import React from 'react';
import styled from 'styled-components'; 

function ContadorResultadosEncontrados({ quantidadeResultados }) {
  return (
    <Contador> 
      <h2>Quantidade de Resultados Encontrados : {quantidadeResultados}</h2>
    </Contador>
  );
}

const Contador = styled.div`
  margin-top: 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 15px;
`;

export default ContadorResultadosEncontrados;
