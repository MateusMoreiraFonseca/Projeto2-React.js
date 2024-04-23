import React, { useContext, useState, useEffect } from 'react';
import ContadorResultadosEncontrados from './ContadorResultadosEncontrados';
import styled from 'styled-components';
import { DataContext } from './DataContext';

function App() {
  const { fakeData, setFakeData, contadorRetorno, setContadorRetorno } = useContext(DataContext);

  const [quantidade, setQuantidade] = useState(1);
  const [gender, setGender] = useState('');
  const [birthdayStart, setBirthdayStart] = useState('');
  const [birthdayEnd, setBirthdayEnd] = useState('');
  const [buscarSubstring, setSearchSubstring] = useState('');
  const [erro, setErro] = useState(null);
  const [sucesso, setSucesso] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

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

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      if (buscarSubstring.trim() === '') {
        setErro('Preencha o campo de busca');
      } else {
        setErro(null); 
      }
    }
  };
  
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCurrentPage(1);
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
      setCurrentPage(1);
    } catch (error) {
      console.error(error.message);
      setErro('Falha ao executar requisição. Por favor, tente novamente mais tarde.');
    }
  };

  useEffect(() => {
    const dadosFiltrados = exibirDados(fakeData, buscarSubstring);
    const contador = dadosFiltrados.length;
    setContadorRetorno(contador);
    setCurrentPage(1);
  }, [fakeData, buscarSubstring, setContadorRetorno]);

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

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = exibirDados(fakeData, buscarSubstring).slice(indexOfFirstItem, indexOfLastItem);

  return (

    <div className='aplicacao'>
      <h2>Gerador de Dados Customizado </h2>
      <h1>Faker 1.0</h1>
      <Inputs className='inputs'>
        <Form onSubmit={handleSubmit}>
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
          <Botao type="submit">Obter Dados Falsos Personalizados</Botao>
        </Form>
      </Inputs>


      {erro && <ErroMessage>{erro}</ErroMessage>}
      {sucesso && <SuccessMessage>{sucesso}</SuccessMessage>}

      <Resultados>
        {currentItems.map((dados, index) => (
          <div key={index} className="conjuntoDados">
            <h3>Conjunto de Dados {index + 1}</h3>
            {Object.entries(dados).map(([chave, valor]) => (
              <p key={chave}>{chave === 'address' ? `Rua: ${valor.street} ${valor.streetName}, Cidade: ${valor.city}, País: ${valor.country}` : `${chave}: ${valor}`}</p>
            ))}
          </div>
        ))}
      </Resultados>

      <Pagination>
        <button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>Anterior</button>
        <span>Página {currentPage}</span>
        <button onClick={() => setCurrentPage(currentPage + 1)} disabled={currentItems.length < itemsPerPage || (currentPage * itemsPerPage >= contadorRetorno)}>Próxima</button>
        <span>Total de Páginas: {Math.ceil(contadorRetorno / itemsPerPage)}</span>
      </Pagination>

      <BuscaSubstring>
        <div className="input-group">
          <label htmlFor="searchSubstring">Buscar por Substring:</label>
          <input type="text" id="searchSubstring" name="searchSubstring" value={buscarSubstring} onChange={handleInputChange} placeholder="Substring" />
        </div>
      </BuscaSubstring>

      {erro && buscarSubstring.trim() === '' && <ErroMessage>{erro}</ErroMessage>}
      

      {buscarSubstring && contadorRetorno >= 0 && (
        <Contador className="Contador">
          <ContadorResultadosEncontrados quantidadeResultados={contadorRetorno} />
        </Contador>

      )}


    </div>

  );
}

const Contador = styled.div`
margin-top: 15px;
display: flex;
  flex-direction: column;
  align-items: center;

`;
const BuscaSubstring = styled.div`
margin-top: 15px;
display: flex;
  flex-direction: column;
  align-items: center;

`;

const Inputs = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;


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
  margin-top: 5px;
  
`;

const ErroMessage = styled.div`
  color: red;
  font-size: 14px;
  margin-top: 10px;
  margin-button: 10px;
  text-align: center;
`;

const SuccessMessage = styled.div`
  color: green;
  font-size: 14px;
  margin-top: 10px;
  margin-button: 10px;
  text-align: center; 
`;

const Pagination = styled.div`
margin-top: 10px;

  display: flex;
  justify-content: center;
  align-items: center;

  button {
    margin: 0 5px;
    cursor: pointer;
  }

  button:disabled {
    cursor: not-allowed;
  }
`;

const Resultados = styled.div`
  max-height: 600px;
  max-width: 400px;
  overflow-y: auto;
  margin: 0 auto;
  background-color: #f2f2f2;
  border: 2px solid black;
`;

export default App; 
