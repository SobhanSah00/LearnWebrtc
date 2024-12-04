import './Home.css';
// import {useSocket} from "D:/LearnWebrtc/frontend/src/Providers/Socket"
import { useSocket } from "../../Providers/Socket";
import { useState,useEffect, useCallback } from 'react';
import {useNavigate} from "react-router-dom"

function Home() {

  const [emailId,setEmail] = useState()
  const [roomId,setRoomId] = useState()
  const {socket} = useSocket()
  const navigate = useNavigate()

  const handelRoomJoined = useCallback(({roomId}) => {
    navigate(`/room/${roomId}`)
  },[navigate])

  useEffect(() => {
    socket.on('joined-room',handelRoomJoined)
    return () => {
      socket.off('joined-room',handelRoomJoined)
    }
  },[socket,handelRoomJoined])

  const handelJoinRoom = () => {
    socket.emit('join-room', {
      email: emailId,
      roomId: roomId
    })
  }
  return (
    <div className="HomePageContainer">
      <div className="FormContainer">
        <input value={emailId} onChange={e => setEmail(e.target.value)} type="email" placeholder="Enter your email" />
        <input value={roomId} onChange={e => setRoomId(e.target.value)} type="text" placeholder="Enter your room number" />
        <button onClick={handelJoinRoom}>Submit</button>
      </div>
    </div>
  );
}

export default Home;
