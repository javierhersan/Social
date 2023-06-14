import React , { useContext } from 'react';
import UserContext from '../../contexts/UserContext'
import { useState, useEffect} from "react";

import {drizzleReactHooks} from '@drizzle/react-plugin';
import {useNavigate} from "react-router-dom";

const Username = () => {

    // eslint-disable-next-line
    const { username, setUsername } = useContext(UserContext);

    let [usernameText, setUsernameText] = useState("");
    let [isReadOnly, setIsReadOnly] = useState(false);

    const { useDrizzle, useDrizzleState } = drizzleReactHooks;
    const drizzleState = useDrizzleState(state => state);

    const {useCacheCall, useCacheSend} = useDrizzle();

    let {send, status} = useCacheSend("DNS", "register");
    let usernameOwner = useCacheCall("DNS", "dns", usernameText); // Choose another username

    useEffect(()=>{
        if (isReadOnly || status === "success"){
            
        }
        // eslint-disable-next-line
    }, [status]);

    let navigate = useNavigate(); 
    const next = () =>{
        if(isReadOnly || status === "success"){
            window.localStorage.setItem("username", usernameText);
            setUsername(usernameText);
            navigate("/account/personal");
        }
    }

    return (
                <div className='container-fluid pl-0 pr-0'>
                    <div className='row'>
                    </div>
                    <div className='row p-4'>
                        <div className='col-4 ml-0 pl-0'></div>
                        <div className='col-4'>
                            <h5>Username</h5>
                            <form>
                                <p>Choose your username</p>
                                <div className="form-group mb-2">
                                    <div className="input-group input-group">
                                        <span className={isReadOnly || status === "success" ? "input-group-text text-light bg-success border-0" : "input-group-text text-light bg-dark border-0"}>@</span>
                                        <input type="" className="form-control shadow-none" id="" placeholder="Enter username" value={usernameText} readOnly={isReadOnly || status === "success"} onChange={ev => {ev.preventDefault(); setUsernameText(ev.target.value);}}/>
                                        <div className="input-group-append" style={{"paddingLeft": "1px"}}>
                                            <button className="btn btn-outline-dark rounded-0 rounded-end" type="submit" onClick={(ev) => {ev.preventDefault(); usernameOwner===drizzleState.accounts[0] ? setIsReadOnly(true) : send(usernameText);}}> 
                                                Submit
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                {
                                    usernameOwner === "0x0000000000000000000000000000000000000000" || usernameOwner===drizzleState.accounts[0]
                                        ? <p className="text-success mb-2">Available</p>
                                        : <p className="text-danger mb-2">Not available</p>
                                }
                                <div className="input-group d-flex justify-content-between">
                                    <div className="">
                                    <button type="submit" className="btn btn-dark" onClick={ev => {ev.preventDefault(); navigate(-1);}}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-arrow-left-circle-fill" viewBox="0 0 16 16">
                                            <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0zm3.5 7.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5z"/>
                                        </svg>
                                        <span> Back</span> 
                                    </button>
                                    </div>
                                    
                                    <div className="">
                                        <button type="submit" className="btn btn-dark" onClick={ev => {ev.preventDefault(); next()}}>
                                            <span>Next </span>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-arrow-right-circle-fill" viewBox="0 0 16 16">
                                                <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0zM4.5 7.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H4.5z"/>
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                                <div className="progress mt-3">
                                    <div className="progress-bar bg-dark" role="progressbar" style={{width: "50%"}} aria-valuenow="75" aria-valuemin="0" aria-valuemax="100"></div>
                                </div>
                                {/* <div className="text-danger ml-2">{status === "error" ? "Error" : ""}</div> */}
                                
                            </form>
                        </div>
                        <div className='col-4'></div>
                    </div>
                </div>
            );  
} 

export default Username;