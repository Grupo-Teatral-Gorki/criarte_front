import React, { useState } from 'react';
import Link from 'next/link';
import {
  Button, TextField, Box, Typography, IconButton, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Menu, MenuItem, Select, InputLabel, FormControl, Alert, CircularProgress
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SaveIcon from '@mui/icons-material/Save';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CloseIcon from '@mui/icons-material/Close';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Header from '../components/Header/Header';
import PrivateRoute from '../components/PrivateRoute';
import { useEffect } from 'react';
//import './FichaTecnicaForm.css';



const FichaTecnicaForm = () => {
  const [integrantes, setIntegrantes] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(null);
  const [nome, setNome] = useState('');
  const [tipoPessoa, setTipoPessoa] = useState('F');
  const [funcao, setFuncao] = useState('');
  const [cpf, setCpf] = useState('');
  const [cnpj, setCnpj] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error] = useState(null);


  useEffect(() => {
    const fetchNumeroInscricao = async () => {
      setIsLoading(true);

      const idProjeto = localStorage.getItem('numeroInscricao')
      console.log(idProjeto)
      const url = `https://api.grupogorki.com.br/api/projeto/Integrantes/${idProjeto}`;
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
          const novosIntegrantes = data.data.map((item) => ({
            nome: item.nomeCompleto,
            tipoPessoa: item.tipoPessoa,
            funcao: item.funcao,
            cpf: item.cpf,
            cnpj: item.cnpj
          }));

          setIntegrantes([...integrantes, ...novosIntegrantes]);

      } else {
        console.log("Número de inscrição não encontrado.");
      }
    } catch (error) {
      console.log(error.message);
    } finally {
      console.log('Requisição finalizada');
      setIsLoading(false);
    }
  };

  fetchNumeroInscricao();
}, []);


const handleAddIntegrante = () => {
  if (nome.trim() && tipoPessoa.trim() && funcao.trim() && (cpf.trim() || cnpj.trim())) {
    setIntegrantes([...integrantes, { nome, tipoPessoa, funcao, cpf, cnpj }]);
    setNome('');
    setTipoPessoa('');
    setFuncao('');
    setCpf('');
    setCnpj(null);
    setShowAddForm(false);
  }
};

const handleShowAddForm = () => {
  setShowAddForm(true);
};

const handleCloseAddForm = () => {
  setShowAddForm(false);
};

const handleEditIntegrante = () => {
  const updatedIntegrantes = [...integrantes];
  updatedIntegrantes[currentIndex] = { nome, tipoPessoa, funcao, cpf, cnpj };
  setIntegrantes(updatedIntegrantes);
  setShowEditForm(false);
  setCurrentIndex(null);
  setNome('');
  setTipoPessoa('F');
  setFuncao('');
  setCpf('');
  setCnpj(null);
};

const handleDeleteIntegrante = (index) => {
  const updatedIntegrantes = integrantes.filter((_, i) => i !== index);
  setIntegrantes(updatedIntegrantes);
};

const handleShowEditForm = (index) => {
  const integrante = integrantes[index];
  setCurrentIndex(index);
  setNome(integrante.nome);
  setTipoPessoa("F");
  setFuncao(integrante.funcao);
  setCpf(integrante.cpf);
  setCnpj(null);
  setShowEditForm(true);
};

const handleCloseEditForm = () => {
  setShowEditForm(false);
};

const handleMenuClick = (event, index) => {
  setAnchorEl(event.currentTarget);
  setCurrentIndex(index);
};

const handleMenuClose = () => {
  setAnchorEl(null);
  setCurrentIndex(null);
};

