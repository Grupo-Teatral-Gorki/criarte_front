import React, { useState, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
//import './Header.css';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { logout } = React.useContext(AuthContext);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleSubMenuClick = (event) => {
    event.stopPropagation();
  };

  const fecharMenu = () => {
    setIsMobileMenuOpen(false);
  };

  useEffect(() => {
    const overlayMenu = document.getElementById("overlay-menu");
    if (overlayMenu) {
      overlayMenu.addEventListener("click", fecharMenu);
    }
  }, []);

  return (
    <div className="menu-mobile-all">
      <div className="btn-abrir-menu" id="btn-menu" onClick={toggleMobileMenu}>
        <img
          className="icon-menu"
          src="https://styxx-public.s3.sa-east-1.amazonaws.com/header/list.png"
          alt="Menu"
        />
      </div>
      <div
        className={`menu-mobile ${isMobileMenuOpen ? "open" : ""}`}
        id="menu-mobile"
      >
        <div className="btn-fechar-menu">
          <img
            className="arrow-menu"
            src="https://styxx-public.s3.sa-east-1.amazonaws.com/header/left-arrow(1).png"
            onClick={toggleMobileMenu}
          ></img>
        </div>
        <nav>
          <ul>
            <li className="links_menu">
              <a href="/meusProjetos">
                <i className="bi bi-folder"></i> Meus Projetos
              </a>
            </li>
            <li className="links_menu">
              <a href="/proponente">Meus Proponentes</a>
            </li>
            <li className="links_menu">
              <a href="/Profile">Alterar Meus Dados</a>
            </li>
            <li className="links_menu">
              <ul className="submenu">
                <li>
                  <a href="#" onClick={handleSubMenuClick}>
                    Entidades
                  </a>
                </li>
                <li>
                  <a href="#" onClick={handleSubMenuClick}>
                    Indicados
                  </a>
                </li>
              </ul>
            </li>
            <li className="links_menu">
              <ul className="submenu">
                <li>
                  <a href="#" onClick={handleSubMenuClick}>
                    Perguntas frequentes
                  </a>
                </li>
                <li>
                  <a href="#" onClick={handleSubMenuClick}>
                    Manual do proponente
                  </a>
                </li>
                <li>
                  <a href="#" onClick={handleSubMenuClick}>
                    Política de privacidade
                  </a>
                </li>
                <li>
                  <a href="#" onClick={handleSubMenuClick}>
                    Termos de Uso
                  </a>
                </li>
              </ul>
            </li>
            <li className="links_menu">
              <a onClick={logout} href="/">
                <i onClick={logout} className="btn-sair"></i> Sair
              </a>
            </li>
          </ul>
        </nav>
      </div>
      <a href="/home">
        <img
          className="logo_criarte"
          src="https://styxx-public.s3.sa-east-1.amazonaws.com/logo-criarte.png"
          alt="Logo Criarte"
        />
      </a>
      <div>
        <a href="/profile">
          <img
            src="https://styxx-public.s3.sa-east-1.amazonaws.com/header/user.png"
            className="icon-user"
          ></img>
        </a>
      </div>
    </div>
  );
};

export default Header;
