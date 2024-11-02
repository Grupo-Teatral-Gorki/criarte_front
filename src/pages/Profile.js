import React, { useEffect, useState } from 'react';
import { Container, Box, TextField, Button, Link, Alert } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import PrivateRoute from '../components/PrivateRoute';
import Header from '../components/Header/Header';

const ProfileForm = () => {
  const [userEmail, setUserEmail] = useState('');
  const [userCityId, setUserCityId] = useState('');
  const [userId, setUserId] = useState(null);
  const [userType, setUserType] = useState(null);
  const [showProfile, setShowProfile] = useState(false);

  // Mapeamento de idCidade para o nome da cidade
  const cityNames = {
    3842: 'Serrana',
    3798: 'Santa Rita Do Passa Quatro',
    // Adicione mais cidades conforme necessário
  };

  useEffect(() => {
    const storedUserDetails = localStorage.getItem('userDetails');

    if (storedUserDetails) {
      const userDetails = JSON.parse(storedUserDetails);
      console.log("Dados do usuário:", userDetails);

      setUserEmail(userDetails.usuario || '');
      setUserCityId(userDetails.idCidade || '');
      setUserId(userDetails.id || null);
      setUserType(Number(userDetails.tipoUsuario) || null);
    }

    setShowProfile(true);
  }, []);

  const getCityName = (cityId) => {
    return cityNames[cityId] || 'Cidade desconhecida';
  };

  return (
    <div>
      <PrivateRoute />
      <Header/>
      {showProfile && (
        <Container maxWidth="sm" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '70vh' }}>
          {userType === 5 && (
            <Alert severity="error" sx={{ mb: 2 }}>
              Este usuário é um SuperAdmin
            </Alert>
          )}

          <Link href="/home" sx={{ alignSelf: 'flex-start', mb: 2 }}>Home</Link>

          <Box component="form" sx={{ bgcolor: 'white', p: 4, borderRadius: 1, boxShadow: 3, width: '100%', textAlign: 'center' }}>
            <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <Stack>
                <Avatar sx={{ width: 100, height: 100, fontSize: '2rem' }}>{userEmail ? userEmail[0].toUpperCase() : 'P'}</Avatar>
              </Stack>
            </Box>

            <TextField
              fullWidth
              label="E-mail"
              variant="outlined"
              margin="normal"
              disabled
              value={userEmail}
              InputLabelProps={{
                sx: {
                  backgroundColor: 'white',
                  paddingRight: '8px', // Para evitar sobreposição com a borda
                  paddingLeft: '8px',
                },
              }}
              sx={{
                '& .MuiInputLabel-root': {
                  backgroundColor: 'white',
                },
              }}
            />

            <TextField
              fullWidth
              label="Cidade"
              variant="outlined"
              margin="normal"
              disabled
              value={getCityName(userCityId)} // Converte o id da cidade para o nome
              InputLabelProps={{
                sx: {
                  backgroundColor: 'white',
                  paddingRight: '8px', // Para evitar sobreposição com a borda
                  paddingLeft: '8px',
                },
              }}
              sx={{
                '& .MuiInputLabel-root': {
                  backgroundColor: 'white',
                },
              }}
            />

            <TextField
              fullWidth
              label="ID"
              variant="outlined"
              margin="normal"
              disabled
              value={userId}
              InputLabelProps={{
                sx: {
                  backgroundColor: 'white',
                  paddingRight: '8px',
                  paddingLeft: '8px',
                },
              }}
              sx={{
                '& .MuiInputLabel-root': {
                  backgroundColor: 'white',
                },
              }}
            />

            <Link href="/pass/new" sx={{ display: 'block', mb: 2 }}>Trocar senha</Link>
            <Button variant="contained" color="primary">Salvar</Button>
          </Box>
        </Container>
      )}
    </div>
  );
};

export default ProfileForm;
