import React, { useEffect , useState , useContext} from 'react'
import { db } from '../firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import AuthContext from '../context/AuthContext';

 const Chats = () => {


    const [chats, setChats] = useState([]);
    const {currentUser} = useContext(AuthContext);
    useEffect(() => {
        const getChats = async () => {
            const unsub = onSnapshot(doc(db, "userChats", currentUser.uid), (doc) => {
                setChats(doc.data().chats);
             });
     
             return () => {
                 unsub();
             };
        };

        currentUser.uid && getChats();
    }, [currentUser.uid]);
    console.log(Object.entries(chats)); 


  return (
    <div>
        <h1>Chats</h1>
        {Object.entries(chats)?.map(([chat]) => (
            <div className='userChat'
                key={chat[0]}>
                <img src={chat[1].userInfo.photoURL} alt=""/>
                <div>
                    <span>{chat[1].userInfo.displayName}</span>
                    <p>{chat[1].userInfo.lastmessage?.text}</p>
                </div>
            </div>
        ))}
    </div>
  )
}
export default Chats
