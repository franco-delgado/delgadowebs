import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Concesionaria.css";

// 1. Datos simulados (Mock Data)
const CATEGORIES = ["Todos", "Autos", "Camionetas", "4x4", "Motos"];
const BRANDS = ["Toyota", "Ford", "Chevrolet", "Honda", "Volkswagen", "Yamaha"];

const VEHICLES = [
  {
    id: 1,
    name: "Volkswagen Vento",
    category: "Camionetas",
    price: "$32,000",
    brand: "Volkswagen",
    path: "ventoLanding",
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQodhZ8ftRWiScgYjUevi1Lnw_6nXTFTnDJdg&s",
  },
  {
    id: 2,
    name: "Honda Civic",
    category: "Autos",
    price: "$22,500",
    brand: "Honda",
    img: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: 3,
    name: "Ford Ranger 4x4",
    category: "4x4",
    price: "$38,000",
    brand: "Ford",
    img: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: 4,
    name: "Yamaha MT-07",
    category: "Motos",
    price: "$9,800",
    brand: "Yamaha",
    img: "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=400&q=80",
  },
];

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  // Filtrado de vehículos
  const filteredVehicles =
    selectedCategory === "Todos"
      ? VEHICLES
      : VEHICLES.filter(
          (v) => v.category.toLowerCase() === selectedCategory.toLowerCase(),
        );

  // Datos de contacto del dueño
  const contactEmail = "dueno@concesionaria.com";
  const contactWhatsApp = "5493804112233";

  return (
    <div className="site-layout">
      {/* --- BARRA SUPERIOR (NAVBAR) --- */}
      <nav className="navbar">
        <div className="nav-container">
          <div className="nav-spacer"></div>

          <h1 className="nav-logo" onClick={() => setSelectedCategory("Todos")}>
            MAX <span className="text-highlight-red">MOTORS</span>
          </h1>

          <div className="nav-actions-group">
            <div className="dropdown-wrapper">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="dropdown-trigger-btn"
              >
                Explorar ▾
              </button>

              {isDropdownOpen && (
                <div className="dropdown-menu">
                  <div className="dropdown-section-title">Categorías</div>
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => {
                        setSelectedCategory(cat);
                        setIsDropdownOpen(false);
                      }}
                      className="dropdown-item-btn"
                    >
                      {cat}
                    </button>
                  ))}
                  <div className="dropdown-divider"></div>
                  <div className="dropdown-section-title">Contacto Directo</div>
                  <a
                    href={`mailto:${contactEmail}?subject=Consulta de Vehículo`}
                    className="dropdown-link-email"
                  >
                    ✉️ Enviar Email
                  </a>
                  <a
                    href={`https://wa.me/${contactWhatsApp}?text=Hola,%20estoy%20interesado%20en%20un%20vehículo`}
                    target="_blank"
                    rel="noreferrer"
                    className="dropdown-link-whatsapp"
                  >
                    💬 Mensaje WhatsApp
                  </a>
                </div>
              )}
            </div>
          </div>

          <div className="back-btn" onClick={() => navigate(-1)}>
            ◀ Volver
          </div>
        </div>
      </nav>

      {/* --- PORTADA / HERO --- */}
      <header className="hero-banner">
        <h2 className="hero-title">Encontrá tu próximo vehículo</h2>
        <p className="hero-subtitle">
          Calidad, confianza y la mejor financiación del mercado.
        </p>
      </header>

      <main className="main-content">
        {/* --- SECCIÓN CATEGORÍAS --- */}
        <section className="categories-section">
          <h3 className="section-title">Categorías Disponibles</h3>
          <div className="categories-grid">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`category-card-btn ${
                  selectedCategory === cat ? "active" : "inactive"
                }`}
              >
                {cat === "Todos" ? "🌐 Ver Todos" : cat}
              </button>
            ))}
          </div>
        </section>

        {/* --- SECCIÓN MARCAS --- */}
        <section className="brands-section">
          <h3 className="brands-title">Marcas con las que trabajamos</h3>
          <div className="brands-list">
            {BRANDS.map((brand) => (
              <span key={brand} className="brand-item">
                {brand.toUpperCase()}
              </span>
            ))}
          </div>
        </section>

        {/* --- LISTADO DE VEHÍCULOS --- */}
        <section className="showcase-section">
          <div className="showcase-header">
            <h3 className="section-title">
              Vehículos en exhibición:{" "}
              <span className="text-danger-red">{selectedCategory}</span>
            </h3>
            {selectedCategory !== "Todos" && (
              <button
                onClick={() => setSelectedCategory("Todos")}
                className="clear-filters-btn"
              >
                Limpiar filtros
              </button>
            )}
          </div>

          <div className="vehicles-grid">
            {filteredVehicles.length > 0 ? (
              filteredVehicles.map((vehicle) => (
                <div key={vehicle.id} className="vehicle-card">
                  <div className="vehicle-image-wrapper">
                    <img
                      src={vehicle.img}
                      alt={vehicle.name}
                      className="vehicle-image"
                    />
                  </div>
                  <div className="vehicle-info-body">
                    <div className="vehicle-meta">
                      <span className="vehicle-category-tag">
                        {vehicle.category}
                      </span>
                      <h4 className="vehicle-title">{vehicle.name}</h4>
                      <p className="vehicle-brand-label">
                        Marca: {vehicle.brand}
                      </p>
                    </div>

                    <div className="vehicle-action-area">
                      <span className="vehicle-price-tag">{vehicle.price}</span>

                      {/* Contenedor de botones corregido */}
                      <div className="vehicle-buttons-group">
                        <button
                          onClick={() =>
                            navigate(`/detalles-de-vehiculos/${vehicle.path}`)
                          }
                          className="btn-details"
                        >
                          Ver Detalles
                        </button>

                        <a
                          href={`https://wa.me/${contactWhatsApp}?text=Hola,%20me%20interesa%20el%20${encodeURIComponent(vehicle.name)}`}
                          target="_blank"
                          rel="noreferrer"
                          className="btn-query"
                        >
                          Consultar
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="no-results-message">
                No hay vehículos disponibles en esta categoría por el momento.
              </p>
            )}
          </div>
        </section>
      </main>

      <footer className="site-footer">
        &copy; 2026 Max Motors. Todos los derechos reservados.
      </footer>
    </div>
  );
}
