import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { PROFESIONALES_INICIALES } from './seed';
import { KEYS, leer, escribir } from '../utils/storage';

const ClinicaContext = createContext(null);

function generarId(prefijo) {
  return `${prefijo}-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
}

export function ClinicaProvider({ children }) {
  const [profesionales, setProfesionales] = useState(() =>
    leer(KEYS.PROFESIONALES, PROFESIONALES_INICIALES)
  );
  const [turnos, setTurnos] = useState(() => leer(KEYS.TURNOS, []));

  useEffect(() => {
    escribir(KEYS.PROFESIONALES, profesionales);
  }, [profesionales]);

  useEffect(() => {
    escribir(KEYS.TURNOS, turnos);
  }, [turnos]);

  const turnosDe = useCallback(
    (profesionalId, fecha) =>
      turnos.filter((t) => t.profesionalId === profesionalId && t.fecha === fecha),
    [turnos]
  );

  const cupoDisponible = useCallback(
    (profesionalId, fecha) => {
      const profesional = profesionales.find((p) => p.id === profesionalId);
      if (!profesional) return 0;
      const ocupados = turnosDe(profesionalId, fecha).length;
      return Math.max(profesional.cupoPorDia - ocupados, 0);
    },
    [profesionales, turnosDe]
  );

  const reservarTurno = useCallback(
    (datos) => {
      const { profesionalId, fecha, hora } = datos;
      const disponible = cupoDisponible(profesionalId, fecha);
      if (disponible <= 0) {
        return { ok: false, motivo: 'CUPO_LLENO' };
      }
      const horaOcupada = turnosDe(profesionalId, fecha).some((t) => t.hora === hora);
      if (horaOcupada) {
        return { ok: false, motivo: 'HORA_OCUPADA' };
      }
      const nuevoTurno = {
        id: generarId('turno'),
        creadoEn: new Date().toISOString(),
        estado: 'confirmado',
        ...datos,
      };
      setTurnos((prev) => [...prev, nuevoTurno]);
      return { ok: true, turno: nuevoTurno };
    },
    [cupoDisponible, turnosDe]
  );

  const cancelarTurno = useCallback((turnoId) => {
    setTurnos((prev) => prev.filter((t) => t.id !== turnoId));
  }, []);

  const agregarProfesional = useCallback((profesional) => {
    setProfesionales((prev) => [
      ...prev,
      { id: generarId('prof'), cupoPorDia: 10, ...profesional },
    ]);
  }, []);

  const quitarProfesional = useCallback((profesionalId) => {
    setProfesionales((prev) => prev.filter((p) => p.id !== profesionalId));
    setTurnos((prev) => prev.filter((t) => t.profesionalId !== profesionalId));
  }, []);

  const actualizarCupo = useCallback((profesionalId, cupoPorDia) => {
    setProfesionales((prev) =>
      prev.map((p) => (p.id === profesionalId ? { ...p, cupoPorDia } : p))
    );
  }, []);

  const value = {
    profesionales,
    turnos,
    turnosDe,
    cupoDisponible,
    reservarTurno,
    cancelarTurno,
    agregarProfesional,
    quitarProfesional,
    actualizarCupo,
  };

  return <ClinicaContext.Provider value={value}>{children}</ClinicaContext.Provider>;
}

export function useClinica() {
  const contexto = useContext(ClinicaContext);
  if (!contexto) {
    throw new Error('useClinica debe usarse dentro de ClinicaProvider');
  }
  return contexto;
}
