const Footer = () => {
  return (
    <>
      <div id="footer-hotel">
        <div id="footer-izquierdo">
          <h3>CONTACTOS Y DIRECCIÓN</h3>
          <div id="contactos">
            <div className="divIcon">
              <img className="img-icon" src="./phone.svg" alt="Teléfono" />
              <p className="licon-tel">TEL: ************</p>
            </div>
            <div className="divIcon">
              <img className="img-icon" src="./message.svg" alt="Email" />
              <p className="licon-emal">Email: ****@****.com</p>
            </div>
            <div className="divIcon">
              <img
                className="img-icon"
                src="./map-location-dot.svg"
                alt="Ubicación"
              />
              <p className="licon-dir">Dir: **************</p>
            </div>
          </div>
        </div>

        <div id="footer-derecho">
          <h3>REDES SOCIALES</h3>
          <div id="redes">
            <div className="divIcon">
              <img
                className="img-icon"
                src="./square-facebook.svg"
                alt="Facebook"
              />
              <p className="pIcon">Facebook</p>
            </div>
            <div className="divIcon">
              <img
                className="img-icon"
                src="./square-twitter.svg"
                alt="Twitter"
              />
              <p className="pIcon">Twitter</p>
            </div>
            <div className="divIcon">
              <img
                className="img-icon"
                src="./square-instagram.svg"
                alt="Instagram"
              />
              <p className="pIcon">Instagram</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Footer;
