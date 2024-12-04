import {Routes,Route} from "react-router-dom"
import Home from "./pages/Home/Home"
import { SocketProvider } from "./Providers/Socket"
import Room from "./pages/Room/Room"
import {PeerProvider} from "./Providers/Peer"

function App() {
  return (
    // <div>App</div>
    <SocketProvider>
      <PeerProvider>
        <Routes>
            <Route path="/" element={<Home/>} /> 
            <Route path="/room/:roomId" element={<Room/>} />
        </Routes>
      </PeerProvider>
    </SocketProvider>
  )
}

export default App