import React, { useRef,useState,useEffect} from "react";
import styles from "./video.module.css"

function VideoContainer(){
    const videoRef1 = useRef(null)
    const videoRef2 = useRef(null)
    const [stream, setStream] = useState(null);
    const [peerConnection, setPeerConnection] = useState(null);
    const [remoteStream, setRemoteStream] = useState(null);
    const [loaded, setLoaded] = useState(false)
    const servers = {
        iceServers:[
            {
                urls:['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302']
            }
        ]
    }

    useEffect(() => {
        const getMediaStream = async () => {
          try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
            setStream(mediaStream);
            
          } catch (error) {
            console.error('Error accessing media devices:', error);
          }
          
        };
        
        getMediaStream();
        setLoaded(true)
        
      }, []);

    useEffect(() => {
        if (stream && videoRef1.current) {
          videoRef1.current.srcObject = stream;
        }
      }, [stream]);

    useEffect(()=>{
        const createOffer = async () => {
            const pc = new RTCPeerConnection(servers);
            const rs = new MediaStream();
            setPeerConnection(pc)
            setRemoteStream(rs)
            if (videoRef2.current) {
                videoRef2.current.srcObject = rs;

            }
            stream.getTracks().forEach((track) => {
                pc.addTrack(track, stream)
            });
            
            pc.ontrack = (events) => {
                events.streams[0].getTracks().forEach((track) =>{
                    rs.addTrack(track)
                })
            }

            pc.onicecandidate = async (events) =>{
                if(events.canditate){
                    console.log("nic", events.candidate)
                }
            }

            const offer = await pc.createOffer();
            await pc.setLocalDescription(offer)
            console.log(offer)

        }

        
        createOffer();
        
       

      },[loaded])
    
    return(
        <div className={styles.VideoContainer}>
            <video className={styles.videoFeed} ref={videoRef1} autoPlay playsInline></video>
            <video className={styles.videoFeed} ref={videoRef2} autoPlay playsInline></video>
        </div>
    )
}

export default VideoContainer