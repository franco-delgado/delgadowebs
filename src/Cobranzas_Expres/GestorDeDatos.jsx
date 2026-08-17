import React, { useState, useEffect, useMemo } from 'react';
import "./GestorDeDatos.css";
import { 
  Users, UserPlus, CreditCard, Search, Calendar, 
  AlertTriangle, CheckCircle, Clock, DollarSign, ChevronRight, Trash2 
} from 'lucide-react';
import { db } from './firebase';
import { 
  collection, 
  addDoc, 
  onSnapshot, 
  doc, 
  updateDoc,
  deleteDoc,
  query,
  where,
  getDocs
} from 'firebase/firestore';

const TODAY = new Date("2026-08-13");

export default function GestorCobranzasApp() {
  const [customers, setCustomers] = useState([]);
  const [plans, setPlans] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCustomerId, setSelectedCustomerId] = useState("");
  const [activeTab, setActiveTab] = useState("estado_cuenta");

  // --- FORM STATES ---
  const [newCustomer, setNewCustomer] = useState({ documento: "", nombre: "", telefono: "", email: "", direccion: "" });
  const [newPlan, setNewPlan] = useState({ customerId: "", montoTotal: "", cuotasCount: 12, fechaPrimerVencimiento: "" });

  // --- ESCUCHA EN TIEMPO REAL DESDE FIREBASE ---
  useEffect(() => {
    const unsubCustomers = onSnapshot(collection(db, "cobranzas_clientes"), (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setCustomers(docs);
      if (docs.length > 0 && !selectedCustomerId) {
        setSelectedCustomerId(docs[0].id);
      }
    });

    const unsubPlans = onSnapshot(collection(db, "cobranzas_planes"), (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPlans(docs);
    });

    return () => {
      unsubCustomers();
      unsubPlans();
    };
  }, []);

  // --- FILTRADO DE CLIENTES ---
  const filteredCustomers = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return customers;
    return customers.filter(c => 
      c.nombre?.toLowerCase().includes(q) || c.documento?.includes(q)
    );
  }, [customers, searchQuery]);

  const selectedCustomer = useMemo(() => 
    customers.find(c => c.id === selectedCustomerId) || customers[0],
  [customers, selectedCustomerId]);

  const customerPlans = useMemo(() => 
    plans.filter(p => p.customerId === selectedCustomer?.id),
  [plans, selectedCustomer]);

  // --- ELIMINAR CLIENTE Y SUS PLANES ---
  const handleDeleteCustomer = async (e, customerId, customerName) => {
    e.stopPropagation(); // Evita seleccionar el cliente al hacer clic en eliminar
    
    if (window.confirm(`¿Estás seguro de que deseas eliminar a "${customerName}"? Se borrarán también sus planes de pago.`)) {
      try {
        // 1. Borrar el cliente de Firestore
        await deleteDoc(doc(db, "cobranzas_clientes", customerId));

        // 2. Borrar los planes asociados a este cliente
        const q = query(collection(db, "cobranzas_planes"), where("customerId", "==", customerId));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach(async (planDoc) => {
          await deleteDoc(doc(db, "cobranzas_planes", planDoc.id));
        });

        // 3. Ajustar la selección si se borró el cliente activo
        if (selectedCustomerId === customerId) {
          const remaining = customers.filter(c => c.id !== customerId);
          setSelectedCustomerId(remaining.length > 0 ? remaining[0].id : "");
        }
      } catch (error) {
        console.error("Error al eliminar el cliente:", error);
      }
    }
  };

  // --- MÉTRICAS DE MORA ---
  const metrics = useMemo(() => {
    let totalMoraDiasAcc = 0;
    let cuotasEnMoraCount = 0;
    let maxMora = 0;
    let saldoPendienteTotal = 0;

    customerPlans.forEach(plan => {
      plan.cuotas?.forEach(cuota => {
        if (cuota.estado !== "PAGADO") {
          saldoPendienteTotal += (Number(cuota.monto) - Number(cuota.pagado || 0));
          
          const venc = new Date(cuota.vencimiento);
          if (venc < TODAY) {
            const diffTime = Math.abs(TODAY - venc);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            
            totalMoraDiasAcc += diffDays;
            cuotasEnMoraCount++;
            if (diffDays > maxMora) maxMora = diffDays;
          }
        }
      });
    });

    const promedioMora = cuotasEnMoraCount > 0 ? Math.round(totalMoraDiasAcc / cuotasEnMoraCount) : 0;

    return { saldoPendienteTotal, cuotasEnMoraCount, promedioMora, maxMora };
  }, [customerPlans]);

  // --- OPERACIONES EN FIREBASE ---
  // --- OPERACIONES EN FIREBASE ---
  const handleRegisterCustomer = async (e) => {
    e.preventDefault();
    
    // Verificación previa en consola
    console.log("Intentando guardar cliente...", newCustomer);

    if (!newCustomer.documento || !newCustomer.nombre) {
      alert("Por favor completa el documento y el nombre.");
      return;
    }

    try {
      // Guardar el objeto directamente en Firestore
      const docRef = await addDoc(collection(db, "cobranzas_clientes"), {
        documento: newCustomer.documento,
        nombre: newCustomer.nombre,
        telefono: newCustomer.telefono || "",
        email: newCustomer.email || "",
        direccion: newCustomer.direccion || "",
        fechaCreacion: new Date().toISOString()
      });

      console.log("Cliente guardado con ID en Firestore:", docRef.id);
      
      // Limpiar formulario y cambiar de vista
      setSelectedCustomerId(docRef.id);
      setNewCustomer({ documento: "", nombre: "", telefono: "", email: "", direccion: "" });
      setActiveTab("estado_cuenta");

    } catch (error) {
      console.error("Error al guardar cliente en Firestore:", error);
      alert("Error al guardar en Firestore: " + error.message);
    }
  };

  const handleCreatePlan = async (e) => {
    e.preventDefault();
    const targetCustomer = newPlan.customerId || selectedCustomer?.id;
    const monto = parseFloat(newPlan.montoTotal);
    const count = parseInt(newPlan.cuotasCount);
    if (!monto || !count || !newPlan.fechaPrimerVencimiento || !targetCustomer) return;

    const valorCuota = Math.round(monto / count);
    const cuotasGeneradas = [];
    let fechaBase = new Date(newPlan.fechaPrimerVencimiento);

    for (let i = 1; i <= count; i++) {
      const fechaVenc = new Date(fechaBase);
      fechaVenc.setMonth(fechaVenc.getMonth() + (i - 1));
      
      cuotasGeneradas.push({
        id: `C-${Date.now()}-${i}`,
        numero: i,
        monto: valorCuota,
        vencimiento: fechaVenc.toISOString().split('T')[0],
        pagado: 0,
        fechaPago: null,
        estado: "PENDIENTE"
      });
    }

    try {
      await addDoc(collection(db, "cobranzas_planes"), {
        customerId: targetCustomer,
        montoTotal: monto,
        cuotasCount: count,
        fechaCreacion: new Date().toISOString().split('T')[0],
        cuotas: cuotasGeneradas
      });

      setSelectedCustomerId(targetCustomer);
      setActiveTab("estado_cuenta");
    } catch (error) {
      console.error("Error al crear plan:", error);
    }
  };

  const handleRegisterPayment = async (planId, cuotaId) => {
    const targetPlan = plans.find(p => p.id === planId);
    if (!targetPlan) return;

    const cuotasActualizadas = targetPlan.cuotas.map(c => {
      if (c.id !== cuotaId) return c;
      return {
        ...c,
        pagado: c.monto,
        fechaPago: TODAY.toISOString().split('T')[0],
        estado: "PAGADO"
      };
    });

    try {
      const planRef = doc(db, "cobranzas_planes", planId);
      await updateDoc(planRef, { cuotas: cuotasActualizadas });
    } catch (error) {
      console.error("Error al registrar pago:", error);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 font-sans text-gray-800">
      
      {/* SIDEBAR */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <CreditCard className="text-blue-600" /> Cobranzas Express
          </h1>
          <p className="text-xs text-gray-500 mt-1">Conectado a Firebase Firestore</p>
          
          <div className="relative mt-4">
            <Search className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
            <input 
              type="text"
              placeholder="Buscar por DNI o Nombre..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-gray-100">
          {filteredCustomers.length === 0 ? (
            <div className="p-4 text-xs text-gray-400 text-center">Sin clientes registrados</div>
          ) : (
            filteredCustomers.map(customer => {
              const isSelected = customer.id === selectedCustomer?.id;
              return (
                <div
                  key={customer.id}
                  onClick={() => {
                    setSelectedCustomerId(customer.id);
                    setActiveTab("estado_cuenta");
                  }}
                  className={`w-full text-left p-4 hover:bg-blue-50 transition-colors flex items-center justify-between cursor-pointer group ${
                    isSelected ? 'bg-blue-50 border-l-4 border-blue-600' : ''
                  }`}
                >
                  <div className="overflow-hidden pr-2">
                    <div className="font-semibold text-gray-900 truncate">{customer.nombre}</div>
                    <div className="text-xs text-gray-500">DNI: {customer.documento}</div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => handleDeleteCustomer(e, customer.id, customer.nombre)}
                      title="Eliminar cliente"
                      className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition opacity-80 group-hover:opacity-100"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="p-4 border-t border-gray-200">
          <button 
            onClick={() => setActiveTab("nuevo_cliente")}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-4 rounded-lg transition"
          >
            <UserPlus className="w-4 h-4" /> Nuevo Cliente
          </button>
        </div>
      </div>

      {/* ÁREA PRINCIPAL */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        <header className="bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center">
          {selectedCustomer ? (
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{selectedCustomer.nombre}</h2>
              <span className="text-sm text-gray-500">DNI: {selectedCustomer.documento} | Tel: {selectedCustomer.telefono || 'N/A'}</span>
            </div>
          ) : <div className="text-gray-400 text-sm">Selecciona o registra un cliente</div>}

          <div className="flex gap-2">
            <button 
              onClick={() => setActiveTab("estado_cuenta")}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${activeTab === 'estado_cuenta' ? 'bg-gray-200 text-gray-900' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              Estado de Cuenta
            </button>
            <button 
              onClick={() => setActiveTab("nuevo_plan")}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${activeTab === 'nuevo_plan' ? 'bg-gray-200 text-gray-900' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              + Nuevo Plan
            </button>
          </div>
        </header>

        <main className="p-8 space-y-6">
          {activeTab === "estado_cuenta" && selectedCustomer && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase">Saldo Pendiente</p>
                    <p className="text-2xl font-bold text-gray-900">${metrics.saldoPendienteTotal.toLocaleString()}</p>
                  </div>
                  <DollarSign className="w-8 h-8 text-emerald-500 bg-emerald-50 p-1.5 rounded-lg" />
                </div>

                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase">Cuotas Vencidas</p>
                    <p className="text-2xl font-bold text-red-600">{metrics.cuotasEnMoraCount}</p>
                  </div>
                  <AlertTriangle className="w-8 h-8 text-red-500 bg-red-50 p-1.5 rounded-lg" />
                </div>

                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase">Atraso Promedio</p>
                    <p className="text-2xl font-bold text-amber-600">{metrics.promedioMora} <span className="text-sm font-normal text-gray-500">días</span></p>
                  </div>
                  <Clock className="w-8 h-8 text-amber-500 bg-amber-50 p-1.5 rounded-lg" />
                </div>

                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase">Atraso Máximo</p>
                    <p className="text-2xl font-bold text-red-700">{metrics.maxMora} <span className="text-sm font-normal text-gray-500">días</span></p>
                  </div>
                  <Calendar className="w-8 h-8 text-red-600 bg-red-100 p-1.5 rounded-lg" />
                </div>
              </div>

              {customerPlans.length === 0 ? (
                <div className="bg-white p-12 text-center rounded-xl border border-gray-200">
                  <p className="text-gray-500">El cliente no tiene planes de pago activos.</p>
                  <button 
                    onClick={() => setActiveTab("nuevo_plan")}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
                  >
                    Crear primer plan de cuotas
                  </button>
                </div>
              ) : (
                customerPlans.map((plan) => (
                  <div key={plan.id} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-6">
                    <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                      <div>
                        <span className="text-xs font-bold uppercase text-blue-600 tracking-wider">Plan ID: {plan.id}</span>
                        <h3 className="text-lg font-bold text-gray-800">Total: ${plan.montoTotal?.toLocaleString()} en {plan.cuotasCount} cuotas</h3>
                      </div>
                      <span className="text-xs text-gray-500">Creado el {plan.fechaCreacion}</span>
                    </div>

                    <table className="w-full text-left text-sm">
                      <thead className="bg-gray-100 text-gray-600 border-b border-gray-200">
                        <tr>
                          <th className="p-4">N° Cuota</th>
                          <th className="p-4">Monto</th>
                          <th className="p-4">Vencimiento</th>
                          <th className="p-4">Días Mora</th>
                          <th className="p-4">Estado</th>
                          <th className="p-4 text-right">Acción</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {plan.cuotas?.map((cuota) => {
                          const venc = new Date(cuota.vencimiento);
                          const isVencida = cuota.estado !== "PAGADO" && venc < TODAY;
                          const diasAtraso = isVencida ? Math.ceil((TODAY - venc) / (1000 * 60 * 60 * 24)) : 0;

                          return (
                            <tr key={cuota.id} className={isVencida ? "bg-red-50/50" : "hover:bg-gray-50"}>
                              <td className="p-4 font-medium">Cuota {cuota.numero} / {plan.cuotasCount}</td>
                              <td className="p-4 font-bold text-gray-900">${cuota.monto?.toLocaleString()}</td>
                              <td className="p-4">{cuota.vencimiento}</td>
                              <td className="p-4">
                                {diasAtraso > 0 ? (
                                  <span className="font-semibold text-red-600">{diasAtraso} días</span>
                                ) : (
                                  <span className="text-gray-400">-</span>
                                )}
                              </td>
                              <td className="p-4">
                                {cuota.estado === "PAGADO" ? (
                                  <span className="inline-flex items-center gap-1 text-xs font-semibold bg-green-100 text-green-700 px-2.5 py-1 rounded-full">
                                    <CheckCircle className="w-3 h-3" /> Pagado ({cuota.fechaPago})
                                  </span>
                                ) : isVencida ? (
                                  <span className="inline-flex items-center gap-1 text-xs font-semibold bg-red-100 text-red-700 px-2.5 py-1 rounded-full">
                                    <AlertTriangle className="w-3 h-3" /> Vencida
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 text-xs font-semibold bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full">
                                    Pendiente
                                  </span>
                                )}
                              </td>
                              <td className="p-4 text-right">
                                {cuota.estado !== "PAGADO" && (
                                  <button
                                    onClick={() => handleRegisterPayment(plan.id, cuota.id)}
                                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-md text-xs font-medium transition"
                                  >
                                    Registrar Pago
                                  </button>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                ))
              )}
            </>
          )}

          {activeTab === "nuevo_cliente" && (
            <div className="max-w-xl mx-auto bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <UserPlus className="text-blue-600" /> Registrar Nuevo Cliente
              </h3>
              <form onSubmit={handleRegisterCustomer} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">N° Documento (DNI/CUIT)</label>
                  <input 
                    type="text" required
                    value={newCustomer.documento}
                    onChange={e => setNewCustomer({...newCustomer, documento: e.target.value})}
                    className="w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre Completo</label>
                  <input 
                    type="text" required
                    value={newCustomer.nombre}
                    onChange={e => setNewCustomer({...newCustomer, nombre: e.target.value})}
                    className="w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                  <input 
                    type="text"
                    value={newCustomer.telefono}
                    onChange={e => setNewCustomer({...newCustomer, telefono: e.target.value})}
                    className="w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input 
                    type="email"
                    value={newCustomer.email}
                    onChange={e => setNewCustomer({...newCustomer, email: e.target.value})}
                    className="w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition mt-4">
                  Guardar en Firestore
                </button>
              </form>
            </div>
          )}

          {activeTab === "nuevo_plan" && (
            <div className="max-w-xl mx-auto bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <CreditCard className="text-blue-600" /> Crear Plan de Cuotas
              </h3>
              <form onSubmit={handleCreatePlan} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cliente Seleccionado</label>
                  <select 
                    value={newPlan.customerId || selectedCustomer?.id || ""}
                    onChange={e => setNewPlan({...newPlan, customerId: e.target.value})}
                    className="w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    {customers.map(c => (
                      <option key={c.id} value={c.id}>{c.nombre} ({c.documento})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Monto Total Financiado ($)</label>
                  <input 
                    type="number" required min="1"
                    value={newPlan.montoTotal}
                    onChange={e => setNewPlan({...newPlan, montoTotal: e.target.value})}
                    className="w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cantidad de Cuotas</label>
                  <input 
                    type="number" required min="1" max="60"
                    value={newPlan.cuotasCount}
                    onChange={e => setNewPlan({...newPlan, cuotasCount: e.target.value})}
                    className="w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fecha Primer Vencimiento</label>
                  <input 
                    type="date" required
                    value={newPlan.fechaPrimerVencimiento}
                    onChange={e => setNewPlan({...newPlan, fechaPrimerVencimiento: e.target.value})}
                    className="w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition mt-4">
                  Generar y Guardar Plan
                </button>
              </form>
            </div>
          )}
        </main>
      </div>

    </div>
  );
}