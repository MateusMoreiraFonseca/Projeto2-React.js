// ErroComponent.js
import React from 'react';
import styled from 'styled-components';

const ErroMessage = styled.div`
  color: red;
  font-size: 14px;
  margin-top: 10px;
  margin-bottom: 10px;
  text-align: center;
`;

const ErroComponent = ({ erro }) => {
  return erro ? <ErroMessage>{erro}</ErroMessage> : null;
};

export default ErroComponent;
