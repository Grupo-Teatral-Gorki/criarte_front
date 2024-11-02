import React, { useState, useEffect } from 'react';
import { Container, Grid, Typography, TextField, Button, Box, CircularProgress, Alert, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import Header from '../components/Header/Header';
import PrivateRoute from '../components/PrivateRoute';
require('dotenv').config();

const InformacoesGerais = () => {
  const [formData, setFormData] = useState({
    resumo: '',
    relevancia: '',
    perfil: '',
    expectativa: '',
    contrapartida: '',
    divulgacao: '',
    democratizacao: '',
    afirmativas: '',
    local: '',
    outras: ''
  });

  const [numeroInscricao, setNumeroInscricao] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);
  const [module, setModule] = useState('');
  const [category, setCategory] = useState('');
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [userCityId, setUserCityId] = useState('');

  const citySantaRitaId = 3798; // ID da cidade de Santa Rita Do Passa Quatro

  const storedUserDetails = localStorage.getItem('userDetails');
  const userDetails = JSON.parse(storedUserDetails);

  // Buscar userID e idCidade ao montar o componente
  useEffect(() => {
    const storedUserDetails = localStorage.getItem('userDetails');
    const userDetails = JSON.parse(storedUserDetails);
    setUserId(userDetails ? userDetails.id : null);
    setUserCityId(userDetails ? userDetails.idCidade : null);
  }, []);

  // Buscar numeroInscricao do localStorage e dados do projeto
  useEffect(() => {
    const storedNumeroInscricao = localStorage.getItem('numeroInscricao');
    if (storedNumeroInscricao) {
      setNumeroInscricao(storedNumeroInscricao);
    } else {
      setError("Número de inscrição não encontrado.");
      setIsLoading(false);
    }
  }, []);


  async function logError(erro, idUsuario) {
    try {
      const response = await fetch('https://gorki-fix-proponente.iglgxt.easypanel.host/api/logErro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          erro: erro,
          numeroProjeto: localStorage.getItem('numeroInscricao') || null, // Pode ser obtido do localStorage se disponível
          idUsuario: idUsuario,
        }),
      });

      if (!response.ok) {
        console.error('Falha ao enviar log de erro:', response.statusText);
      } else {
        const logResponse = await response.json();
        console.log('Log de erro registrado com sucesso:', logResponse);
      }
    } catch (logError) {
      console.error('Erro ao tentar enviar log para a API:', logError);
    }
  }

  useEffect(() => {
    const userDetails = localStorage.getItem('userDetails');
    const parsedUserDetails = JSON.parse(userDetails);
    const idUsuario = parsedUserDetails.id;

    if (numeroInscricao) {
      const fetchResumoProjeto = async () => {
        setIsLoading(true);
        const url = `https://gorki-api-nome.iglgxt.easypanel.host/api/getProjeto`;
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

          if (data.projeto) {
            const projeto = data.projeto;
            let descricao = {};

            if (projeto.descricao) {
              try {
                descricao = JSON.parse(projeto.descricao);
              } catch (e) {
                console.warn('Erro ao analisar descrição:', e);
              }
            }

            setFormData({
              resumo: projeto.resumo_projeto || '',
              relevancia: descricao.relevancia || '',
              perfil: descricao.perfil || '',
              expectativa: descricao.expectativa || '',
              contrapartida: descricao.contrapartida || '',
              divulgacao: descricao.divulgacao || '',
              democratizacao: descricao.democratizacao || '',
              afirmativas: descricao.afirmativas || '',
              local: descricao.local || '',
              outras: descricao.outras || ''
            });

            setModule(projeto.id_modalidade || '');
            setCategory(projeto.nome_modalidade || '');

            // Atualiza as opções de categoria após definir o módulo
            updateCategoryOptions(projeto.id_modalidade || '');
          } else {
            throw new Error('Projeto não encontrado.');
          }
        } catch (error) {
          setError(error.message);
          await logError(error.message, idUsuario);
        } finally {
          setIsLoading(false);
        }
      };

      fetchResumoProjeto();
    } else {
      logError('Erro ao verificar o id do projeto', idUsuario);

    }
  }, [numeroInscricao]);

  // Função para atualizar as opções de categoria
  const updateCategoryOptions = (selectedModule) => {
    if (userCityId === citySantaRitaId) {
      const santaRitaOptions = [
        'Artes visuais',
        'Artesanato',
        'Audiovisual',
        'Circo',
        'Dança',
        'Cultura Afro-brasileira e tradições',
        'Música',
        'Literatura',
        'Patrimônio',
        'Teatro'
      ];
      setCategoryOptions(santaRitaOptions);
    } else {
      if (selectedModule === 1) {
        setCategoryOptions([
          'PRODUÇÃO DE EVENTOS',
          'ARTES PLÁSTICAS OU VISUAIS',
          'EXPOSIÇÃO COLETIVA DE ARTESANATO',
          'APRESENTAÇÃO TEATRAL',
          'APRESENTAÇÃO DE DANÇA',
          'CONTAÇÃO DE HISTÓRIAS',
          'ATIVIDADES CULTURAIS VOLTADAS PARA A CULTURA AFRO-BRASILEIRA'
        ]);
      } else if (selectedModule === 2) {
        setCategoryOptions([
          'ATIVIDADES DE FORMAÇÃO VOLTADAS PARA ZONAS PERIFÉRICAS'
        ]);
      }
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleModuleChange = (event) => {
    const selectedModule = event.target.value;
    setModule(selectedModule);
    setCategory(''); // Reseta categoria quando o módulo mudar
    updateCategoryOptions(selectedModule); // Atualiza as opções de categoria
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

    // Cria o corpo da requisição com o formato correto
    const body = {
      idProjeto: numeroInscricao,
      resumoProjeto: resumo,
      descricao: {
        relevancia: formData.relevancia,
        perfil: formData.perfil,
        expectativa: formData.expectativa,
        contrapartida: formData.contrapartida,
        divulgacao: formData.divulgacao,
        democratizacao: formData.democratizacao,
        afirmativas: formData.afirmativas,
        local: formData.local,
        outras: formData.outras
      },
      idUsuario: userId,
    };

    const url = `https://gorki-api-nome.iglgxt.easypanel.host/api/updateProjeto`;
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

    // Envio para o endpoint de modalidade
    const modalidadeData = {
      usuario: userEmail,
      senha: userPassword,
      idModalidade: module,
      nomeModalidade: category,
      idProjeto: numeroInscricao
    };

    const modalidadeUrl = 'https://gorki-api-nome.iglgxt.easypanel.host/api/updateModalidade';

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

  function CheckLabels() {
    switch (userDetails.idCidade) {
      case 3823:
        return [
          { label: 'Resumo do projeto:', key: 'resumo' },
          { label: 'Relevância e pertinência:', key: 'relevancia' },
          { label: 'Perfil de público e classificação indicativa:', key: 'perfil' },
          { label: 'Expectativa da quantidade do público alcançado com o projeto:', key: 'expectativa' },
          { label: 'Detalhamento da proposta de contrapartida do projeto:', key: 'contrapartida' },
          { label: 'Plano de Divulgação:', key: 'divulgacao' },
          { label: 'Medidas de democratização de acesso e acessibilidade', key: 'democratizacao' },
          { label: 'Outras Informações', key: 'outras' }
        ]

      case 3798:
        return [
          { label: 'Resumo do projeto:', key: 'resumo' },
          { label: 'Relevância e pertinência:', key: 'relevancia' },
          { label: 'Perfil de público e classificação indicativa:', key: 'perfil' },
          { label: 'Expectativa da quantidade do público alcançado com o projeto:', key: 'expectativa' },
          { label: 'Detalhamento da proposta de contrapartida do projeto:', key: 'contrapartida' },
          { label: 'Plano de Divulgação:', key: 'divulgacao' },
          { label: 'Medidas de democratização de acesso e acessibilidade', key: 'democratizacao' },
          { label: 'Local de realização e justificativa da escolha do local', key: 'local' },
          { label: 'Outras Informações', key: 'outras' }
        ]

      default:
        return [
          { label: 'Resumo do projeto:', key: 'resumo' },
          { label: 'Relevância e pertinência:', key: 'relevancia' },
          { label: 'Perfil de público e classificação indicativa:', key: 'perfil' },
          { label: 'Expectativa da quantidade do público alcançado com o projeto:', key: 'expectativa' },
          { label: 'Detalhamento da proposta de contrapartida do projeto:', key: 'contrapartida' },
          { label: 'Plano de Divulgação:', key: 'divulgacao' },
          { label: 'Plano de Democratização', key: 'democratizacao' },
          { label: 'Plano de ações afirmativas', key: 'afirmativas' },
          { label: 'Local de realização e justificativa da escolha do local', key: 'local' },
          { label: 'Outras Informações', key: 'outras' }
        ]
    }
  }

  return (
    <div>
      <PrivateRoute>
        <Header />
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
                  ...(JSON.parse(localStorage.getItem('userDetails')).idCidade === 3798
                    ? [{ label: 'Medidas de democratização de acesso e acessibilidade', key: 'democratizacao' }]
                    : [
                      { label: 'Plano de Democratização:', key: 'democratizacao' },
                      { label: 'Plano de ações afirmativas:', key: 'afirmativas' },
                    ]),
                  { label: 'Local de realização e justificativa da escolha do local', key: 'local' },
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

                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Modalidade</InputLabel>
                    <Select value={module} onChange={handleModuleChange}>
                      <MenuItem value={1}>Módulo 1</MenuItem>
                      <MenuItem value={2}>Módulo 2</MenuItem>
                      {JSON.parse(localStorage.getItem('userDetails')).idCidade !== 3842 && (
                        <MenuItem value={3}>Módulo 3</MenuItem>
                      )}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Categoria</InputLabel>
                    <Select value={category} onChange={handleCategoryChange}>
                      {categoryOptions.map((option) => (
                        <MenuItem key={option} value={option}>
                          {option}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} style={{ marginTop: '20px' }}>
                  <Button variant="contained" color="primary" onClick={handleSubmit}>
                    Atualizar Informações
                  </Button>
                </Grid>
              </Grid>
            </Box>
          )}

        </Container>
      </PrivateRoute>
    </div>
  );
};

export default InformacoesGerais;
