/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
/* eslint-disable react/react-in-jsx-scope */
import { useState, useEffect } from "react";
import {
  CircularProgress,
  Alert,
  Button,
  Typography,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import Link from "next/link";
import PrivateRoute from "../../components/PrivateRoute";
import Header from "../../components/header/header";
import { useRouter } from "next/router";

console.log("CI/CD Test");

function PnabHomeForms() {
  const [numeroInscricao, setNumeroInscricao] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openSubmitDialog, setOpenSubmitDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [canSubmit, setCanSubmit] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [storageUserDetails, setStorageUserDetails] = useState(null);
  const [idEdital, setIdEdital] = useState(null);
  const router = useRouter();
  const [projeto, setProjeto] = useState({ status: "" });
  const [hasProponent, setHasProponent] = useState(false);
  const [statusProjeto, setStatusProjeto] = useState("");

  const deadline = new Date("2024-12-31T23:59:59");

  useEffect(() => {
    console.log("ID do edital:", idEdital);
  }, [idEdital]);

  useEffect(() => {
    const storedNumeroInscricao = localStorage.getItem("numeroInscricao");
    const storedProjectName = localStorage.getItem("projectName");
    const now = new Date();

    const checkProponents = async () => {
      const token = localStorage.getItem("authToken");
      const url =
        "https://gorki-fix-proponente.iglgxt.easypanel.host/api/getProponenteByUser";
      // Obtém o valor do localStorage para userDetails e converte para objeto
      const userDetails = JSON.parse(localStorage.getItem("userDetails"));

      // Acessa o id do usuário, se userDetails existir
      const userId = userDetails ? userDetails.id : null;

      try {
        const response = await fetch(url, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            idUsuario: userId,
          }),
        });

        const data = await response.json();
        console.log("res", response);
        if (response.ok && data.proponentes && data.proponentes.length > 0) {
          setHasProponent(true); // Habilita o envio do projeto
        } else {
          setError("Nenhum proponente cadastrado.");
          setHasProponent(false); // Desabilita o envio do projeto
        }
      } catch (error) {
        setError("Erro ao verificar proponentes. Tente novamente mais tarde.");
      }
    };

    if (typeof window !== "undefined") {
      const userDetails = localStorage.getItem("userDetails");
      if (userDetails) {
        setStorageUserDetails(JSON.parse(userDetails));
      }
    }

    if (storedNumeroInscricao) {
      setNumeroInscricao(storedNumeroInscricao);
      if (storedProjectName) {
        setProjectName(storedProjectName);
      }
      if (now > deadline) {
        setCanSubmit(false);
      } else {
        setCanSubmit(true);
      }

      const fetchResumoProjeto = async () => {
        setIsLoading(true);

        const url = `https://gorki-api-nome.iglgxt.easypanel.host/api/getProjeto`;
        const token = localStorage.getItem("authToken");

        try {
          const response = await fetch(url, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              usuario: localStorage.getItem("userEmail"),
              senha: localStorage.getItem("userPassword"),
              numeroInscricao: storedNumeroInscricao,
            }),
          });

          if (!response.ok) {
            throw new Error(
              `Erro na requisição: ${response.status} ${response.statusText}`
            );
          }

          const data = await response.json();
          if (data.projeto) {
            const projeto = data.projeto;
            setProjeto(projeto);
            setIdEdital(projeto.id_edital || "");
            setProjectName(projeto.nome || "");
            setStatusProjeto(projeto.status || "");
          } else {
            throw new Error("Projeto não encontrado.");
          }
        } catch (error) {
          setError(error.message);
        } finally {
          setIsLoading(false);
        }
      };

      fetchResumoProjeto();
      checkProponents(); // Chamada da função para verificar proponentes
    } else {
      setError("Número de inscrição não encontrado.");
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const fetchProponentes = async () => {
      const url = `https://gorki-fix-proponente.iglgxt.easypanel.host/api/getProponenteByUser`;
      const token = localStorage.getItem("authToken");
      const userDetails = localStorage.getItem("userDetails");
      const parsedUserDetails = userDetails ? JSON.parse(userDetails) : null;
      const idUsuario = parsedUserDetails ? parsedUserDetails.id : null;

      if (!idUsuario) {
        console.error("ID de usuário não encontrado em localStorage");
        setError("Erro ao encontrar o usuário.");
        return;
      }

      try {
        const response = await fetch(url, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ idUsuario }),
        });

        if (!response.ok) {
          throw new Error("Nenhum proponente encontrado");
        }

        const data = await response.json();
        console.log("Dados recebidos com sucesso:", data);
        localStorage.setItem(
          "tipoProponente",
          data.proponentes[0].cpf_responsavel ? "PF" : "PJ"
        );
      } catch (error) {
        console.error("Erro ao receber os proponentes:", error);
        setError(error.message);
      }
    };

    fetchProponentes();
  }, []);

  const handleProjectNameChange = (event) => {
    setProjectName(event.target.value);
  };

  const handleProjectNameBlur = async () => {
    const requestBody = JSON.stringify({
      idProjeto: numeroInscricao,
      novoNome: projectName,
    });

    try {
      const response = await fetch(
        "https://gorki-api-nome.iglgxt.easypanel.host/api/updateProjectName",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: requestBody,
        }
      );

      if (!response.ok) {
        throw new Error(
          `Erro ao atualizar o nome do projeto: ${response.status}`
        );
      }

      console.log("Nome do projeto atualizado com sucesso");
      console.log(requestBody);
      localStorage.setItem("projectName", projectName);
    } catch (error) {
      setError(
        "Erro ao atualizar o nome do projeto. Tente novamente mais tarde."
      );
    }
  };

  const handleOpenDeleteDialog = () => setOpenDeleteDialog(true);
  const handleCloseDeleteDialog = () => setOpenDeleteDialog(false);

  const handleOpenSubmitDialog = () => setOpenSubmitDialog(true);
  const handleCloseSubmitDialog = () => setOpenSubmitDialog(false);

  const handleDelete = async () => {
    setIsSubmitting(true);
    setIsSubmitting(false);
  };

  const handleSubmit = async () => {
    if (!hasProponent) {
      setError("Você deve cadastrar um proponente antes de enviar o projeto.");
      return;
    }

    setIsSubmitting(true);
    const token = localStorage.getItem("authToken");
    const url =
      "https://gorki-fix-proponente.iglgxt.easypanel.host/api/submitProjeto";

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          numeroInscricao,
          idEdital,
          projectName,
          usuario: localStorage.getItem("userEmail"),
        }),
      });

      if (!response.ok) {
        throw new Error(`Erro ao enviar o projeto: ${response.status}`);
      }

      alert("Projeto enviado com sucesso!");
      setStatusProjeto("enviado");
    } catch (error) {
      setError("Erro ao enviar o projeto. Tente novamente mais tarde.");
    } finally {
      setIsSubmitting(false);
    }
  };

  function DocumentLink() {
    const idCidade = storageUserDetails.idCidade;

    switch (idCidade) {
      case 3798:
        return "https://criarte.s3.us-east-2.amazonaws.com/public/Edital%2Bde%2BFomento-%2BSanta%2BRita-6-37.pdf";

      case 3823:
        return "https://criarte.s3.us-east-2.amazonaws.com/public/sao-jose-do-rio-pardo/fomento/EDITAL+RIO+PARDO+PNAB_Retificado+2024+-+Fomento+Cultural%5B1%5D.pdf";

      case 3842:
        return "https://criarte.s3.us-east-2.amazonaws.com/documents/edital/edital.pdf";

      case 3398:
        return "https://www.cerquilho.sp.gov.br/public/admin/globalarq/diario-eletronico/diario/RAw32caA3Z2s2xTA.pdf";

      case 3716:
        return "https://styxx-public.s3.sa-east-1.amazonaws.com/editalPontal.pdf";

      case 3391:
        return "https://oficial.casabranca.sp.gov.br/prepara-pdf/305";

      default:
        break;
    }
  }

  return (
    <div>
      <PrivateRoute />
      <Header />
      <div className="app-container">
        <main className="main-content">
          <div className="project-header">
            {isLoading ? (
              <CircularProgress /> // Exibe o spinner de carregamento enquanto a requisição está sendo feita
            ) : error ? (
              <Alert severity="error">{error}</Alert>
            ) : (
              <>
                {/* Mostra apenas depois que o idEdital é definido */}
                <Button
                  variant="outlined"
                  onClick={() => router.push("/meusProjetos")}
                >
                  Voltar
                </Button>

                {idEdital !== 4 && (
                  <TextField
                    sx={{ minWidth: "400px" }}
                    id="standard-basic"
                    label="Nome do projeto"
                    required
                    variant="standard"
                    value={projectName}
                    onChange={handleProjectNameChange}
                    onBlur={handleProjectNameBlur}
                    InputLabelProps={{
                      sx: {
                        left: "10px",
                        top: "5px",
                        textAlign: "center",
                      },
                    }}
                  />
                )}

                <Typography variant="subtitle1" className="project-id">
                  ID: {numeroInscricao}
                </Typography>
              </>
            )}
          </div>

          {!isLoading &&
            idEdital !== null &&
            storageUserDetails.idCidade !== null && (
              <>
                {idEdital === 2 ? (
                  <div className="sections">
                    <div
                      style={{
                        backgroundColor: "white",
                        minHeight: "90px",
                        display: "flex",
                        marginLeft: "auto",
                        marginRight: "auto",
                        minWidth: "80%",
                        borderRadius: "8px",
                        boxShadow:
                          "rgba(0, 0, 0, 0.2) 0px 2px 1px -1px, rgba(0, 0, 0, 0.14) 0px 1px 1px 0px, rgba(0, 0, 0, 0.12) 0px 1px 3px 0px", // Sombra
                        alignItems: "center",
                        justifyContent: "center",
                        padding: "10px",
                      }}
                    >
                      <a
                        href="https://criarte.s3.us-east-2.amazonaws.com/documents/santa-rita-p4/edital-mestres-e-mestras/EDITAL-MESTRES-E-MESTRAS-PNAB-2024-assinado.pdf"
                        target="_blank"
                        rel="noreferrer"
                      >
                        LER OBJETO DO EDITAL
                      </a>
                      <p></p>
                    </div>
                    <Section
                      title="Anexos"
                      description="Anexe seus documentos aqui"
                      link="/documentoPremiacao"
                    />
                    <Section
                      title="Proponente"
                      description="Selecione o proponente do projeto"
                      link="../proponente"
                    />
                  </div>
                ) : storageUserDetails.idCidade === 3798 ? (
                  <div className="sections">
                    <div
                      style={{
                        backgroundColor: "white",
                        minHeight: "90px",
                        display: "flex",
                        marginLeft: "auto",
                        marginRight: "auto",
                        minWidth: "80%",
                        borderRadius: "8px",
                        boxShadow:
                          "rgba(0, 0, 0, 0.2) 0px 2px 1px -1px, rgba(0, 0, 0, 0.14) 0px 1px 1px 0px, rgba(0, 0, 0, 0.12) 0px 1px 3px 0px", // Sombra
                        alignItems: "center",
                        justifyContent: "center",
                        padding: "10px",
                      }}
                    >
                      <a href={DocumentLink()} target="_blank" rel="noreferrer">
                        LER OBJETO DO EDITAL
                      </a>
                      <p></p>
                    </div>

                    <Section
                      title="Proponente"
                      description="Selecione o proponente do projeto"
                      link="/proponente"
                    />
                    <Section
                      title="Informações gerais do projeto"
                      description="Informe o segmento, período previsto e o valor do projeto"
                      link="/informacoesGerais"
                    />
                    <Section
                      title="Documentos do projeto e proponente"
                      description="Importante! Só é possível anexar 01 (um) arquivo por item exigido. Caso necessário, reúna todos os ..."
                      link="/documentForm"
                    />
                    <Section
                      title="Planilha orçamentária"
                      description="O valor total das despesas cadastradas deverá corresponder ao informado no orçamento."
                      link="/planilhaOrc"
                    />
                  </div>
                ) : storageUserDetails.idCidade === 3398 ? (
                  <div className="sections">
                    <div
                      style={{
                        backgroundColor: "white",
                        minHeight: "90px",
                        display: "flex",
                        marginLeft: "auto",
                        marginRight: "auto",
                        minWidth: "80%",
                        borderRadius: "8px",
                        boxShadow:
                          "rgba(0, 0, 0, 0.2) 0px 2px 1px -1px, rgba(0, 0, 0, 0.14) 0px 1px 1px 0px, rgba(0, 0, 0, 0.12) 0px 1px 3px 0px", // Sombra
                        alignItems: "center",
                        justifyContent: "center",
                        padding: "10px",
                      }}
                    >
                      <a href={DocumentLink()} target="_blank" rel="noreferrer">
                        LER OBJETO DO EDITAL
                      </a>
                      <p></p>
                    </div>

                    <Section
                      title="Proponente"
                      description="Selecione o proponente do projeto"
                      link="../proponente"
                    />
                    <Section
                      title="Informações gerais do projeto"
                      description="Informe o segmento, período previsto e o valor do projeto"
                      link="/informacoesGerais"
                    />
                    <Section
                      title="Documentos do projeto e proponente"
                      description="Importante! Só é possível anexar 01 (um) arquivo por item exigido. Caso necessário, reúna todos os ..."
                      link="/documentForm"
                    />
                    <Section
                      title="Planilha orçamentária"
                      description="O valor total das despesas cadastradas deverá corresponder ao informado no orçamento."
                      link="/planilhaOrc"
                    />
                  </div>
                ) : storageUserDetails.idCidade === 3478 && idEdital == 1 ? (
                  <div className="sections">
                    <div
                      style={{
                        backgroundColor: "white",
                        minHeight: "90px",
                        display: "flex",
                        marginLeft: "auto",
                        marginRight: "auto",
                        minWidth: "80%",
                        borderRadius: "8px",
                        boxShadow:
                          "rgba(0, 0, 0, 0.2) 0px 2px 1px -1px, rgba(0, 0, 0, 0.14) 0px 1px 1px 0px, rgba(0, 0, 0, 0.12) 0px 1px 3px 0px", // Sombra
                        alignItems: "center",
                        justifyContent: "center",
                        padding: "10px",
                      }}
                    >
                      <a href={DocumentLink()} target="_blank" rel="noreferrer">
                        LER OBJETO DO EDITAL
                      </a>
                      <p></p>
                    </div>

                    <Section
                      title="Proponente"
                      description="Selecione o proponente do projeto"
                      link="../proponente"
                    />
                    <Section
                      title="Informações gerais do projeto"
                      description="Informe o segmento, período previsto e o valor do projeto"
                      link="/informacoesGerais"
                    />
                    <Section
                      title="Documentos do projeto e proponente"
                      description="Importante! Só é possível anexar 01 (um) arquivo por item exigido. Caso necessário, reúna todos os ..."
                      link="/documentForm"
                    />
                    <Section
                      title="Planilha orçamentária"
                      description="O valor total das despesas cadastradas deverá corresponder ao informado no orçamento."
                      link="/planilhaOrc"
                    />
                  </div>
                ) : storageUserDetails.idCidade === 3478 && idEdital == 4 ? (
                  <div className="sections">
                    <Section
                      title="Proponente"
                      description="Selecione o proponente do projeto"
                      link="../proponente"
                    />

                    <Section
                      title="Documentos do projeto e proponente"
                      description="Importante! Só é possível anexar 01 (um) arquivo por item exigido. Caso necessário, reúna todos os ..."
                      link="/documentForm"
                    />
                  </div>
                ) : storageUserDetails.idCidade === 3716 ? (
                  <div className="sections">
                    <div
                      style={{
                        backgroundColor: "white",
                        minHeight: "90px",
                        display: "flex",
                        marginLeft: "auto",
                        marginRight: "auto",
                        minWidth: "80%",
                        borderRadius: "8px",
                        boxShadow:
                          "rgba(0, 0, 0, 0.2) 0px 2px 1px -1px, rgba(0, 0, 0, 0.14) 0px 1px 1px 0px, rgba(0, 0, 0, 0.12) 0px 1px 3px 0px", // Sombra
                        alignItems: "center",
                        justifyContent: "center",
                        padding: "10px",
                      }}
                    >
                      <a href={DocumentLink()} target="_blank" rel="noreferrer">
                        LER OBJETO DO EDITAL
                      </a>
                      <p></p>
                    </div>

                    <Section
                      title="Proponente"
                      description="Selecione o proponente do projeto"
                      link="../proponente"
                    />
                    <Section
                      title="Informações gerais do projeto"
                      description="Informe o segmento, período previsto e o valor do projeto"
                      link="/informacoesGerais"
                    />
                    <Section
                      title="Documentos do projeto e proponente"
                      description="Importante! Só é possível anexar 01 (um) arquivo por item exigido. Caso necessário, reúna todos os ..."
                      link="/documentForm"
                    />
                    <Section
                      title="Planilha orçamentária"
                      description="O valor total das despesas cadastradas deverá corresponder ao informado no orçamento."
                      link="/planilhaOrc"
                    />
                  </div>
                ) : null}
                {storageUserDetails.idCidade === 3391 && idEdital == 1 && (
                  <div className="sections">
                    <div
                      style={{
                        backgroundColor: "white",
                        minHeight: "90px",
                        display: "flex",
                        marginLeft: "auto",
                        marginRight: "auto",
                        minWidth: "80%",
                        borderRadius: "8px",
                        boxShadow:
                          "rgba(0, 0, 0, 0.2) 0px 2px 1px -1px, rgba(0, 0, 0, 0.14) 0px 1px 1px 0px, rgba(0, 0, 0, 0.12) 0px 1px 3px 0px", // Sombra
                        alignItems: "center",
                        justifyContent: "center",
                        padding: "10px",
                      }}
                    >
                      <a href={DocumentLink()} target="_blank" rel="noreferrer">
                        LER OBJETO DO EDITAL
                      </a>
                      <p></p>
                    </div>

                    <Section
                      title="Proponente"
                      description="Selecione o proponente do projeto"
                      link="../proponente"
                    />
                    <Section
                      title="Informações gerais do projeto"
                      description="Informe o segmento, período previsto e o valor do projeto"
                      link="/informacoesGerais"
                    />
                    <Section
                      title="Documentos do projeto e proponente"
                      description="Importante! Só é possível anexar 01 (um) arquivo por item exigido. Caso necessário, reúna todos os ..."
                      link="/documentForm"
                    />
                    <Section
                      title="Planilha orçamentária"
                      description="O valor total das despesas cadastradas deverá corresponder ao informado no orçamento."
                      link="/planilhaOrc"
                    />
                  </div>
                )}

                <div className="actions">
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={handleOpenDeleteDialog}
                  >
                    Excluir projeto
                  </Button>
                  <Button
                    sx={{ backgroundColor: "#1D4A5D", color: "white" }}
                    onClick={handleSubmit}
                    variant="contained"
                    color="primary"
                    disabled={
                      statusProjeto === "enviado" ||
                      (storageUserDetails &&
                        storageUserDetails.idCidade === 3478) ||
                      (storageUserDetails &&
                        storageUserDetails.idCidade === 3398) ||
                      (storageUserDetails &&
                        storageUserDetails.idCidade === 3716) ||
                      (storageUserDetails &&
                        storageUserDetails.idCidade === 3391)
                    }
                  >
                    Enviar projeto
                  </Button>
                </div>
              </>
            )}
        </main>
      </div>

      <Dialog
        open={openSubmitDialog}
        onClose={handleCloseSubmitDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Confirmar Envio do Projeto"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Após enviar o projeto, você não poderá mais editá-lo. Deseja
            continuar?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseSubmitDialog} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            color="primary"
            disabled={isSubmitting}
            autoFocus
          >
            {isSubmitting ? <CircularProgress size={24} /> : "Confirmar"}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Confirmar Exclusão do Projeto"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Após excluir o projeto, você não poderá recuperá-lo. Deseja
            continuar?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button
            onClick={handleDelete}
            color="primary"
            disabled={isSubmitting}
            autoFocus
          >
            {isSubmitting ? <CircularProgress size={24} /> : "Confirmar"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

function Section({ title, description, link }) {
  const router = useRouter();

  const handleClick = (e) => {
    const tipoProponente = localStorage.getItem("tipoProponente");
    if (link === "/documentForm" && !tipoProponente) {
      e.preventDefault();
      alert("Você deve cadastrar um proponente primeiro.");
    } else {
      router.push(link);
    }
  };

  return (
    <div
      className="section"
      onClick={handleClick}
      style={{
        display: "flex",
        alignItems: "center",
        padding: "16px",
        margin: "8px 0",
        border: "1px solid #ccc",
        borderRadius: "8px",
        cursor: "pointer",
        backgroundColor: "#f9f9f9",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        transition: "background-color 0.3s",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#e6f7ff")}
      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#f9f9f9")}
    >
      <div
        className="section-icon"
        style={{
          width: "40px",
          height: "40px",
          marginRight: "16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#ddd",
          borderRadius: "50%",
          fontWeight: "bold",
          fontSize: "18px",
        }}
      >
        ?
      </div>
      <div
        className="section-content"
        style={{
          flexGrow: 1,
        }}
      >
        <h3
          style={{
            margin: "0",
            fontSize: "18px",
            color: "#333",
          }}
        >
          {title}
        </h3>
        <p
          style={{
            margin: "4px 0 0",
            fontSize: "14px",
            color: "#666",
          }}
        >
          {description}
        </p>
      </div>
      <div
        className="section-arrow"
        style={{
          fontSize: "18px",
          color: "#888",
        }}
      >
        &gt;
      </div>
    </div>
  );
}

export default PnabHomeForms;
