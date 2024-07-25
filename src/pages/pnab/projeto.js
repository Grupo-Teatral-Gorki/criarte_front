import { useState, useEffect } from 'react';
import { CircularProgress, Alert } from '@mui/material';
import Link from 'next/link';
import PrivateRoute from '../../components/PrivateRoute';
import Header from '../../components/Header/Header';

function PnabHomeForms() {
  const [numeroInscricao, setNumeroInscricao] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {

    const fetchProjectInfo = async () => {
      setIsLoading(true);
      setError(null);
      let attempts = 0;
      const maxAttempts = 3;
      const url = `https://api.grupogorki.com.br/api/projeto/listaProjetos`;
      const token = localStorage.getItem('authToken');

      while (attempts < maxAttempts) {
        try {
          await new Promise(resolve => setTimeout(resolve, 1000));
          const response = await fetch(url, {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });

          if (response.ok) {
            const data = await response.json();
            console.log('Dados do projeto:', data);

            localStorage.setItem('numeroInscricao', data.data[0].numeroInscricao);

            if (data.data && data.data.length > 0) {
              setNumeroInscricao(data.data[0].numeroInscricao);
              console.log(data.data[0].numeroInscricao);
            } else {
              console.error("Número de inscrição não encontrado na resposta da API.");
              setError("Número de inscrição não encontrado.");
            }
            break;
          } else {
            throw new Error(`Erro na requisição: ${response.status} ${response.statusText}`);
          }
        } catch (error) {
          console.error('Erro ao obter informações do projeto:', error);
          setError(error.message);
          attempts += 1;

          if (attempts >= maxAttempts) {
            console.error('Número máximo de tentativas alcançado.');
            setError('Não foi possível obter as informações do projeto após várias tentativas.');
          }
        }
      }

      setIsLoading(false);
    };

    fetchProjectInfo();
  }, []);



  const handleSaveChanges = () => {
    alert('Informações enviadas');
  };

  return (
      <div>
      <PrivateRoute>
    <Header/>
    <div className="app-container">
      <main className="main-content">
        <div className="project-header">
        <a href='../editais'><button>Voltar</button></a>
          {isLoading ? (
            <CircularProgress />
          ) : error ? (
            <Alert severity="error">{error}</Alert>
          ) : (
            <p className="project-id">ID DO PROJETO: P_00{numeroInscricao}</p>
          )}
        </div>
        <div className="progress-bar">
          <div className="progress" style={{ width: '0%' }}></div>
        </div>
        <div className="content">
          <div className="card">
            <h2>Edital de Chamamento Público 001/2024 SMC</h2>
            <p>Pessoa Física</p>
            <p>Inscrições de 27/06/2024 00:00 até 21/08/2024 23:59</p>
            <a style={{color: 'black'}} href="https://dosp.com.br/exibe_do.php?i=NTEzMzU5">Leia o objeto do edital</a>
          </div>
          <div className="sections">
            <Section title="Proponente" description="Selecione o proponente do projeto" link="../proponente" />
            <Section title="Informações gerais do projeto" description="Informe o segmento, período previsto e o valor do projeto" link="/InformacoesGerais" />
            <Section title="Planilha orçamentária" description="O valor total das despesas cadastradas deverá corresponder ao informado no orçamento." link="/PlanilhaOrc" />
            <Section title="Ficha técnica" description="Você deve cadastrar o(a)s principais integrantes da ficha técnica do projeto." link="/FichaTecnicaForm" />
            <Section title="Documentos do projeto e proponente" description="Importante! Só é possível anexar 01 (um) arquivo por item exigido. Caso necessário, reúna todos os ..." link="/DocumentForm" />
          </div>
          <div className="actions">
            <button className="delete-button">Excluir projeto</button>
            <button className="submit-button" onClick={handleSaveChanges}>Enviar inscrição</button>
          </div>
        </div>
      </main>
    </div>
    </PrivateRoute>
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
