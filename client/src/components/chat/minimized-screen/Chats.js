import { useState, useEffect} from "react";
import { useNavigate } from 'react-router-dom'

const Chats = () => {
    
    const navigate = useNavigate()
    // Hide chat when we are in full-screen chat
    let [hideMinimizedChat, setHideMinimizedChat] = useState(window.location.pathname === '/account/chat');
    useEffect(()=>{
        setHideMinimizedChat(window.location.pathname === '/account/chat');
    },[navigate])

    // Minimize the chat
    let [showChat, setShowChat] = useState(false);

    return (<>
            {hideMinimizedChat ? "" :
                <div className="m-0 p-0">
                    <section className="container">
                        <div className="row fixed-bottom">
                            <div className="col-4"></div>
                            <div className="col-4"></div>
                            <div className="col-4">
                                <div className="card" style={ showChat ? {display:"none"} : {display:"block"}}>
                                    <div className="card-header d-flex justify-content-between align-items-center p-3"
                                        style={{"borderTop": "4px solid #A8A8A8"}}>
                                        <h5 className="mb-0">Messages</h5>
                                        <div className="d-flex flex-row align-items-center">
                                        <span className="badge me-3" style={{"backgroundColor": "#A8A8A8"}}>
                                            20
                                        </span>
                                        <button className="badge me-3 border-0" style={{"backgroundColor": "#A8A8A8"}} onClick={ev => {ev.preventDefault(); setShowChat(true)}}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" className="bi bi-caret-down-fill" viewBox="0 0 16 16">
                                                <path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z"/>
                                            </svg>
                                        </button>
                                        </div>
                                    </div>
                                    <div className="card-body" data-mdb-perfect-scrollbar="true" style={{position: "relative", height: "190px"}}></div>
                                </div>
                                <div style={ showChat ? {display:"block"} :  {display:"none"}} className="card " >
                                    <div className="card-header d-flex justify-content-between align-items-center p-3"
                                        style={{"borderTop": "4px solid #A8A8A8"}}>
                                        <h5 className="mb-0">Chat messages</h5>
                                        <div className="d-flex flex-row align-items-center">
                                        <span className="badge me-3" style={{"backgroundColor": "#A8A8A8"}}>20</span>
                                        <button className="badge me-3 border-0" style={{"backgroundColor": "#A8A8A8"}} onClick={ev => {ev.preventDefault(); setShowChat(false)}}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" className="bi bi-caret-down-fill" viewBox="0 0 16 16">
                                                <path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z"/>
                                            </svg>
                                        </button>
                                        </div>
                                    </div>
                                    <div className="card-body overflow-auto" style={{position: "relative", height: "300px"}}>
                                        <div className="d-flex justify-content-between overflow-auto">
                                            <p className="small mb-1">Timona Siera</p>
                                            <p className="small mb-1 text-muted">23 Jan 2:00 pm</p>
                                            </div>
                                            <div className="d-flex flex-row justify-content-start">
                                            <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava5-bg.webp"
                                                alt="avatar 1" style={{width: "45px", height: "100%"}}></img>
                                            <div>
                                                <p className="small p-2 ms-3 mb-3 rounded-3" style={{"backgroundColor": "#f5f6f7"}}>For what reason
                                                would it
                                                be advisable for me to think about business content?</p>
                                            </div>
                                            </div>

                                            <div className="d-flex justify-content-between">
                                            <p className="small mb-1 text-muted">23 Jan 2:05 pm</p>
                                            <p className="small mb-1">Johny Bullock</p>
                                            </div>
                                            <div className="d-flex flex-row justify-content-end mb-4 pt-1">
                                            <div>
                                                <p className="small p-2 me-3 mb-3 text-white rounded-3 bg-secondary">Thank you for your believe in
                                                our
                                                supports</p>
                                            </div>
                                            <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava6-bg.webp"
                                                alt="avatar 1" style={{width: "45px", height: "100%"}}></img>
                                            </div>

                                            <div className="d-flex justify-content-between">
                                            <p className="small mb-1">Timona Siera</p>
                                            <p className="small mb-1 text-muted">23 Jan 5:37 pm</p>
                                            </div>
                                            <div className="d-flex flex-row justify-content-start">
                                            <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava5-bg.webp"
                                                alt="avatar 1" style={{width: "45px", height: "100%"}}></img>
                                            <div>
                                                <p className="small p-2 ms-3 mb-3 rounded-3" style={{"backgroundColor": "#f5f6f7"}}>Lorem ipsum dolor
                                                sit amet
                                                consectetur adipisicing elit similique quae consequatur</p>
                                            </div>
                                            </div>

                                            <div className="d-flex justify-content-between">
                                            <p className="small mb-1 text-muted">23 Jan 6:10 pm</p>
                                            <p className="small mb-1">Johny Bullock</p>
                                            </div>
                                            <div className="d-flex flex-row justify-content-end mb-4 pt-1">
                                            <div>
                                                <p className="small p-2 me-3 mb-3 text-white rounded-3 bg-secondary">Dolorum quasi voluptates quas
                                                amet in
                                                repellendus perspiciatis fugiat</p>
                                            </div>
                                            <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava6-bg.webp"
                                                alt="avatar 1" style={{width: "45px", height: "100%"}}></img>
                                        </div>
                                    </div>
                                    <div className="card-footer text-muted d-flex justify-content-start align-items-center p-3" >
                                        <div className="input-group mb-0">
                                        <input type="text" className="form-control shadow-none" placeholder="Type message"
                                            aria-label="Recipient's username" aria-describedby="button-addon2" />
                                        <button className="btn text-white" type="button" id="button-addon2" style={{"backgroundColor": "#A8A8A8", "paddingTop": ".55rem"}}>
                                            Send
                                        </button>
                                        </div>
                                    </div>
                                    <div className="card-body" data-mdb-perfect-scrollbar="true" style={{position: "relative", height: "190px"}}></div>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            }
        </> 
    );
}

export default Chats;