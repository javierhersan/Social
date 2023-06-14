import React , { useContext } from 'react';
import UserContext from '../../contexts/UserContext'

import {drizzleReactHooks} from '@drizzle/react-plugin';
import {useNavigate} from "react-router-dom";
import {useEffect} from "react";
import { useState} from "react";

const Login = () => {

    // eslint-disable-next-line
    const { username, setUsername } = useContext(UserContext);

    const { useDrizzle, useDrizzleState } = drizzleReactHooks;
    const drizzleState = useDrizzleState(state => state);

    let [usernameText, setUsernameText] = useState("");

    const {useCacheCall} = useDrizzle();

    let providers = useCacheCall("DNS", "providers", drizzleState.accounts[0]);
    let usernameOwner = useCacheCall("DNS", "dns", usernameText); 

    useEffect(()=>{
        // Reload if providers change
    }, [providers]);
    
    let navigate = useNavigate(); 
    const login = () =>{ 
        // Check if the account has at least one provider
        if(providers.provider1==="" && providers.provider2==="" && providers.provider3===""){
            navigate("/signup");
        } else {
            if(usernameOwner===drizzleState.accounts[0]){
                window.localStorage.setItem("username", usernameText);
                setUsername(usernameText);
                navigate("/account/feed");
            } else {
                // TODO: Show login error
                navigate(0)
            } 
        }
    }
    
    return(
            <div className='container-fluid pl-0 pr-0'>
                <div className='row'>
                </div>
                <div className='row p-4'>
                    <div className='col-4 ml-0 pl-0'>
                    </div>
                    <div className='col-4'>
                        <form>
                            <div className="form-group mb-2">
                                <label>Ethereum address</label>
                                <input type="" className="form-control shadow-none mb-2" id="" readOnly value={drizzleState.accounts[0]}/>
                                <input type="" className="form-control shadow-none" id="" placeholder="Enter username" value={usernameText} onChange={ev => {ev.preventDefault(); setUsernameText(ev.target.value);}}/>
                            </div>
                            <button type="submit" className="btn btn-dark" onClick={ev => {ev.preventDefault(); login();}}>
                                Log in
                            </button>
                        </form>
                    </div>
                    <div className='col-4'></div>
                </div>
            </div>
    );

    
};

export default Login;


