import React, { useState, useEffect } from 'react';
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
import { useRouter } from 'next/router';

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
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNumeroInscricao = async () => {
      setIsLoading(true);

      const idProjeto = localStorage.getItem('numeroInscricao');
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
            id: item.id, // Adicionando o ID aqui
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
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNumeroInscricao();
  }, []);

  const router = useRouter();

  const handleAddIntegrante = async () => {
    if (nome.trim() && tipoPessoa.trim() && funcao.trim() && (cpf.trim() || cnpj.trim())) {
      const url = `https://gorki-fix-proponente.iglgxt.easypanel.host/api/setIntegrante`;
      const token = localStorage.getItem('authToken');
  
      const newIntegrante = {
        usuario: localStorage.getItem('userEmail'),
        senha: localStorage.getItem('userPassword'),
        cpf: tipoPessoa === 'F' ? cpf.trim() : null,
        nome_completo: nome.trim(),
        id_projeto: parseInt(localStorage.getItem('numeroInscricao')),
        funcao: funcao.trim(),
        tipo_pessoa: tipoPessoa,
        cnpj: tipoPessoa === 'J' ? cnpj.trim() : null
      };
      
  
      try {
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Accept": "*/*",
            "Content-Type": "application/json"
          },
          body: JSON.stringify(newIntegrante)
        });
  
        if (response.ok) {
          const result = await response.json();
          console.log('Integrante adicionado:', result);
          setIntegrantes([...integrantes, { ...newIntegrante, id: result.id }]);
          router.reload();
        } else {
          const errorData = await response.json();
          console.error('Erro ao adicionar integrante:', errorData);
          alert('Erro ao adicionar integrante.');
        }
      } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao adicionar integrante.');
      }
  
      // Limpa os campos após o envio
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
    updatedIntegrantes[currentIndex] = { id: integrantes[currentIndex].id, nome, tipoPessoa, funcao, cpf, cnpj };
    setIntegrantes(updatedIntegrantes);
    setShowEditForm(false);
    setCurrentIndex(null);

    setNome('');
    setTipoPessoa('F');
    setFuncao('');
    setCpf('');
    setCnpj(null);
  };

  const handleDeleteIntegrante = async (id) => {
    if (window.confirm("Tem certeza que deseja excluir este integrante?")) {
      const url = `https://gorki-fix-proponente.iglgxt.easypanel.host/api/deleteIntegrante`;

      const deleteRequest = {
        usuario: localStorage.getItem('userEmail'),
        senha: localStorage.getItem('userPassword'),
        id: id
      };

      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(deleteRequest),
        });

        if (response.ok) {
          setIntegrantes(integrantes.filter(integrante => integrante.id !== id));
        } else {
          const errorData = await response.json();
          console.error('Erro ao excluir integrante:', errorData);
          alert('Erro ao excluir integrante.');
        }
      } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao excluir integrante.');
      }
    }
  };

  const handleShowEditForm = (index) => {
    const integrante = integrantes[index];
    setCurrentIndex(index);
    setNome(integrante.nome);
    setTipoPessoa(integrante.tipoPessoa);
    setFuncao(integrante.funcao);
    setCpf(integrante.cpf || '');
    setCnpj(integrante.cnpj || '');
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
    alert('Alterações salvas.');
  };

  return (
    <div>
      <PrivateRoute />
      <Header />
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
                      <MenuItem value="F">Pessoa Física</MenuItem>
                      <MenuItem value="J">Pessoa Jurídica</MenuItem>

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
                  {tipoPessoa === 'F' && (
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
                  {tipoPessoa === 'J' && (
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
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<SaveIcon />}
                    onClick={handleAddIntegrante}
                    className="save-integrante-button"
                  >
                    Adicionar
                  </Button>
                </Box>
              )}

              <TableContainer component={Paper} className="integrantes-table">
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Nome</TableCell>
                      <TableCell>Tipo de Pessoa</TableCell>
                      <TableCell>Função</TableCell>
                      <TableCell>CPF/CNPJ</TableCell>
                      <TableCell>Ações</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {integrantes.map((integrante, index) => (
                      <TableRow key={index}>
                        <TableCell>{integrante.nome}</TableCell>
                        <TableCell>{integrante.tipoPessoa === 'F' ? 'Pessoa Física' : 'Pessoa Jurídica'}</TableCell>
                        <TableCell>{integrante.funcao}</TableCell>
                        <TableCell>{integrante.tipoPessoa === 'F' ? integrante.cpf : integrante.cnpj}</TableCell>
                        <TableCell>
                          <IconButton
                            aria-label="more"
                            aria-controls="long-menu"
                            aria-haspopup="true"
                            onClick={(event) => handleMenuClick(event, index)}
                          >
                            <MoreVertIcon />
                          </IconButton>
                          <Menu
                            anchorEl={anchorEl}
                            keepMounted
                            open={Boolean(anchorEl)}
                            onClose={handleMenuClose}
                          >

                            <MenuItem onClick={() => handleDeleteIntegrante(integrante.id)}>
                              <DeleteIcon fontSize="small" />
                              Excluir
                            </MenuItem>
                          </Menu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              <Box sx={{ marginTop: '10px' }} className="save-changes-button-container">
                <Link href="/pnab/projeto" passHref>
                  <Button variant="outlined" sx={{ marginRight: '10px' }} startIcon={<ArrowBackIcon />} className="cancel-button">
                    Voltar
                  </Button>
                </Link>
              </Box>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default FichaTecnicaForm;
