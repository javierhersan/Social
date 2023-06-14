import { useState, useEffect, useRef} from "react";
import {generateKeys, getConversationMessages, saveMyMessage, getLastMessageId} from '../../../services/ChatService'
import {drizzleReactHooks} from '@drizzle/react-plugin';
import Message from './Message'

const Chat = (props) => {

    const { useDrizzle, useDrizzleState } = drizzleReactHooks;
    const drizzleState = useDrizzleState(state => state);

    const {useCacheCall, /*useCacheSend*/} = useDrizzle();
    // eslint-disable-next-line
    let myProviders = useCacheCall("DNS", "providers", drizzleState.accounts[0]);
    let providers = useCacheCall("DNS", "providers", props.address);

    let [messagesArray, setMessagesArray] = useState([]);
    useEffect(()=>{
        // eslint-disable-next-line
        if(drizzleState.accounts[0]!==null){
            getMessages()
        }
        // eslint-disable-next-line
    },[drizzleState, providers]);

    const getMessages = async()=> {
        setMessagesArray(await getConversationMessages(drizzleState.accounts[0], props.address))
    }

    const sendMessage = async(content)=> {
        let messageID = getLastMessageId(drizzleState.accounts[0], props.address);
        let message = {address: drizzleState.accounts[0], messageId: messageID+1, message: content}
        await saveMyMessage(drizzleState.accounts[0], props.address, providers, message)
        // setMessagesArray(await getConversationMessages(drizzleState.accounts[0], props.address))
    }

    let [textInput, setTextInput] = useState("");

    const  generateKeyPair = async () => {
        await generateKeys(drizzleState.accounts[0], props.address, providers);
        await getMessages();
    };

    useEffect(()=>{
        // eslint-disable-next-line
        if(drizzleState.accounts[0]!==null && providers!==undefined){
            generateKeyPair();
        }
        // eslint-disable-next-line
    },[drizzleState, providers]);

    const updateChat = async()=>{
        if(drizzleState.accounts[0]!==null){
            getMessages();
        }
    }

    let [messages, setMessages] = useState([]);
    const print = () =>{
        let messagesToPrint = []
        messagesToPrint.push(
            <li className="d-grid row ms-1 me-2" key="new-chat">
                <span>
                    <Message message={"This chat is end-to-end encrypted and all messages are signed by their owners"} isInformative/>
                    
                </span>
            </li>
        );
        for (let i = 0; i < messagesArray?.length; i++) {
            messagesToPrint.push(
                <li className="d-grid row ms-1 me-2" key={i}>
                    <span>
                        {messagesArray[i].message 
                            ? <Message message={messagesArray[i].message} address={messagesArray[i].address} isMe={messagesArray[i].address === drizzleState.accounts[0] ? true : false} isHim={messagesArray[i].address !== drizzleState.accounts[0] ? true : false}/> 
                            : <Message message={
                                    <span>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="bi bi-lock-fill mb-1 me-1" viewBox="0 0 16 16" style={{height:"12", width:"12", minHeight:"12", minWidth:"12"}}>
                                            <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"/>
                                        </svg>
                                        Public Key Shared
                                    </span>
                                } address={messagesArray[i].address} isMe={messagesArray[i].address === drizzleState.accounts[0] ? true : false} isHim={messagesArray[i].address !== drizzleState.accounts[0] ? true : false}/> }
                    </span>
                </li>
            );
        }
        setMessages(messagesToPrint);
    }
    useEffect(()=>{
        print()
        // eslint-disable-next-line
    },[messagesArray]);

    const messagesEndRef = useRef(null);
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
      }
      useEffect(()=>{
        scrollToBottom()
        // eslint-disable-next-line
    },[messages]);

    return (
            <section className="container">
                <div className="row">
                    <div className="col-12">
                        <div className="mt-3" style={{height:"calc(100vh - 200px)"}}>
                            <div id="MessagesContainer" className="card-body overflow-auto" style={{height:"calc(100vh - 350px)", scrollTop: "9999",scrollBehavior: "smooth"}}>
                                <div>{messages}</div>
                                <div key="ref" ref={messagesEndRef} />
                            </div>
                            <div className="card-footer text-muted d-flex justify-content-start align-items-center p-3" >
                                <div className="input-group mb-0">
                                    <input type="text" className="form-control shadow-none" placeholder="Type message"
                                        aria-label="Recipient's username" aria-describedby="button-addon2" value={textInput} onChange={ev => {ev.preventDefault(); setTextInput(ev.target.value);}}/>
                                    <button className="btn text-white" type="button" id="button-addon2" style={{"backgroundColor": "#A8A8A8", "paddingTop": ".55rem"}} onClick={()=>{sendMessage(textInput); setTextInput(""); updateChat()}}>
                                        Send
                                    </button>
                                </div>
                            </div> 
                        </div>
                    </div>
                </div>
            </section>
    );
}

export default Chat;