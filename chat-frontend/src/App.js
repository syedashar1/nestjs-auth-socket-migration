import './App.css';
import { io } from 'socket.io-client';
import { useEffect, useState } from 'react'

function App() {

  const [messages, setMessages] = useState([]) 
  const [messageText, setMessageText] = useState('') 
  const [joinedRoom, setJoinedRoom] = useState(false)
  const [myName, setMyName] = useState('Ashar')
  const [typingDisplay, setTypingDisplay] = useState('')
  const socket = io('http://localhost:3001')

  useEffect(() => {

    socket.emit('findAllMessages' , {} , (res) => {
      console.log('all messages : ',res);
      setMessages(res)
    })

    socket.on('message' , (message) => {
      // console.log('new message' , message);
      // setMessages([...messages , message])

      socket.emit('findAllMessages' , {} , res => setMessages(res) )

    } )

    socket.on('typing' , ({name , isTyping }) => {
      if(isTyping) setTypingDisplay(`${name} is typing...`)
      else setTypingDisplay('')
    } )

  }, [])



  const sendMessageHandler = () => {
    if(messageText==='') return;

    socket.emit('createMessage' , {message : messageText , name : myName } , (res) => {
      setMessageText('')
    })

  }

  const join = () => {
    socket.emit('join' , {name : myName} , (res) => {
      console.log(res);
      setJoinedRoom(true)
    } )
  }

  let timeOut ;
  const handleTyping = () => {
    console.log('typing');
    socket.emit('typing' , {isTyping : true});
    timeOut = setTimeout( ()=> {
      socket.emit('typing' , {isTyping : false})
    } , 2000 )
  }

  return (
    <div className="App">
    {joinedRoom ? <>
      {messages.map(m=><p>
        {m.name} : {m.message}
      </p>)}
      <br/>
      {typingDisplay && <p>{typingDisplay}</p>}
      <input value={messageText} onChange={e=>{
        setMessageText(e.target.value);
        handleTyping();
        }}/>
      <button onClick={sendMessageHandler} >Send</button>
      </> 
      : 
      <div>
        <h1>You need to join first</h1>
      <input value={myName} placeholder='Join room as' onChange={e=>setMyName(e.target.value)}/>
      <button onClick={join} >Send</button>
      </div>}
    </div>
  );
}

export default App;
