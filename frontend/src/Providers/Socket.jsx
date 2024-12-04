import { createContext,useMemo } from "react";
import {io} from "socket.io-client"
import { useContext } from "react";

const SocketContext = createContext(null);

export const useSocket = () => {
    return useContext(SocketContext);
}

export const SocketProvider = ({children}) => {
    // 'http://localhost:8001'
    const socket = useMemo(() => io('http://localhost:8001'),[])
    return (
        <SocketContext.Provider value={{socket}}>
            {children}
        </SocketContext.Provider>
    )
}
    