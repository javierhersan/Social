import {drizzleReactHooks} from '@drizzle/react-plugin';
import {useNavigate} from "react-router-dom";
import { useEffect, useContext} from "react";

import UserContext from "../../contexts/UserContext";

const Protection = ({children}) => {

    const { username, setUsername } = useContext(UserContext);
    const { useDrizzle, useDrizzleState } = drizzleReactHooks;
    const drizzleState = useDrizzleState(state => state);
    const {useCacheCall} = useDrizzle();

    let navigate = useNavigate();

    //Check username owner address
    let usernameOwner = useCacheCall("DNS", "dns", username);
    let providers = useCacheCall("DNS", "providers", drizzleState.accounts[0]);

    useEffect(()=>{
        // Load username from local storage
        if(username === ""){
            setUsername(window.localStorage.getItem("username"))
        }
        // eslint-disable-next-line
    },[])

    useEffect(()=>{
        if(providers?.provider1==="" && providers?.provider2==="" && providers?.provider3===""){
            navigate('/signup');
        }
        // If username is not defined redirect to /login
        else if(window.localStorage.getItem("username")===null){
            navigate('/login');
        }
        // Check first if the account logged in owns that username, if not login
        else if(usernameOwner !== undefined && usernameOwner !== drizzleState.accounts[0]){
            navigate('/login');
        }

        // eslint-disable-next-line
    }, [usernameOwner, providers]);

    return(<>{children}</>)

};

export default Protection;
