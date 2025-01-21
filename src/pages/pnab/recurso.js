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
  const [file, setFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState(null);
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

  const handleFileChange = (event) => {
    const newFile = event.target.files[0];
    if (newFile) {
      setFile(newFile);
    }
  };

  const uploadFile = async () => {
    if (!file) return;

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
        setUploadStatus("success");
        setSuccessMessage(true);
      } else {
        setUploadStatus("error");
        setSuccessMessage(false);
      }
    } catch (err) {
      console.error("Upload error:", err);
      setUploadStatus("error");
      setSuccessMessage(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage(false);
    setSuccessMessage(false);

    if (!file) {
      setErrorMessage(true);
      return;
    }

    await uploadFile();
  };

  const UploadField = ({ name, label }) => (
    <Card sx={{ padding: "20px", marginBottom: 2, boxShadow: 3 }}>
      <CardContent>
        <Typography variant="h6" sx={{ marginBottom: 2 }}>
          {label}
        </Typography>
        <UploadBox>
          {file && <Typography>{file.name}</Typography>}
          <input
            type="file"
            id={`upload-${name}`}
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
          <label htmlFor={`upload-${name}`}>
            <Button variant="outlined" component="span">
              Selecionar Arquivo
            </Button>
          </label>
        </UploadBox>
        {uploadStatus === "success" && (
          <Alert severity="success">Arquivo enviado com sucesso!</Alert>
        )}
        {uploadStatus === "error" && (
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
                  Enviar
                </Button>
              </Box>
            </form>
          )}
          {successMessage && (
            <Alert severity="success">Documento enviado com sucesso!</Alert>
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
