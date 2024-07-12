import React, { useState } from 'react';
import Link from 'next/link';
import { Button, TextField, Box, Typography, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Menu, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SaveIcon from '@mui/icons-material/Save';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CloseIcon from '@mui/icons-material/Close';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Header from '../components/Header/Header';//import './FichaTecnicaForm.css';

const FichaTecnicaForm = () => {
  const [integrantes, setIntegrantes] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(null);
  const [nome, setNome] = useState('');
  const [tipoPessoa, setTipoPessoa] = useState('');
  const [funcao, setFuncao] = useState('');
  const [cpf, setCpf] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);

  const handleAddIntegrante = () => {
    if (nome && tipoPessoa && funcao && (cpf || cnpj)) {
      setIntegrantes([...integrantes, { nome, tipoPessoa, funcao, cpf, cnpj }]);
      setNome('');
      setTipoPessoa('');
      setFuncao('');
      setCpf('');
      setCnpj('');
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
    setTipoPessoa('');
    setFuncao('');
    setCpf('');
    setCnpj('');
  };

  const handleDeleteIntegrante = (index) => {
    const updatedIntegrantes = integrantes.filter((_, i) => i !== index);
    setIntegrantes(updatedIntegrantes);
  };

  const handleShowEditForm = (index) => {
    const integrante = integrantes[index];
    setCurrentIndex(index);
    setNome(integrante.nome);
    setTipoPessoa(integrante.tipoPessoa);
    setFuncao(integrante.funcao);
    setCpf(integrante.cpf);
    setCnpj(integrante.cnpj);
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

  const handleSaveChanges = () => {
    alert('Informações enviadas');
  };

  return (
      <div>
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
            <Button variant="outlined" startIcon={<AddIcon />} onClick={handleShowAddForm} className="add-integrante-button">
              Adicionar integrante
            </Button>
          </Box>

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
                    <MenuItem value="Juridica">Pessoa Jurídica</MenuItem>
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
                    <MenuItem value="Juridica">Pessoa Jurídica</MenuItem>
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
                        Não há dados
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
                              <MenuItem onClick={() => handleShowEditForm(currentIndex)}>
                                <EditIcon /> Editar
                              </MenuItem>
                              <MenuItem onClick={() => handleDeleteIntegrante(currentIndex)}>
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
            <Button variant="contained" onClick={handleSaveChanges} startIcon={<SaveIcon />} className="save-button">
              Salvar alterações
            </Button>
          </Box>
        </div>
      </div>
      </div>
  );
};

export default FichaTecnicaForm;
