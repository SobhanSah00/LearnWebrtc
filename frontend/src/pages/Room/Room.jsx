import { useEffect,useCallback } from 'react'
import {useSocket} from "../../Providers/Socket"
import { usePeer } from "../../Providers/Peer"

function Room() {
    const {socket} = useSocket();
    const {peer,createOffer,createAnswer} = usePeer()

    const newUserJoinedAfterOneUserJoined = useCallback(async (data) => {
        // console.log("recived data : ",JSON.stringify(data, null, 2))
        const {email} = data
        console.log("new user joined",email);   
        const offer = await createOffer()
        socket.emit('offerForCall-User',{email,offer})
    },[createOffer,socket])

    const handelIncommingCall = useCallback( async (data) => {
      const {from,offer} = data;
      console.log("incomming call from",from,offer)
      const ans = await createAnswer(offer)
      socket.emit('call-accepted',{email : from,ans})

      },[createAnswer,socket])

    useEffect(() => {
      socket.on('user-joined', newUserJoinedAfterOneUserJoined)
      socket.on('incomming-call',handelIncommingCall)
      return () => {
        socket.off('user-joined', newUserJoinedAfterOneUserJoined) //securitu purpose and clean up also 
        socket.off('incomming-call',handelIncommingCall)
      }
    }, [socket,newUserJoinedAfterOneUserJoined,handelIncommingCall])
    
  return (
    <>
        <div className='Room-page-container'>
            <h1>
                Room page
            </h1>
        </div>

    </>
  )
}

export default Room