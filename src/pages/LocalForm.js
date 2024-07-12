import React, { useState } from 'react';
import { Button, TextField, Box, Typography, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Menu, MenuItem } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SaveIcon from '@mui/icons-material/Save';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CloseIcon from '@mui/icons-material/Close';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
//import './LocalForm.css';


const LocalForm = () => {
  const [locais, setLocais] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(null);
  const [cidade, setCidade] = useState('');
  const [nomeLocal, setNomeLocal] = useState('');
  const [lotacao, setLotacao] = useState('');
  const [qtdApresentacoes, setQtdApresentacoes] = useState('');
  const [endereco, setEndereco] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);

  const handleAddLocal = () => {
    if (cidade && nomeLocal && lotacao && qtdApresentacoes && endereco) {
      setLocais([...locais, { cidade, nomeLocal, lotacao, qtdApresentacoes, endereco }]);
      setCidade('');
      setNomeLocal('');
      setLotacao('');
      setQtdApresentacoes('');
      setEndereco('');
      setShowAddForm(false);
    }
  };

  const handleShowAddForm = () => {
    setShowAddForm(true);
  };

  const handleCloseAddForm = () => {
    setShowAddForm(false);
  };

  const handleEditLocal = () => {
    const updatedLocais = [...locais];
    updatedLocais[currentIndex] = { cidade, nomeLocal, lotacao, qtdApresentacoes, endereco };
    setLocais(updatedLocais);
    setShowEditForm(false);
    setCurrentIndex(null);
    setCidade('');
    setNomeLocal('');
    setLotacao('');
    setQtdApresentacoes('');
    setEndereco('');
  };

  const handleDeleteLocal = (index) => {
    const updatedLocais = locais.filter((_, i) => i !== index);
    setLocais(updatedLocais);
  };

  const handleShowEditForm = (index) => {
    const local = locais[index];
    setCurrentIndex(index);
    setCidade(local.cidade);
    setNomeLocal(local.nomeLocal);
    setLotacao(local.lotacao);
    setQtdApresentacoes(local.qtdApresentacoes);
    setEndereco(local.endereco);
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


  return (
    <div className="form-page">
      <div className="form-container">
        <Typography variant="h6" className="form-title">
          Local de realização
        </Typography>
        <Typography variant="body2" className="form-description">
          Informe o local de realização do projeto (você pode incluir mais de um local).
        </Typography>
        <Box className="form-field">
          <Typography variant="body2" className="required-label">
            * Adicionar local de realização
          </Typography>
          <Button variant="outlined" startIcon={<AddIcon />} onClick={handleShowAddForm} className="add-local-button">
            Adicionar local
          </Button>
        </Box>

        {showAddForm && (
          <Box className="add-local-form">
            <IconButton onClick={handleCloseAddForm} className="close-add-form">
              <CloseIcon />
            </IconButton>
            <TextField
              label="Cidade"
              variant="outlined"
              fullWidth
              value={cidade}
              onChange={(e) => setCidade(e.target.value)}
              className="form-input"
              margin="normal"
            />
            <TextField
              label="Nome do local"
              variant="outlined"
              fullWidth
              value={nomeLocal}
              onChange={(e) => setNomeLocal(e.target.value)}
              className="form-input"
              margin="normal"
            />
            <TextField
              label="Lotação"
              variant="outlined"
              fullWidth
              value={lotacao}
              onChange={(e) => setLotacao(e.target.value)}
              className="form-input"
              margin="normal"
            />
            <TextField
              label="Qtd. de apresentações"
              variant="outlined"
              fullWidth
              value={qtdApresentacoes}
              onChange={(e) => setQtdApresentacoes(e.target.value)}
              className="form-input"
              margin="normal"
            />
            <TextField
              label="Endereço completo"
              variant="outlined"
              fullWidth
              value={endereco}
              onChange={(e) => setEndereco(e.target.value)}
              className="form-input"
              margin="normal"
            />
            <Button variant="contained" color="primary" onClick={handleAddLocal}>
              Adicionar
            </Button>
          </Box>
        )}

        {showEditForm && (
          <Box className="edit-local-form">
            <IconButton onClick={handleCloseEditForm} className="close-edit-form">
              <CloseIcon />
            </IconButton>
            <TextField
              label="Cidade"
              variant="outlined"
              fullWidth
              value={cidade}
              onChange={(e) => setCidade(e.target.value)}
              className="form-input"
              margin="normal"
            />
            <TextField
              label="Nome do local"
              variant="outlined"
              fullWidth
              value={nomeLocal}
              onChange={(e) => setNomeLocal(e.target.value)}
              className="form-input"
              margin="normal"
            />
            <TextField
              label="Lotação"
              variant="outlined"
              fullWidth
              value={lotacao}
              onChange={(e) => setLotacao(e.target.value)}
              className="form-input"
              margin="normal"
            />
            <TextField
              label="Qtd. de apresentações"
              variant="outlined"
              fullWidth
              value={qtdApresentacoes}
              onChange={(e) => setQtdApresentacoes(e.target.value)}
              className="form-input"
              margin="normal"
            />
            <TextField
              label="Endereço completo"
              variant="outlined"
              fullWidth
              value={endereco}
              onChange={(e) => setEndereco(e.target.value)}
              className="form-input"
              margin="normal"
            />
            <Button variant="contained" color="primary" onClick={handleEditLocal}>
              Salvar
            </Button>
          </Box>
        )}

        <TableContainer component={Paper} className="local-table">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Cidade</TableCell>
                <TableCell>Nome do local</TableCell>
                <TableCell>Lotação</TableCell>
                <TableCell>Qtd. de apresentações</TableCell>
                <TableCell>Endereço completo</TableCell>
                <TableCell>Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {locais.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="no-data">
                    Não há dados
                  </TableCell>
                </TableRow>
              ) : (
                locais.map((local, index) => (
                  <TableRow key={index}>
                    <TableCell>{local.cidade}</TableCell>
                    <TableCell>{local.nomeLocal}</TableCell>
                    <TableCell>{local.lotacao}</TableCell>
                    <TableCell>{local.qtdApresentacoes}</TableCell>
                    <TableCell>{local.endereco}</TableCell>
                    <TableCell>
                      <IconButton onClick={(e) => handleMenuClick(e, index)}>
                        <MoreVertIcon />
                      </IconButton>
                      <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleMenuClose}
                      >
                        <MenuItem onClick={() => { handleShowEditForm(currentIndex); handleMenuClose(); }}>
                          <EditIcon /> Editar
                        </MenuItem>
                        <MenuItem onClick={() => { handleDeleteLocal(currentIndex); handleMenuClose(); }}>
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

        <Typography variant="body2" className="required-message">
          Necessário ao menos um registro.
        </Typography>
        <Box className="form-actions">
          <Button variant="contained" startIcon={<ArrowBackIcon />} className="back-button">
            Voltar para o projeto
          </Button>
          <Button variant="contained" startIcon={<SaveIcon />} className="save-button">
            Salvar alterações
          </Button>
        </Box>
      </div>
    </div>
  );
};

export default LocalForm;
