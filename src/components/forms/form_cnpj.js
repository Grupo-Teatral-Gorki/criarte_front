import React, { useState } from 'react';
import './form_cnpj.css';

function FormCNPJ() {
  const [razaoSocial, setRazaoSocial] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [nomeFantasia, setNomeFantasia] = useState('');
  const [website, setWebsite] = useState('');
  const [email, setEmail] = useState('');
  const [telefoneFixo, setTelefoneFixo] = useState('');
  const [celular, setCelular] = useState('');
  const [dataDeNascimento, setDataDeNascimento] = useState('');
  const [cargo, setCargo] = useState('');
  const [cep, setCep] = useState('');
  const [logradouro, setLogradouro] = useState('');
  const [numero, setNumero] = useState('');
  const [complemento, setComplemento] = useState('');
  const [bairro, setBairro] = useState('');
  const [telefoneAlternativo, setTelefoneAlternativo] = useState('');
  const [responsavelLegal, setResponsavelLegal] = useState('');
  const [cpf, setCpf] = useState('');
  const [rg, setRg] = useState('');
  const [municipio, setMunicipio] = useState('');
  const [uf, setUf] = useState('');
  const [nomeSocial, setNomeSocial] = useState('');

  const handleChange = (setter) => (event) => setter(event.target.value);

  const handleCepChange = async (event) => {
    const value = event.target.value.replace(/[^0-9]/g, '');
    setCep(value);
    if (value.length === 8) {
      try {
        const response = await fetch(`https://viacep.com.br/ws/${value}/json/`);
        if (response.ok) {
          const data = await response.json();
          if (!data.erro) {
            setLogradouro(data.logradouro);
            setBairro(data.bairro);
            setMunicipio(data.localidade);
            setUf(data.uf);
          } else {
            console.error('CEP not found');
          }
        } else {
          console.error('Failed to fetch data');
        }
      } catch (error) {
        console.error('Network error:', error);
      }
    }
  };

  return (
    <main>
      <div className='xablau'>
        <h1>Cadastro de proponente CNPJ</h1>
        <div className="input-container">
          <div className="input-wrapper">
            <label htmlFor="RazaoSocial">Razão Social*</label>
            <input
              id="RazaoSocial"
              type="text"
              value={razaoSocial}
              onChange={handleChange(setRazaoSocial)}
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
              onChange={handleChange(setCnpj)}
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
              onChange={handleChange(setNomeFantasia)}
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
              onChange={handleChange(setWebsite)}
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
                onChange={handleChange(setEmail)}
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
                onChange={handleChange(setTelefoneFixo)}
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
                onChange={handleChange(setCelular)}
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
                onChange={handleChange(setTelefoneAlternativo)}
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
                onChange={handleChange(setResponsavelLegal)}
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
                onChange={handleChange(setCpf)}
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
                onChange={handleChange(setRg)}
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
                onChange={handleChange(setNomeSocial)}
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
                onChange={handleChange(setDataDeNascimento)}
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
                onChange={handleChange(setCargo)}
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
                onChange={handleChange(setLogradouro)}
                className="input-field"
                placeholder="Rua das Flores"
              />
            </div>
            <div className="input-wrapper">
              <label htmlFor="numero">Número*</label>
              <input
                id="numero"
                type="text"
                value={numero}
                onChange={handleChange(setNumero)}
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
                onChange={handleChange(setComplemento)}
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
                onChange={handleChange(setBairro)}
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
                onChange={handleChange(setMunicipio)}
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
                onChange={handleChange(setUf)}
                className="input-field"
                placeholder="SP"
              />
            </div>
          </div>
        </div>
      </div>
      </main>
  );
}

export default FormCNPJ;
