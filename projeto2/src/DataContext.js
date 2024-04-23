import React, { createContext, useState } from 'react';

export const DataContext = createContext();


export const DataProvider = ({ children }) => {
  const [fakeData, setFakeData] = useState([]);
  const [contadorRetorno, setContadorRetorno] = useState(0); // Inicialize aqui

  return (
    <DataContext.Provider value={{ fakeData, setFakeData, contadorRetorno, setContadorRetorno }}>
      {children}
    </DataContext.Provider>
  );
};
