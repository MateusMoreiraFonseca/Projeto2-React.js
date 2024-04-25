import React, { useContext, useState, useEffect, useRef } from 'react';
import ContadorResultadosEncontrados from './ContadorResultadosEncontrados';
import styled from 'styled-components';
import { DataContext } from './DataContext';
import ErroComponent from './ErroComponent';

function App() {
  const { fakeData, setFakeData, contadorRetorno, setContadorRetorno } = useContext(DataContext);

  const [quantidade, setQuantidade] = useState(1);
  const [gender, setGender] = useState('');
  const [birthdayStart, setBirthdayStart] = useState('');
  const [birthdayEnd, setBirthdayEnd] = useState('');
  const [buscarSubstring, setSearchSubstring] = useState('');
  const [sucesso, setSucesso] = useState(null);
  const [paginalAtual, setCurrentPage] = useState(1);
  const [itensNaPagina] = useState(10);
  const resultadosRef = useRef(null);
  const [erroRequisicao, setErroRequisicao] = useState(null);
  const [erroBusca, setErroBusca] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let valorValidado = value;

    if (name === 'quantidade' && isNaN(value) || parseInt(value) < 0) {
      valorValidado = 0;
    }

    switch (name) {
      case 'quantidade':
        setQuantidade(valorValidado);
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

    setErroBusca(null)
    setErroRequisicao(null);
    setSucesso(null)
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCurrentPage(1);
    if (quantidade <= 0) {
      setErroRequisicao('Por favor, insira uma quantidade válida a ser gerada.');
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
      setCurrentPage(1);
    } catch (error) {
      console.error(error.message);
      setErroRequisicao('Falha ao executar requisição. Por favor, tente novamente mais tarde.');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      if (buscarSubstring.trim() === '') {
        setErroBusca('Campo de busca vazio. Por favor, insira uma substring.');
      } else {
        setErroBusca(null);
      }
    }
  };

  useEffect(() => {
    const dadosFiltrados = exibirDados(fakeData, buscarSubstring);
    const contador = dadosFiltrados.length;
    setContadorRetorno(contador);
    setCurrentPage(1);

    const temResultados = contador > 0;

    if (resultadosRef.current) {
      resultadosRef.current.style.borderStyle = temResultados ? 'solid' : 'none';
    }
  }, [fakeData, buscarSubstring, setContadorRetorno]);


  const exibirDados = (arrayDados, substring) => {
    return substring
      ? arrayDados.filter((dados) =>
        Object.values(dados).some(
          (valor) =>
            typeof valor === 'string' && valor.toLowerCase().includes(substring)
        )
      )
      : arrayDados;
  };

  const indexOfLastItem = paginalAtual * itensNaPagina;
  const indexOfFirstItem = indexOfLastItem - itensNaPagina + 1;
  const itemAtual = exibirDados(fakeData, buscarSubstring).slice(
    indexOfFirstItem - 1,
    indexOfLastItem
  );

  return (
    <Tudo className='aplicacao'>
      <Titulo>
        <h1>Gerador de Dados Pessoais Falsos</h1>
        <h1>Faker 1.0</h1>
      </Titulo>
      <Corpo>
        <Inputs className='inputs'>
          <Form onSubmit={handleSubmit}>
            <div className='input-group'>
              <label htmlFor='quantidade'>Quantidade de registros a ser gerado:</label>
              <input
                type='number'
                id='quantidade'
                name='quantidade'
                value={quantidade}
                onChange={handleInputChange}
              />
            </div>
            <div className='input-group'>
              <label htmlFor='gender'>Gênero:</label>
              <select id='gender' name='gender' value={gender} onChange={handleInputChange}>
                <option value=''>Qualquer</option>
                <option value='male'>Masculino</option>
                <option value='female'>Feminino</option>
              </select>
            </div>
            <Botao type='submit'>Obter Dados Falsos Personalizados</Botao>
          </Form>
        </Inputs>
        {erroRequisicao && <ErroComponent erro={erroRequisicao} />}
        {sucesso && <SuccessMessage>{sucesso}</SuccessMessage>}

      </Corpo>

      <BuscaSubstring>
        <div className='input-group'>
          <label htmlFor='searchSubstring'>Buscar por Substring:</label>
          <input
            type='text'
            id='searchSubstring'
            name='searchSubstring'
            value={buscarSubstring}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder='Substring'
          />
        </div>
      </BuscaSubstring>

      {erroBusca && <ErroComponent erro={erroBusca} />}

      {buscarSubstring && contadorRetorno >= 0 && (

        <ContadorResultadosEncontrados quantidadeResultados={contadorRetorno} />

      )}

      <Resultados ref={resultadosRef}>
        {itemAtual.map((dados, index) => (
          <div key={index} className='conjuntoDados'>
            <hr /> {/* Linha de separação */}
            <table>
              <tbody>
                {Object.entries(dados).map(([chave, valor]) => (
                  <tr key={chave}>
                    <td>
                      {chave === 'address' ?
                        'Endereço' :
                        chave === 'id' ? 'Id' :
                          chave === 'firstname' ? 'Nome' :
                            chave === 'lastname' ? 'Sobrenome' :
                              chave === 'email' ? 'Email' :
                                chave === 'phone' ? 'Telefone' :
                                  chave === 'birthday' ? 'Data de Nascimento' :
                                    chave === 'gender' ? 'Gênero' :
                                      chave.charAt(0).toUpperCase() + chave.slice(1)
                      }
                    </td>
                    <td>
                      {chave === 'address' ?
                        `Rua: ${valor.street} ${valor.streetName}, Cidade: ${valor.city}, País: ${valor.country}`
                        : valor}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <hr /> {/* Linha de separação */}
          </div>
        ))}
      </Resultados>

      <Footer>
        <Pagination>
          <button onClick={() => setCurrentPage(paginalAtual - 1)} disabled={paginalAtual === 1}>
            Anterior
          </button>
          <span>Página {paginalAtual}</span>
          <button
            onClick={() => setCurrentPage(paginalAtual + 1)}
            disabled={itemAtual.length < itensNaPagina || paginalAtual * itensNaPagina >= contadorRetorno}
          >
            Próxima
          </button>
          <span>Total de Páginas: {Math.ceil(contadorRetorno / itensNaPagina)}</span>
        </Pagination>

        <Assinatura>
          Mateus Moreira Fonseca © Projeto2 da Disciplina Full Stack-UTFPR
        </Assinatura>

      </Footer>

    </Tudo>
  );
}

const Tudo = styled.h1`
  background-color: #00b8ab;
`;

const Titulo = styled.h1`
  background-color: #00b8ab;
  font-size: 24px;
  margin-top: 10px;
  align-items: center;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Corpo = styled.div`
  display: flex;  
  align-items: center;
  background-color: #00b8ab;
  display: grid;
  justify-content: center;
`;

const Resultados = styled.div`
  max-height: 600px;
  max-width: 400px;
  overflow-y: auto;
  margin: 0 auto;
  background-color: #f2f2f2;
  font-size: 16px;
  margin-top: 10px;
  margin-botton: 10px;

`;


const Footer = styled.h1`
  background-color: #00b8ab;  
  margin: 10px auto;
`;

const Assinatura = styled.footer`
  background-color: #101e36;
  color: #fff;
  padding: 10px;
  font-size: 12px;
  text-align: center;
`;


const BuscaSubstring = styled.div`
  margin-top: 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 22px;
  margin-bottom: px;
`;

const Inputs = styled.div`
  display: flex;
  flex-direction: column;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  font-size: 20px;
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
  margin-bottom: 5px;
`;

const SuccessMessage = styled.div`
  color: green;
  font-size: 14px;
  margin-top: 10px;
  margin-bottom: 10px;
  text-align: center;
`;

const Pagination = styled.div`
  font-size: 14px;
  
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
  margin-bottom: 10px;
`;





export default App;
