import React, { createRef, useEffect, useState } from 'react';
import { Icon } from '@iconify/react';
import ScrollToBottom from 'react-scroll-to-bottom';
import EmojiPicker from 'emoji-picker-react';
import { toast } from 'react-toastify';

export const Chats = (props) => {
    const {socket, room, user} = props;
    const inputRef = createRef();
    const [currentPosition, setCurrentPosition] = useState('')
    const [message, setMessage] = useState('');
    const [messageList, setMessageList] = useState([]);
    const [openEmoji, setOpenEmoji] = useState(false);

    // const [isLike, setIsLike] = useState(false);



  async function HandelSend(){
    try {
        const messageBody = {
            message,
            room,
            user,
            // like : [],
            time : new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes()
        }
        setMessageList((prev)=>[...prev, messageBody]);
        await socket.emit('send_message',messageBody);
        setMessage('');
        setOpenEmoji(false);
    } catch (error) {
        toast.error("Somthing Went Wrong ! please try again.")
        return;
    }
  }

  useEffect(()=>{
    socket.on('receive_message',(data)=>{
        setMessageList((prev)=>[...prev, data]);
    });
  },[socket]);


  useEffect(()=>{
    inputRef.current.selectionEnd = currentPosition;
  },[currentPosition]);


function HandelAddEmoji(e){
    try{
        const ref = inputRef.current;
        ref.focus();
        const start = message.substring(0,ref.selectionStart);
        const end = message.substring(ref.selectionStart);
        setMessage(start + e.emoji + end);
        setCurrentPosition(start.length + e.emoji.length)
    }catch(err){
        toast.error("Somthing Went Wrong ! please try again.");
        return;
    }
}

  return (
    <div className='w-[100%] md:w-[60%] lg:w-[40%] h-full md:h-[80%] lg:h-[80%] bg-[#bbb]'>
        <div className='chat-header h-16 px-2 w-full flex items-center gap-3 bg-[#666]'>
            <div className='h-10 aspect-square bg-pink-500 font-semibold rounded-full text-2xl flex justify-center items-center'>
                <Icon icon="el:group" width="25" height="25"  style={{color: '#303030'}} />
            </div>
            <p className='text-3xl font-semibold text-white'>
            Group Chats
            </p>
        </div>
        <div className='chat-body h-[calc(100%-4rem)] w-full flex flex-col justify-between'>
                <div className='message-body scrollbar-thumb-slate-600 scrollbar-track-transparent p-2 h-full'>
            <ScrollToBottom scroller={() => Infinity} className='w-full h-full scrollbar-track-slate-950'>
                    {messageList.map((sms,i)=>(
                    <>
                        {sms.user === user?(
                            <div key={i} className='flex gap-2 justify-end m-3'>
                                {/* <div className='h-8 aspect-square bg-[#4dd8ff] rounded-full flex justify-center items-center'>{user.substring(0,2).toUpperCase()}</div> */}
                                <div className='w-[70%] bg-[#dedede] p-2 rounded-br-md rounded-bl-md rounded-tl-md'>
                                    {/* <p className='text-xl font-semibold'>{'~'}{sms.user}</p> */}
                                    <p className=''>{sms.message}</p>
                                    <p className='text-right text-[12px]'>{sms.time}</p>
                                </div>
                            </div>
                        ):(
                            <div key={i} className='w-full gap-2 my-3'>
                                <div className='w-full'>
                                    <div className='flex w-full gap-2'>
                                        <div className='h-8 aspect-square bg-[#4dd8ff] rounded-full flex justify-center items-center'>{sms.user.substring(0,2).toUpperCase()}</div>
                                        <div className='w-[70%] bg-[#dedede] p-2 rounded-br-md rounded-bl-md rounded-tr-md'>
                                            <p className='text-xl font-semibold'>{'~'}{sms.user}</p>
                                            <p className=''>{sms.message}</p>
                                            <p className='text-right text-[12px]'>
                                                {/* <span><Icon icon="mdi:like" width="25" height="25"  style={{color: 'white'}} /></span> */}
                                                {sms.time}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                {/* <div className='w-full pl-14'>
                                    {messageList[i].like.includes(user)?(
                                        <Icon icon="mdi:like" width="30" height="30"  style={{color: 'white'}} />
                                    ):(<div >like</div>)} {messageList[i].like.length}
                                </div> */}
                            </div>
                        )}
                    </>
                ))}
            </ScrollToBottom>
                </div>
            <div className='p-2 w-full flex gap-2'>
                {/* <input onChange={(event)=>setMessage(event.target.value)} className='w-full' placeholder='Type Here.....'/> */}
                <div className='w-full flex items-center gap-2 relative'>
                    <textarea ref={inputRef} value={message} onChange={(event)=>setMessage(event.target.value)} className='scrollbar-none w-full py-2 pl-2 pr-5 resize-none rounded-md' rows='2'placeholder='Message.....'></textarea>
                    <Icon onClick={()=>{setOpenEmoji(prev=>!prev);inputRef.current.focus()}} className='absolute right-0 cursor-pointer' icon="mdi:emoji" width="30" height="30"  style={{color: '#303030'}} />
                    <div className='w-[80%] absolute bottom-full right-0'><EmojiPicker onEmojiClick={(event)=>{HandelAddEmoji(event)}} className='w-full' open={openEmoji} /></div>
                </div>
                <button onClick={()=>HandelSend()} className='p-3 bg-[#ffffff] rounded-full'>
                    <Icon icon="material-symbols:send" width="30" height="30"  style={{color: '#2e74ff'}} />
                </button>
            </div>
        </div>
    </div>
  )
}
