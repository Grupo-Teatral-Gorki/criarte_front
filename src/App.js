import React, { useState } from 'react';
import Header from './components/header/header';
import './App.css';
import { eventWrapper } from '@testing-library/user-event/dist/utils';

function App() {
  
  const [razaoSocial, setRazaoSocial] = useState('');
  const handleRazaoSocialChange = (event) => {
    const valor = event.target.value.slice(0, 100);
    setRazaoSocial(valor);
  };

  const [cnpj, setCnpj] = useState('');
  const handleCnpjChange = (event) => {
    const apenasNumeros = event.target.value.replace(/\D/g, '');
    if (apenasNumeros.length <= 14) {
      const cnpjFormatado = apenasNumeros.replace(
        /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
        '$1.$2.$3/$4-$5'
      );
      setCnpj(cnpjFormatado);
    }
  };

  const [nomeFantasia, setNomeFantasia] = useState('');
  const handleNomeFantasiaChange = (event) => {
    const valor = event.target.value.slice(0, 100);
    setNomeFantasia(valor);
  };

  const [website, setWebsite] = useState('');
  const handleWebsiteChange = (event) => {
    const valor = event.target.value.slice(0, 70);
    setWebsite(valor);
  };

  const [email, setEmail] = useState('');
  const handleEmailChange = (event) => {
    const emailFormatado = event.target.value.toLowerCase().trim();
    setEmail(emailFormatado);
  };

  const [telefoneFixo, setTelefoneFixo] = useState('');
  const handleTelefoneFixoChange = (event) => {
    const apenasNumeros = event.target.value.replace(/\D/g, '');
    if (apenasNumeros.length <= 10) {
      const telefoneFormatado = apenasNumeros.replace(
        /^(\d{2})(\d{4})(\d{4})$/,
        '($1) $2-$3'
      );
      setTelefoneFixo(telefoneFormatado);
    }
  };

  const [celular, setCelular] = useState('');
  const handleCelularChange = (event) => {
    const apenasNumeros = event.target.value.replace(/\D/g, '').slice(0, 11);
    if (apenasNumeros.length === 10 || apenasNumeros.length === 11) {
      const celularFormatado = apenasNumeros.replace(
        /^(\d{2})(\d{4,5})(\d{4})$/,
        '($1) $2-$3'
      );
      setCelular(celularFormatado);
    } else {
      setCelular(apenasNumeros);
    }
  };

  const [dataDeNascimento, setDataDeNascimento] = useState('');
  const handleDataDeNascimentoChange = (event) => {
    const dataFormatada = event.target.value.replace(
      /^(\d{2})(\d{2})(\d{4})$/,
      '$1/$2/$3'
    );
    setDataDeNascimento(dataFormatada);
  };

  const [cargo, setCargo] = useState('');
  const handleCargoChange = (event) =>{
    const valor = event.target.value.slice(0, 30);
    setCargo(valor);
  };

  const [cep, setCep] = useState('');
  const handleCepChange = (event)=>{
    setCep(event.target.value.slice(0, 8))
  }

  const [logradouro, setLogradouro] = useState('');
  const handleLogradouroChange = (event)=>{
    setLogradouro(event.target.value)
  }

  const [numero, setNumero] = useState('');
  const handleNumeroChange = (event)=>{
    setNumero(event.target.value.slice(0, 6))
  }

  const [complemento, setComplemento] = useState('');
  const handleComplementoChange = (event)=>{
    setComplemento(event.target.value);
  };

  const [bairro, setBairro] = useState('');
  const handleBairroChange = (event)=>{
    setBairro(event.target.value)
  }

  const [telefoneAlternativo, setTelefoneAlternativo] = useState('');
  const handleTelefoneAlternativoChange = (event) => {
    setTelefoneAlternativo(event.target.value);
  };

  const [responsavelLegal, setResponsavelLegal] = useState('');
  const handleResponsavelLegalChange = (event) => {
    setResponsavelLegal(event.target.value);
  };

  const [cpf, setCpf] = useState('');
  const handleCpfChange = (event) => {
    setCpf(event.target.value);
  };

  const [rg, setRg] = useState('');
  const handleRgChange = (event) => {
    setRg(event.target.value);
  };

  const [municipio, setMunicipio] = useState('');
  const handleMunicipioChange = (event)=>{
    setMunicipio(event.target.value)
  }

  const [uf, setUf] = useState('');
  const handleUfChange = (event)=>{
    setUf(event.target.value);
  };

  const [nomeSocial, setNomeSocial] = useState('');
  const handleNomeSocialChange = (event) => {
    setNomeSocial(event.target.value);
  };

  

  return (
    <div className="App">
      <Header />
      <main>
        <div className='prop-info'>
        <h1>Cadastro de proponente CNPJ</h1>
        <div className="input-container">
          <div className="input-wrapper">
            <label htmlFor="RazaoSocial">Razão Social*</label>
            <input
              id="RazaoSocial"
              type="text"
              value={razaoSocial}
              onChange={handleRazaoSocialChange}
              className="input-field"
              placeholder="Globo Comunicação e Participações"
            />
          </div>
          <div className="input-wrapper">
            <label htmlFor="cnpj">CNPJ*</label>
            <input
              id="cnpj"
              type="text"
              value={cnpj}
              onChange={handleCnpjChange}
              className="input-field"
              placeholder="12.345.678/0001-00"
            />
          </div>
          <div className="input-wrapper">
            <label htmlFor="nomeFantasia">Nome Fantasia*</label>
            <input
              id="nomeFantasia"
              type="text"
              value={nomeFantasia}
              onChange={handleNomeFantasiaChange}
              className="input-field"
              placeholder="Globo"
            />
          </div>
          <div className="input-wrapper">
            <label htmlFor="website">Website</label>
            <input
              id="website"
              type="text"
              value={website}
              onChange={handleWebsiteChange}
              className="input-field"
              placeholder="www.globo.com"
            />
          </div>
        </div>
        <div className='divisor'></div>
          <div className='contact'>
          <h2 className='contact-title'>Dados de contato</h2>
            <div className='contact-inputs'>
            <div className="input-wrapper">
            <label htmlFor="email">E-mail*</label>
            <input
              id="email"
              type="text"
              value={email}
              onChange={handleEmailChange}
              className="input-field"
              placeholder="contato@gmail.com"
            />
          </div>
          <div className="input-wrapper">
            <label htmlFor="telefoneFixo">Telefone Fixo</label>
            <input
              id="telefoneFixo"
              type="text"
              value={telefoneFixo}
              onChange={handleTelefoneFixoChange}
              className="input-field"
              placeholder="1640406532"
            />
          </div>
          <div className="input-wrapper">
            <label htmlFor="celular">Celular*</label>
            <input
              id="celular"
              type="text"
              value={celular}
              onChange={handleCelularChange}
              className="input-field"
              placeholder="16976555443"
            />
          </div>
          <div className="input-wrapper">
            <label htmlFor="telefoneAlternativo">Telefone Alternativo</label>
            <input
              id="telefoneAlternativo"
              type="text"
              value={telefoneAlternativo}
              onChange={handleTelefoneAlternativoChange}
              className="input-field"
              placeholder="16976555443"
            />
          </div>
          <div className="input-wrapper">
            <label htmlFor="responsavelLegal">Responsável Legal*</label>
            <input
              id="responsavelLegal"
              type="text"
              value={responsavelLegal}
              onChange={handleResponsavelLegalChange}
              className="input-field"
              placeholder="Ex: João Pedro Souza Miranda"
            />
          </div>
          <div className="input-wrapper">
            <label htmlFor="cpf">CPF*</label>
            <input
              id="cpf"
              type="text"
              value={cpf}
              onChange={handleCpfChange}
              className="input-field"
              placeholder="528.765.443-22"
            />
          </div>
          <div className="input-wrapper">
            <label htmlFor="rg">RG*</label>
            <input
              id="rg"
              type="text"
              value={rg}
              onChange={handleRgChange}
              className="input-field"
              placeholder="55.555.555-5"
            />
          </div>
          <div className="input-wrapper">
            <label htmlFor="nomeSocial">Nome Social*</label>
            <input
              id="nomeSocial"
              type="text"
              value={nomeSocial}
              onChange={handleNomeSocialChange}
              className="input-field"
              placeholder="Ex: Luiza"
            />
          </div>
          <div className="input-wrapper">
            <label htmlFor="dataDeNascimento">Data De Nascimento*</label>
            <input
              id="dataDeNascimento"
              type="text"
              value={dataDeNascimento}
              onChange={handleDataDeNascimentoChange}
              className="input-field"
              placeholder="25/03/1999"
            />
          </div>
          <div className="input-wrapper">
            <label htmlFor="cargo">Cargo*</label>
            <input
              id="cargo"
              type="text"
              value={cargo}
              onChange={handleCargoChange}
              className="input-field"
              placeholder="Gerente"
            />
          </div>
            </div>
          </div>
          <div className='divisor'></div>
          <div className='contact'>
          <h2 className='contact-title'>Endereço Responsável Legal</h2>
            <div className='contact-inputs'>
            <div className="input-wrapper">
            <label htmlFor="cep">CEP*</label>
            <input
              id="cep"
              type="text"
              value={cep}
              onChange={handleCepChange}
              className="input-field"
              placeholder="08000-000"
            />
          </div>
          <div className="input-wrapper">
            <label htmlFor="logradouro">Logradouro*</label>
            <input
              id="logradouro"
              type="text"
              value={logradouro}
              onChange={handleLogradouroChange}
              className="input-field"
              placeholder="Rua das Flores"
            />
          </div>
          <div className="input-wrapper">
            <label htmlFor="numero">Nmero*</label>
            <input
              id="numero"
              type="text"
              value={numero}
              onChange={handleNumeroChange}
              className="input-field"
              placeholder="1697"
            />
          </div>
          <div className="input-wrapper">
            <label htmlFor="complemento">Complemento</label>
            <input
              id="complemento"
              type="text"
              value={complemento}
              onChange={handleComplementoChange}
              className="input-field"
              placeholder="Casa"
            />
          </div>
          <div className="input-wrapper">
            <label htmlFor="bairro">Bairro*</label>
            <input
              id="bairro"
              type="text"
              value={bairro}
              onChange={handleBairroChange}
              className="input-field"
              placeholder="Centro"
            />
          </div>
          <div className="input-wrapper">
            <label htmlFor="municipio">Município*</label>
            <input
              id="municipio"
              type="text"
              value={municipio}
              onChange={handleMunicipioChange}
              className="input-field"
              placeholder="São Paulo"
            />
          </div>
          <div className="input-wrapper">
            <label htmlFor="uf">UF*</label>
            <input
              id="uf"
              type="text"
              value={uf}
              onChange={handleUfChange}
              className="input-field"
              placeholder="SP"
            />
          </div>
            </div>
          </div>
        </div>
      </main>
      <div className='docs'>
          <h4 className='docs-title'>Documentos</h4>
        </div>
    </div>
  );
}

export default App;
