import {drizzleReactHooks} from '@drizzle/react-plugin';
import {useNavigate} from "react-router-dom";
import { useState, useEffect} from "react";

const Providers = () => {

    const { useDrizzle, useDrizzleState} = drizzleReactHooks;
    const drizzleState = useDrizzleState(state => state);
    const {useCacheCall, useCacheSend} = useDrizzle();

    let [provider1IP, setProvider1IP] = useState("");
    let [provider2IP, setProvider2IP] = useState("");
    let [provider3IP, setProvider3IP] = useState("");

    let providers = useCacheCall("DNS", "providers", drizzleState.accounts[0]);
    let {send, /*status*/} = useCacheSend("DNS", "setProvider");

    useEffect(()=>{
        setProvider1IP(providers?.provider1)
        setProvider2IP(providers?.provider2)
        setProvider3IP(providers?.provider3)
        // eslint-disable-next-line
    }, [providers]);

    let navigate = useNavigate(); 
    const next = () =>{ 
        // Check if the account has at least one provider
        if(providers.provider1==="" && providers.provider2==="" && providers.provider3===""){
            navigate(0);
        } else {
            navigate("/account/username");
        }
    }

    return (
            <div className='container-fluid pl-0 pr-0'>
                <div className='row'>
                </div>
                <div className='row p-4'>
                    <div className='col-4 ml-0 pl-0'></div>
                    <div className='col-4'>
                        <h5>Server providers</h5>
                        <form>
                            <p>Choose your server providers</p>
                            <div className="form-group">
                                <div className="input-group mb-2">
                                    <span className={providers?.provider1 === "" ? "input-group-text text-light bg-danger border-0" : "input-group-text text-light bg-success border-0"}>1</span>
                                    <input type="" className="form-control shadow-none" id="" placeholder="192.168.1.2" value={provider1IP} onChange={ev => {ev.preventDefault(); setProvider1IP(ev.target.value);}}/>
                                    <div className="input-group-append" style={{"paddingLeft": "1px"}}>
                                        <button className="btn btn-outline-dark rounded-0 rounded-end" type="submit" onClick={ev => {ev.preventDefault(); send(provider1IP,1);}}> 
                                            Submit
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="form-group">
                                <div className="input-group mb-2">
                                    <span className={providers?.provider2 === "" ? "input-group-text text-light bg-danger border-0" : "input-group-text text-light bg-success border-0"}>2</span>
                                    <input type="" className="form-control shadow-none" id="" placeholder="192.168.1.2" value={provider2IP} onChange={ev => {ev.preventDefault(); setProvider2IP(ev.target.value);}}/>
                                    <div className="input-group-append" style={{"paddingLeft": "1px"}}>
                                        <button className="btn btn-outline-dark rounded-0 rounded-end" type="submit" onClick={ev => {ev.preventDefault(); send(provider2IP,2);}}> 
                                            Submit
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="form-group">
                                <div className="input-group mb-3">
                                    <span className={providers?.provider3 === "" ? "input-group-text text-light bg-danger border-0" : "input-group-text text-light bg-success border-0"}>3</span>
                                    <input type="" className="form-control shadow-none" id="" placeholder="192.168.1.2" value={provider3IP} onChange={ev => {ev.preventDefault(); setProvider3IP(ev.target.value);}}/>
                                    <div className="input-group-append" style={{"paddingLeft": "1px"}}>
                                        <button className="btn btn-outline-dark rounded-0 rounded-end" type="submit" onClick={ev => {ev.preventDefault(); send(provider3IP,3);}}> 
                                            Submit
                                        </button>
                                    </div>
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
                                    <button type="submit" className="btn btn-dark" onClick={ev => {ev.preventDefault(); next();}}>
                                        <span>Next </span>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-arrow-right-circle-fill" viewBox="0 0 16 16">
                                            <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0zM4.5 7.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H4.5z"/>
                                        </svg>
                                    </button>
                                </div>
                            </div>
                            <div className="progress mt-3">
                                <div className="progress-bar bg-dark" role="progressbar" style={{width: "25%"}} aria-valuenow="75" aria-valuemin="0" aria-valuemax="100"></div>
                            </div>
                            {/* <div className="text-danger ml-2">{status === "error" ? "Error" : ""}</div> */}
                        </form>
                    </div>
                    <div className='col-4'></div>
                </div>
            </div>
    );
}

export default Providers;