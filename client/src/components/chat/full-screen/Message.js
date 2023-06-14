const Message = (props) => {

    return (
            <div>

                {props.isInformative ? 
                    (
                        <div>
                            <div className="d-flex flex-row justify-content-center">
                                <div>
                                    <p className="small p-2 mt-3 mb-3 rounded-3 text-center" style={{"backgroundColor": "#f1f28d"}}>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="bi bi-lock-fill mb-1" viewBox="0 0 16 16" style={{height:"12", width:"12", minHeight:"12", minWidth:"12"}}>
                                            <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"/>
                                        </svg>
                                        {" "}{props.message}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ) : ""
                }

                {props.isMe ? 
                    (
                        <div>
                            <div className="d-flex justify-content-between overflow-auto">
                                <p className="small mb-1">{props.address}</p>
                                <p className="small mb-1 text-muted">23 Jan 2:00 pm</p>
                            </div>
                            <div className="d-flex flex-row justify-content-start">
                                <svg xmlns="http://www.w3.org/2000/svg" onClick={()=>{}} width="30" height="30" fill="currentColor" className="bi bi-person-fill rounded-circle p-1" viewBox="0 0 16 16" style={{minHeight: "40", minWidth: "40", color:"#7F7F7F", backgroundColor:"rgb(247 247 247)", "border": "2px solid #D1D1D1"}}>
                                    <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3Zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"/>
                                </svg>
                                <div>
                                    <p className="small p-2 ms-3 mb-3 rounded-3" style={{"backgroundColor": "#f5f6f7"}}>
                                        {props.message}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ) : ""
                }

                {props.isHim ? 
                    (
                        <div>
                            <div className="d-flex justify-content-between">
                                <p className="small mb-1 text-muted">23 Jan 2:05 pm</p>
                                <p className="small mb-1"> {props.address}</p>
                            </div>
                            <div className="d-flex flex-row justify-content-end mb-4 pt-1">
                                <div>
                                    <p className="small p-2 me-3 mb-3 text-white rounded-3 bg-secondary">
                                        {props.message}    
                                    </p>
                                </div>
                                <svg xmlns="http://www.w3.org/2000/svg" onClick={()=>{}} width="30" height="30" fill="currentColor" className="bi bi-person-fill rounded-circle p-1" viewBox="0 0 16 16" style={{minHeight: "40", minWidth: "40", color:"#7F7F7F", backgroundColor:"rgb(247 247 247)", "border": "2px solid #D1D1D1"}}>
                                    <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3Zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"/>
                                </svg>
                            </div>
                        </div>
                    ) : ""
                }

            </div>
    );
}

export default Message;