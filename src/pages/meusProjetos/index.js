/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unknown-property */
/* eslint-disable no-constant-binary-expression */
import React, { useState, useEffect } from "react";
import Header from "../../components/header/header";
import PrivateRoute from "../../components/PrivateRoute";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useRouter } from "next/router";

const MeusProjetos = () => {
  const [projetos, setProjetos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [editAlertOpen, setEditAlertOpen] = useState(false);
  const [disabledAlertOpen, setDisabledAlertOpen] = useState(false);
  const [storageUserDetails, setStorageUserDetails] = useState(null);

  const router = useRouter();

  useEffect(() => {
    const userDetails = localStorage.getItem("userDetails");
    setStorageUserDetails(userDetails);
    console.log("user", JSON.parse(userDetails));
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const userDetails = localStorage.getItem("userDetails");
      if (userDetails) {
        setStorageUserDetails(JSON.parse(userDetails));
      }
    }

    const fetchProjectInfo = async () => {
      setIsLoading(true);
      setError(null);
      const token = localStorage.getItem("authToken");
      try {
        const response = await fetch(
          `https://api.grupogorki.com.br/api/projeto/listaProjetos`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setProjetos(data.data || []);
          console.log("data", data.data);
        } else {
          setError("Nenhum projeto foi encontrado.");
        }
      } catch (error) {
        setError("Erro ao carregar projetos.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjectInfo();
  }, []);

  const handleCreateProject = async () => {
    const userDetails = localStorage.getItem("userDetails");
    const parsedUserDetails = JSON.parse(userDetails);
    const idUsuario = parsedUserDetails.id;

    try {
      const response = await fetch(
        "https://gorki-api-nome.iglgxt.easypanel.host/api/createProjeto",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            usuario: localStorage.getItem("userEmail"),
            senha: localStorage.getItem("userPassword"),
            nomeProjeto: "Nome do seu projeto",
            idProponente: 0,
            idArea: 1,
            dataPrevistaInicio: "2024-01-01",
            dataPrevistaFim: "2024-12-31",
            resumoProjeto: "Resumo do projeto",
            descricao: "Descrição detalhada do projeto",
            objetivos: "Objetivos do projeto",
            justificativaProjeto: "Justificativa para o projeto",
            contrapartidaProjeto: "Contrapartida oferecida pelo projeto",
            planoDemocratizacao: "Plano de democratização",
            outrasInformacoes: "Outras informações relevantes",
            ingresso: false,
            valorIngresso: 0,
            idEdital: 1,
            idModalidade: 1,
            idUsuario: idUsuario,
            relevanciaPertinencia: "Relevância e pertinência do projeto",
            perfilPublico: "Perfil do público-alvo",
            classificacaoIndicativa: "Livre",
            qtdPublico: 100,
            propostaContrapartida: "Proposta de contrapartida detalhada",
            planoDivulgacao: "Plano de divulgação do projeto",
            nomeModalidade: "",
          }),
        }
      );

      const data = await response.json();
      if (data && data.projeto && data.projeto.id_projeto) {
        localStorage.setItem("numeroInscricao", data.projeto.id_projeto);
        router.push("/pnab/projeto");
      } else {
        console.error("Erro ao criar projeto:", data);
      }
    } catch (error) {
      console.error("Erro ao criar projeto:", error);
    }
  };

  const handleEdit = (projeto) => {
    if (projeto.status === "enviado" || projeto.status === "enviado") {
      setEditAlertOpen(true);
    } else {
      localStorage.setItem("numeroInscricao", projeto.numeroInscricao);
      router.push("/pnab/projeto");
    }
  };

  const handleDisabledButtonClick = () => {
    setDisabledAlertOpen(true);
  };

  const handleClickOpen = (project) => {
    setSelectedProject(project);
    setOpen(true); // Isso abre o diálogo de confirmação
  };

  const handleClickOpenRecurso = (project, tipo) => {
    // Atualiza o numeroInscricao no localStorage
    localStorage.setItem("numeroInscricao", project.numeroInscricao);
    if (tipo === "recurso") {
      router.push("/pnab/recurso");
    } else if (tipo === "habilitacao") {
      router.push("/pnab/habilitacao");
    }
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedProject(null);
  };

  const handleDelete = async () => {
    try {
      if (selectedProject) {
        const response = await fetch(
          "https://gorki-fix-proponente.iglgxt.easypanel.host/api/deleteProjeto",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              usuario: localStorage.getItem("userEmail"),
              senha: localStorage.getItem("userPassword"),
              numeroInscricao: selectedProject.numeroInscricao,
            }),
          }
        );

        if (response.ok) {
          router.reload();
          handleClose();
        }
      }
    } catch (error) {
      console.error("Erro ao excluir projeto:", error);
    }
  };

  return (
    <div>
      <PrivateRoute />
      <Header />
      <div className="mp-container">
        <div
          style={{
            backgroundColor: "white",
            padding: "20px",
            borderRadius: "10px",
          }}
          className="mp-header"
        >
          <Button variant="outlined" onClick={() => router.push("/home")}>
            Voltar
          </Button>
          <h1 style={{ marginLeft: "25px", color: "gray" }}>Meus Projetos</h1>
          <div className="mp-controls">
            <Button
              sx={{
                backgroundColor: "#1D4A5D",
                color: "white",
                ":hover": { backgroundColor: "#1D4A5D" },
              }}
              onClick={() => {
                router.push("/projetos/selecao");
              }}
              variant="contained"
              disabled={
                (storageUserDetails && storageUserDetails.idCidade === 3823) ||
                (storageUserDetails && storageUserDetails.idCidade === 3478) ||
                (storageUserDetails && storageUserDetails.idCidade === 3398)
              }
            >
              Criar Projeto
            </Button>
          </div>
        </div>

        {/* Mostrar o card "Criar Novo Projeto" apenas se não houver projetos */}
        {projetos.length === 0 && (
          <div
            style={{
              backgroundColor: "white",
              padding: "20px",
              borderRadius: "10px",
            }}
            className="mp-header new-proj-card blinking-shadow"
          >
            <div
              onClick={() => {
                router.push("/projetos/selecao");
              }}
              style={{
                display: "flex",
                justifyContent: "center",
                cursor: "pointer",
              }}
              className="mp-controls"
            >
              <img
                src="https://criarte.s3.us-east-2.amazonaws.com/public/botao-adicionar.png"
                style={{ maxWidth: "40px" }}
                alt="Botão Adicionar"
              />
              <Button
                sx={{
                  backgroundColor: "white",
                  color: "gray",
                  boxShadow: "none !important",
                  ":hover": { backgroundColor: "white" },
                }}
                variant="contained"
                onClick={() => {
                  router.push("/projetos/selecao");
                }}
              >
                Criar Novo Projeto
              </Button>
            </div>
          </div>
        )}

        <div className="mp-projects-grid">
          {isLoading ? (
            <CircularProgress />
          ) : error ? (
            <Alert severity="info">{error}</Alert>
          ) : (
            projetos.map((projeto) => (
              <div
                style={{ backgroundColor: "white" }}
                className="mp-project-card"
                key={projeto.id}
              >
                <div className="mp-project-header">
                  <h2>{projeto.nomeProjeto}</h2>
                  <span
                    className={`mp-status ${projeto.status ? projeto.status.toLowerCase() : "rascunho"}`}
                  >
                    {projeto.status || "Rascunho"}
                  </span>
                </div>
                <div className="mp-project-body">
                  <p>
                    <strong>Nº de inscrição:</strong>{" "}
                    {projeto.numeroInscricao || "---"}
                  </p>
                  <p>
                    <strong>Título do edital:</strong>{" "}
                    {projeto.titulo || "PNAB 2024"}
                  </p>
                  <p>
                    <strong>Modalidade:</strong> {"Pessoa Física" || "---"}
                  </p>
                </div>
                <div className="mp-project-footer">
                  <Button
                    size="small"
                    variant="outlined"
                    sx={{ marginRight: "8px" }}
                    onClick={() =>
                      handleClickOpenRecurso(projeto, "habilitacao")
                    }
                    disabled={
                      ![3823, 3398, 3478].includes(storageUserDetails.idCidade)
                    }
                  >
                    {storageUserDetails.idCidade === 3842
                      ? "Recurso em Habilitação"
                      : "Habilitação "}
                  </Button>
                  <Button
                    size="small"
                    variant="outlined"
                    sx={{ marginRight: "8px" }}
                    onClick={() => handleClickOpenRecurso(projeto, "recurso")}
                    disabled={![].includes(storageUserDetails.idCidade)}
                  >
                    Recurso
                  </Button>
                  <Button
                    size="small"
                    variant="outlined"
                    color="error"
                    onClick={() => handleClickOpen(projeto)}
                    disabled={
                      projeto.status === "enviado" ||
                      projeto.status === "Habilitação" ||
                      projeto.status === "Recurso"
                    }
                  >
                    Excluir
                  </Button>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => handleEdit(projeto)}
                    disabled={
                      projeto.status === "enviado" ||
                      projeto.status === "Habilitação" ||
                      projeto.status === "Recurso"
                    }
                  >
                    Editar
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Confirmar Exclusão"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Você tem certeza de que deseja excluir este projeto? Esta ação não
            pode ser desfeita.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDelete} color="error" autoFocus>
            Confirmar
          </Button>
          <Button onClick={handleClose}>Cancelar</Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={editAlertOpen}
        onClose={() => setEditAlertOpen(false)}
        aria-labelledby="edit-alert-dialog-title"
        aria-describedby="edit-alert-dialog-description"
      >
        <DialogTitle id="edit-alert-dialog-title">
          {"Edição não permitida"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="edit-alert-dialog-description">
            Este projeto já foi enviado e não pode ser editado.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditAlertOpen(false)} autoFocus>
            Ok
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={disabledAlertOpen}
        onClose={() => setDisabledAlertOpen(false)}
        aria-labelledby="disabled-alert-dialog-title"
        aria-describedby="disabled-alert-dialog-description"
      >
        <DialogTitle id="disabled-alert-dialog-title">
          {"Ação Não Permitida"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="disabled-alert-dialog-description">
            Este projeto já foi enviado e não pode ser editado.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDisabledAlertOpen(false)} autoFocus>
            Ok
          </Button>
        </DialogActions>
      </Dialog>

      <style jsx>{`
        @keyframes blinking-shadow {
          0% {
            box-shadow: none;
          }
          50% {
            box-shadow: 0 0 10px 5px white;
          }
          100% {
            box-shadow: none;
          }
        }

        .blinking-shadow {
          animation: blinking-shadow 1.5s infinite;
        }
      `}</style>
    </div>
  );
};

export default MeusProjetos;
