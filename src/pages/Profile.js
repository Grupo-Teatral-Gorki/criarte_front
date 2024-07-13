import React, { useEffect, useState } from 'react';
import { Container, Box, TextField, Button, Link, Alert } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';

const ProfileForm = () => {
  const [userEmail, setUserEmail] = useState('');
  const [userCityId, setUserCityId] = useState('');
  const [userId, setUserId] = useState(null);
  const [userType, setUserType] = useState(null);
  const [showProfile, setShowProfile] = useState(false);

  useEffect(() => {
    const storedUserDetails = localStorage.getItem('userDetails');

    if (storedUserDetails) {
      const userDetails = JSON.parse(storedUserDetails);
      console.log("Dados do usuário:", userDetails);
      setUserEmail(userDetails.usuario || '');
      setUserCityId(`${userDetails.idCidade} - Brodowski` || '');
      setUserId(userDetails.id || null);
      setUserType(Number(userDetails.tipoUsuario) || null);
    }

    setShowProfile(true);
  }, []);


  return (
    <div>
      {showProfile && (
        <Container maxWidth="sm" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '70vh' }}>
          {userType === 5 && (
            <Alert severity="error" sx={{ mb: 2 }}>
              Este usuário é um SuperAdmin
            </Alert>
          )}

          <Link href="/" sx={{ alignSelf: 'flex-start', mb: 2 }}>Home</Link>

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
                  paddingRight: '8px', // Optional: To avoid overlap with the outlined border
                  paddingLeft: '8px',  // Optional: To avoid overlap with the outlined border
                },
              }}
              sx={{
                // If you need the whole text field to have a white background
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
  value={userCityId}
  InputLabelProps={{
    sx: {
      backgroundColor: 'white',
      paddingRight: '8px', // Optional: To avoid overlap with the outlined border
      paddingLeft: '8px',  // Optional: To avoid overlap with the outlined border
    },
  }}
  sx={{
    // If you need the whole text field to have a white background
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
      paddingRight: '8px', // Optional: To avoid overlap with the outlined border
      paddingLeft: '8px',  // Optional: To avoid overlap with the outlined border
    },
  }}
  sx={{
    // If you need the whole text field to have a white background
    '& .MuiInputLabel-root': {
      backgroundColor: 'white',
    },
  }}
/>
            <Link href="/" sx={{ display: 'block', mb: 2 }}>Trocar senha</Link>
            <Button variant="contained" color="primary">Salvar</Button>
          </Box>
        </Container>
      )}
    </div>
  );
};

export default ProfileForm;
