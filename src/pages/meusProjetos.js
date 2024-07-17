import React from 'react';
import Header from '../components/Header/Header';
import PrivateRoute from '../components/PrivateRoute';
//import "./MeusProjetos.css"

const MeusProjetos = () => {
  return (
    <div>
    <PrivateRoute/>
    <Header/>
    <div className='nopage-container'>
      <h1>( Erro: 404 ) - Página não encontrada</h1>
      <p>A página que você está procurando não existe.</p>
    </div>
    </div>
  );
};

export default MeusProjetos;