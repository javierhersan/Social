import {Account} from '../../services/ProfileService'
import { useState, useEffect, useRef} from "react";
import {drizzleReactHooks} from '@drizzle/react-plugin';
import FeedPosts from "../posts/FeedPosts"

const Feed = () => {
    // https://stackoverflow.com/questions/71960194/update-navbar-after-success-login-or-logout-redirection
    // https://github.com/trufflesuite/drizzle/issues/41
    // https://github.com/wildcards-world/ui/blob/master/src/helpers/web3/web3ProvideSwitcher.js

    const { useDrizzle, useDrizzleState } = drizzleReactHooks;
    const drizzleState = useDrizzleState(state => state);
    
    const {useCacheCall, /*useCacheSend*/} = useDrizzle();

    let myProviders = useCacheCall("DNS", "providers", drizzleState.accounts[0]);

    const stateRef = useRef({
        account: new Account() 
    });
    useEffect(()=>{
        stateRef.current.account.setAddress(drizzleState.accounts[0]);
        // eslint-disable-next-line
    }, [drizzleState.accounts[0]]);
    useEffect(()=>{
        stateRef.current.account.setProviders(myProviders);
    }, [myProviders]);

    let [feedPosts, setFeedPosts] = useState([]);
    let [loadingPosts, setLoadingPosts] = useState(true);
    const loadFeed = async () =>{
        setFeedPosts(await stateRef.current.account.getFeed())
        setLoadingPosts(false)
    }
    useEffect(()=>{
        loadFeed();
        // eslint-disable-next-line
    }, [myProviders, drizzleState.accounts[0]]);

    return (
            <div className='container-fluid pl-0 pr-0'>
                <div className='row pt-4'>
                    <div className='col-4 ml-0 pl-0'></div>
                    <div className='col-4 mb-5 justify-content-center align-items-center'>
                        <div className="card w-100 pt-3 pb-2 ps-2 mt-2" style={{backgroundColor:"rgb(247 247 247)"}}>
                            <div className='row'>
                                <h4 className='ms-4 mb-2 mt-2 pt-3 pb-3 text-center rounded col-5 text-white' style={{backgroundColor:"#8292ab"}}>For you</h4>
                                <h4 className='ms-4 mb-2 mt-2 pt-3 pb-3 text-center col-5'>Following</h4>
                            </div>
                        </div>
                        <div>
                            {loadingPosts ? 
                                <div className="text-center mt-4">
                                    <div style={{width: '16px', height: '16px'}} className="spinner-border" role="status">
                                        <span className="sr-only"></span>
                                    </div>
                                    <b className="h5"> Loading...</b>
                                </div> : ""}
                            {feedPosts ? <FeedPosts posts = {feedPosts}></FeedPosts> : ""}
                        </div>
                    </div>
                    <div className='col-4'></div>
                </div>
            </div>     
    );
}

export default Feed;