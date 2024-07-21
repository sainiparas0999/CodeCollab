import react from "react";
import logoImage from "../assets/Images/code-sync.png"
import { useState , useEffect } from "react";
import Client from "../Component/Client.jsx"
import Editor  from "../Component/Editor.jsx";
import { useRef } from "react";
import { useLocation } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useNavigate , Navigate } from "react-router-dom";
import { initSocket } from "../socket.js";
import toast from "react-hot-toast";


function EditorPage(){

    const ACTIONS = {
        JOIN: 'join',
        JOINED: 'joined',
        DISCONNECTED: 'disconnected',
        CODE_CHANGE: 'code-change',
        SYNC_CODE: 'sync-code',
        LEAVE: 'leave',
    };
  
  const socketRef = useRef(null);
  const codeRef = useRef(null);
  const location = useLocation();
  const { roomId } = useParams();
  const reactNavigator = useNavigate();
  const [clients, setClients] = useState([]);

  useEffect(() => {
      const init = async () => {
          socketRef.current = await initSocket();
          socketRef.current.on('connect_error', (err) => handleErrors(err));
          socketRef.current.on('connect_failed', (err) => handleErrors(err));

          function handleErrors(e) {
              console.log('socket error', e);
              toast.error('Socket connection failed, try again later.');
              reactNavigator('/');
          }

          socketRef.current.emit(ACTIONS.JOIN, {
              roomId,
              username: location.state?.userName,
          });

        //   Listening for joined event
          socketRef.current.on(
              'joined',
              ({ clients, username, socketId }) => {
                //  console.log(clients);
                  if (username !== location.state?.username) {
                      toast.success(`${username} joined the room.`);
                      console.log(`${username} joined`);
                  }
                  setClients(clients);
                //   console.log(clients);
                  socketRef.current.emit(ACTIONS.SYNC_CODE, {
                      code: codeRef.current,
                      socketId,
                  });
              }
          );

        //   Listening for disconnected
          socketRef.current.on(
              ACTIONS.DISCONNECTED,
              ({ socketId, username }) => {
                  toast.success(`${username} left the room.`);
                  setClients((prev) => {
                      return prev.filter(
                          (client) => client.socketId !== socketId
                      );
                  });
              }
          );
      };
      init();
      return () => {
          socketRef.current.disconnect();
          socketRef.current.off(ACTIONS.JOINED);
          socketRef.current.off(ACTIONS.DISCONNECTED);
      };
  }, []);

  async function copyRoomId() {
      try {
          await navigator.clipboard.writeText(roomId);
          toast.success('Room ID has been copied to your clipboard');
      } catch (err) {
          toast.error('Could not copy the Room ID');
          console.error(err);
      }
  }

  function leaveRoom() {
      reactNavigator('/');
  }

  if (!location.state) {
      return <Navigate to="/" />;
  }


    return(
        <div className="grid grid-cols-[230px_1fr] h-screen">

            

           <div className="bg-[#1c1e29] p-[16px] text-[#fff] flex flex-col justify-between">

              <div>
              <div className="pb-[10px] border-b-[1px] border-[#424242] border-solid ">
             <img src={logoImage} 
             width={200}/>
           </div> 

            <h1 className="py-5 text-[20px] font-bold">Connected</h1>

             <div className="flex flex-wrap gap-[20px] justify-between">
                
                 {
                    clients.map( (client) => {
                        return(
                            <Client key={client.socketId} userName={client.username}/>
                        )
                    })
                 }

             </div>

              </div>  

              <div className="flex flex-col">

                <button 
                 onClick={copyRoomId}
                className=" border-none p-[7px] rounded-[5px] font-semibold cursor-pointer text-[15px]  w-full mt-[20px] bg-slate-200 text-black">
                  Copy Room Id
                </button>

                <button  
                onClick={leaveRoom}
                className=" mt-[10px] border-none p-[7px] rounded-[5px] font-semibold cursor-pointer text-black text-[15px] bg-[#4aed88] w-full  hover:bg-[#2b824c] duration-200">
                  Leave
                </button>
        
              </div>

           </div>

           <Editor

                socketRef={socketRef}
                roomId={roomId}
                onCodeChange={(code) => {
                    codeRef.current = code;
                }}
           />

        </div>
       
    )
 }

 export default EditorPage ;



