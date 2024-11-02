import { useState } from 'react';
import { useRouter } from 'next/router';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [city, setCity] = useState('');
  const [cityOpen, setCityOpen] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert('As senhas não coincidem. Por favor, digite novamente.');
      return;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      alert('A senha deve ter pelo menos 8 caracteres, incluindo letras maiúsculas, minúsculas, números e um símbolo. Exemplo: Senha@1234');
      return;
    }

    try {
      const response = await fetch('https://api.grupogorki.com.br/api/usuarios/createuser', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ usuario: email, senha: password, idCidade: city }),
      });

      if (!response.ok) {
        const errorResponse = await response.text();
        throw new Error(errorResponse);
      }

      const textResponse = await response.text();
      if (textResponse === 'Usuario cadastrado com sucesso.') {
        console.log('Cadastro realizado com sucesso:', textResponse);
        alert('Cadastro realizado com sucesso');
        router.push('/login');
      } else {
        throw new Error('Erro ao cadastrar usuário.');
      }
    } catch (error) {
      console.error('Erro no cadastro:', error.message);
      alert('Falha no cadastro: ' + error.message);
    }
  };

  const handleChange = (event) => {
    setCity(event.target.value);
  };

  const handleCloseCity = () => {
    setCityOpen(false);
  };

  const handleOpenCity = () => {
    setCityOpen(true);
  };

  return (
    <div className='body-register'>
      <img className='logo-register' src="https://styxx-public.s3.sa-east-1.amazonaws.com/logo_criarte_black.png" alt="Logo Criarte" />
      <div className="register-container">
        <h2>Cadastro</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Senha:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Confirme a senha:</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <div className='selecao-cidade'>
            <FormControl sx={{ m: 1, minWidth: "100%", marginLeft: 'auto', marginRight: 'auto' }}>
              <InputLabel id="demo-controlled-open-select-label">Cidade</InputLabel>
              <Select
                labelId="demo-controlled-open-select-label"
                id="demo-controlled-open-select"
                open={cityOpen}
                onClose={handleCloseCity}
                onOpen={handleOpenCity}
                value={city}
                label="Cidade"
                required
                onChange={handleChange}
              >
                <MenuItem value="">
                  <em>Nenhuma</em>
                </MenuItem>
                <MenuItem value="3357">Brodowski</MenuItem>
                <MenuItem value="3798">Santa Rita do Passa Quatro</MenuItem>
                <MenuItem value="3842">Serrana</MenuItem>
                <MenuItem value="3716">Pontal</MenuItem>
                <MenuItem value="3478">Guariba</MenuItem>
                <MenuItem value="3823">São José do Rio Pardo</MenuItem>
              </Select>
            </FormControl>
          </div>
          <div className="button-container">
            <Button variant="contained" type="submit">
              Cadastrar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
