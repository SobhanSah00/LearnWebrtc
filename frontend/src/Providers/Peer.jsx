import  { createContext,useCallback,useContext,useEffect,useMemo, useState } from 'react'

const PeerContext = createContext(null);

export const usePeer = () => useContext(PeerContext)

export const PeerProvider = (props) => {

    const [remoteStream,setRemoteStream] = useState(null)

    const { children } = props;
    const peer = useMemo(() => new RTCPeerConnection({
        iceServers: [
            {
                urls: [
                    'stun:stun.l.google.com:19302',
                    'stun:global.stun.twilio.com:3478'

                ]

            }
        ]
    }),[])

    const createOffer = async () => {
        const offer = await peer.createOffer()
        // await peer.setLocalDescription(new RTCSessionDescription({ type: 'offer', sdp: offer}))
        await peer.setLocalDescription(offer)
        return offer
    }

    const createAnswer = async(offer) => {
        await peer.setRemoteDescription(offer)
        const answer = await  peer.createAnswer()
        await peer.setLocalDescription(answer)
        return answer
    }

    const setRemoteAns = async(ans) => {
      await peer.setRemoteDescription(ans)  
    }

    const sendStream = async(stream) => {
        const tracks = stream.getTracks();
        // tracks.forEach(track => peer.addTrack(track, stream))
        for(const track of tracks) {
            peer.addTrack(track, stream)
        }
    }

    const handelTrackEvent = useCallback((e) => {
        const streams = e.streams; // video audio sharing screen type streams
        setRemoteStream(streams[0])
    }, [setRemoteStream])

    // const handelNegotiation = useCallback(() => {
    //     console.log("negotition needed");
    // }, [])

    useEffect(() => {
        peer.addEventListener('track',handelTrackEvent)
        // peer.addEventListener('negotiationneeded', handelNegotiation)
        return () => {
            peer.removeEventListener('track',handelTrackEvent)
            // peer.removeEventListener('negotiationneeded',handelNegotiation)
        }
    },[peer,handelTrackEvent])
    
    return (
        <PeerContext.Provider value={{peer,createOffer,createAnswer,setRemoteAns,sendStream,remoteStream}}>
            {children}
        </PeerContext.Provider>
    )
}

