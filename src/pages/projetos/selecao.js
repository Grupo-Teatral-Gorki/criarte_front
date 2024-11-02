import React, { useState, useEffect } from 'react';
import Header from '../../components/Header/Header';
import PrivateRoute from '../../components/PrivateRoute';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useRouter } from 'next/router';

const MeusProjetos = () => {
  const [projetos, setProjetos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [editAlertOpen, setEditAlertOpen] = useState(false);
  const [disabledAlertOpen, setDisabledAlertOpen] = useState(false);
  const [storageUserDetails, setStorageUserDetails] = useState(null);

  const router = useRouter();

  useEffect(() => {

    if (typeof window !== 'undefined') {
      const userDetails = localStorage.getItem('userDetails');
      if (userDetails) {
        setStorageUserDetails(JSON.parse(userDetails));
      }
    }

    const fetchProjectInfo = async () => {
      setIsLoading(true);
      setError(null);
      const token = localStorage.getItem('authToken');
      try {
        const response = await fetch(`https://api.grupogorki.com.br/api/projeto/listaProjetos`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          setProjetos(data.data || []);
        } else {
          setError('Nenhum projeto foi encontrado.');
        }
      } catch (error) {
        setError('Erro ao carregar projetos.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjectInfo();
  }, []);

  const handleCreateProject2 = async () => {

    const userDetails = localStorage.getItem('userDetails');
    const parsedUserDetails = JSON.parse(userDetails);
    const idUsuario = parsedUserDetails.id;

    try {
      const response = await fetch('https://gorki-api-nome.iglgxt.easypanel.host/api/createProjeto', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          usuario: localStorage.getItem('userEmail'),
          senha: localStorage.getItem('userPassword'),
          nomeProjeto: "Nome do seu projeto",
          idProponente: 0,
          idArea: 1,
          dataPrevistaInicio: "2024-01-01",
          dataPrevistaFim: "2024-12-31",
          resumoProjeto: "Resumo do projeto",
          descricao: "...",
          objetivos: "Objetivos do projeto",
          justificativaProjeto: "Justificativa para o projeto",
          contrapartidaProjeto: "Contrapartida oferecida pelo projeto",
          planoDemocratizacao: "Plano de democratização",
          outrasInformacoes: "...",
          ingresso: false,
          valorIngresso: 0,
          idEdital: 2,
          idModalidade: 1,
          idUsuario: idUsuario,
          relevanciaPertinencia: "Relevância e pertinência do projeto",
          perfilPublico: "Perfil do público-alvo",
          classificacaoIndicativa: "Livre",
          qtdPublico: 100,
          propostaContrapartida: "Proposta de contrapartida detalhada",
          planoDivulgacao: "Plano de divulgação do projeto",
          nomeModalidade: ""
        }),
      });

      const data = await response.json();
      // Atualizando para acessar corretamente o ID do projeto
      if (data && data.projeto && data.projeto.id_projeto) {
        localStorage.setItem('numeroInscricao', data.projeto.id_projeto);
        router.push('/pnab/projeto');
      } else {
        console.error('Erro ao criar projeto:', data);
      }
    } catch (error) {
      console.error('Erro ao criar projeto:', error);
    }
  };


  const handleCreateProject = async () => {
    const userDetails = localStorage.getItem('userDetails');
    const parsedUserDetails = JSON.parse(userDetails);
    const idUsuario = parsedUserDetails.id;

    try {
      const response = await fetch('https://gorki-api-nome.iglgxt.easypanel.host/api/createProjeto', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          usuario: localStorage.getItem('userEmail'),
          senha: localStorage.getItem('userPassword'),
          nomeProjeto: "Nome do seu projeto",
          idProponente: 0,
          idArea: 1,
          dataPrevistaInicio: "2024-01-01",
          dataPrevistaFim: "2024-12-31",
          resumoProjeto: "Resumo do projeto",
          descricao: "Descrição detalhada do projeto",
          objetivos: "Objetivos do projeto",
          justificativaProjeto: "Justificativa para o projeto",
          contrapartidaProjeto: "Contrapartida oferecida pelo projeto",
          planoDemocratizacao: "Plano de democratização",
          outrasInformacoes: "Outras informações relevantes",
          ingresso: false,
          valorIngresso: 0,
          idEdital: 1,
          idModalidade: 1,
          idUsuario: idUsuario,
          relevanciaPertinencia: "Relevância e pertinência do projeto",
          perfilPublico: "Perfil do público-alvo",
          classificacaoIndicativa: "Livre",
          qtdPublico: 100,
          propostaContrapartida: "Proposta de contrapartida detalhada",
          planoDivulgacao: "Plano de divulgação do projeto",
          nomeModalidade: ""
        }),
      });

      const data = await response.json();

      // Atualizando para acessar corretamente o ID do projeto
      if (data && data.projeto && data.projeto.id_projeto) {
        localStorage.setItem('numeroInscricao', data.projeto.id_projeto);
        router.push('/pnab/projeto');
      } else {
        console.error('Erro ao criar projeto:', data);
        // Enviar log de erro para a API
        await logError('Erro ao criar projeto: ' + JSON.stringify(data), idUsuario);
      }
    } catch (error) {
      console.error('Erro ao criar projeto:', error);
      // Enviar log de erro para a API
      await logError(error.message, idUsuario);
    }
  };

  // Função para enviar log de erro para a API
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


  const handleEdit = (projeto) => {
    if (projeto.status === 'Enviado') {
      setEditAlertOpen(true);
    } else {
      localStorage.setItem('numeroInscricao', projeto.numeroInscricao);
      router.push('/pnab/projeto');
    }
  };

  const handleDisabledButtonClick = () => {
    setDisabledAlertOpen(true);
  };

  const handleClickOpen = (project) => {
    setSelectedProject(project);

  };

  const handleClickOpenRecurso = (project) => {
    router.push('/pnab/recurso')
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedProject(null);
  };

  const handleDelete = async () => {
    try {
      if (selectedProject) {
        const response = await fetch('https://styxx-api.w3vvzx.easypanel.host/api/deleteProjeto', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            usuario: localStorage.getItem('userEmail'),
            senha: localStorage.getItem('userPassword'),
            numeroInscricao: selectedProject.numeroInscricao,
          }),
        });

        if (response.ok) {
          router.reload();
          handleClose();
        }
      }
    } catch (error) {
      console.error('Erro ao excluir projeto:', error);
    }
  };

  return (
    <div>
      <PrivateRoute />
      <Header />
      <div className='mp-container'>
        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '10px' }} className='mp-header'>
          <Button variant="outlined" onClick={() => router.push('/home')}>Voltar</Button>
          <h1 style={{ marginLeft: '25px', color: 'gray' }}>Selecione o tipo do projeto</h1>

        </div>
        <div className='mp-projects-grid'>
          <div style={{ backgroundColor: 'white' }} className='mp-project-card' >
            <div className='mp-project-header'>
              <h1>Fomento</h1>
              <span className={`mp-status`}>
                Disponível
              </span>
            </div>
            <div className='mp-project-body'>
              <p><strong>Os programas de fomento da Secretaria de Cultura e Economia Criativa têm o objetivo de apoiar a realização de projetos culturais, por meio da concessão de incentivos financeiros para artistas, grupos, instituições e coletivos.</strong></p>

            </div>
            <div className='mp-project-footer'>

            </div>
            <Button
              size='small'
              variant="outlined"
              sx={{ marginTop: '30px' }}
              onClick={handleCreateProject}
            >
              Selecionar
            </Button>
          </div>
          {
            storageUserDetails && storageUserDetails.idCidade == 3798 ? (
              <div style={{ backgroundColor: 'white' }} className='mp-project-card' >
                <div className='mp-project-header'>
                  <h1>Premiação de Mestres E Mestras</h1>
                  <span className={`mp-status`}>
                    {
                      storageUserDetails ? (
                        (storageUserDetails.idCidade == 3798) ? (
                          <p>Disponível</p>
                        ) : (
                          <p>Não Qualificado</p>
                        )
                      ) : (
                        <p>Carregando...</p>
                      )
                    }
                  </span>
                </div>
                <div className='mp-project-body'>
                  <p><strong>O objeto deste Edital é a Premiação de Mestres e Mestras e Grupos e Coletivos das Culturas Tradicionais e Populares que tenham prestado relevante contribuição ao desenvolvimento artístico ou cultural do Município.</strong></p>
                  <a href='https://criarte.s3.us-east-2.amazonaws.com/documents/santa-rita-p4/edital-mestres-e-mestras/EDITAL-MESTRES-E-MESTRAS-PNAB-2024-assinado.pdf' target='_blank'>LER OBJETO DO EDITAL</a>
                </div>
                <div className='mp-project-footer'>

                </div>
                <Button
                  size='small'
                  variant="outlined"
                  sx={{ marginTop: '30px' }}
                  disabled={storageUserDetails && storageUserDetails.idCidade != 3798}
                  onClick={handleCreateProject2}
                >
                  Selecionar
                </Button>
              </div>
            ): null
          }

        </div>
      </div>

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirmar Exclusão"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Você tem certeza de que deseja excluir este projeto? Esta ação não pode ser desfeita.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDelete} color='error' autoFocus>
            Confirmar
          </Button>
          <Button onClick={handleClose}>Cancelar</Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={editAlertOpen}
        onClose={() => setEditAlertOpen(false)}
        aria-labelledby="edit-alert-dialog-title"
        aria-describedby="edit-alert-dialog-description"
      >
        <DialogTitle id="edit-alert-dialog-title">{"Edição não permitida"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="edit-alert-dialog-description">
            Este projeto já foi enviado e não pode ser editado.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditAlertOpen(false)} autoFocus>
            Ok
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={disabledAlertOpen}
        onClose={() => setDisabledAlertOpen(false)}
        aria-labelledby="disabled-alert-dialog-title"
        aria-describedby="disabled-alert-dialog-description"
      >
        <DialogTitle id="disabled-alert-dialog-title">{"Ação Não Permitida"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="disabled-alert-dialog-description">
            Este projeto já foi enviado e não pode ser editado.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDisabledAlertOpen(false)} autoFocus>
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default MeusProjetos;
