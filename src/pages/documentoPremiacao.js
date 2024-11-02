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
import Header from "../components/Header/Header";
import PrivateRoute from "../components/PrivateRoute";

// Alterado para começar com letra maiúscula
const DocumentoPremiacao = () => {
  const [numeroInscricao, setNumeroInscricao] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [files, setFiles] = useState({});
  const [uploadStatus, setUploadStatus] = useState({});
  const [allFilesUploaded, setAllFilesUploaded] = useState(false);

  useEffect(() => {
    const numeroInscricaoStored = localStorage.getItem("numeroInscricao");

    if (numeroInscricaoStored && numeroInscricaoStored.length > 0) {
      setNumeroInscricao(numeroInscricaoStored);
      setIsLoading(false);
    } else {
      setError("Número de inscrição não encontrado.");
      setIsLoading(false);
    }
  }, []);

  const handleFileChange = (event, fieldName) => {
    const file = event.target.files[0];
    setFiles((prevFiles) => ({
      ...prevFiles,
      [fieldName]: file,
    }));
  };

  const uploadFile = async (file, fieldName) => {
    if (!numeroInscricao) {
      throw new Error("Número de inscrição do projeto não encontrado.");
    }

    const formData = new FormData();
    formData.append("IdProjeto", numeroInscricao);
    formData.append("IdTipo", 1);
    formData.append("Archive", file, file.name);

    try {
      const response = await fetch(
        "https://api.grupogorki.com.br/api/docProjeto/Create",
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
          body: formData,
        },
      );

      if (response.ok) {
        setUploadStatus((prevStatus) => ({
          ...prevStatus,
          [fieldName]: "success",
        }));
      } else {
        setUploadStatus((prevStatus) => ({
          ...prevStatus,
          [fieldName]: "error",
        }));

        console.error(
          "Upload error:",
          response.status,
          response.statusText,
          await response.text(),
        );
      }
    } catch (error) {
      setUploadStatus((prevStatus) => ({
        ...prevStatus,
        [fieldName]: "error",
      }));

      console.error("Upload error:", error.message);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const storedUserDetails = localStorage.getItem("userDetails");
    const userDetails = JSON.parse(storedUserDetails);

    try {
      await Promise.all(
        Object.keys(files).map((fieldName) =>
          uploadFile(files[fieldName], fieldName),
        ),
      );
      setAllFilesUploaded(true);

      const updateResponse = await fetch(
        "https://api.grupogorki.com.br/api/projeto/updateProjeto",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            idProponente: userDetails.id,
          }),
        },
      );

      if (!updateResponse.ok) {
        throw new Error(
          `Erro ao atualizar o projeto: ${updateResponse.status} ${updateResponse.statusText}`,
        );
      }

      console.log(
        "Projeto atualizado com sucesso:",
        await updateResponse.json(),
      );
    } catch (error) {
      console.error("Error updating project:", error);
    }
  };

  const UploadField = ({ name, label, exampleLink, exampleText }) => (
    <Card
      sx={{
        padding: "20px",
        borderRadius: "8px",
        boxShadow: 3,
        maxWidth: "700px",
        width: "800px",
        margin: "auto",
        mb: 2,
      }}
    >
      {exampleLink && <a href={exampleLink}>{exampleText}</a>}
      <CardContent>
        <Typography variant="h6" sx={{ mb: 2 }}>
          {label}
        </Typography>
        <UploadBox>
          <Typography variant="body2" sx={{ mb: 1 }}>
            Selecione o arquivo aqui
          </Typography>
          {files[name] && <p>{files[name].name}</p>}
          <Typography variant="caption" sx={{ mb: 2, display: "block" }}>
            Arquivos Suportados: PDF
          </Typography>
          <input
            type="file"
            onChange={(e) => handleFileChange(e, name)}
            style={{ display: "none" }}
            id={`upload-${name}`}
          />
          <label htmlFor={`upload-${name}`}>
            <Button variant="outlined" component="span">
              SELECIONAR
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

  const UploadBox = styled("div")(({ theme }) => ({
    border: "2px dashed #ccc",
    padding: "20px",
    textAlign: "center",
    borderRadius: "4px",
    backgroundColor: "#f9f9f9",
    cursor: "pointer",
    "&:hover": {
      borderColor: "#999",
    },
  }));

  const FooterAlert = () => {
    if (allFilesUploaded) {
      return (
        <Alert severity="success">
          Todos os documentos foram enviados com sucesso!
        </Alert>
      );
    } else {
      return null;
    }
  };

  return (
    <div>
      <PrivateRoute />
      <Header />
      <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
        <Box
          sx={{
            width: "50%",
            border: "1px solid #ddd",
            padding: "2rem",
            borderRadius: "8px",
            backgroundColor: "#f9f9f9",
          }}
        >
          <Typography
            variant="h4"
            sx={{ marginBottom: "1rem", textAlign: "center" }}
          >
            Documentos do Projeto e Proponente
          </Typography>
          <Alert sx={{ marginBottom: "20px" }} severity="warning">
            Após receber a mensagem de confirmação, o arquivo será salvo
            automaticamente e não será exibido na tela. Caso precise enviar um
            novo arquivo para substituir o anterior, repita o processo,
            preenchendo apenas o campo necessário.
          </Alert>
          {isLoading ? (
            <CircularProgress />
          ) : error ? (
            <Alert severity="error">{error}</Alert>
          ) : (
            <form onSubmit={handleSubmit}>
              <UploadField
                name="form-insc"
                label="Formulário De Inscrição"
                exampleLink="https://criarte.s3.us-east-2.amazonaws.com/public/EDITAL-05-ANEXO-2-FORMULARIO-DE-INSCRICAO.docx"
                exampleText="Baixar exemplo"
              />
              <UploadField
                name="portf"
                label="Portfólio / Curriculo Artístico"
              />
              <UploadField
                name="dec-rep"
                label="Declaração De Representação ( Opcional )"
              />
              <UploadField
                name="auto-dec-et"
                label="Autodeclaração étnico-racial e/ou de pessoa com deficiência"
              />

              <Box sx={{ mt: 4, textAlign: "center" }}>
                <Button variant="contained" type="submit">
                  SALVAR DOCUMENTOS
                </Button>
              </Box>
            </form>
          )}
          <FooterAlert />
        </Box>
      </Box>
    </div>
  );
};

// Altere a exportação para o novo nome
export default DocumentoPremiacao;
