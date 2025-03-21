import React, { createContext, useContext, useEffect, useState } from 'react';
import socketIO from 'socket.io-client';

const SOCKET_URL = process.env.REACT_APP_API_URL;

console.log(process.env.REACT_APP_API_URL)

// Cria o contexto
const SocketContext = createContext();

// Provedor do contexto
export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Cria a conexão com o Socket.IO
    const socketInstance = socketIO(SOCKET_URL, {
      autoConnect: false, // Não conecta automaticamente
    });

    // Conecta ao Socket.IO
    socketInstance.connect();
    setSocket(socketInstance);

    // Desconecta ao desmontar o componente
    return () => {
      socketInstance.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export const useSocket = () => {
  return useContext(SocketContext);
};