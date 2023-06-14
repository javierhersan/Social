import React , { useContext } from 'react';
import UserContext from '../../contexts/UserContext';
import {useNavigate} from "react-router-dom";
import {useParams} from "react-router-dom";
import Dropdown from 'react-bootstrap/Dropdown';

import {Account} from '../../services/ProfileService'

import {drizzleReactHooks} from '@drizzle/react-plugin';
import { useState, useEffect, useRef} from "react";

import ProfilePosts from "../posts/ProfilePosts"

const Profile = () => {

    let { address } = useParams();
    let navigate = useNavigate();
    let URI = window.location.pathname;
    const { username, /*setUsername*/ } = useContext(UserContext);

    let [isMyProfile, setIsMyProfile] = useState(true);
    useEffect(()=>{
        if(address === undefined){
            setIsMyProfile(true);
        }else{
            if(address === drizzleState.accounts[0]){
                setIsMyProfile(true);
            }else{
                setIsMyProfile(false);
            }
        }
        // eslint-disable-next-line
    }, [address]);
    
    const { useDrizzle, useDrizzleState } = drizzleReactHooks;
    const drizzleState = useDrizzleState(state => state);
    
    const {useCacheCall, /*useCacheSend*/} = useDrizzle();

    let myProviders = useCacheCall("DNS", "providers", drizzleState.accounts[0]);
    let providers = useCacheCall("DNS", "providers", ((address === undefined) ? drizzleState.accounts[0] : address));

    let [nPosts, setnPosts] = useState(0);
    let [showModal, setShowModal] = useState(false);

    let [posts, setPosts] = useState([]);
    let [firstName, setFirstName] = useState("");
    let [lastName, setLastName] = useState("");
    let [description, setDescription] = useState("");

    // ------------------------------------------------------------------------------- //
    // ------------------------------- Account Object -------------------------------- //
    // ------------------------------------------------------------------------------- //
    const stateRef = useRef({
        account: new Account() 
    });
    useEffect(()=>{
        if(address !== undefined ){
            stateRef.current.account.setAddress(address);
        } else {
            stateRef.current.account.setAddress(drizzleState.accounts[0]);
        }
        // eslint-disable-next-line
    }, [address]);
    useEffect(()=>{
        stateRef.current.account.setWatcherAddress(drizzleState.accounts[0]);
        // eslint-disable-next-line
    }, [drizzleState.accounts, drizzleState.accounts[0]]);
    useEffect(()=>{
        stateRef.current.account.setProviders(providers);
    }, [providers]);
    useEffect(()=>{
        stateRef.current.account.setWatcherProviders(myProviders);
    }, [myProviders]);

    // -------------------------------------------------------------------------------
    let [loadingPosts, setLoadingPosts] = useState(true);
    const load = async () =>{
        await stateRef.current.account.downloadPosts()
        let postChain = stateRef.current.account.getPostChain()
        if(postChain !== undefined){
            // Set posts
            setPosts(postChain);
            setnPosts((postChain.length-1 > 0) ? postChain.length-1 : 0);
            // Set profile info
            let profileInfo = postChain.find(o => o.header.post_id === parseInt(0));
            setLoadingPosts(false)
            if(profileInfo !== undefined){
                setFirstName(profileInfo.content.first_name)
                setLastName(profileInfo.content.last_name)
                setDescription(profileInfo.content.description)
            } else {}
        }  
    }
    useEffect(()=>{
        load();
        // eslint-disable-next-line
    }, [providers, myProviders, drizzleState.accounts[0], address]);

    let [newPostContent, setNewPostContent] = useState("");
    let publish = async (content) => {
        setNewPostContent("");
        await stateRef.current.account.publishPost(content)
        load();
    }

    let [isFollowing, setIsFollowing] = useState(false);
    const check = async () => {
        setIsFollowing(await stateRef.current.account.checkIsFollowing());
    }
    let [following, setFollowing] = useState(false);
    const getFollowing = async () => {
        setFollowing(0);
    }
    // Initial loading
    useEffect(()=>{
        check();
        getFollowing();
        // eslint-disable-next-line
    }, [providers, address, myProviders, drizzleState.accounts[0]]);

    const followClick = async () =>{
        await stateRef.current.account.follow();
        check();
    }

    const unfollowClick = async () =>{
        await stateRef.current.account.unfollow();
        check();
    }

    return(  
            <div className='container-fluid pl-0 pr-0'>
                <div className='row p-3'>
                    <div className='col-4 ml-0 pl-0'></div>
                    <div className='col-4'>
                        {
                            URI==='/account/profile' ? "" :
                                <button type="submit" className="btn btn-dark" onClick={ev => {ev.preventDefault(); navigate(-1);}}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-arrow-left-circle-fill" viewBox="0 0 16 16">
                                        <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0zm3.5 7.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5z"/>
                                    </svg>
                                    <span> Back</span>
                                </button>
                        }
                    </div>
                    <div className='col-4'></div>
                </div>
                <div className='row'>
                    <div className='col-4 ml-0 pl-0'></div>
                    <div className='col-4'>
                        <div className="d-flex justify-content-center align-items-center">
                            <div className="card w-100" style={{backgroundColor:"rgb(247 247 247)", "borderTop": "4px solid #A8A8A8"}}>
                                <div className="w-100 text-end" style={{height: "100px", backgroundColor:"#e8e8e8", "borderBottom": "2px solid #D1D1D1"}}>
                                    <div className="pr-3 pt-2 me-2" style={{border: "none", background: "none"}}>
                                        <Dropdown>
                                            <style>
                                                {`
                                                    .dropdown-toggle::after {
                                                        display: none !important; 
                                                      }
                                                    .dropdown-item:active{ background-color: gray; }
                                                `}
                                            </style>
                                            <Dropdown.Toggle className="bg-secondary rounded border border-secondary text-secondary" variant="success" id="dropdown-basic">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" fill="currentColor" className="bi bi-three-dots-vertical text-light" viewBox="0 0 16 16">
                                                    <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/>
                                                </svg>
                                            </Dropdown.Toggle>
                                            {URI ==='/account/profile' ? 
                                                <Dropdown.Menu>
                                                    <Dropdown.Item className="text-center" onClick={(ev) => {navigate("/account/settings")}}>
                                                        Settings {" "}
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="bi bi-gear" viewBox="0 0 16 16">
                                                            <path d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492zM5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0z"/>
                                                            <path d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52l-.094-.319zm-2.633.283c.246-.835 1.428-.835 1.674 0l.094.319a1.873 1.873 0 0 0 2.693 1.115l.291-.16c.764-.415 1.6.42 1.184 1.185l-.159.292a1.873 1.873 0 0 0 1.116 2.692l.318.094c.835.246.835 1.428 0 1.674l-.319.094a1.873 1.873 0 0 0-1.115 2.693l.16.291c.415.764-.42 1.6-1.185 1.184l-.291-.159a1.873 1.873 0 0 0-2.693 1.116l-.094.318c-.246.835-1.428.835-1.674 0l-.094-.319a1.873 1.873 0 0 0-2.692-1.115l-.292.16c-.764.415-1.6-.42-1.184-1.185l.159-.291A1.873 1.873 0 0 0 1.945 8.93l-.319-.094c-.835-.246-.835-1.428 0-1.674l.319-.094A1.873 1.873 0 0 0 3.06 4.377l-.16-.292c-.415-.764.42-1.6 1.185-1.184l.292.159a1.873 1.873 0 0 0 2.692-1.115l.094-.319z"/>
                                                        </svg>
                                                    </Dropdown.Item>
                                                    <Dropdown.Item className="text-center" onClick={(ev) => {navigate("/login")}}>
                                                        Sign out {" "}
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-box-arrow-right" viewBox="0 0 16 16">
                                                            <path fillRule="evenodd" d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0v2z"/>
                                                            <path fillRule="evenodd" d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z"/>
                                                        </svg>
                                                    </Dropdown.Item>
                                                </Dropdown.Menu> : <></>
                                            }
                                        </Dropdown>
                                    </div>
                                </div>
                                <div className="d-flex justify-content-center">
                                    <div className="profile" style={{position: "relative ",top:"-45px"}}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" fill="currentColor" className="bi bi-person-fill rounded-circle p-2" viewBox="0 0 16 16" style={{color:"#7F7F7F", backgroundColor:"rgb(247 247 247)", "border": "2px solid #D1D1D1"}}>
                                            <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3Zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"/>
                                        </svg>
                                    </div>
                                </div>
                                <div className="mt-0 text-center" style={{position: "relative ",top:"-40px"}}>
                                    <h4 className="mb-0">{firstName} {lastName}</h4>
                                    <span className="text-muted mb-2">
                                        {((isMyProfile ||  (drizzleState.accounts[0] === address)) ? ("@"+username) : "")}
                                        <button className="pt-2 text-secondary" style={{border: "none", background: "none"}} onClick={()=>{setShowModal(!showModal)}}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="bi bi-info-circle" viewBox="0 0 16 16">
                                                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                                                <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
                                            </svg>
                                        </button>
                                    </span>
                                    <div>{description}</div>
                                    <div className="col-auto card mt-2 ms-3 me-3 pt-3" style={showModal ? {display:"block"} : {display:"none"}}>
                                        <span className="text-muted d-block mb-2" style={{display: "inline-block"}}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" className="bi bi-clipboard" viewBox="0 0 16 16">
                                                <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z"/>
                                                <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z"/>
                                            </svg>
                                            <small> {(isMyProfile ? drizzleState.accounts[0] : address)}</small>
                                            <p><label >Providers: {(!providers?.provider1 && !providers?.provider2 && !providers?.provider3) ? "Not found" : ""}{providers?.provider1 ? providers?.provider1 : ""}{providers?.provider1 && providers?.provider2 ? ", " : ""}{providers?.provider2 ? providers?.provider2 : ""}{providers?.provider2 && providers?.provider3 ? ", " : ""}{providers?.provider3 ? providers?.provider3 : ""}</label></p>
                                        </span>
                                    </div>
                                    {(URI !=='/account/profile' && (!isMyProfile) && !isFollowing)  ? <p className='p-2'><button className="btn btn-primary btn-sm follow" onClick={async ()=>{await followClick()}}>Follow</button></p> : ""}
                                    {(URI !=='/account/profile' && (!isMyProfile) && isFollowing)  ? <p className='p-2'><button className="btn btn-danger btn-sm follow" onClick={async ()=>{await unfollowClick()}}>Unfollow</button></p> : ""}
                                    <div className="row mt-4 px-4">
                                        <div className="col-4">
                                            <h6 className="mb-0">Posts</h6>
                                            <span>{nPosts}</span>
                                        </div>
                                        <div className="col-4">
                                            <h6 className="mb-0">Following</h6>
                                            <span>{following}</span>
                                        </div>
                                        <div className="col-4">
                                            <h6 className="mb-0">Followers</h6>
                                            <span>0</span>
                                        </div>
                                    </div>
                                </div>
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
                            {posts ? <ProfilePosts posts = {posts}></ProfilePosts> : ""}
                        </div>
                        {
                            (URI==='/account/profile' && ! loadingPosts) ? 
                                <div className="w-100 mt-2" style={{backgroundColor:"rgb(247 247 247)"}}>
                                    <div className="input-group">
                                        <input className="form-control w-50 shadow-none p-3" placeholder="Text" value={newPostContent} onChange={ev => {ev.preventDefault(); setNewPostContent(ev.target.value);}}/>
                                        <div className="input-group-append ml-5">
                                            <button type="submit" className="btn btn-dark p-3 rounded-0 rounded-end" onClick={ev => {ev.preventDefault(); publish(newPostContent);}}>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-send" viewBox="0 0 16 16">
                                                    <path d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576 6.636 10.07Zm6.787-8.201L1.591 6.602l4.339 2.76 7.494-7.493Z"/>
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </div> : ""
                        }
                    </div>
                    <div className='col-4'></div>
                </div>
            </div>
    );
};

export default Profile;