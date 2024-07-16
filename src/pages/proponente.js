import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';
import NewProponentForm from './NovoProponente';
import Header from '../components/Header/Header';
import PrivateRoute from '../components/PrivateRoute';
import Checkbox from '@mui/material/Checkbox';
//import './Proponente.css';

const Proponente = () => {
  const [openList, setOpenList] = useState(false);
  const [openForm, setOpenForm] = useState(false);
  const [proponentes, setProponentes] = useState([]);
  const [loading, setLoading] = useState(false);


  const handleOpenList = async () => {
    setLoading(true);
    const url = `https://api.grupogorki.com.br/api/proponentes/getProponentesByUser`;

    const token = localStorage.getItem('authToken');

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        console.log(response)
        throw new Error(`Não foi possível trazer os dados da API`);
      }

      const data = await response.json();
      console.log("Dados recebidos com sucesso:", data);
      setProponentes(data); 
    } catch (error) {
      console.error("Erro ao receber os proponentes:", error);
    }finally{
      setLoading(false);
    }
    setOpenList(true);
  };

  const handleCloseList = () => {
    setOpenList(false);
  };

  const handleOpenForm = () => {
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
  };

  return (
      <div>
      <PrivateRoute>
    <Header/>
    <div className="proponente-container">
      <h1>Proponente</h1>
      <div className="proponente-content">
      <p>1. Selecione o(a) proponente ( Pessoa Física )</p>
        <div className="proponente-info">
          <p>2. Este proponente pode ter até <b>1</b> projeto(s) em andamento neste edital. Certifique-se que o proponente selecionado possui vagas para iniciar o cadastramento.</p>
        </div>
        <div className="proponente-selection">
          <p>Nenhum proponente foi selecionado!</p>
          <Button className="proponente-button" disabled={loading} variant="contained" color="primary" onClick={handleOpenList}>
            Clique aqui ver sua lista de proponentes
          </Button>
        </div>
        <div className="proponente-actions">
          <a href='/pnab/projeto'><Button className="back-button" variant="contained">Voltar para o projeto</Button></a>
          <Button className="save-button" variant="contained" color="primary" disabled>Salvar alterações</Button>
        </div>
      </div>
      
      <Dialog open={openList} onClose={handleCloseList} maxWidth="sm" fullWidth>
        <DialogTitle>Lista de proponentes</DialogTitle>
        <DialogContent className='proponentes' dividers>
          {proponentes.map((proponente) => (
            
            <div className='proponente-unity'>
            <Checkbox sx={{display: 'flex',justifyContent: 'right', color: "gray"}}></Checkbox>

            <div key={proponente.idProponente}  style={{ marginBottom: "16px" }}>
              <Typography variant="subtitle1">NOME: {proponente.responsavelLegal} <div>Tipo: Pessoa Física</div></Typography>
              <Typography variant="body2">
                CPF: ***.***.***-{proponente.cpfResponsavel[9]}{proponente.cpfResponsavel[10]} | Email: {proponente.email}
              </Typography>
              </div>
            </div>
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseList} color="primary">Fechar</Button>
          <Button variant="contained" color="primary" onClick={handleOpenForm}>Adicionar novo proponente</Button>
        </DialogActions>
      </Dialog>
      
      <NewProponentForm open={openForm} handleClose={handleCloseForm} />
    </div>
    </PrivateRoute>
      </div>
  );
};

export default Proponente;
