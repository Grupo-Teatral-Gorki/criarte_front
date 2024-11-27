/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import {
  Button,
  Typography,
  Box,
  Card,
  CardContent,
  CircularProgress,
  Alert,
} from "@mui/material";
import { styled } from "@mui/system";
import Header from "../../components/header/header";
import PrivateRoute from "../../components/PrivateRoute";

const RecursoForm = () => {
  const [numeroInscricao, setNumeroInscricao] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [files, setFiles] = useState({});
  const [uploadStatus, setUploadStatus] = useState({});
  const [successMessage, setSuccessMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState(false);

  useEffect(() => {
    const storedNumero = localStorage.getItem("numeroInscricao");
    if (storedNumero) {
      setNumeroInscricao(storedNumero);
    } else {
      setError("Número de inscrição não encontrado.");
    }
    setIsLoading(false);
  }, []);

  const handleFileChange = (event, fieldName) => {
    const file = event.target.files[0];
    if (file) {
      setFiles((prev) => ({ ...prev, [fieldName]: file }));
    }
  };

  const uploadFile = async (file, fieldName) => {
    try {
      const formData = new FormData();
      formData.append("IdProjeto", numeroInscricao);
      formData.append("IdTipo", 1);
      formData.append("Archive", file);

      const response = await fetch(
        "https://api.grupogorki.com.br/api/docProjeto/Create",
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
          body: formData,
        }
      );

      if (response.ok) {
        setUploadStatus((prev) => ({ ...prev, [fieldName]: "success" }));
      } else {
        console.error("Upload failed:", response.status, response.statusText);
        setUploadStatus((prev) => ({ ...prev, [fieldName]: "error" }));
      }
    } catch (err) {
      console.error("Upload error:", err);
      setUploadStatus((prev) => ({ ...prev, [fieldName]: "error" }));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage(false);
    setSuccessMessage(false);

    if (!Object.keys(files).length) {
      setErrorMessage(true);
      return;
    }

    try {
      await Promise.all(
        Object.entries(files).map(([fieldName, file]) =>
          uploadFile(file, fieldName)
        )
      );
      setSuccessMessage(true);

      const updateResponse = await fetch(
        "https://apiv3.styxx.com.br/api/updateStatus",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            usuario: localStorage.getItem("userEmail"),
            senha: localStorage.getItem("userPassword"),
            idProjeto: numeroInscricao,
            status: "Recurso",
          }),
        }
      );

      if (!updateResponse.ok) {
        console.error("Failed to update status:", updateResponse.statusText);
        setErrorMessage(true);
      }
    } catch (err) {
      console.error("Error during submission:", err);
      setErrorMessage(true);
    }
  };

  const UploadField = ({ name, label }) => (
    <Card sx={{ padding: "20px", marginBottom: 2, boxShadow: 3 }}>
      <CardContent>
        <Typography variant="h6" sx={{ marginBottom: 2 }}>
          {label}
        </Typography>
        <UploadBox>
          {files[name] && <Typography>{files[name].name}</Typography>}
          <input
            type="file"
            id={`upload-${name}`}
            onChange={(e) => handleFileChange(e, name)}
            style={{ display: "none" }}
          />
          <label htmlFor={`upload-${name}`}>
            <Button variant="outlined" component="span">
              Selecionar Arquivo
            </Button>
          </label>
        </UploadBox>
        {uploadStatus[name] === "success" && (
          <Alert severity="success">Arquivo enviado com sucesso!</Alert>
        )}
        {uploadStatus[name] === "error" && (
          <Alert severity="error">Erro ao enviar o arquivo.</Alert>
        )}
      </CardContent>
    </Card>
  );

  const UploadBox = styled("div")(() => ({
    border: "2px dashed #ccc",
    padding: "20px",
    textAlign: "center",
    borderRadius: "4px",
    backgroundColor: "#f9f9f9",
    cursor: "pointer",
  }));

  return (
    <div>
      <PrivateRoute />
      <Header />
      <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
        <Box sx={{ width: "50%", padding: 4, backgroundColor: "#f9f9f9" }}>
          <Typography
            variant="h4"
            sx={{ textAlign: "center", marginBottom: 2 }}
          >
            Recurso
          </Typography>

          {isLoading ? (
            <CircularProgress />
          ) : error ? (
            <Alert severity="error">{error}</Alert>
          ) : (
            <form onSubmit={handleSubmit}>
              <UploadField name="argumento" label="*Argumento do Recurso" />
              <Box sx={{ textAlign: "center", marginTop: 4 }}>
                <Button variant="contained" type="submit">
                  Enviar Todos
                </Button>
              </Box>
            </form>
          )}
          {successMessage && (
            <Alert severity="success">Documentos enviados com sucesso!</Alert>
          )}
          {errorMessage && (
            <Alert severity="error">
              Selecione um arquivo antes de enviar.
            </Alert>
          )}
        </Box>
      </Box>
    </div>
  );
};

export default RecursoForm;
