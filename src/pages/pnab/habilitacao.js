/* eslint-disable react/prop-types */
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
  const [allFilesUploaded, setAllFilesUploaded] = useState(false);
  const [userDetails, setUserDetails] = useState({});
  const [idEdital, setIdEdital] = useState();
  const [hasUploadError, setHasUploadError] = useState(false);

  useEffect(() => {
    const storedUserDetails = localStorage.getItem("userDetails");
    setUserDetails(JSON.parse(storedUserDetails) || {}); // Ensure parsing is done to retrieve proper object
  }, []);

  useEffect(() => {
    const fetchIdEdital = async () => {
      try {
        const response = await fetch(
          "https://gorki-api-nome.iglgxt.easypanel.host/api/getProjeto",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              usuario: localStorage.getItem("userEmail"),
              senha: localStorage.getItem("userPassword"),
              numeroInscricao: localStorage.getItem("numeroInscricao"),
            }),
          }
        );

        if (!response.ok) {
          throw new Error(`Erro ao buscar projeto: ${response.statusText}`);
        }

        const data = await response.json();
        setIdEdital(data.projeto.id_edital); // Aqui coletamos o idEdital
        console.log("edital", data.projeto.id_edital);
        setIsLoading(false);
      } catch (error) {
        setError("Erro ao buscar o projeto.");
        setIsLoading(false);
      }
    };

    fetchIdEdital();
  }, []);

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
    setFiles((prev) => ({ ...prev, [fieldName]: file }));
  };

  const uploadFile = async (file, fieldName) => {
    if (!numeroInscricao) {
      console.error("Número de inscrição não encontrado.");
      return;
    }

    const formData = new FormData();
    formData.append("IdProjeto", numeroInscricao);
    formData.append("IdTipo", 1);
    formData.append("Archive", file);

    try {
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
        setHasUploadError(true);
        throw new Error("Erro ao enviar arquivo.");
      }
    } catch (err) {
      setUploadStatus((prev) => ({ ...prev, [fieldName]: "error" }));
      console.error(err.message);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      let allUploaded = true; // Initially assume all files will upload successfully

      // Upload each file and check for errors
      await Promise.all(
        Object.keys(files).map(async (field) => {
          try {
            await uploadFile(files[field], field);
          } catch (error) {
            console.error(`Error uploading file for field ${field}:`, error);
            allUploaded = false; // Set to false if any file upload fails
          }
        })
      );

      // Only proceed with further logic if all uploads were successful
      if (allUploaded) {
        setAllFilesUploaded(true);
        setError(null); // Clear any previous error messages
      } else {
        setError("Erro ao enviar os arquivos. Tente novamente."); // Show error if not all files are uploaded successfully
        setAllFilesUploaded(false); // Ensure success message is hidden if upload fails
      }

      // If all uploads were successful, update the status in the API
      if (allUploaded) {
        const response = await fetch(
          "https://apiv3.styxx.com.br/api/updateStatus",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              usuario: localStorage.getItem("userEmail"),
              senha: localStorage.getItem("userPassword"),
              idProjeto: numeroInscricao,
              status: "Habilitação",
            }),
          }
        );

        if (!response.ok) {
          throw new Error("Erro ao atualizar status.");
        }
      }
    } catch (err) {
      console.error(err.message);
      setError("Erro ao enviar os arquivos. Tente novamente.");
      setAllFilesUploaded(false); // Ensure success message is hidden if upload fails
    }
  };

  const UploadField = ({ name, label }) => (
    <Card
      sx={{
        padding: "20px",
        borderRadius: "8px",
        boxShadow: 3,
        maxWidth: "700px",
        margin: "auto",
        mb: 2,
      }}
    >
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

  const UploadBox = styled("div")(() => ({
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

  const FooterAlert = () =>
    allFilesUploaded && !hasUploadError ? (
      <Alert severity="success">Todos os documentos foram enviados!</Alert>
    ) : error ? (
      <Alert severity="error">{error}</Alert>
    ) : null;

  const handleRenderForm = () => {
    if (userDetails.idCidade === 3798 && idEdital === 2) {
      return (
        <span>
          <UploadField
            name="doc_com_foto"
            label="Cópia digitalizada de um único documento com foto do proponente, constando número do CPF e RG (carteira de identidade, CNH, outros..)"
          />
          <UploadField
            name="comprov_endereco_retro"
            label="Comprovante de endereço retroativo "
          />
          <UploadField
            name="comprov_endereco_atual"
            label="Comprovante de endereço atual"
          />
          <UploadField
            name="dec_cessao_direitos_autorais"
            label="Declaração de opção de cessão de direitos autorais e/ou Declaração negativa de opção de direitos autorais, conforme Anexo III"
          />
          <UploadField
            name="cop_auto_declaracao"
            label="Cópia digitalizada da autodeclaração (anexo II) devidamente preenchida e assinada"
          />
          <UploadField
            name="dec_rep_coletivo"
            label="Nos casos de coletivos sem constituição jurídica, declaração de Representação do Grupo/Coletivo, conforme Anexo IV, assinada por todos os integrantes do coletivo;"
          />
          <UploadField
            name="dec_opc_municipio"
            label="Declaração de opção de Município, conforme Anexo IX."
          />
        </span>
      );
    } else {
      return (
        <>
          <UploadField name="cnd_municipal" label="*CND Municipal" />
          <UploadField name="cnd_estadual" label="*CND Estadual" />
          <UploadField name="cnd_federal" label="*CND Federal" />
        </>
      );
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
          <Typography variant="h4" sx={{ mb: "1rem", textAlign: "center" }}>
            {userDetails.idCidade === 3842 ||
            userDetails.idCidade === 3478 ||
            userDetails.idCidade === 3716
              ? "Recurso da Habilitação"
              : "Habilitação"}
          </Typography>

          {isLoading ? (
            <CircularProgress />
          ) : error ? (
            <Alert severity="error">{error}</Alert>
          ) : (
            <form onSubmit={handleSubmit}>
              {handleRenderForm()}
              <Box sx={{ mt: 4, textAlign: "center" }}>
                <Button
                  variant="contained"
                  type="submit"
                  disabled={Object.keys(files).length < 3}
                >
                  Enviar Todos
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

export default RecursoForm;
