import React, { useContext, useState, useEffect, useRef } from 'react';
import ContadorResultadosEncontrados from './ContadorResultadosEncontrados';
import styled from 'styled-components';
import { DataContext } from './DataContext';
import ErroComponent from './ErroComponent';
import moonImage from './bluemoon.png';
import useInput from './useInput';


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

    if ((name === 'quantidade' && (isNaN(value) || parseInt(value) < 0))) {
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

    limparMensagens();
  };

  const limparMensagens = () => {
    setErroBusca(null);
    setErroRequisicao(null);
    setSucesso(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCurrentPage(1);
    limparMensagens();
    setFakeData([]);
    if (quantidade <= 0) {
      setErroRequisicao('Por favor, insira uma quantidade válida a ser gerado.');
      return;
    }
    const apiUrl = `https://fakerapi.it/api/v1/persons?_quantity=${quantidade}&_gender=${gender}&_birthday_start=${birthdayStart}&_birthday_end=${birthdayEnd}`;
    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();

      if (!data || !data.data) {
        setErroRequisicao('Dados inválidos retornados pela API.');
        return;
      }

      for (const pessoa of data.data) {
        let imageUrl = '';
        if (pessoa.gender === 'male') {
          const responseDog = await fetch('https://dog.ceo/api/breeds/image/random');
          const responseDataDog = await responseDog.json();
          imageUrl = responseDataDog.message;
        } else {
          const responseCat = await fetch('https://api.thecatapi.com/v1/images/search?limit=1');
          const responseDataCat = await responseCat.json();
          imageUrl = responseDataCat[0].url;
        }
        if (!pessoa.Foto) {
          pessoa.Foto = imageUrl;

          // Estou tendo problema com a atribuicao, alem de exibir a imagem no html , tbm exibi o link
        }
        delete pessoa.image;
      }

      localStorage.setItem('fakeData', JSON.stringify(data.data));
      setSucesso(`Sucesso! Gerado ${data.data.length} Dados Cadastrais`);
      setFakeData(data.data);
      setCurrentPage(1);
    } catch (error) {
      console.error(error.message);
      setErroRequisicao('Falha ao executar requisição. Por favor, tente novamente mais tarde.');
      setSucesso(null);
      setErroBusca(null);
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

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    limparMensagens();
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

  useEffect(() => {
    limparMensagens();
  }, [quantidade, gender, birthdayStart, birthdayEnd, buscarSubstring]);

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
  const quantidadeInput = useInput(1);
  return (
    
    <Tudo className='aplicacao'>
      <BlocoExterno>
        <Titulo>
          <h2>Gerador de Dados Pessoais Falsos</h2>
          <MoonImage src={moonImage} alt="Blue Moon" />
          <h2>BlueMoon 1.0</h2>
        </Titulo>
        <BlocoInterno>

          <Inputs className='inputs'>
            <Form onSubmit={handleSubmit}>
              <div className='input-group'>
                <label htmlFor='quantidade'>Quantidade de registros a ser gerado:</label>
                <input
                  type='number'
                  id='quantidade'
                  name='quantidade'
                  value={quantidadeInput.value}
                  onChange={quantidadeInput.onChange}
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

            {erroRequisicao && <ErroComponent erro={erroRequisicao} />}
            {sucesso && <SuccessMessage>{sucesso}</SuccessMessage>}

          </Inputs>

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

              <ConjuntoDados key={index} className='conjuntoDados'>
                <hr />
                <table>
                  <tbody>
                    {Object.entries(dados).map(([chave, valor]) => (
                      <tr key={chave}>
                        <td>
                          {chave === 'address' ? 'Endereço' :
                            chave === 'id' ? 'Id' :
                              chave === 'firstname' ? 'Nome' :
                                chave === 'lastname' ? 'Sobrenome' :
                                  chave === 'email' ? 'Email' :
                                    chave === 'phone' ? 'Telefone' :
                                      chave === 'birthday' ? 'Data de Nascimento' :
                                        chave === 'gender' ? 'Gênero' :
                                          chave.charAt(0).toUpperCase() + chave.slice(1)}
                        </td>
                        <td>
                          {chave.trim() === 'Foto' ? (
                            <img src={valor} alt={`Foto ${index}`} style={{ maxWidth: '100px' }} />
                          ) : (
                            chave === 'address' ?
                              `Rua: ${valor.street} ${valor.streetName}, Cidade: ${valor.city}, País: ${valor.country}` :
                              valor
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </ConjuntoDados>
            ))}
          </Resultados>



          <Paginacao>
            <button onClick={() => handlePageChange(paginalAtual - 1)} disabled={paginalAtual === 1}>
              Anterior
            </button>
            <span>Página {paginalAtual}</span>
            <button
              onClick={() => handlePageChange(paginalAtual + 1)}
              disabled={itemAtual.length < itensNaPagina || paginalAtual * itensNaPagina >= contadorRetorno}
            >
              Próxima
            </button>
            <span>Total de Páginas: {Math.ceil(contadorRetorno / itensNaPagina)}</span>
          </Paginacao>
        </BlocoInterno>
      </BlocoExterno>
      <Footer>
        <Assinatura>
          Mateus Moreira Fonseca © Projeto2 da Disciplina Full Stack-UTFPR
        </Assinatura>
      </Footer>
    </Tudo>
  );
}


const ConjuntoDados = styled.div`
  background-color: #001f3f; 
  margin: 0px;
  padding: 0; 
  `;

const Tudo = styled.div`
background-color: #001f3f; 
min-height: 98vh;
position: relative;
display: flex;
flex-direction: column;
word-break: break-word;
text-align: center;
align-content: start;
border-radius: 10px;

`;

const BlocoExterno = styled.div`
  background-color: #00BFF3;
  border: 2px solid #000;
  padding: 20px;
  width: 50%;
  height: 80vh;
  self-align:top;
  margin: auto;
  margin-bottom: 2.5rem;
  border-radius: 10px;
  position: static;
  top: 50%; 
  left: 50%;
  align-content: start;
  `;

const Footer = styled.footer`
  background-color: #00BFF3;  
  width: 100%;
  height: 2.5rem;   
  position: absolute;
  bottom: 0;
`;

const BlocoInterno = styled.div`
  border: 2px solid #000; 
  border-top-left-radius: 10px; 
  border-bottom-left-radius: 10px;
  overflow: auto; 
  background-color: #00BFF3;  
  height: 50vh;
  align-content: center;
  
`;

const Titulo = styled.div`
  background-color: #00BFF3;
  font-size: 15px;
  margin-top: 10px;
  align-items: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #001f3f ;
  
  
`;

const MoonImage = styled.img`
  width: 100px;
  height: auto;
  margin-bottom: 10px;
`;

const Resultados = styled.div`
  max-height: 600px;
  max-width: 400px;
  overflow-y: auto;
  margin: 0 auto;
  background-color: #00BFF3;
  font-size: 16px;
  margin-top: 0px;
  margin-bottom: 15px;
  border-collapse: collapse;
  border-spacing: 0;
  
  
  tr:nth-child(even) {
    background-color: #f2f2f2; 
  }
  tr:nth-child(odd) {
    background-color: #ffffff; 
  }
  table {
    width: 100%;
  }
  td {
    width: 10%; 
    text-align: left; 
  }
  tr:hover {
    background-color: #ddd; 
`;


const Assinatura = styled.footer`
  background-color: #101e36;
  color: #fff;
  padding: 10px;
  font-size: 12px;
  text-align: center;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px; 
`;

const BuscaSubstring = styled.div`
  margin-top: 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 22px;
  margin-bottom: 15px;
`;

const Inputs = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #00BFF3;
  display: grid;
  justify-content: center;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  font-size: 20px;
  border-radius: 10px;
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

const Paginacao = styled.div`
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
