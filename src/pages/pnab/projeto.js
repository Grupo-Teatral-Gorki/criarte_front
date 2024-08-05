import { useState, useEffect } from 'react';
import { CircularProgress, Alert, Button, Typography, Card, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import Link from 'next/link';
import PrivateRoute from '../../components/PrivateRoute';
import Header from '../../components/Header/Header';
import { useRouter } from 'next/router';

function PnabHomeForms() {
  const [numeroInscricao, setNumeroInscricao] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const storedNumeroInscricao = localStorage.getItem('numeroInscricao');
    if (storedNumeroInscricao) {
      setNumeroInscricao(storedNumeroInscricao);
      setIsLoading(false);
    } else {
      setError("Número de inscrição não encontrado.");
      setIsLoading(false);
    }
  }, []);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch('https://styxx-api.w3vvzx.easypanel.host/api/updateStatus', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          usuario: localStorage.getItem('userEmail'),
          senha: localStorage.getItem('userPassword'),
          idProjeto: numeroInscricao,
          status: 'enviado',
        }),
      });

      router.push('/meusProjetos')

      if (!response.ok) {
        throw new Error(`Erro ao enviar o projeto: ${response.status}`);
      }

      console.log('Projeto enviado com sucesso');
    } catch (error) {
      console.error('Erro ao enviar projeto:', error);
      setError('Erro ao enviar o projeto. Tente novamente mais tarde.');
    } finally {
      setIsSubmitting(false);
      setOpen(false);
    }
  };

  return (
    <div>
      <PrivateRoute />
      <Header />
      <div className="app-container">
        <main className="main-content">
          <div className="project-header">
            <Button variant="outlined" onClick={(() => { router.push('/meusProjetos') })}>Voltar</Button>
            {isLoading ? (
              <CircularProgress />
            ) : error ? (
              <Alert severity="error">{error}</Alert>
            ) : (
              <Typography variant="subtitle1" className="project-id">
                ID: {numeroInscricao}
              </Typography>
            )}
          </div>
          <Card className="project-details">
            <Typography variant="h6">
              Edital de Chamamento Público 001/2024 SMC
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Pessoa Física
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Inscrições de 27/06/2024 00:00 até 21/08/2024 23:59
            </Typography>
            <Link href="https://dosp.com.br/exibe_do.php?i=NTEzMzU5" target="_blank" rel="noopener">
              Leia o objeto do edital
            </Link>
          </Card>
          <div className="sections">
            <Section title="Proponente" description="Selecione o proponente do projeto" link="../proponente" />
            <Section title="Informações gerais do projeto" description="Informe o segmento, período previsto e o valor do projeto" link="/InformacoesGerais" />
            <Section title="Planilha orçamentária" description="O valor total das despesas cadastradas deverá corresponder ao informado no orçamento." link="/PlanilhaOrc" />
            <Section title="Ficha técnica" description="Você deve cadastrar o(a)s principais integrantes da ficha técnica do projeto." link="/FichaTecnicaForm" />
            <Section title="Documentos do projeto e proponente" description="Importante! Só é possível anexar 01 (um) arquivo por item exigido. Caso necessário, reúna todos os ..." link="/DocumentForm" />
          </div>
          <div className="actions">
            <Button variant="outlined" color="error" onClick={handleClickOpen}>
              Excluir projeto
            </Button>
            <Button sx={{ backgroundColor: '#1D4A5D', color: 'white' }} onClick={handleClickOpen} variant="contained" color="primary">
              Enviar projeto
            </Button>
          </div>
        </main>
      </div>

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Confirmar Envio do Projeto"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Após enviar o projeto, você não poderá mais editá-lo. Deseja continuar?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={isSubmitting}>Cancelar</Button>
          <Button onClick={handleSubmit} color='primary' disabled={isSubmitting} autoFocus>
            {isSubmitting ? <CircularProgress size={24} /> : "Confirmar"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

function Section({ title, description, link }) {
  return (
    <Link href={link} passHref>
      <div className="section">
        <div className="section-icon">?</div>
        <div className="section-content">
          <h3>{title}</h3>
          <p>{description}</p>
        </div>
        <div className="section-arrow">&gt;</div>
      </div>
    </Link>
  );
}

export default PnabHomeForms;
