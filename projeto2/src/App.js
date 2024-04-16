// App.js
import React, { useState } from 'react';
import ContadorResultados from './ContadorResultados';

function App() {
  const [quantidade, setQuantidade] = useState(1);
  const [gender, setGender] = useState('');
  const [birthdayStart, setBirthdayStart] = useState('');
  const [birthdayEnd, setBirthdayEnd] = useState('');
  const [searchSubstring, setSearchSubstring] = useState('');
  const [progressWidth, setProgressWidth] = useState(0);
  const [status, setStatus] = useState('');
  const [quantidadeResultados, setQuantidadeResultados] = useState(0);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    switch (name) {
      case 'quantidade':
        setQuantidade(value);
        break;
      case 'gender':
        setGender(value);
        break;
      case 'birthdayStart':
        setBirthdayStart(value);
        break;
      case 'birthdayEnd':
        setBirthdayEnd(value);
        break;
      case 'searchSubstring':
        setSearchSubstring(value);
        break;
      default:
        break;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (birthdayStart > birthdayEnd) {
      alert("A data de início não pode ser posterior à data de fim.");
      return;
    }
    const apiUrl = `https://fakerapi.it/api/v1/persons?_quantity=${quantidade}&_gender=${gender}&_birthday_start=${birthdayStart}&_birthday_end=${birthdayEnd}`;
    setStatus('Enviando requisição...');
    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setStatus('Concluído (HTTP status 200)');
      localStorage.setItem('fakeData', JSON.stringify(data.data));
      exibirDados(data.data, searchSubstring);
    } catch (error) {
      console.error(error.message);
      setStatus('Erro');
    }
  };

  const handleKeyUp = () => {
    const substring = searchSubstring.trim().toLowerCase();
    const data = JSON.parse(localStorage.getItem('fakeData'));
    exibirDados(data, substring);
  };

  const exibirDados = (arrayDados, substring) => {
    const containerDados = document.getElementById('customDataContainer');
    containerDados.innerHTML = '';
  
    let quantidadeEncontrada = 0;
  
    arrayDados.forEach((dados, index) => {
      let hasMatch = false;
  
      for (const chave in dados) {
        const valor = dados[chave];
        if (typeof valor === 'string' && valor.toLowerCase().includes(substring)) {
          hasMatch = true;
          break;
        }
      }
  
      if (hasMatch) {
        quantidadeEncontrada++;
        const divDados = document.createElement('div');
        divDados.classList.add('conjuntoDados');
        divDados.innerHTML = `<h3>Conjunto de Dados ${index + 1}</h3>`;

        for (const chave in dados) {
          const valor = dados[chave];
          if (chave === 'address') {
            const endereco = dados[chave];
            const endereço = `${endereco.street} ${endereco.streetName}`;
            const endereçoParagrafo = document.createElement('p');
            endereçoParagrafo.textContent = `Rua: ${endereço}`;
            divDados.appendChild(endereçoParagrafo);

            const cidadeParagrafo = document.createElement('p');
            cidadeParagrafo.textContent = `Cidade: ${endereco.city}`;
            divDados.appendChild(cidadeParagrafo);

            const paísParagrafo = document.createElement('p');
            paísParagrafo.textContent = `País: ${endereco.country}`;
            divDados.appendChild(paísParagrafo);
          } else if (chave !== 'street' && chave !== 'streetName') {
            const paragrafo = document.createElement('p');
            paragrafo.textContent = `${chave}: ${valor}`;
            divDados.appendChild(paragrafo);
          }
        }
        setQuantidadeResultados(quantidadeEncontrada);


        containerDados.appendChild(divDados);
      }
    });
  };


  return (
    <div>
      <h1>Gerador de Dados Customizado Faker</h1>
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label htmlFor="quantidade">Quantidade de registros a ser gerado:</label>
          <input type="number" id="quantidade" name="quantidade" value={quantidade} onChange={handleInputChange} />
        </div>

        <div className="input-group">
          <label htmlFor="gender">Gênero:</label>
          <select id="gender" name="gender" value={gender} onChange={handleInputChange}>
            <option value="">Qualquer</option>
            <option value="male">Masculino</option>
            <option value="female">Feminino</option>
          </select>
        </div>

        <div className="input-group">
          <label htmlFor="birthdayStart">Data de Nascimento (Início):</label>
          <input type="date" id="birthdayStart" name="birthdayStart" value={birthdayStart} onChange={handleInputChange} />
        </div>

        <div className="input-group">
          <label htmlFor="birthdayEnd">Data de Nascimento (Fim):</label>
          <input type="date" id="birthdayEnd" name="birthdayEnd" value={birthdayEnd} onChange={handleInputChange} />
        </div>

        <div className="progress">
          <div className="status">Status:</div>
          <div className="progress-bar" style={{ width: `${progressWidth}%` }} role="progressbar" aria-valuenow={progressWidth} aria-valuemin="0" aria-valuemax="100"></div>
        </div>
        <button id="btnObterDados" type="submit">Obter Dados Falsos Personalizados</button>

        <div className="input-group">
          <label htmlFor="searchSubstring">Buscar por Substring:</label>
          <input type="text" id="searchSubstring" name="searchSubstring" value={searchSubstring} onChange={handleInputChange} onKeyUp={handleKeyUp} placeholder="Substring" />
        </div>


        <div className="Contador">

          <ContadorResultados quantidadeResultados={quantidadeResultados} />
        </div>
      </form>

      <div id="customDataContainer"></div>
    </div>
  );
}

export default App;
