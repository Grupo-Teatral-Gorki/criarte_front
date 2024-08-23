import React, { useState, useEffect } from 'react';
import { Button, Typography, Box, Card, CardContent, CircularProgress, Alert } from '@mui/material';
import { styled } from '@mui/system';
import Header from '../components/Header/Header';
import PrivateRoute from '../components/PrivateRoute';

const DocumentUploadForm = () => {
  const [numeroInscricao, setNumeroInscricao] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [file, setFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');
  const [allFilesUploaded, setAllFilesUploaded] = useState(false);

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

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const uploadFile = async (file) => {
    if (!numeroInscricao) {
      throw new Error('Número de inscrição do projeto não encontrado.');
    }

    const formData = new FormData();
    formData.append('IdProjeto', numeroInscricao);
    formData.append('IdTipo', 1);
    formData.append('Archive', file, file.name);

    const url = `https://api.grupogorki.com.br/api/docProjeto/Create`;
    const token = localStorage.getItem('authToken');

    try {
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData
      });

      if (response.ok) {
        setUploadStatus('success');
        console.log('Upload success:', await response.json());
      } else {
        setUploadStatus('error');
        console.error('Upload error:', response.status, response.statusText, await response.text());
      }
    } catch (error) {
      setUploadStatus('error');
      console.error('Upload error:', error.message);
    }
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    if (!file) {
      alert('Por favor, selecione um arquivo para enviar.');
      return;
    }

    try {
      await uploadFile(file);
      setAllFilesUploaded(true);
    } catch (error) {
      console.error('Error uploading files:', error);
      setAllFilesUploaded(false);
    }
  };

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
            Planilha orçamentária
          </Typography>
          <Alert sx={{marginBottom: "20px"}} severity="warning">
          Após receber a mensagem de confirmação, o arquivo será salvo automaticamente e não será exibido na tela. Caso precise enviar um novo arquivo para substituir o anterior, repita o processo, preenchendo apenas o campo necessário.

          </Alert>
          {isLoading ? (
            <CircularProgress />
          ) : error ? (
            <Alert severity="error">{error}</Alert>
          ) : (
            <form onSubmit={onSubmit}>
              <Card sx={{ padding: '20px', borderRadius: '8px', boxShadow: 3, maxWidth: '700px', width: '800px', margin: 'auto', mb: 2 }}>
                <CardContent>
                  <a href='https://styxx-public.s3.sa-east-1.amazonaws.com/example-docs/ANEXO+IV+-+MODELO+DE+PLANILHA+OR%C3%87AMENT%C3%81RIA.docx'>Baixar modelo</a>
                  <UploadBox>
                    <Typography variant="body2" sx={{ mb: 1 }}>Selecione o arquivo aqui</Typography>
                    {file && <p>{file.name}</p>}
                    <Typography variant="caption" sx={{ mb: 2, display: 'block' }}>Arquivos Suportados: PDF, TEXT, DOC, DOCX</Typography>
                    <input
                      type="file"
                      onChange={handleFileChange}
                      style={{ display: 'none' }}
                      id="upload-file"
                    />
                    <label htmlFor="upload-file">
                      <Button variant="contained" component="span">
                        ENVIAR
                      </Button>
                    </label>
                  </UploadBox>
                  {uploadStatus === 'success' && <Alert severity="success">Arquivo enviado com sucesso!</Alert>}
                  {uploadStatus === 'error' && <Alert severity="error">Erro ao enviar o arquivo.</Alert>}
                </CardContent>
              </Card>
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <a href='/pnab/projeto'><Button variant="outlined" color="primary" sx={{marginRight: '5px'}}>Voltar</Button></a>
                <Button variant="contained" color="primary" type="submit">
                  Enviar Documento
                </Button>
              </Box>
            </form>
          )}
        </Box>
      </Box>
    </div>
  );
};

export default DocumentUploadForm;
