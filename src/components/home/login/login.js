import React, { useEffect, useState } from 'react';
import './login.css';

function Login() {
    const [email, setEmail] = useState('');

    useEffect(() => {
        const btnAcessar = document.getElementById('btnAcessar');
        const btnCriarConta = document.getElementById('btnCriarConta');
        const emailInput = document.getElementById('email');

        function isValidEmail(email) {
            const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            return emailPattern.test(email);
        }

        const handleAcessarClick = () => {
            if (isValidEmail(email)) {
                // Se o email for válido, redirecione para a página de acesso
                window.location.href = 'pagina_acesso.html';
            } else {
                // Caso contrário, exiba um alerta
                alert('Por favor, insira um e-mail válido.');
            }
        };

        const handleCriarContaClick = () => {
            // Redirecione para a página de registro ao clicar em "Criar conta"
            window.location.href = '../register/index.html';
        };

        // Adiciona os event listeners aos botões
        if (btnAcessar) {
            btnAcessar.addEventListener('click', handleAcessarClick);
        }
        if (btnCriarConta) {
            btnCriarConta.addEventListener('click', handleCriarContaClick);
        }

        // Limpa os event listeners ao desmontar o componente
        return () => {
            if (btnAcessar) {
                btnAcessar.removeEventListener('click', handleAcessarClick);
            }
            if (btnCriarConta) {
                btnCriarConta.removeEventListener('click', handleCriarContaClick);
            }
        };
    }, [email]); // Dependência do email para garantir que o useEffect seja executado quando o email for alterado

    return (
        <div className="sob-div">
            <div className="box-login">
                <div className="page">
                    <form method="POST" className="formLogin">
                        <h1>Login</h1>
                        <p>Digite os seus dados de acesso no campo abaixo.</p>
                        <label htmlFor="email">E-mail</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Digite seu e-mail"
                            autoFocus={true}
                        />
                        <label htmlFor="password">Senha</label>
                        <input type="password" placeholder="Digite sua senha" />
                        <a href="/">Esqueci minha senha</a>
                        <input type="button" value="Acessar" className="btn" id="btnAcessar" />
                        <input type="button" value="Criar conta" className="btn-register" id="btnCriarConta" />
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Login;
