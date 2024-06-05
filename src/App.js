import React, { useState } from 'react';
import Header from './components/header/header'
import FormCNPJ from './components/forms/form_cnpj'
import Login from './components/home/login/login'

import './App.css';

function App() {

  return (
    <div className="App">
      <main>
        <Login/>
      </main>
    </div>
  );
}

export default App;