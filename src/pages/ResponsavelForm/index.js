import React, { useState } from "react";
import {
  Button,
  TextField,
  Box,
  Typography,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SaveIcon from "@mui/icons-material/Save";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
//import './ResponsavelForm.css';

const ResponsavelForm = () => {
  const [responsaveis, setResponsaveis] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [editIndex, setEditIndex] = useState(null);

  const handleAddResponsavel = () => {
    if (nome && cpf) {
      if (editIndex !== null) {
        const updatedResponsaveis = [...responsaveis];
        updatedResponsaveis[editIndex] = { nome, cpf };
        setResponsaveis(updatedResponsaveis);
        setEditIndex(null);
      } else {
        setResponsaveis([...responsaveis, { nome, cpf }]);
      }
      setNome("");
      setCpf("");
      setShowAddForm(false);
    }
  };

  const handleShowAddForm = () => {
    setShowAddForm(true);
  };

  const handleCloseAddForm = () => {
    setShowAddForm(false);
    setEditIndex(null);
    setNome("");
    setCpf("");
  };

  const handleEditResponsavel = (index) => {
    setEditIndex(index);
    setNome(responsaveis[index].nome);
    setCpf(responsaveis[index].cpf);
    setShowAddForm(true);
  };

  const handleDeleteResponsavel = (index) => {
    setResponsaveis(responsaveis.filter((_, i) => i !== index));
  };

  return (
    <div className="form-page">
      <div className="form-container">
        <Typography variant="h6" className="form-title">
          Responsável técnico(a)
        </Typography>
        <Typography variant="body2" className="form-description">
          Deverá ser indicado(a) responsável técnico(a) para atuar no projeto,
          podendo esta função, no caso de projeto cadastrado por pessoa física,
          ser exercida pelo(a) próprio(a) proponente.
        </Typography>
        <Box className="form-field">
          <Typography variant="body2" className="required-label">
            * Responsável técnico(a) / artístico(a)
          </Typography>
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={handleShowAddForm}
            className="add-responsible-button"
          >
            Adicionar responsável
          </Button>
        </Box>

        {showAddForm && (
          <Box className="add-responsavel-form">
            <IconButton onClick={handleCloseAddForm} className="close-add-form">
              <CloseIcon />
            </IconButton>
            <TextField
              label="Nome"
              variant="outlined"
              fullWidth
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="form-input"
              margin="normal"
            />
            <TextField
              label="CPF"
              variant="outlined"
              fullWidth
              value={cpf}
              onChange={(e) => setCpf(e.target.value)}
              className="form-input"
              margin="normal"
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddResponsavel}
            >
              {editIndex !== null ? "Salvar Alterações" : "Adicionar"}
            </Button>
          </Box>
        )}

        <TableContainer component={Paper} className="responsavel-table">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nome</TableCell>
                <TableCell>CPF</TableCell>
                <TableCell>Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {responsaveis.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="no-data">
                    Não há dados
                  </TableCell>
                </TableRow>
              ) : (
                responsaveis.map((responsavel, index) => (
                  <TableRow key={index}>
                    <TableCell>{responsavel.nome}</TableCell>
                    <TableCell>{responsavel.cpf}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleEditResponsavel(index)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => handleDeleteResponsavel(index)}
                      >
                        <DeleteIcon />
                      </IconButton>
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
          <Button
            variant="contained"
            startIcon={<ArrowBackIcon />}
            className="back-button"
          >
            Voltar para o projeto
          </Button>
          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            className="save-button"
          >
            Salvar alterações
          </Button>
        </Box>
      </div>
    </div>
  );
};

export default ResponsavelForm;
