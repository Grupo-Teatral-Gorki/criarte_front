import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Alert,
  CircularProgress,
} from "@mui/material";
import Header from "../../components/header/header";
import PrivateRoute from "../../components/PrivateRoute";
import Checkbox from "@mui/material/Checkbox";
import NovoProponente from "./NovoProponente";

const Proponente = () => {
  const [openList, setOpenList] = useState(false);
  const [openForm, setOpenForm] = useState(false);
  const [proponentes, setProponentes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProponentes = async () => {
      setLoading(true);
      const url = `https://gorki-fix-proponente.iglgxt.easypanel.host/api/getProponenteByUser`;
      const token = localStorage.getItem("authToken");
      const userDetails = localStorage.getItem("userDetails");
      const parsedUserDetails = userDetails ? JSON.parse(userDetails) : null;
      const idUsuario = parsedUserDetails ? parsedUserDetails.id : null;

      if (!idUsuario) {
        console.error("ID de usuário não encontrado em localStorage");
        setError("Erro ao encontrar o usuário.");
        setLoading(false);
        setIsLoading(false);
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
        setProponentes(data.proponentes);
      } catch (error) {
        console.error("Erro ao receber os proponentes:", error);
        setError(error.message);
      } finally {
        setLoading(false);
        setIsLoading(false);
      }
    };

    fetchProponentes();
  }, []);

  const handleOpenList = () => {
    setOpenList(true);
  };

  const handleCloseList = () => {
    setOpenList(false);
  };

  const handleOpenForm = () => {
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
  };

  const handleSelectProponente = async (proponente, idProponente) => {
    setLoading(true);
    const url = `https://gorki-fix-proponente.iglgxt.easypanel.host/api/selectProponente`;
    const token = localStorage.getItem("authToken");
    const userDetails = localStorage.getItem("userDetails");
    const parsedUserDetails = userDetails ? JSON.parse(userDetails) : null;
    const idUsuario = parsedUserDetails ? parsedUserDetails.id : null;

    if (!idUsuario) {
      console.error("ID de usuário não encontrado em localStorage");
      setError("Erro ao encontrar o usuário.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id_proponente: proponente.id_proponente,
          id_usuario: idUsuario,
        }),
      });
      localStorage.setItem(
        "tipoProponente",
        proponente.cpf_responsavel ? "PF" : "PJ"
      );

      if (!response.ok) {
        throw new Error("Erro ao selecionar o proponente");
      }

      const data = await response.json();
      console.log("Proponente selecionado com sucesso:", data);

      setProponentes((prevProponentes) =>
        prevProponentes.map((proponente) =>
          proponente.id_proponente === idProponente
            ? { ...proponente, is_selected: true }
            : { ...proponente, is_selected: false }
        )
      );
    } catch (error) {
      console.error("Erro ao selecionar o proponente:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <PrivateRoute>
        <Header />
        <div className="proponente-container">
          <h1>Proponente</h1>
          <div className="proponente-content">
            <div className="proponente-info">
              <p>1. Selecione o(a) proponente (Pessoa Física ou Jurídica)</p>
              <p>
                2. Este proponente pode ter até <b>1</b> projeto(s) em andamento
                neste edital. Certifique-se de que o proponente selecionado
                possui vagas para iniciar o cadastramento.
              </p>
            </div>
            <DialogContent className="proponentes" dividers>
              {isLoading ? (
                <CircularProgress />
              ) : error ? (
                <Alert variant="outlined" severity="info">
                  {error}
                </Alert>
              ) : (
                proponentes.map((proponente) => (
                  <div
                    key={proponente.id_proponente}
                    className="proponente-unity"
                  >
                    <Checkbox
                      checked={proponente.is_selected}
                      onChange={() =>
                        handleSelectProponente(
                          proponente,
                          proponente.id_proponente
                        )
                      }
                      sx={{ color: "blue" }}
                    />
                    <div className="info">
                      <Typography>
                        NOME:{" "}
                        {proponente.razao_social &&
                        proponente.razao_social !== "off"
                          ? proponente.razao_social
                          : proponente.responsavel_legal &&
                              proponente.responsavel_legal !== "off"
                            ? proponente.responsavel_legal
                            : "Indisponível"}
                        <div className="type">
                          Tipo:{" "}
                          {proponente.cpf_responsavel
                            ? "Pessoa Física"
                            : "Pessoa Jurídica"}
                        </div>
                      </Typography>
                      <Typography variant="body2" className="details">
                        {proponente.cpf_responsavel ? (
                          <>
                            CPF: ***.***.***-
                            {proponente.cpf_responsavel.slice(-2)}
                          </>
                        ) : proponente.cnpj ? (
                          <>CNPJ: **.***.***/{proponente.cnpj.slice(-4)}</>
                        ) : (
                          <>Documento não disponível</>
                        )}
                        | Email: {proponente.email}
                      </Typography>
                      <Typography variant="body2" className="details">
                        Endereço: {proponente.logradouro_responsavel},{" "}
                        {proponente.numero_responsavel},{" "}
                        {proponente.complemento_responsavel || ""},{" "}
                        {proponente.bairro_responsavel},{" "}
                        {proponente.cidade_responsavel}/
                        {proponente.uf_responsavel}
                      </Typography>
                    </div>
                  </div>
                ))
              )}
            </DialogContent>
            <div className="proponente-actions">
              <a href="/pnab/projeto">
                <Button className="back-button" variant="outlined">
                  Voltar para o projeto
                </Button>
              </a>
              <Button
                className="proponente-button"
                disabled={loading}
                variant="contained"
                color="primary"
                onClick={handleOpenList}
              >
                Lista de proponentes
              </Button>
            </div>
          </div>
          <Dialog
            open={openList}
            onClose={handleCloseList}
            maxWidth="sm"
            fullWidth
          >
            <DialogTitle>Lista de proponentes</DialogTitle>
            <DialogContent className="proponentes" dividers>
              {isLoading ? (
                <CircularProgress />
              ) : error ? (
                <Alert variant="outlined" severity="info">
                  {error}
                </Alert>
              ) : (
                proponentes.map((proponente) => (
                  <div
                    key={proponente.id_proponente}
                    className="proponente-unity"
                  >
                    <Checkbox
                      checked={proponente.is_selected}
                      onChange={() =>
                        handleSelectProponente(
                          proponente,
                          proponente.id_proponente
                        )
                      }
                      sx={{ color: "blue" }}
                    />
                    <Typography variant="subtitle1">
                      NOME:{" "}
                      {proponente.razao_social ||
                        proponente.responsavel_legal ||
                        "Não disponível"}
                      <div>
                        Tipo:{" "}
                        {proponente.cpf_responsavel
                          ? "Pessoa Física"
                          : "Pessoa Jurídica"}
                      </div>
                    </Typography>
                    <Typography variant="body2">
                      {proponente.cpf_responsavel ? (
                        <>
                          CPF: ***.***.***-
                          {proponente.cpf_responsavel.slice(-2)}
                        </>
                      ) : proponente.cnpj ? (
                        <>CNPJ: **.***.***/{proponente.cnpj.slice(-4)}</>
                      ) : (
                        <>Documento não disponível</>
                      )}
                      | Email: {proponente.email}
                    </Typography>
                    <Typography variant="body2">
                      Endereço: {proponente.logradouro_responsavel},{" "}
                      {proponente.numero_responsavel},{" "}
                      {proponente.complemento_responsavel || ""},{" "}
                      {proponente.bairro_responsavel},{" "}
                      {proponente.cidade_responsavel}/
                      {proponente.uf_responsavel}
                    </Typography>
                  </div>
                ))
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseList} color="primary">
                Fechar
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleOpenForm}
              >
                Adicionar novo proponente
              </Button>
            </DialogActions>
          </Dialog>
          <NovoProponente open={openForm} handleClose={handleCloseForm} />
        </div>
      </PrivateRoute>
    </div>
  );
};

export default Proponente;
