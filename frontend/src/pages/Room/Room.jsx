// import { useEffect,useCallback, useState } from 'react'
// import {useSocket} from "../../Providers/Socket"
// import { usePeer } from "../../Providers/Peer"
// import ReactPlayer from 'react-player';

// function Room() {
//     const {socket} = useSocket();
//     const {peer,createOffer,createAnswer,setRemoteAns} = usePeer()


//     const [myStream,setMystream] = useState(null)
//     const newUserJoinedAfterOneUserJoined = useCallback(async (data) => {
//         // console.log("recived data : ",JSON.stringify(data, null, 2))
//         const {email} = data
//         console.log("new user joined",email);   
//         const offer = await createOffer()
//         socket.emit('offerForCall-User',{email,offer})
//     },[createOffer,socket])

//     const handelIncommingCall = useCallback( async (data) => {
//       const {from,offer} = data;
//       console.log("incomming call from",from,offer)
//       const ans = await createAnswer(offer)
//       socket.emit('call-accepted',{email : from,ans})

//       },[createAnswer,socket])

//     const handelCallAccepted = useCallback(async (data) => {
//       const {ans} = data;
//       console.log("call got accepted",ans)
//       await setRemoteAns(ans)

//     } ,[setRemoteAns])

//     const getUserMediaStream = useCallback(async() => {
//       const stream = await navigator.mediaDevices.getUserMedia({
//         video: true,
//         audio: true
//       })
//       setMystream(stream)
//     }, [])

//     useEffect(() => {
//       socket.on('user-joined', newUserJoinedAfterOneUserJoined)
//       socket.on('incomming-call',handelIncommingCall)
//       socket.on('call-accepted',handelCallAccepted);
//       return () => {
//         socket.off('user-joined', newUserJoinedAfterOneUserJoined) //securitu purpose and clean up also 
//         socket.off('incomming-call',handelIncommingCall)
//         socket.off('call-accepted',handelCallAccepted);
//       }
//     }, [socket,newUserJoinedAfterOneUserJoined,handelIncommingCall,handelCallAccepted])
    
//     useEffect(() => {
//       getUserMediaStream()
//     },[getUserMediaStream])

//   return (
//     <>
//         <div className='Room-page-container'>
//             <h1>
//                 Room page
//             </h1>
//             <ReactPlayer url={myStream} playing muted />
//         </div>

//     </>
//   )
// }

// export default Room



import { useEffect, useCallback, useState, useRef } from 'react';
import { useSocket } from "../../Providers/Socket";
import { usePeer } from "../../Providers/Peer";

function Room() {
  const { socket } = useSocket();
  const { peer, createOffer, createAnswer, setRemoteAns } = usePeer();

  const [myStream, setMyStream] = useState(null);
  const videoRef = useRef(null); // Ref for the video element

  const newUserJoinedAfterOneUserJoined = useCallback(async (data) => {
    const { email } = data;
    console.log("new user joined", email);
    const offer = await createOffer();
    socket.emit('offerForCall-User', { email, offer });
  }, [createOffer, socket]);

  const handelIncommingCall = useCallback(async (data) => {
    const { from, offer } = data;
    console.log("incoming call from", from, offer);
    const ans = await createAnswer(offer);
    socket.emit('call-accepted', { email: from, ans });
  }, [createAnswer, socket]);

  const handelCallAccepted = useCallback(async (data) => {
    const { ans } = data;
    console.log("call got accepted", ans);
    await setRemoteAns(ans);
  }, [setRemoteAns]);

  const getUserMediaStream = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      setMyStream(stream);
    } catch (error) {
      console.error("Error accessing media devices:", error);
    }
  }, []);

  useEffect(() => {
    if (myStream && videoRef.current) {
      videoRef.current.srcObject = myStream; // Attach MediaStream to video element
    }
  }, [myStream]);

  useEffect(() => {
    socket.on('user-joined', newUserJoinedAfterOneUserJoined);
    socket.on('incomming-call', handelIncommingCall);
    socket.on('call-accepted', handelCallAccepted);

    return () => {
      socket.off('user-joined', newUserJoinedAfterOneUserJoined);
      socket.off('incomming-call', handelIncommingCall);
      socket.off('call-accepted', handelCallAccepted);
    };
  }, [socket, newUserJoinedAfterOneUserJoined, handelIncommingCall, handelCallAccepted]);

  useEffect(() => {
    getUserMediaStream();
  }, [getUserMediaStream]);

  return (
    <div className='Room-page-container'>
      <h1>Room page</h1>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        style={{ width: '100%', height: 'auto', border: '1px solid black' }}
      />
    </div>
  );
}

export default Room;