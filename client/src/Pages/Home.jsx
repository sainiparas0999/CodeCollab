import React ,{useState} from "react";
import CodeImage from "../assets/Images/code-sync.png"
import { v4 as uuidv4 } from 'uuid';
import toast from 'react-hot-toast'
import { useNavigate } from "react-router-dom";
export default function Home(){
   const navigate = useNavigate();
  const [RoomId , setRoomId]= useState('')
  const [userName , setUserName] = useState('')
     const createNewRoom = (e) =>{
        e.preventDefault();
        const Id = uuidv4();
        console.log(Id);
        setRoomId(Id);
        toast.success('Created a new Room')
     }

     const joinRoom = (e) =>{
 
      if(!RoomId || !userName){
         toast.error('RoomId & Username is required');
         return ;
      }
 
      navigate(`/editor/${RoomId}`,
         {
            state :{
                   userName,
            }
         }
      );
     }

        const hanldeInputEnter = (e) =>{
         
         if( e.code === 'Enter'){
            joinRoom();
         }

        }


     return(
        <div className="w-screen h-screen bg-[#1c1e29] flex justify-center items-center">

        <div className=" w-[400px] max-w-9/10 flex flex-col   bg-[#282a36] text-white p-[20px] rounded-[10px]">

           <div className="h-[80px] mb-[20px] mt-0">
            <img src={CodeImage} alt="Nhi Mili Image" loading="lazy" height={40} width={250}/>
           </div>

           <p className="mb-[20px] text-[20px]">Paste invitation Id:</p>

           <div className="flex flex-col gap-2 text-black">

            <input 
             type="text"
             placeholder="Room Id"
             value={RoomId}
             onKeyUp={hanldeInputEnter}
             onChange={(e) => setRoomId(e.target.value)}
             className="p-[10px] rounded-[5px] outline-none border-none bg-[#eee] text-[16px]
             font-bold "
             />

            <input 
             type="text"
             placeholder="USERNAME"
             value={userName}
             onKeyUp={hanldeInputEnter}
             onChange={(e) => setUserName(e.target.value)}
             className="p-[10px] rounded-[5px] outline-none border-none bg-[#eee] text-[16px]
             font-bold"
             />

             <button 
              onClick={joinRoom}
             className=" border-none p-[7px] rounded-[5px] cursor-pointer text-[20px] bg-[#4aed88] w-[100px] ml-auto hover:bg-[#2b824c] duration-200">
                 Join
             </button>
           </div>
           
           <p className="mt-3">If you don't have an invite then create 
            <a href="" 
               onClick={createNewRoom}
            className="text-[#4aed88] underline ml-2 hover:text-[#2b824c] duration-200">new room</a>
           </p>

        </div>
       
    </div>
     )
}