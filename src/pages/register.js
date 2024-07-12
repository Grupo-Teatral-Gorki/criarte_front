import { useState } from 'react';
import { useRouter } from 'next/router';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Link from 'next/link';

const Register = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Verifica se as senhas são iguais
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
        body: JSON.stringify({ usuario: email, senha: password, idCidade: '3357' }),
      });

      if (!response.ok) {
        const errorResponse = await response.text();
        throw new Error(errorResponse);
      }

      // Verifica o texto da resposta para confirmar o cadastro
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
            <Button
              id="basic-button"
              aria-controls={open ? 'basic-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
              onClick={handleClick}
            >
              Selecionar cidade
            </Button>
            <Menu
              id="basic-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              MenuListProps={{
                'aria-labelledby': 'basic-button',
              }}
            >
              <MenuItem onClick={handleClose}>3357 - Brodowski</MenuItem>
            </Menu>
          </div>
          <div className="button-container">
            <Link href="/login" passHref>
              <button className="login-button" type="button">Logar</button>
            </Link>
            <button className="register-button" type="submit">Cadastrar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
