import React, { useEffect, useState } from "react";
import Header from "../../components/header/header";
import PrivateRoute from "../../components/PrivateRoute";
import Footer from "../../components/Footer/Footer";

const allowedUsers = [
  "contato@styxx.com.br",
  "gaferreirainicial@gmail.com",
  "analuzmira23@gmail.com",
  "producaocultural@grupoteatralgorki.com",
]; // Lista de usuários permitidos

const Home = () => {
  const [storageUserDetails, setStorageUserDetails] = useState(null);
  const [storageUserEmail, setStorageUserEmail] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false); // Controla a visibilidade do dropdown

  useEffect(() => {
    if (typeof window !== "undefined") {
      const userDetails = localStorage.getItem("userDetails");
      const userEmail = localStorage.getItem("userEmail");

      if (userEmail) {
        setStorageUserEmail(storageUserEmail);
      }

      if (userDetails) {
        const parsedUserDetails = JSON.parse(userDetails);

        // Verifica se o usuário está na lista de permitidos
        if (allowedUsers.includes(parsedUserDetails.usuario)) {
          if (parsedUserDetails.tipoUsuario <= 1) {
            parsedUserDetails.tipoUsuario = 2;
            localStorage.setItem(
              "userDetails",
              JSON.stringify(parsedUserDetails)
            );
            window.location.reload();
          }
        }

        // Salva os detalhes do usuário no estado
        setStorageUserDetails(parsedUserDetails);
      }
    }
  }, []);

  // Função para trocar a cidade no localStorage
  const handleCityChange = (idCidade) => {
    if (storageUserDetails) {
      const updatedDetails = { ...storageUserDetails, idCidade };
      localStorage.setItem("userDetails", JSON.stringify(updatedDetails));
      window.location.reload(); // Atualiza a página após trocar a cidade
    }
  };

  // Função para abrir/fechar o dropdown
  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const handleButtonClick = () => {
    window.open(
      "https://criarte.s3.us-east-2.amazonaws.com/documents/edital-1.pdf"
    );
  };

  // Mapeamento de idCidade para o nome da cidade
  const cityNames = {
    3842: "Serrana",
    3798: "Santa Rita Do Passa Quatro",
    3357: "Brodowski",
    3823: "São José Do Rio Pardo",
    3398: "Cerquilho",
    3478: "Guariba",
  };

  // Pegando o nome da cidade com base no idCidade
  const cityName = storageUserDetails && cityNames[storageUserDetails.idCidade];

  return (
    <PrivateRoute>
      <div>
        <Header />
        <div className="cityIdentifierContainer">
          <div style={{ display: "flex" }}>
            <p>Version: 1.75.2</p>
            <p>
              Cidade:{" "}
              {storageUserDetails
                ? `${cityName} (${storageUserDetails.idCidade})`
                : "Cidade Desconhecida"}
            </p>
          </div>
          <div style={{ display: "flex", alignItems: "center" }}>
            {storageUserDetails && storageUserDetails.tipoUsuario !== 1 && (
              <>
                <div style={{ position: "relative", marginLeft: "10px" }}>
                  <button
                    onClick={toggleDropdown}
                    style={{
                      backgroundColor: "#33959c",
                      padding: "6px",
                      color: "white",
                      cursor: "pointer",
                      border: "none",
                    }}
                  >
                    Trocar Cidade
                  </button>
                  {showDropdown && (
                    <ul
                      style={{
                        position: "absolute",
                        top: "30px",
                        left: "0",
                        minWidth: "200px",
                        backgroundColor: "white",
                        padding: "10px",
                        borderRadius: "5px",
                        boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                      }}
                    >
                      <p
                        style={{ padding: "5px 0", cursor: "pointer" }}
                        onClick={() => handleCityChange(3842)}
                      >
                        Serrana
                      </p>
                      <p
                        style={{ padding: "5px 0", cursor: "pointer" }}
                        onClick={() => handleCityChange(3798)}
                      >
                        Santa Rita
                      </p>
                      <p
                        style={{ padding: "5px 0", cursor: "pointer" }}
                        onClick={() => handleCityChange(3823)}
                      >
                        São José Do Rio Pardo
                      </p>
                      <p
                        style={{ padding: "5px 0", cursor: "pointer" }}
                        onClick={() => handleCityChange(3357)}
                      >
                        Brodowski
                      </p>
                      <p
                        style={{ padding: "5px 0", cursor: "pointer" }}
                        onClick={() => handleCityChange(3398)}
                      >
                        Cerquilho
                      </p>
                      <p
                        style={{ padding: "5px 0", cursor: "pointer" }}
                        onClick={() => handleCityChange(3478)}
                      >
                        Guariba
                      </p>
                    </ul>
                  )}
                </div>
                <img
                  style={{ maxWidth: "30px", backgroundColor: "#b54435" }}
                  src="https://cdn.icon-icons.com/icons2/1222/PNG/512/1492616967-31-shield-protection-safety-security-google_83401.png"
                ></img>
                <p
                  style={{
                    backgroundColor: "#b54435",
                    padding: "4px",
                    color: "white",
                    marginRight: "0",
                    marginLeft: "0",
                  }}
                >
                  Supervisor
                </p>
              </>
            )}
          </div>
        </div>
        <section className="container_opcoes_banner">
          <section className="container_opcoes">
            <a href="/meusProjetos" className="opcao_link">
              <div className="container_meus_projetos" id="meus_projetos_off">
                <h3>
                  <i className="bi bi-folder"></i> Meus Projetos
                </h3>
                <p>Lista de projetos inscritos</p>
              </div>
            </a>

            <div className="container_ajuda">
              <a
                href="https://wa.me/16981423000"
                target="_blank"
                rel="noopener noreferrer"
                className="opcao_link"
              >
                <h3>
                  <i className="bi bi-journal-check"></i> Ajuda
                </h3>
                <p>Veja como usar a plataforma e tire suas dúvidas</p>
              </a>
            </div>

            {storageUserDetails &&
              storageUserDetails.usuario === "emersonabud@hotmail.com" && (
                <div className="container_ajuda">
                  <a href="/gestao/projetos" className="opcao_link">
                    <h3>
                      <i className="bi bi-journal-check"></i> Gestão
                    </h3>
                    <p>Acesso às ferramentas de administração</p>
                  </a>
                </div>
              )}
          </section>

          <section className="container_banner">
            {storageUserDetails ? (
              storageUserDetails.idCidade === 3842 ? (
                <div>
                  <img
                    className="banner_img"
                    style={{ display: "flex" }}
                    src="https://styxx-public.s3.sa-east-1.amazonaws.com/pnab-logo.png"
                    alt="ADICIONAR BANNER"
                  />

                  <h1 className="banner_titulo">
                    EDITAL DE CHAMAMENTO PÚBLICO Nº 001/2024 - SCET
                  </h1>
                  <p className="banner_paragrafo" style={{ marginTop: "10px" }}>
                    SELEÇÃO DE PROJETOS PARA FIRMAR TERMO DE EXECUÇÃO CULTURAL
                    COM RECURSOS DA POLÍTICA NACIONAL ALDIR BLANC DE FOMENTO À
                    CULTURA – PNAB (LEI Nº 14.399/2022)
                  </p>
                  <button
                    onClick={handleButtonClick}
                    style={{ marginTop: "20px", minWidth: "100%" }}
                    className="btn-detalhes"
                  >
                    Ver detalhes
                  </button>
                </div>
              ) : storageUserDetails.idCidade === 3798 ? (
                // Layout personalizado para idCidade 3798
                <div>
                  <img
                    className="banner_img"
                    style={{ display: "flex" }}
                    src="https://www.santaritadopassaquatro.sp.gov.br/portal/wp-content/uploads/2018/03/cropped-brasao_santa_rita_estancia_menor-1.png"
                    alt="ADICIONAR BANNER"
                  />
                  <h1 style={{ marginTop: "20px" }} className="banner_titulo">
                    Editais Santa Rita Do Passa Quatro
                  </h1>
                  <p
                    className="banner_paragrafo"
                    style={{ marginTop: "10px" }}
                  ></p>
                  <button
                    onClick={() =>
                      window.open(
                        "https://criarte.grupogorki.com.br/projetos/selecao"
                      )
                    }
                    style={{ marginTop: "20px", minWidth: "100%" }}
                    className="btn-detalhes"
                  >
                    Ver Editais
                  </button>
                </div>
              ) : storageUserDetails.idCidade === 9888 ? (
                // Ação personalizada para idCidade 9888
                <div>
                  <h1 className="banner_titulo">Cidade Desabilitada</h1>
                  <p className="banner_paragrafo" style={{ marginTop: "10px" }}>
                    Nada encontrado...
                  </p>
                  <button
                    onClick={() => alert("Indisponível")}
                    disabled
                    style={{ marginTop: "20px", minWidth: "100%" }}
                    className="btn-detalhes"
                  >
                    INDISPONÍVEL
                  </button>
                </div>
              ) : storageUserDetails.idCidade === 3478 ? (
                <div>
                  <img
                    className="banner_img"
                    style={{ display: "flex", maxWidth: "180px" }}
                    src="https://guariba.sp.gov.br/pat/Arquitetura/Imagens/logo.png"
                    alt="ADICIONAR BANNER"
                  />
                  <h1 className="banner_titulo">Editais de Guariba</h1>
                  <button
                    onClick={() =>
                      window.open(
                        "https://criarte.grupogorki.com.br/projetos/selecao"
                      )
                    }
                    style={{ marginTop: "20px", minWidth: "100%" }}
                    className="btn-detalhes"
                  >
                    Ver Editais
                  </button>
                </div>
              ) : storageUserDetails.idCidade === 3823 ? (
                <div>
                  <img
                    className="banner_img"
                    style={{ display: "flex", maxWidth: "300px" }}
                    src="https://criarte.s3.us-east-2.amazonaws.com/public/sao-jose-do-rio-pardo/sjrp.png"
                    alt="ADICIONAR BANNER"
                  />
                  <h1 style={{ marginTop: "20px" }} className="banner_titulo">
                    Editais São José Do Rio Pardo
                  </h1>
                  <p
                    className="banner_paragrafo"
                    style={{ marginTop: "10px" }}
                  ></p>
                  <button
                    onClick={() =>
                      window.open(
                        "https://criarte.grupogorki.com.br/projetos/selecao"
                      )
                    }
                    style={{ marginTop: "20px", minWidth: "100%" }}
                    className="btn-detalhes"
                  >
                    Ver Editais
                  </button>
                </div>
              ) : storageUserDetails.idCidade === 3398 ? (
                <div>
                  <img
                    className="banner_img"
                    style={{ display: "flex", maxWidth: "150px" }}
                    src="https://www.cerquilho.sp.gov.br/admin/globalarq/logo/95e1558d00b80e1d167060696e4dceb1.png"
                    alt="ADICIONAR BANNER"
                  />
                  <h1 style={{ marginTop: "20px" }} className="banner_titulo">
                    Editais Cerquilho
                  </h1>
                  <p
                    className="banner_paragrafo"
                    style={{ marginTop: "10px" }}
                  ></p>
                  <button
                    onClick={() =>
                      window.open(
                        "https://criarte.grupogorki.com.br/projetos/selecao"
                      )
                    }
                    style={{ marginTop: "20px", minWidth: "100%" }}
                    className="btn-detalhes"
                  >
                    Ver Editais
                  </button>
                </div>
              ) : (
                <div>
                  <h1
                    style={{
                      backgroundColor: "white",
                      padding: "20px",
                      borderRadius: "10px",
                    }}
                    className="banner_titulo"
                  >
                    Inscrições não estão disponíveis para sua cidade.
                  </h1>
                </div>
              )
            ) : (
              <h1 className="banner_titulo">
                Nenhum edital encontrado para sua região.
              </h1>
            )}
          </section>
        </section>
      </div>
      <Footer />
    </PrivateRoute>
  );
};

export default Home;