const handleSaveChanges = async () => {
  const url = `https://api.grupogorki.com.br/api/projeto/createIntegrantes`;
  const token = localStorage.getItem('authToken');

  const data = integrantes.map(integrante => ({
    idProjeto: parseInt(localStorage.getItem('numeroInscricao')),
    nomeCompleto: integrante.nome.trim(),
    tipoPessoa: "F",
    funcao: integrante.funcao.trim(),
    cpf: integrante.cpf.trim(),
    cnpj: null
  }));

  console.log('Dados a serem enviados:', data);

  try {
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Accept": "*/*",
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data[0])
    });

    if (response.ok) {
      alert('Integrante cadastrado');
    } else {
      const errorData = await response.json();
      console.error('Erro ao atualizar o projeto:', errorData);
      alert('Erro ao atualizar o projeto.');
    }
  } catch (error) {
    console.error('Erro:', error);
    alert('Erro ao atualizar o projeto.');
  }
};
return (
  <div>
      <PrivateRoute />
      <Header></Header>
      <div className="form-page">
        <div className="form-container">
          <Typography variant="h6" className="form-title">
            Ficha Técnica
          </Typography>
          <Typography variant="body2" className="form-description">
            Informe os principais integrantes da ficha técnica do projeto.
          </Typography>
          <Box className="form-field">
            <Typography variant="body2" className="required-label">
              * Adicionar integrante da ficha técnica
            </Typography>
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={handleShowAddForm}
              className="add-integrante-button"
            >
              Adicionar integrante
            </Button>
          </Box>
          {isLoading ? (
            <CircularProgress />
          ) : error ? (
            <Alert severity="error">{error}</Alert>
          ) : (
            <>
              {showAddForm && (
                <Box className="add-integrante-form">
                  <IconButton onClick={handleCloseAddForm} className="close-add-form">
                    <CloseIcon />
                  </IconButton>
                  <TextField
                    label="Nome completo"
                    variant="outlined"
                    fullWidth
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    className="form-input"
                    margin="normal"
                  />
                  <FormControl variant="outlined" fullWidth margin="normal">
                    <InputLabel>Tipo de pessoa</InputLabel>
                    <Select
                      value={tipoPessoa}
                      onChange={(e) => setTipoPessoa(e.target.value)}
                      label="Tipo de pessoa"
                    >
                      <MenuItem value="Fisica">Pessoa Física</MenuItem>
                    </Select>
                  </FormControl>
                  <TextField
                    label="Função"
                    variant="outlined"
                    fullWidth
                    value={funcao}
                    onChange={(e) => setFuncao(e.target.value)}
                    className="form-input"
                    margin="normal"
                  />
                  {tipoPessoa === 'Fisica' && (
                    <TextField
                      label="CPF"
                      variant="outlined"
                      fullWidth
                      value={cpf}
                      onChange={(e) => setCpf(e.target.value)}
                      className="form-input"
                      margin="normal"
                    />
                  )}
                  {tipoPessoa === 'Juridica' && (
                    <TextField
                      label="CNPJ"
                      variant="outlined"
                      fullWidth
                      value={cnpj}
                      onChange={(e) => setCnpj(e.target.value)}
                      className="form-input"
                      margin="normal"
                    />
                  )}
                  <Button variant="contained" color="primary" onClick={handleAddIntegrante}>
                    Adicionar
                  </Button>
                </Box>
              )}

              {showEditForm && (
                <Box className="edit-integrante-form">
                  <IconButton onClick={handleCloseEditForm} className="close-edit-form">
                    <CloseIcon />
                  </IconButton>
                  <TextField
                    label="Nome completo"
                    variant="outlined"
                    fullWidth
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    className="form-input"
                    margin="normal"
                  />
                  <FormControl variant="outlined" fullWidth margin="normal">
                    <InputLabel>Tipo de pessoa</InputLabel>
                    <Select
                      value={tipoPessoa}
                      onChange={(e) => setTipoPessoa(e.target.value)}
                      label="Tipo de pessoa"
                    >
                      <MenuItem value="Fisica">Pessoa Física</MenuItem>
                    </Select>
                  </FormControl>
                  <TextField
                    label="Função"
                    variant="outlined"
                    fullWidth
                    value={funcao}
                    onChange={(e) => setFuncao(e.target.value)}
                    className="form-input"
                    margin="normal"
                  />
                  {tipoPessoa === 'Fisica' && (
                    <TextField
                      label="CPF"
                      variant="outlined"
                      fullWidth
                      value={cpf}
                      onChange={(e) => setCpf(e.target.value)}
                      className="form-input"
                      margin="normal"
                    />
                  )}
                  {tipoPessoa === 'Juridica' && (
                    <TextField
                      label="CNPJ"
                      variant="outlined"
                      fullWidth
                      value={cnpj}
                      onChange={(e) => setCnpj(e.target.value)}
                      className="form-input"
                      margin="normal"
                    />
                  )}
                  <Button variant="contained" color="primary" onClick={handleEditIntegrante}>
                    Salvar
                  </Button>
                </Box>
              )}

              <TableContainer component={Paper} className="integrante-table">
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Nome completo</TableCell>
                      <TableCell>Tipo de pessoa</TableCell>
                      <TableCell>Função</TableCell>
                      <TableCell>CPF</TableCell>
                      <TableCell>CNPJ</TableCell>
                      <TableCell>Ações</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {integrantes.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="no-data">
                          Nenhum integrante cadastrado
                        </TableCell>
                      </TableRow>
                    ) : (
                      integrantes.map((integrante, index) => (
                        <TableRow key={index}>
                          <TableCell>{integrante.nome}</TableCell>
                          <TableCell>{integrante.tipoPessoa}</TableCell>
                          <TableCell>{integrante.funcao}</TableCell>
                          <TableCell>{integrante.cpf}</TableCell>
                          <TableCell>{integrante.cnpj}</TableCell>
                          <TableCell>
                            <IconButton onClick={(e) => handleMenuClick(e, index)}>
                              <MoreVertIcon />
                            </IconButton>
                            <Menu
                              anchorEl={anchorEl}
                              open={Boolean(anchorEl)}
                              onClose={handleMenuClose}
                            >
                              <MenuItem onClick={() => handleShowEditForm(index)}>
                                <EditIcon /> Editar
                              </MenuItem>
                              <MenuItem onClick={() => handleDeleteIntegrante(index)}>
                                <DeleteIcon /> Excluir
                              </MenuItem>
                            </Menu>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>

              <Box className="form-actions">
                <Link href="/pnab/projeto" passHref>
                  <Button variant="contained" startIcon={<ArrowBackIcon />} className="back-button">
                    Voltar para o projeto
                  </Button>
                </Link>
                <Button
                  variant="contained"
                  onClick={handleSaveChanges}
                  startIcon={<SaveIcon />}
                  className="save-button"
                >
                  Salvar alterações
                </Button>
              </Box>
            </>
          )}
        </div>
      </div>
    </div>
);
};

export default FichaTecnicaForm;
