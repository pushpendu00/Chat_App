import React, { useEffect, useState } from 'react'

export const Chats = (props) => {
    const {socket, room, user} = props;

    const [message, setMessage] = useState('');
    const [messageList, setMessageList] = useState([]);



  async function HandelSend(){
    // console.log(userList);
    const messageBody = {
      message,
      room,
      user,
      time : new Date(Date.now()).getHours + ":" + new Date(Date.now()).getMinutes
    }
    setMessageList((prev)=>[...prev, messageBody]);
    await socket.emit('send_message',messageBody);
  }

  useEffect(()=>{
    socket.on('receive_message',(data)=>{
        setMessageList((prev)=>[...prev, data]);
    });
  },[socket]);

  return (
    <div className='w-full md:w-[60%] lg:w-[40%] h-full md:h-[80%] lg:h-[80%] bg-[#b0b0b0]'>
        <div className='chat-header'>Live Chats</div>
        <div className='chat-body h-96 w-full'>
            <div className='message-body'>
                {messageList.map((sms,i)=>(
                    <div>
                        {sms.message} <br />
                    </div>
                ))}
            </div>
        <div className='w-full'>
            <input onChange={(event)=>setMessage(event.target.value)} className='bg-slate-400' placeholder='Type Here.....'/>
             <br />
            <button onClick={()=>HandelSend()} className='px-3 py-1 border-2 border-black'>Send</button>
        </div>
      </div>
    </div>
  )
}
