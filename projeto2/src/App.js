import React, { useState, useEffect } from 'react';
import ContadorResultadosEncontrados from './ContadorResultadosEncontrados';
import styled from 'styled-components';

function App() {
  const [quantidade, setQuantidade] = useState(1);
  const [gender, setGender] = useState('');
  const [birthdayStart, setBirthdayStart] = useState('');
  const [birthdayEnd, setBirthdayEnd] = useState('');
  const [searchSubstring, setSearchSubstring] = useState('');
  const [fakeData, setFakeData] = useState([]);
  const [contadorRetorno, setContadorRetorno] = useState(0);
  const [erro, setErro] = useState(null); 
  const [sucesso, setSucesso] = useState(null);


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
        setSearchSubstring(value.toLowerCase());
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
    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      localStorage.setItem('fakeData', JSON.stringify(data.data));
      setSucesso(`Sucesso! Gerado ${data.data.length} Dados Cadastrais`); 
      setFakeData(data.data);
      setErro(null); 
    } catch (error) {
      console.error(error.message);
      setErro('Falha ao executar requisição. Por favor, tente novamente mais tarde.');
    }
  };

  useEffect(() => {
    const dadosFiltrados = exibirDados(fakeData, searchSubstring);
    const contador = dadosFiltrados.length;
    setContadorRetorno(contador);
  }, [fakeData, searchSubstring]);

  const exibirDados = (arrayDados, substring) => {
    return substring
      ? arrayDados.filter((dados) =>
        Object.values(dados).some(
          (valor) =>
            typeof valor === 'string' &&
            valor.toLowerCase().includes(substring)
        )
      )
      : arrayDados;
  };

  return (
    <div className='inputs'>
      <h1>Gerador de Dados Customizado </h1>
      <h2>Faker</h2>
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

        <div className="input-group">
          <label htmlFor="searchSubstring">Buscar por Substring:</label>
          <input type="text" id="searchSubstring" name="searchSubstring" value={searchSubstring} onChange={handleInputChange} placeholder="Substring" />
        </div>

        <Botao type="submit">Obter Dados Falsos Personalizados</Botao>
      </form>

      {erro && <ErroMessage>{erro}</ErroMessage>}
      {sucesso && <SuccessMessage>{sucesso}</SuccessMessage>}

      <div className='Resultados'>
        {exibirDados(fakeData, searchSubstring).map((dados, index) => (
          <div key={index} className="conjuntoDados">
            <h3>Conjunto de Dados {index + 1}</h3>
            {Object.entries(dados).map(([chave, valor]) => (
              <p key={chave}>{chave === 'address' ? `Rua: ${valor.street} ${valor.streetName}, Cidade: ${valor.city}, País: ${valor.country}` : `${chave}: ${valor}`}</p>
            ))}
          </div>
        ))}
      </div>

      {searchSubstring && contadorRetorno >= 0 && (
        <div className="Contador">
          <ContadorResultadosEncontrados quantidadeResultados={contadorRetorno} />
        </div>
      )}
    </div>
  );
}

const Botao = styled.button`
  background-color: blue;
  color: white;
  font-size: 16px;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: darkblue;
  }
`;

const ErroMessage = styled.div`
  color: red;
  font-size: 14px;
  margin-top: 10px;
`;
const SuccessMessage = styled.div`
  color: green;
  font-size: 14px;
  margin-top: 10px;
`;

export default App;
