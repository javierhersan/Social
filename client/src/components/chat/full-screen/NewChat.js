import { useState} from "react";
import { createChat } from "../../../services/ChatService";
import {drizzleReactHooks} from '@drizzle/react-plugin';
import { useNavigate } from 'react-router-dom'

const NewChat = () => {

    const navigate = useNavigate()
    const {useDrizzleState } = drizzleReactHooks;
    const drizzleState = useDrizzleState(state => state);

    let [address, setAddress] = useState("");
  
    return (
            <div className='mt-4 ms-3'>
                <form>
                    <div className="form-group mb-2">
                        <label className="">Ethereum address</label>
                        <input type="" className="form-control shadow-none" style={{maxWidth:"500px"}} id="" placeholder="0x62c0bf99ce1496a9656df8214f298F103C3a31ca" value={address} onChange={ev => {ev.preventDefault(); setAddress(ev.target.value);}}/>
                    </div>
                    <button type="submit" className="btn btn-dark" onClick={ev => {ev.preventDefault();  createChat(drizzleState.accounts[0], address); navigate(0)}}>
                        New chat
                    </button>
                </form>
            </div>
    );
}

export default NewChat;