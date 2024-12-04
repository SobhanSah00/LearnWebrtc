import  { createContext,useContext,useMemo } from 'react'

const PeerContext = createContext(null);

export const usePeer = () => useContext(PeerContext)

export const PeerProvider = (props) => {

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

    

    
    return (
        <PeerContext.Provider value={{peer,createOffer,createAnswer}}>
            {children}
        </PeerContext.Provider>
    )
}

