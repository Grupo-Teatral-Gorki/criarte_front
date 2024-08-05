import React, { useState, useEffect } from 'react';
import { Container, Grid, Typography, TextField, Button, Box, CircularProgress, Alert, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
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
  const [userId, setUserId] = useState(null);
  const [module, setModule] = useState('');
  const [category, setCategory] = useState('');
  const [categoryOptions, setCategoryOptions] = useState([]);

  // Fetch user ID on mount
  useEffect(() => {
    const storedUserDetails = localStorage.getItem('userDetails');
    const userDetails = JSON.parse(storedUserDetails);
    setUserId(userDetails ? userDetails.id : null);
  }, []);

  // Fetch numeroInscricao from localStorage and project data
  useEffect(() => {
    const storedNumeroInscricao = localStorage.getItem('numeroInscricao');
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
    
        const url = `https://styxx-api.w3vvzx.easypanel.host/api/getProjeto`;
        const token = localStorage.getItem('authToken');
    
        try {
          const response = await fetch(url, {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              usuario: localStorage.getItem('userEmail'),
              senha: localStorage.getItem('userPassword'),
              numeroInscricao
            })
          });
    
          if (!response.ok) {
            throw new Error(`Erro na requisição: ${response.status} ${response.statusText}`);
          }
    
          const data = await response.json();  // Aqui não precisa de JSON.parse
          if (data[0]) {  // Verifica se há dados no array retornado
            const projeto = data[0];
  
            // Lida com `descricao` normalmente, se não for um JSON serializado:
            let descricao = {};
            try {
              descricao = JSON.parse(projeto.descricao);  // Tente desserializar apenas se `descricao` for realmente um JSON
            } catch (e) {
              // Se `descricao` não for um JSON serializado, lide com isso de forma diferente
              descricao = { descricao: projeto.descricao };
            }
  
            setFormData({
              resumo: projeto.resumo_projeto || '',
              relevancia: descricao.relevancia || projeto.relevancia_pertinencia || '',
              perfil: descricao.perfil || projeto.perfil_publico || '',
              expectativa: descricao.expectativa || projeto.qtd_publico || '',
              contrapartida: descricao.contrapartida || projeto.proposta_contrapartida || '',
              divulgacao: descricao.divulgacao || projeto.plano_divulgacao || '',
              democratizacao: descricao.democratizacao || projeto.plano_democratizacao || '',
              outras: descricao.outras || projeto.outras_informacoes || ''
            });
  
            setModule(projeto.id_modalidade || '');
            setCategory(projeto.nome_modalidade || '');
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
    if (numeroInscricao) {
      const fetchResumoProjeto = async () => {
        setIsLoading(true);
  
        const url = `https://styxx-api.w3vvzx.easypanel.host/api/getProjeto`;
        const token = localStorage.getItem('authToken');
  
        try {
          const response = await fetch(url, {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              usuario: localStorage.getItem('userEmail'),
              senha: localStorage.getItem('userPassword'),
              numeroInscricao
            })
          });
  
          if (!response.ok) {
            throw new Error(`Erro na requisição: ${response.status} ${response.statusText}`);
          }
  
          const data = await response.json();
          if (data.data && data.data.projeto) {
            const resumoProjeto = data.data.projeto.resumo_projeto || '';
            let descricao = {};
  
            // Verifica se `descricao` não é null ou undefined antes de tentar parsear
            if (data.data.projeto.descricao) {
              try {
                descricao = JSON.parse(data.data.projeto.descricao);
              } catch (e) {
                console.warn('Erro ao analisar descrição:', e);
              }
            } else {
              // Se `descricao` for null ou undefined, usa um objeto vazio para garantir campos em branco
              descricao = ' ';
            }
  
            setFormData((prevFormData) => ({
              ...prevFormData,
              resumo: resumoProjeto,
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

  const handleModuleChange = (event) => {
    const selectedModule = event.target.value;
    setModule(selectedModule);

    if (selectedModule === 1) {
      setCategoryOptions([
        'Música',
        'Artesanato',
        'Artes Plásticas',
        'Fotografia',
        'Literatura'
      ]);
    } else if (selectedModule === 2) {
      setCategoryOptions([
        'Contação de Histórias',
        'Teatro',
        'Dança'
      ]);
    }
    setCategory(''); // Reset category when module changes
  };

  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
  };

  const handleSubmit = async () => {
    if (!numeroInscricao) {
      alert('Número de inscrição do projeto não encontrado.');
      return;
    }

    const { resumo, ...rest } = formData;

    let userEmail = localStorage.getItem('userEmail');
    let userPassword = localStorage.getItem('userPassword');

    const body = {
      idProjeto: numeroInscricao,
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

    // Adicionando a parte de envio para o novo endpoint
    const modalidadeData = {
      usuario: userEmail,
      senha: userPassword,
      idModalidade: module,
      nomeModalidade: category,
      idProjeto: numeroInscricao
    };

    const modalidadeUrl = 'https://styxx-api.w3vvzx.easypanel.host/api/updateModalidade';

    try {
      const modalidadeResponse = await fetch(modalidadeUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(modalidadeData)
      });

      if (modalidadeResponse.ok) {
        console.log('Modalidade atualizada com sucesso!');
      } else {
        console.log('Erro ao atualizar a modalidade.');
      }
    } catch (error) {
      console.error('Erro:', error);
      console.log('Erro ao atualizar a modalidade.');
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

                <Grid item xs={12}>
                  <FormControl fullWidth margin="normal">
                    <InputLabel id="module-label">Módulo</InputLabel>
                    <Select
                      labelId="module-label"
                      id="module"
                      value={module}
                      onChange={handleModuleChange}
                    >
                      <MenuItem value={1}>Módulo 1</MenuItem>
                      <MenuItem value={2}>Módulo 2</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <FormControl fullWidth margin="normal">
                    <InputLabel id="category-label">Categoria</InputLabel>
                    <Select
                      labelId="category-label"
                      id="category"
                      value={category}
                      onChange={handleCategoryChange}
                      disabled={!module}
                    >
                      {categoryOptions.map((option, index) => (
                        <MenuItem key={index} value={option}>
                          {option}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

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
