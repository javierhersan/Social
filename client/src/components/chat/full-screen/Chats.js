import { useState, useEffect} from "react";
import NewChat from './NewChat'
import Chat from './Chat'
import { getChatList, dispatchMessages } from "../../../services/ChatService";
import {drizzleReactHooks} from '@drizzle/react-plugin';

const Chats = () => {

    const { useDrizzle, useDrizzleState } = drizzleReactHooks;
    const drizzleState = useDrizzleState(state => state);

    const {useCacheCall, /*useCacheSend*/} = useDrizzle();
    let myProviders = useCacheCall("DNS", "providers", drizzleState.accounts[0]);

    let [chats, setChats] = useState([]);
    useEffect(()=>{
        // load chats
        setChats(getChatList(drizzleState.accounts[0]))
        loadMessages();
        // Get my messages - the public key to decrypt his messages
        
        // eslint-disable-next-line
    },[myProviders])

    const loadMessages = async () =>{
        await dispatchMessages(drizzleState.accounts[0], myProviders)
    }

    let [selectedChat, setSelectedChat] = useState("new-chat");

    let chatList = []
    chatList.push(
        <li className="d-grid row ms-1 me-2" key="new-chat">
            <button className={selectedChat==="new-chat" ? "bg-secondary text-white btn text-start d-flex flex-row col-12 text-truncate " : "btn text-start d-flex flex-row col-12 text-truncate"} onClick={()=>{setSelectedChat("new-chat")}}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-plus-square ms-1 mt-1 me-1" viewBox="0 0 16 16" style={{minHeight: "24", minWidth: "24"}}>
                    <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/>
                    <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
                </svg>
                
                <span className="text-truncate ms-2 me-2 pt-1">
                    {" "} New chat
                </span>
            </button>
        </li>
    );
    for (let i = 0; i < chats?.length; i++) {
        chatList.push(
            <li className="d-grid row ms-1 me-2" key={i}>
                <button className={selectedChat===chats[i].user ? "bg-secondary text-white btn text-start d-flex flex-row col-12 text-truncate" : "btn text-start d-flex flex-row col-12 text-truncate"} onClick={()=>{setSelectedChat(chats[i].user)}}>
                    <svg xmlns="http://www.w3.org/2000/svg" onClick={()=>{}} width="30" height="30" fill="currentColor" className="bi bi-person-fill rounded-circle p-1" viewBox="0 0 16 16" style={{minHeight: "30", minWidth: "30", color:"#7F7F7F", backgroundColor:"rgb(247 247 247)", "border": "2px solid #D1D1D1"}}>
                        <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3Zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"/>
                    </svg>
                    <span className="text-truncate ms-2 me-2 pt-1">
                        {" "} {chats[i].user}
                    </span>
                </button>
            </li>
            // <FeedPost post={props.posts[i]} key={props.posts[i].header.address+props.posts[i].header.post_id}></FeedPost>
        );
    }

    return (
        <div className="m-0 p-0">
            <div className="container-fluid m-0 ps-0">
                <div className="row">
                    <div className="col-3">
                        <div className="p-3 border-end border-secondary" style={{height:"calc(100vh - 140px)", backgroundColor:"#ebebeb", overflow: "hidden"}}>
                            <div className="d-flex align-items-center mb-3 mb-md-0 me-md-auto link-dark text-decoration-none ps-5">
                                <span className="fs-4">
                                    Chats {" "}
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-chat-left-dots" viewBox="0 0 16 16">
                                        <path d="M14 1a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H4.414A2 2 0 0 0 3 11.586l-2 2V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12.793a.5.5 0 0 0 .854.353l2.853-2.853A1 1 0 0 1 4.414 12H14a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/>
                                        <path d="M5 6a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm4 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm4 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
                                    </svg>
                                </span> 
                            </div>
                            <hr></hr>
                            <ul className="nav nav-pills flex-column mb-auto">
                                {chatList}
                            </ul>
                        </div>
                    </div>
                    {selectedChat==="new-chat" ? 
                        <div className="col-9 m-0 p-0">
                            <NewChat/>
                        </div>
                        : "" 
                    }
                    {selectedChat!=="new-chat" ? 
                        <div className="col-9 m-0 p-0">
                            <Chat address={selectedChat}/>
                        </div>
                        : "" 
                    }
                </div>
            </div>
        </div>
        
    );
}

export default Chats;