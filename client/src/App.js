import React, { useEffect, useState } from 'react';
import io from 'socket.io-client'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import {base_url} from './utils/constant';
import { Chats } from './component/Chats';
const socket = io.connect(base_url);

function App() {
  const [showChat, setShowChat] = useState(false);
  // const [userList, setUserList] = useState([]);
  const [user_id, setUser_Id] = useState('');
  const [user,setUser] = useState('');
  const [room,setRoom] = useState('');

  async function Handel_Join_Room(){
    try {
      if(room !== '' && user!== ''){
        await socket.emit('join_room',{room,user});
        setShowChat(true);
        // setUserList(prev=>[...prev,user]);
        toast.success("sucessfully Joined Chat");
      }
    } catch (error) {
      toast.error("Somthing Went Wrong ! please try again.");
    }
  }

  // useEffect(()=>{
  //   socket.on('new_user',new_user=>{
  //     console.log(new_user);
  //   })
  // },[socket]);
  
  
  return (<>
    <div className="App w-full h-[100vh] flex justify-center items-center">
      {!showChat?(
        <div className='join-room w-[90%] p-5 md:w-[60%] lg:w-[40%] bg-slate-400 rounded-md'>
          <div className='join-room-header py-3 mb-10 border-b-2 border-black text-3xl text-center font-bold'>
              Join Room For Live Chats
          </div>
          
          {/* <div></div> */}
          <div className='join-room-body w-full flex flex-col gap-2 items-center'>
            <input type='text' value={user} onChange={(event)=>setUser(event.target.value)} className='p-1 h-10 w-full rounded-md outline-none' placeholder='Enter Your Nick Name' required/>
            <br />
            <input type='number' value={room} onChange={(event)=>setRoom(event.target.value)} className='p-1 h-10 w-full rounded-md outline-none' placeholder='Enter Room ID' required/>
            <br />
            <button  onClick={()=>Handel_Join_Room()} className='px-3 py-1 rounded-md border-2 border-black bg-[#002fff] text-xl font-semibold text-white'>Send</button>
          </div>
        </div>
      ):(
        // <div className='w-full h-[100vh]'>
          <Chats socket={socket} 
                room={room} 
                user={user} 
                // userList={userList}
          />
        // </div>
      )}
    </div>
    <ToastContainer
    // position="top-right"
    position='bottom-center'
    autoClose={2000}
    // hideProgressBar={false}
    // newestOnTop={false}
    // closeOnClick
    // rtl={false}
    // pauseOnFocusLoss
    // draggable
    // pauseOnHover
    theme="colored"
  />
  </>);
}

export default App;
