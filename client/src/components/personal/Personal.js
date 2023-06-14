import React from 'react';
import { useState, useEffect} from "react";

import {drizzleReactHooks} from '@drizzle/react-plugin';
import {useNavigate} from "react-router-dom";

import {verify, buildHeader} from '../../helpers/index'

const Personal = () => {

    let [firstName, setFirstName] = useState("");
    let [lastName, setLastName] = useState("");
    let [description, setDescription] = useState("");
    let [version, setVersion] = useState(0);

    const { useDrizzle, useDrizzleState } = drizzleReactHooks;
    const drizzleState = useDrizzleState(state => state);

    const {useCacheCall} = useDrizzle();

    let providers = useCacheCall("DNS", "providers", drizzleState.accounts[0]);

    useEffect(()=>{
        getMetadata();
        // eslint-disable-next-line
    }, [providers]);

    const getMetadata = async () => {
        let firstNameText = ""
        let lastNameText = ""
        let descriptionText = ""
        let versionNumber = 0;

        if(providers){
            let urlProvider1 = 'http://'+providers.provider1+'/'+drizzleState.accounts[0];
            let urlProvider2 = 'http://'+providers.provider2+'/'+drizzleState.accounts[0];
            let urlProvider3 = 'http://'+providers.provider3+'/'+drizzleState.accounts[0];

            try { 
                // eslint-disable-next-line
                let response = await fetch(urlProvider1+"/0", {
                    method:'get',
                    mode:'cors',
                    headers: {
                        'Accept':'application/json',
                        'Content-type':'application/json',
                    },
                    // TODO: change id, sign the post and hash the content
                })
                let json = await response.json();
                let header = json.header;
                let content = json.content;
                if(await verify(header, content)){
                    if(header.update_id > versionNumber){
                        firstNameText = content.first_name
                        lastNameText = content.last_name
                        descriptionText = content.description
                        versionNumber = header.update_id
                    }
                }

            } catch (err) {}

            try { 
                // eslint-disable-next-line
                let response = await fetch(urlProvider2+"/0", {
                    method:'get',
                    mode:'cors',
                    headers: {
                        'Accept':'application/json',
                        'Content-type':'application/json',
                    },
                    // TODO: change id, sign the post and hash the content
                })
                let json = await response.json();
                let header = json.header;
                let content = json.content;
                if(await verify(header, content)){
                    if(header.update_id > versionNumber){
                        firstNameText = content.first_name
                        lastNameText = content.last_name
                        descriptionText = content.description
                        versionNumber = header.update_id
                    }
                }

            } catch (err) {}

            try { 
                // eslint-disable-next-line
                let response = await fetch(urlProvider3+"/0", {
                    method:'get',
                    mode:'cors',
                    headers: {
                        'Accept':'application/json',
                        'Content-type':'application/json',
                    },
                    // TODO: change id, sign the post and hash the content
                })
                let json = await response.json();
                let header = json.header;
                let content = json.content;
                if(await verify(header, content)){
                    if(header.update_id > versionNumber){
                        firstNameText = content.first_name
                        lastNameText = content.last_name
                        descriptionText = content.description
                        versionNumber = header.update_id
                    }
                }

            } catch (err) {}

            setFirstName(firstNameText);
            setLastName(lastNameText);
            setDescription(descriptionText);
            setVersion(versionNumber)
        }
        
    }

    let navigate = useNavigate(); 
    const next = async () => {
        
        let urlProvider1 = 'http://'+providers.provider1+'/'+drizzleState.accounts[0];
        let urlProvider2 = 'http://'+providers.provider2+'/'+drizzleState.accounts[0];
        let urlProvider3 = 'http://'+providers.provider3+'/'+drizzleState.accounts[0];

        let metadata = {
            first_name: firstName,
            last_name: lastName,
            description: description,
        }

        const content = metadata;
        const postID = 0;
        const updateID = version+1;
        const header = await buildHeader(content, postID, updateID);
        if(!verify(header, content)){
            return;
        }

        let HTTP_method;
        if(parseInt(updateID) === 1){
            HTTP_method = "post"
        } else {
            HTTP_method = "put"
        }

        // TODO: Update_id check first to update info
        // Write the last information in the screen
        
        try { 
            // eslint-disable-next-line
            let result = await fetch(urlProvider1+"/0", {
                method:HTTP_method,
                mode:'cors',
                headers: {
                    'Accept':'application/json',
                    'Content-type':'application/json',
                },
                // TODO: change id, sign the post and hash the content
                body: JSON.stringify(
                    {
                        content: content,
                        header: header,
                    }
                )
            })
        } catch (err) {}

        try { 
            // eslint-disable-next-line
            let result = await fetch(urlProvider2+"/0", {
                method:HTTP_method,
                mode:'cors',
                headers: {
                    'Accept':'application/json',
                    'Content-type':'application/json',
                },
                // TODO: change id, sign the post and hash the content
                body: JSON.stringify(
                    {
                        content: content,
                        header: header,
                    }
                )
            })
        } catch (err) {}

        try { 
            // eslint-disable-next-line
            let result = await fetch(urlProvider3+"/0", {
                method:HTTP_method,
                mode:'cors',
                headers: {
                    'Accept':'application/json',
                    'Content-type':'application/json',
                },
                // TODO: change id, sign the post and hash the content
                body: JSON.stringify(
                    {
                        content: content,
                        header: header,
                    }
                )
            })
        } catch (err) {}
        
        navigate("/account/feed");
    }

    const skip = async () => {
        navigate("/account/feed");
    }

    return (
                <div className='container-fluid pl-0 pr-0'>
                    <div className='row'>
                    </div>
                    <div className='row p-4'>
                        <div className='col-4 ml-0 pl-0'></div>
                        <div className='col-4'>
                            <h5>Personal</h5>
                            <form>
                                <div className="form-group mb-2">
                                    <div className="input-group input-group mb-2">
                                        <span className="input-group-text text-dark bg-light">First name</span>
                                        <input type="" className="form-control shadow-none" id="" placeholder="Enter first name" value={firstName} onChange={ev => {ev.preventDefault(); setFirstName(ev.target.value);}}/>
                                    </div>
                                    <div className="input-group input-group mb-2">
                                        <span className="input-group-text text-dark bg-light">Last name</span>
                                        <input type="" className="form-control shadow-none" id="" placeholder="Enter last name" value={lastName} onChange={ev => {ev.preventDefault(); setLastName(ev.target.value);}}/>
                                    </div>
                                    <div className="form-group mb-3">
                                        <span className="input-group-text text-dark bg-light rounded-0 rounded-top border-bottom-0">Description</span>
                                        <textarea className="form-control shadow-none rounded-0 rounded-bottom" id="exampleFormControlTextarea1" rows="4" value={description} onChange={ev => {ev.preventDefault(); setDescription(ev.target.value);}}></textarea>
                                    </div>
                                </div>
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
                                        <button type="submit" className="btn btn-secondary me-1" onClick={async (ev) => {ev.preventDefault(); await skip();}}>
                                            <span>Skip </span>
                                        </button>
                                        <button type="submit" className="btn btn-dark" onClick={async (ev) => {ev.preventDefault(); await next();}}>
                                            <span>Next </span>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-arrow-right-circle-fill" viewBox="0 0 16 16">
                                                <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0zM4.5 7.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H4.5z"/>
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                                <div className="progress mt-3">
                                    <div className="progress-bar bg-dark" role="progressbar" style={{width: "75%"}} aria-valuenow="75" aria-valuemin="0" aria-valuemax="100"></div>
                                </div>
                                
                            </form>
                        </div>
                        <div className='col-4'></div>
                    </div>
                </div>
            );  
} 

export default Personal;