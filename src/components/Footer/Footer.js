import React from "react";

const Footer = () => (
  <footer className="footer">
    <div className="footer-section styxx-footer">
      <img
        alt="Logo Styxx"
        className="footer-logo"
        src="https://styxx-public.s3.sa-east-1.amazonaws.com/StyxxB_light2.png"
      />
      <div className="footer-info">
        <p>
          <strong>Suporte Técnico</strong>
        </p>
        <p>Email: suporte@styxx.com.br</p>
      </div>
    </div>
    <div className="footer-section gorki-footer">
      <img
        alt="Logo Gorki"
        className="footer-logo"
        src="https://styxx-public.s3.sa-east-1.amazonaws.com/gorki.png"
      />
      <div className="footer-info">
        <p>
          <strong>Suporte</strong>
        </p>
        <p>WhatsApp: (16) 98142-3000</p>
        <p>Tel: (16) 3421-9152</p>
        <p>Email: producaocultural@grupoteatralgorki.com</p>
      </div>
    </div>
  </footer>
);

export default Footer;
