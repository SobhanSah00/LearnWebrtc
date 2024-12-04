import { useEffect,useCallback, useState } from 'react'
import {useSocket} from "../../Providers/Socket"
import { usePeer } from "../../Providers/Peer"
import ReactPlayer from 'react-player';

function Room() {
    const {socket} = useSocket();
    const {peer,createOffer,createAnswer,setRemoteAns,sendStream,remoteStream} = usePeer()


    const [myStream,setMystream] = useState(null)
    const [remoteEmailId,setRemoteEmailId] = useState()


    const newUserJoinedAfterOneUserJoined = useCallback(async (data) => {
        // console.log("recived data : ",JSON.stringify(data, null, 2))
        const {email} = data
        console.log("new user joined",email);   
        const offer = await createOffer()
        socket.emit('offerForCall-User',{email,offer})
        setRemoteEmailId(email)
    },[createOffer,socket])

    const handelIncommingCall = useCallback( async (data) => {
      const {from,offer} = data;
      console.log("incomming call from",from,offer)
      const ans = await createAnswer(offer)
      socket.emit('call-accepted',{email : from,ans})
      setRemoteEmailId(from)

      },[createAnswer,socket])

    const handelCallAccepted = useCallback(async (data) => {
      const {ans} = data;
      console.log("call got accepted",ans)
      await setRemoteAns(ans)
      // sendStream(myStream)

    } ,[setRemoteAns])

    const getUserMediaStream = useCallback(async() => {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      })
      setMystream(stream)
    }, [])

    const handelNegotiation = useCallback(() => {
        // console.log("negotition needed");
        const loacalOffer = peer.localDescription;
        socket.emit('offerForCall-User',{email : remoteEmailId,offer : loacalOffer})
    }, [peer.localDescription, remoteEmailId, socket])

    useEffect(() => {
      socket.on('user-joined', newUserJoinedAfterOneUserJoined)
      socket.on('incomming-call',handelIncommingCall)
      socket.on('call-accepted',handelCallAccepted);

      
      return () => {
        socket.off('user-joined', newUserJoinedAfterOneUserJoined) //securitu purpose and clean up also 
        socket.off('incomming-call',handelIncommingCall)
        socket.off('call-accepted',handelCallAccepted);
      }
    }, [socket,newUserJoinedAfterOneUserJoined,handelIncommingCall,handelCallAccepted])
    
    useEffect(() => {
      peer.addEventListener('negotiationneeded', handelNegotiation)
      return () => {
        peer.removeEventListener('negotiationneeded', handelNegotiation)
      }
    }, [handelNegotiation, peer])

    useEffect(() => {
      getUserMediaStream()
    },[getUserMediaStream])

  return (
    <>
        <div className='Room-page-container'>
            <h1>
                Room page
            </h1>
            <h4>you are connected to {remoteEmailId}</h4>
            <button onClick={(e) => sendStream(myStream)}>send my video</button>
            <ReactPlayer url={myStream} playing muted />
            <ReactPlayer url={remoteStream} playing muted />
        </div>
    </>
  )
}

export default Room