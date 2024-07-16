import React, { useState, useEffect } from 'react';
import { Button, Typography, Box, Grid, Card, CardContent, CircularProgress, Alert } from '@mui/material';
import axios from 'axios';
import { styled } from '@mui/system';
import Header from '../components/Header/Header';
import PrivateRoute from '../components/PrivateRoute';

const DocumentUploadForm = () => {
  const [numeroInscricao, setNumeroInscricao] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [files, setFiles] = useState({});
  const [uploadStatus, setUploadStatus] = useState({});

  useEffect(() => {
    const fetchNumeroInscricao = async () => {
      setIsLoading(true);

      const url = `https://api.grupogorki.com.br/api/projeto/listaProjetos`;
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
          setNumeroInscricao(data.data[0].numeroInscricao);
        } else {
          setError("Número de inscrição não encontrado.");
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNumeroInscricao();
  }, []);

  const handleFileChange = (event, fieldName) => {
    const file = event.target.files[0];
    setFiles(prevFiles => ({
      ...prevFiles,
      [fieldName]: file,
    }));
  };

  const uploadFile = async (file, fieldName) => {
    if (!numeroInscricao) {
      throw new Error('Número de inscrição do projeto não encontrado.');
    }
  
    const formData = new FormData();
    formData.append('IdProjeto', numeroInscricao);
    formData.append('IdTipo', 1);
    formData.append('Archive', file, file.name);

    console.log(numeroInscricao, fieldName)
    console.log(file)
  
    try {
      const response = await fetch('https://api.grupogorki.com.br/api/docProjeto/Create', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
        body: formData
      });
  
      if (response.ok) {
        setUploadStatus(prevStatus => ({
          ...prevStatus,
          [fieldName]: 'success',
        }));
        console.log('Upload success:', await response.text());
      } else {
        setUploadStatus(prevStatus => ({
          ...prevStatus,
          [fieldName]: 'error',
        }));
        const errorText = await response.text(); // Lê o texto da resposta de erro
        console.error('Upload error:', response.status, response.statusText, errorText);
      }
    } catch (error) {
      setUploadStatus(prevStatus => ({
        ...prevStatus,
        [fieldName]: 'error',
      }));
      console.error('Upload error:', error.message); // Log a mensagem de erro
  
      if (error.response) {
        // A requisição foi feita e o servidor respondeu com um status de erro (ex: 4xx, 5xx)
        console.error('Server response:', error.response.status, error.response.data);
      } else if (error.request) {
        // A requisição foi feita mas não houve resposta
        console.error('No response received:', error.request);
      } else {
        // Algo aconteceu ao configurar a requisição que acionou um erro
        console.error('Error setting up request:', error.message);
      }
  };
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    Object.keys(files).forEach(fieldName => {
      if (files[fieldName]) {
        uploadFile(files[fieldName], fieldName);
      }
    });
  };

  const UploadField = ({ name, label, exampleLink, exampleText }) => (
    <Card sx={{ padding: '20px', borderRadius: '8px', boxShadow: 3, maxWidth: '700px', width: '800px', margin: 'auto', mb: 2 }}>
      {exampleLink && <a href={exampleLink}>{exampleText}</a>}
      <CardContent>
        <Typography variant="h6" sx={{ mb: 2 }}>{label}</Typography>
        <UploadBox>
          <Typography variant="body2" sx={{ mb: 1 }}>Selecione o arquivo aqui</Typography>
          <Typography variant="caption" sx={{ mb: 2, display: 'block' }}>Arquivos Suportados: PDF, TEXT, DOC, DOCX</Typography>
          <input
            type="file"
            onChange={(e) => handleFileChange(e, name)}
            style={{ display: 'none' }}
            id={`upload-${name}`}
          />
          <label htmlFor={`upload-${name}`}>
            <Button variant="contained" component="span">
              ENVIAR
            </Button>
          </label>
        </UploadBox>
        {uploadStatus[name] === 'success' && <Alert severity="success">Arquivo enviado com sucesso!</Alert>}
        {uploadStatus[name] === 'error' && <Alert severity="error">Erro ao enviar o arquivo.</Alert>}
      </CardContent>
    </Card>
  );

  const UploadBox = styled('div')(({ theme }) => ({
    border: '2px dashed #ccc',
    padding: '20px',
    textAlign: 'center',
    borderRadius: '4px',
    backgroundColor: '#f9f9f9',
    cursor: 'pointer',
    '&:hover': {
      borderColor: '#999',
    }
  }));

  return (
    <div>
      <PrivateRoute />
      <Header />
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
        <Box sx={{ width: '50%', border: '1px solid #ddd', padding: '2rem', borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
          <Typography variant="h4" sx={{ marginBottom: '1rem', textAlign: 'center' }}>
            Documentos do Projeto e Proponente
          </Typography>
          {isLoading ? (
            <CircularProgress />
          ) : error ? (
            <Alert severity="error">{error}</Alert>
          ) : (
            <form onSubmit={handleSubmit}>
              <UploadField name="cronograma" label="*Cronograma de execução do projeto" />
              <UploadField name="curriculo" label="*Currículo do(a) responsável técnico(a)/artístico(a)" />
              <UploadField name="rgCpf" label="*RG e CPF do(a) responsável técnico(a)" />
              <UploadField name="curriculoEquipe" label="*Currículo do(a)s principais integrantes da equipe técnica e artística" />
              <UploadField name="direitosAutorais" label="*Direitos autorais e conexos" exampleLink="https://styxx-public.s3.sa-east-1.amazonaws.com/example-docs/ANEXO+III+-+DECLARA%C3%87%C3%83O+DE+OP%C3%87%C3%83O+DE+CESS%C3%83O+DE+DIREITOS+AUTORAIS.docx" exampleText="Baixar exemplo" />
              <UploadField name="termoCompromisso" label="*Termo de compromisso dos participantes" exampleLink="https://styxx-public.s3.sa-east-1.amazonaws.com/example-docs/ANEXO+V+-+MODELO+DE+TERMO+DE+COMPROMISSO+DOS+PARTICIPANTES.docx" exampleText="Baixar exemplo" />
              <UploadField name="comprovanteDomicilioAtual" label="*Comprovantes de domicílio ou sede atual" />
              <UploadField name="comprovanteDomicilio2Anos" label="*Comprovantes de domicílio ou sede de 02 (dois) anos" />
              <UploadField name="curriculoPortfolio" label="*Curriculo ou portfólio de coletivo ou idealizador" />
              <UploadField name="decDeficiencia" label="Declaração de pessoa com deficiência" exampleLink="https://styxx-public.s3.sa-east-1.amazonaws.com/example-docs/ANEXO+VIII+-+DECLARA%C3%87%C3%83O+PESSOA+COM+DEFICI%C3%8ANCIA.docx" exampleText="Baixar exemplo" />
              <UploadField name="decEtnicoRacial" label="Declaração étnico-racial" exampleLink="https://styxx-public.s3.sa-east-1.amazonaws.com/example-docs/ANEXO+VII+-+MODELO+DE+DECLARA%C3%87%C3%83O+%C3%89TNICO-RACIAL.docx" exampleText="Baixar exemplo" />
              <UploadField name="decResidencia" label="Autodeclaração de Residência" exampleLink="https://styxx-public.s3.sa-east-1.amazonaws.com/example-docs/ANEXO+II+-+AUTODECLARA%C3%87%C3%83O+DE+RESID%C3%8ANCIA.docx" exampleText="Baixar exemplo" />
              <UploadField name="outrosDocumentos" label="Outros documentos" />
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
                <Button variant="contained" type="submit">Enviar Documentos</Button>
              </Box>
            </form>
          )}
        </Box>
      </Box>
    </div>
  );
};

export default DocumentUploadForm;
