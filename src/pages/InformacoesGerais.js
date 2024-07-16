import React, { useState, useEffect } from 'react';
import { Container, Grid, Typography, TextField, Button, Box, CircularProgress, Alert } from '@mui/material';
import Header from '../components/Header/Header';
import PrivateRoute from '../components/PrivateRoute';

const InformacoesGerais = () => {
  const [formData, setFormData] = useState({
    resumo: '',
    relevancia: '',
    perfil: '',
    expectativa: '',
    contrapartida: '',
    divulgacao: '',
    democratizacao: '',
    outras: ''
  });

  const [numeroInscricao, setNumeroInscricao] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const storedUserDetails = localStorage.getItem('userDetails');
  const userDetails = JSON.parse(storedUserDetails);
  const userId = userDetails ? userDetails.id : null;

  useEffect(() => {
    const fetchNumeroInscricao = async () => {
      setIsLoading(true);

      const url = `https://api.grupogorki.com.br/api/projeto/listaProjetos`;
      const token = localStorage.getItem('authToken');

      try {
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`Erro na requisição: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        if (data.data && data.data.length > 0) {
          setNumeroInscricao(data.data[0].numeroInscricao);
        } else {
          setError("Número de inscrição não encontrado.");
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNumeroInscricao();
  }, []);

  useEffect(() => {
    if (numeroInscricao) {
      const fetchResumoProjeto = async () => {
        setIsLoading(true);

        const url = `https://api.grupogorki.com.br/api/projeto/Projeto/${numeroInscricao}`;
        const token = localStorage.getItem('authToken');

        try {
          const response = await fetch(url, {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });

          if (!response.ok) {
            throw new Error(`Erro na requisição: ${response.status} ${response.statusText}`);
          }

          const data = await response.json();
          if (data.data && data.data.projeto) {
            const resumoProjeto = data.data.projeto.resumoProjeto;
            const descricao = JSON.parse(data.data.projeto.descricao);
            setFormData((prevFormData) => ({
              ...prevFormData,
              resumo: resumoProjeto || '',
              relevancia: descricao.relevancia || '',
              perfil: descricao.perfil || '',
              expectativa: descricao.expectativa || '',
              contrapartida: descricao.contrapartida || '',
              divulgacao: descricao.divulgacao || '',
              democratizacao: descricao.democratizacao || '',
              outras: descricao.outras || ''
            }));
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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async () => {
    if (!numeroInscricao) {
      alert('Número de inscrição do projeto não encontrado.');
      return;
    }

    const { resumo, ...rest } = formData;
    
    const body = {
      idProjeto: localStorage.getItem('numeroInscricao'),
      resumoProjeto: resumo,
      descricao: JSON.stringify(rest),
      idUsuario: userId,
    };

    const url = `https://api.grupogorki.com.br/api/projeto/updateProjeto`;
    const token = localStorage.getItem('authToken');

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body)
      });

      if (response.ok) {
        alert('Projeto atualizado com sucesso!');
      } else {
        alert('Erro ao atualizar o projeto.');
      }
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro ao atualizar o projeto.');
    }
  };

  return (
    <div>
      <PrivateRoute>
        <Header/>
        <Container className='card' maxWidth="lg" style={{ justifyContent: 'center', alignItems: 'center', minHeight: '100vh', marginTop: '50px' }}>
          <Grid item>
            <a href='/pnab/projeto'><Button variant="outlined" color="primary">Voltar</Button></a>
          </Grid>
          <h1 className='titulo-info'>Informações gerais do projeto</h1>
          {isLoading ? (
            <CircularProgress />
          ) : error ? (
            <Alert severity="error">{error}</Alert>
          ) : (
            <Box border={1} borderRadius={4} padding={3} borderColor="grey.300" width="100%" maxWidth="800px" margin="0 auto">
              <Grid container spacing={2}>
                {[
                  { label: 'Resumo do projeto:', key: 'resumo' },
                  { label: 'Relevância e pertinência:', key: 'relevancia' },
                  { label: 'Perfil de público e classificação indicativa:', key: 'perfil' },
                  { label: 'Expectativa da quantidade do público alcançado com o projeto:', key: 'expectativa' },
                  { label: 'Detalhamento da proposta de contrapartida do projeto:', key: 'contrapartida' },
                  { label: 'Plano de Divulgação:', key: 'divulgacao' },
                  { label: 'Plano de Democratização:', key: 'democratizacao' },
                  { label: 'Outras Informações', key: 'outras' }
                ].map((field) => (
                  <Grid item xs={12} key={field.key}>
                    <Typography variant="body1" gutterBottom>{field.label}</Typography>
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

                <Grid item xs={12} container justifyContent="center" spacing={2}>
                  <Grid item>
                    <a href='/pnab/projeto'><Button variant="outlined" color="primary">Voltar</Button></a>
                  </Grid>
                  <Grid item>
                    <Button variant="contained" color="primary" onClick={handleSubmit}>Salvar</Button>
                  </Grid>
                </Grid>
              </Grid>
            </Box>
          )}
        </Container>
      </PrivateRoute>
    </div>
  );
}

export default InformacoesGerais;
