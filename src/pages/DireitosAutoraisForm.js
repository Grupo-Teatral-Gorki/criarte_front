import React, { useState } from 'react';
import { Button, TextField, Box, Typography, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Menu, MenuItem } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SaveIcon from '@mui/icons-material/Save';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CloseIcon from '@mui/icons-material/Close';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
//import './DireitosAutoraisForm.css';

const DireitosAutoraisForm = () => {
  const [direitos, setDireitos] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(null);
  const [detentor, setDetentor] = useState('');
  const [acervo, setAcervo] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);

  const handleAddDireito = () => {
    if (detentor && acervo) {
      setDireitos([...direitos, { detentor, acervo }]);
      setDetentor('');
      setAcervo('');
      setShowAddForm(false);
    }
  };

  const handleShowAddForm = () => {
    setShowAddForm(true);
  };

  const handleCloseAddForm = () => {
    setShowAddForm(false);
  };

  const handleEditDireito = () => {
    const updatedDireitos = [...direitos];
    updatedDireitos[currentIndex] = { detentor, acervo };
    setDireitos(updatedDireitos);
    setShowEditForm(false);
    setCurrentIndex(null);
    setDetentor('');
    setAcervo('');
  };

  const handleDeleteDireito = (index) => {
    const updatedDireitos = direitos.filter((_, i) => i !== index);
    setDireitos(updatedDireitos);
  };

  const handleShowEditForm = (index) => {
    const direito = direitos[index];
    setCurrentIndex(index);
    setDetentor(direito.detentor);
    setAcervo(direito.acervo);
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
          Direitos Autorais
        </Typography>
        <Typography variant="body2" className="form-description">
          Direitos autorais, fonomecânicos ou conexos, da propriedade do acervo, do imóvel ou de qualquer bem envolvido no projeto, cuja execução demande direito autoral ou patrimonial.
        </Typography>
        <Box className="form-field">
          <Typography variant="body2" className="required-label">
            * Adicionar direito autoral
          </Typography>
          <Button variant="outlined" startIcon={<AddIcon />} onClick={handleShowAddForm} className="add-direito-button">
            Adicionar direito
          </Button>
        </Box>

        {showAddForm && (
          <Box className="add-direito-form">
            <IconButton onClick={handleCloseAddForm} className="close-add-form">
              <CloseIcon />
            </IconButton>
            <TextField
              label="Detentor(a)"
              variant="outlined"
              fullWidth
              value={detentor}
              onChange={(e) => setDetentor(e.target.value)}
              className="form-input"
              margin="normal"
            />
            <TextField
              label="Acervo/Imóvel/Bem Envolvido"
              variant="outlined"
              fullWidth
              value={acervo}
              onChange={(e) => setAcervo(e.target.value)}
              className="form-input"
              margin="normal"
            />
            <Button variant="contained" color="primary" onClick={handleAddDireito}>
              Adicionar
            </Button>
          </Box>
        )}

        {showEditForm && (
          <Box className="edit-direito-form">
            <IconButton onClick={handleCloseEditForm} className="close-edit-form">
              <CloseIcon />
            </IconButton>
            <TextField
              label="Detentor(a)"
              variant="outlined"
              fullWidth
              value={detentor}
              onChange={(e) => setDetentor(e.target.value)}
              className="form-input"
              margin="normal"
            />
            <TextField
              label="Acervo/Imóvel/Bem Envolvido"
              variant="outlined"
              fullWidth
              value={acervo}
              onChange={(e) => setAcervo(e.target.value)}
              className="form-input"
              margin="normal"
            />
            <Button variant="contained" color="primary" onClick={handleEditDireito}>
              Salvar
            </Button>
          </Box>
        )}

        <TableContainer component={Paper} className="direito-table">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Detentor(a)</TableCell>
                <TableCell>Acervo/Imóvel/Bem Envolvido</TableCell>
                <TableCell>Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {direitos.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="no-data">
                    Não há dados
                  </TableCell>
                </TableRow>
              ) : (
                direitos.map((direito, index) => (
                  <TableRow key={index}>
                    <TableCell>{direito.detentor}</TableCell>
                    <TableCell>{direito.acervo}</TableCell>
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
                        <MenuItem onClick={() => handleDeleteDireito(currentIndex)}>
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

export default DireitosAutoraisForm;
