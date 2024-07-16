import React from 'react';
//import "../../components/Gerais/Gerais.css";
//import "../../components/Main/Main.css";
//import "./Home.css";
import Header from '../components/Header/Header';
import PrivateRoute from '../components/PrivateRoute';
import InfoAlert from '../components/BasicAlerts/InfoAlert';

const Home = () => {
    const handleButtonClick = () => {
        window.open("/editais");
    };

    return (
        <PrivateRoute>
        <div>
            <Header/>
            <section className="container_opcoes_banner">
                <section className="container_opcoes">
                    <div className="container_meus_projetos" id='meus_projetos_off'>
                            <h3><i className="bi bi-folder"></i> Meus Projetos</h3>
                            <p>Lista de projetos inscritos</p>
                    </div>
                    
                    <div className="container_editais_vigentes">
                        <a href="/editais" className="opcao_link">
                            <h3><i className="bi bi-journal-check"></i> Editais Vigentes</h3>
                            <p>Lista de editais disponíveis para inscrição</p>
                        </a>
                    </div>

                    <div className="container_ajuda" id='meus_projetos_off'>
                            <h3><i className="bi bi-question-circle"></i> Ajuda</h3>
                    </div>
                    <div className="container_pendencias" id='meus_projetos_off'>
                            <h3><i className="bi bi-exclamation-circle"></i> Pendências</h3>
                            <p>Suas pendências serão exibidas aqui.</p>
                    </div>
                </section>

                <section className="container_banner">
                    <img className="banner_img" src="https://styxx-public.s3.sa-east-1.amazonaws.com/pnab-logo.png" alt="ADICIONAR BANNER"/>
                    <h1 className="banner_titulo">EDITAL DE CHAMAMENTO PÚBLICO Nº 001/2024 SMC</h1>
                    <p className="banner_paragrafo">SELEÇÃO DE PROJETOS PARA FIRMAR TERMO DE EXECUÇÃO CULTURAL COM
                    RECURSOS DA POLÍTICA NACIONAL ALDIR BLANC DE FOMENTO À CULTURA –
                    PNAB (LEI Nº 14.399/2022)</p>

                    <button onClick={handleButtonClick} className="btn-detalhes">Ver detalhes</button>
                </section>
            </section>
            <div className='notification'><InfoAlert/></div>
        </div>
        </PrivateRoute>
    );
};

export default Home;
