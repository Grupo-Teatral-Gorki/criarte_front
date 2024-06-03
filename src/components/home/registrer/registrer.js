import React, { useEffect } from 'react';
import './registrer.css';

function Register() {
    useEffect(() => {
        const btnCadastrar = document.getElementById('btnCadastrar');
        const btnLogin = document.getElementById('btnLogin');
        const emailInput = document.getElementById('email');

        function isValidEmail(email) {
            const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            return emailPattern.test(email);
        }

        const handleCadastrarClick = () => {
            const email = emailInput.value;

            if (isValidEmail(email)) {
                // Redirecionar para a página de cadastro bem-sucedido se o email for válido
                window.location.href = 'pagina_cadastro_sucesso.html';
            } else {
                // Caso contrário, exibir um alerta
                alert('Por favor, insira um e-mail válido.');
            }
        };

        const handleLoginClick = () => {
            // Redirecionar para a página de login ao clicar em "Fazer login"
            window.location.href = '/login';
        };

        if (btnCadastrar) {
            btnCadastrar.addEventListener('click', handleCadastrarClick);
        }

        if (btnLogin) {
            btnLogin.addEventListener('click', handleLoginClick);
        }

        return () => {
            if (btnCadastrar) {
                btnCadastrar.removeEventListener('click', handleCadastrarClick);
            }
            if (btnLogin) {
                btnLogin.removeEventListener('click', handleLoginClick);
            }
        };
    }, []);

    return (
        <div className="sob-div">
            <div className="box-Registro">
                <div className="page">
                    <form method="POST" className="formRegistro">
                        <h1>Cadastro</h1>
                        <p>Digite os seus dados de acesso no campo abaixo.</p>
                        <label htmlFor="nome">Nome completo</label>
                        <input type="text" placeholder="Digite seu nome" autoFocus={true} />
                        <label htmlFor="email">E-mail</label>
                        <input type="email" placeholder="Digite seu e-mail" id="email" />
                        <label htmlFor="password">Senha</label>
                        <input type="password" placeholder="Digite sua senha" id="senha" />
                        <label htmlFor="password">Senha novamente</label>
                        <input type="password" placeholder="Repita sua senha" />
                        <input type="button" value="Cadastrar" className="btn" id="btnCadastrar" />
                        <input type="button" value="Fazer login" className="btn-login" id="btnLogin" />
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Register;
