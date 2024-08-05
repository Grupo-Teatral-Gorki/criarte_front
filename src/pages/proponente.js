import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Alert, CircularProgress } from '@mui/material';
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
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProponentes = async () => {
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
          throw new Error('Nenhum proponente encontrado');
        }


        const data = await response.json();
        console.log("Dados recebidos com sucesso:", data);
        setProponentes(data);
      } catch (error) {
        console.error("Erro ao receber os proponentes:", error);
        setError(error.message);
      } finally {
        setLoading(false);
        setIsLoading(false);
      }
    };

    fetchProponentes();
  }, []);

  const handleOpenList = async () => {
    setIsLoading(true);
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
        throw new Error('Nenhum proponente encontrado');
      }

      const data = await response.json();
      console.log("Dados recebidos com sucesso:", data);
      setProponentes(data);
    } catch (error) {
      console.error("Erro ao receber os proponentes:", error);
      setError(error.message);
    } finally {
      setIsLoading(false);
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
        <Header />
        <div className="proponente-container">
          <h1>Proponente</h1>
          <div className="proponente-content">
            <Alert sx={{ marginBottom: '15px' }} severity="info">Cadastre 1 proponente por login</Alert>
            <div className="proponente-info">
            <p>1. Selecione o(a) proponente (Pessoa Física)</p>
              <p>2. Este proponente pode ter até <b>1</b> projeto(s) em andamento neste edital. Certifique-se de que o proponente selecionado possui vagas para iniciar o cadastramento.</p>
            </div>
            <DialogContent className='proponentes' dividers>
              {isLoading ? (
                <CircularProgress />
              ) : error ? (
                <Alert variant='outlined' severity="info">{error}</Alert>
              ) : (
                proponentes.map((proponente) => (
                  <div key={proponente.idProponente} className='proponente-unity'>
                    <div className='checkbox-container'>
                      <Checkbox disabled checked sx={{ color: "blue" }} />
                    </div>
                    <div className='info'>
                      <Typography variant="subtitle1" className='name'>
                        NOME: {proponente.responsavelLegal}
                        <div className='type'>Tipo: Pessoa Física</div>
                      </Typography>
                      <Typography variant="body2" className='details'>
                        CPF: ***.***.***-{proponente.cpfResponsavel[9]}{proponente.cpfResponsavel[10]} | Email: {proponente.email}
                      </Typography>
                    </div>
                  </div>
                ))
              )}
            </DialogContent>
            <div className="proponente-selection"></div>
            <div className="proponente-actions">
              <a href='/pnab/projeto'>
                <Button className="back-button" variant="outlined">Voltar para o projeto</Button>
              </a>
              <Button className="proponente-button" disabled={loading} variant="contained" color="primary" onClick={handleOpenList}>
                Lista de proponentes
              </Button>
            </div>
          </div>

          <Dialog open={openList} onClose={handleCloseList} maxWidth="sm" fullWidth>
            <DialogTitle>Lista de proponentes</DialogTitle>
            <DialogContent className='proponentes' dividers>
              {isLoading ? (
                <CircularProgress />
              ) : error ? (
                <Alert variant='outlined' severity="info">{error}</Alert>
              ) : (
                proponentes.map((proponente) => (
                  <div key={proponente.idProponente} className='proponente-unity'>
                    <Checkbox disabled checked sx={{ display: 'flex', justifyContent: 'right', color: "blue" }} />
                    <div style={{ marginBottom: "16px" }}>
                      <Typography variant="subtitle1">
                        NOME: {proponente.responsavelLegal} <div>Tipo: Pessoa Física</div>
                      </Typography>
                      <Typography variant="body2">
                        CPF: ***.***.***-{proponente.cpfResponsavel[9]}{proponente.cpfResponsavel[10]} | Email: {proponente.email}
                      </Typography>
                    </div>
                  </div>
                ))
              )}
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
