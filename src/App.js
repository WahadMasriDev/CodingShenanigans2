import React, { useRef, useState } from 'react';
import './App.css';

import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';


import {useAuthState} from 'react-firebase-hooks/auth';
import { useCollectionData} from 'react-firebase-hooks/firestore';

firebase.initializeApp({
  apiKey: "AIzaSyBjtRif6Q0RJWh0Wf4oca3pqysrCenOwaQ",
  authDomain: "a-new-lifestyle.firebaseapp.com",
  projectId: "a-new-lifestyle",
  storageBucket: "a-new-lifestyle.appspot.com",
  messagingSenderId: "592977675771",
  appId: "1:592977675771:web:797451e10e00712d88775e",
  measurementId: "G-6XNH47LJKT"
})

const auth = firebase.auth();
const firestore = firebase.firestore();

 
function App() {

  const [user] = useAuthState(auth);

  return (
    <div className="App">
      <header>
        <h1>⚛️🔥💬</h1>
        <SignOut />
      </header>

      <section>
        {user ? <ChatRoom /> : <SignIn />}
      </section>

    </div>
  );
}

function SignIn(){

  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }
  return(
    <>
    <div><button onClick={signInWithGoogle}>Sign In with Google Here</button></div>
    
    </>
  )
}

function SignOut(){
  return auth.currentUser && (
    <button onClick={()=> auth.signOut()}> Sign Out Here</button>
  )
}

function ChatRoom(){

  const dummy = useRef();
  const messagesRef = firestore.collection('messages');
  const query = messagesRef.orderBy('createdAt').limit(25);

  const [messages] = useCollectionData(query, {idField: 'id'});

  const [formValue, setFormValue] = useState('');

  const sendMessage = async(e) => {
    e.preventDefault();

    const {uid, photoURL } = auth.currentUser;

    await messagesRef.add({
      text: formValue, 
      createdAt:firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL
    });

    setFormValue('');

    dummy.current.scrollIntoView({behavior : 'smooth'});
  }
  return(
    <>
      <main>
        {messages && messages.map(msg => <ChatMessage key={msg.id} message ={msg}/>)}
        <span ref={dummy}></span>
      </main>
      <form onSubmit={sendMessage}>
        <input value={formValue} onChange={(e) => setFormValue(e.target.value)} />
        <button type="submit" disabled={!formValue}>✅</button>
      </form>
    </>
  )
}

function ChatMessage(props){

  const {text, uid, photoURL} = props.message;
  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';
  return(
    <>
      <div className={`message ${messageClass}`}>
        <img src={photoURL|| 'https://api.adorable.io/avatars/23/abott@adorable.png'}/>
        <p>{text}</p>
      </div>
    </>

  )


}
export default App;
