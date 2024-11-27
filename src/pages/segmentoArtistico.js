import React, { useState, useEffect } from "react";
import {
  Container,
  Grid,
  Typography,
  TextField,
  Button,
  Box,
  CircularProgress,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import Header from "../components/header/header";
import PrivateRoute from "../components/PrivateRoute";
require("dotenv").config();

const SegmentoArtistico = () => {
  const [formData, setFormData] = useState({
    outras: "",
  });

  const [numeroInscricao, setNumeroInscricao] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);
  const [module, setModule] = useState("");
  const [category, setCategory] = useState("");
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [userCityId, setUserCityId] = useState("");

  const citySantaRitaId = 3798; // ID da cidade de Santa Rita Do Passa Quatro

  // Fetch user ID and city ID on mount
  useEffect(() => {
    const storedUserDetails = localStorage.getItem("userDetails");
    const userDetails = JSON.parse(storedUserDetails);
    setUserId(userDetails ? userDetails.id : null);
    setUserCityId(userDetails ? userDetails.idCidade : null);
  }, []);

  // Fetch numeroInscricao from localStorage and project data
  useEffect(() => {
    const storedNumeroInscricao = localStorage.getItem("numeroInscricao");
    if (storedNumeroInscricao) {
      setNumeroInscricao(storedNumeroInscricao);
    } else {
      setError("Número de inscrição não encontrado.");
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (numeroInscricao) {
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
              numeroInscricao,
            }),
          });

          if (!response.ok) {
            throw new Error(
              `Erro na requisição: ${response.status} ${response.statusText}`,
            );
          }

          const data = await response.json();

          if (data.projeto) {
            const projeto = data.projeto;

            // Parse do campo descricao, que contém o JSON com "outras"
            let descricao = {};

            if (projeto.descricao) {
              try {
                descricao = JSON.parse(projeto.descricao); // Converte a string JSON em objeto
              } catch (e) {
                console.error("Erro ao fazer o parse de descricao:", e);
              }
            }

            // Atualiza o campo "outras" no formData com o valor extraído
            setFormData((prevFormData) => ({
              ...prevFormData,
              outras: descricao.outras || "", // Pega "outras" de dentro de "descricao"
            }));

            // Set module and category based on project data
            setModule(projeto.id_modalidade || "");
            setCategory(projeto.nome_modalidade || "");
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
    }
  }, [numeroInscricao]);

  useEffect(() => {
    // Condicionar as opções de categorias com base no módulo selecionado e na cidade do usuário
    if (userCityId === citySantaRitaId) {
      // As opções de categoria são as mesmas para todos os módulos
      setCategoryOptions([
        "Artes visuais",
        "Artesanato",
        "Audiovisual",
        "Circo",
        "Dança",
        "Cultura Afro-brasileira e tradições",
        "Música",
        "Literatura",
        "Patrimônio",
        "Teatro",
      ]);
    } else {
      // Regras para outras cidades
      if (module === "1") {
        setCategoryOptions([
          "Produção de eventos",
          "Artes plásticas ou visuais",
          "Exposição coletiva de artesanato",
          "Apresentação teatral",
          "Apresentação de dança",
          "Contação de histórias",
          "Atividades culturais voltadas para a cultura afro-brasileira",
        ]);
      } else if (module === "2") {
        setCategoryOptions([
          "Atividades de formação voltadas para zonas periféricas",
        ]);
      }
    }
  }, [module, userCityId]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleModuleChange = (event) => {
    setModule(event.target.value);
    setCategory(""); // Reseta a categoria quando o módulo muda
  };

  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
  };

  const handleSubmit = async () => {
    if (!numeroInscricao) {
      alert("Número de inscrição do projeto não encontrado.");
      return;
    }

    let userEmail = localStorage.getItem("userEmail");
    let userPassword = localStorage.getItem("userPassword");

    // Envio para atualizar o projeto
    const body = {
      idProjeto: numeroInscricao,
      descricao: JSON.stringify(formData),
      idUsuario: userId,
    };

    const url = `https://gorki-api-nome.iglgxt.easypanel.host/api/updateProjeto`;
    const token = localStorage.getItem("authToken");

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        alert("Projeto atualizado com sucesso!");
        // Atualizar a modalidade após o projeto ser atualizado
        const modalidadeData = {
          usuario: userEmail,
          senha: userPassword,
          idModalidade: module,
          nomeModalidade: category,
          idProjeto: numeroInscricao,
        };

        const modalidadeUrl =
          "https://gorki-api-nome.iglgxt.easypanel.host/api/updateModalidade";

        const modalidadeResponse = await fetch(modalidadeUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(modalidadeData),
        });

        if (modalidadeResponse.ok) {
          console.log("Modalidade atualizada com sucesso!");
        } else {
          console.log("Erro ao atualizar a modalidade.");
        }
      } else {
        alert("Erro ao atualizar o projeto.");
      }
    } catch (error) {
      console.error("Erro:", error);
      alert("Erro ao atualizar o projeto.");
    }
  };

  return (
    <div>
      <PrivateRoute>
        <Header />
        <Container
          className="card"
          maxWidth="lg"
          style={{
            justifyContent: "center",
            alignItems: "center",
            minHeight: "100vh",
            marginTop: "50px",
          }}
        >
          <Grid item>
            <a href="/pnab/projeto">
              <Button variant="outlined" color="primary">
                Voltar
              </Button>
            </a>
          </Grid>
          <h1 className="titulo-info">Segmento artístico</h1>

          {isLoading ? (
            <CircularProgress />
          ) : error ? (
            <Alert severity="error">{error}</Alert>
          ) : (
            <Box
              border={1}
              borderRadius={4}
              padding={3}
              borderColor="grey.300"
              width="100%"
              maxWidth="800px"
              margin="0 auto"
            >
              <Grid container spacing={2}>
                {[
                  { label: "Segmento artístico do seu projeto", key: "outras" },
                ].map((field) => (
                  <Grid item xs={12} key={field.key}>
                    <Typography variant="body1" gutterBottom>
                      {field.label}
                    </Typography>
                    <TextField
                      fullWidth
                      multiline
                      minRows={5}
                      variant="outlined"
                      name={field.key}
                      value={formData[field.key]}
                      onChange={handleChange}
                    />
                  </Grid>
                ))}

                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Modalidade</InputLabel>
                    <Select value={module} onChange={handleModuleChange}>
                      <MenuItem value={1}>Módulo I</MenuItem>
                      <MenuItem value={2}>Módulo II</MenuItem>
                      <MenuItem value={3}>Módulo III</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Categoria</InputLabel>
                    <Select
                      value={category}
                      onChange={handleCategoryChange}
                      disabled={!module}
                    >
                      {categoryOptions.map((option) => (
                        <MenuItem key={option} value={option}>
                          {option}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid
                  item
                  xs={12}
                  container
                  justifyContent="center"
                  spacing={2}
                >
                  <Grid item>
                    <a href="/pnab/projeto">
                      <Button variant="outlined" color="primary">
                        Voltar
                      </Button>
                    </a>
                  </Grid>
                  <Grid item>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleSubmit}
                    >
                      Salvar
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </Box>
          )}
        </Container>
      </PrivateRoute>
    </div>
  );
};

export default SegmentoArtistico;
