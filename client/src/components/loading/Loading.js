import {drizzleReactHooks} from '@drizzle/react-plugin';
import {useState, useEffect} from "react";
import {useNavigate} from "react-router-dom";
import Metamask from "../logos/Metamask";

const { useDrizzleState } = drizzleReactHooks;

const Loading = ({children}) => {

    // TODO: If no username login
    // TODO: Check if the user has providers, if not redirect him to sign up

    let navigate = useNavigate();

    const drizzleState = useDrizzleState(state => state);
    const initialized = useDrizzleState(state => state.drizzleStatus.initialized);

    let [visibility, setVisibility] = useState(false);

    useEffect(()=>{
        if (window.ethereum) {
            window.ethereum.on("chainChanged", () => {
                navigate(0)
            });
            window.ethereum.on("accountsChanged", () => {
                navigate(0)
            });
        }
    });

    const connectWallet = async () => {
        try{
            if (typeof window != "undefined" && typeof window.ethereum != "undefined") {
                await window.ethereum.request({ method: 'eth_requestAccounts' })
                navigate(0)
            }
        } catch(err){
            if (err.code === 4001) {
                console.log('Please connect to MetaMask');
                console.log("Error: ", err.code);
            } else {
                console.error("Unexpected error: ", err.code);
            }
        }
    };

    // Check if MetaMask wallet is installed in the browser
    if (typeof window.ethereum === "undefined"){
        // typeof window === "undefined" || 
        return (
                    <div className='container-fluid pl-0 pr-0 '>
                        <div className='row'>
                            <div className='col-4 ml-0 pl-0'></div>
                            <div className='col-4 mt-5'>
                                <div className="card">
                                    <div className="card-body">
                                        <h3 className="card-title d-flex justify-content-center mb-4">⚠️ Install MetaMask</h3>
                                        <div className="d-flex justify-content-center">
                                            <button className="btn btn-dark" onClick={ev => {ev.preventDefault(); navigate(0);}}>
                                                <span className="pr-3">Reload </span> 
                                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="bi bi-arrow-clockwise" viewBox="0 0 16 16">
                                                    <path fillRule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z"/>
                                                    <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z"/>
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='col-4 ml-0 pl-0'></div>
                        </div>
                    </div>
                );
    } 

    // Check if MetaMask is connected to Ganache Network
    if (window.ethereum.chainId && window.ethereum.chainId !== "0x539") {
        return (
                    <div className='container-fluid pl-0 pr-0 '>
                        <div className='row'>
                            <div className='col-4 ml-0 pl-0'></div>
                            <div className='col-4 mt-5'>
                                <div className="card">
                                    <div className="card-body">
                                        <h3 className="card-title d-flex justify-content-center mb-4">⚠️ Use Ganache Network (0x539)</h3>
                                        <div className="lead d-flex justify-content-center"> Current network: {window.ethereum.chainId}</div>
                                    </div>
                                </div>
                                <div className="d-flex justify-content-center mt-4">
                                    <div className="card" style={{width: '18rem'}}>
                                        <div className="card-body">
                                            <h5 className="card-title">Connect wallet</h5>
                                            <p className="card-text">
                                                By connecting a wallet, you agree to Social's <a href="/terms" className='text-dark'><b><u>Terms of Service</u></b></a> and acknowledge that you have read and understand the protocol disclaimer.
                                            </p>
                                            <button type="submit" className="btn btn-light border border-dark" onClick={ev => {ev.preventDefault(); connectWallet(); /*navigate(0);/*routeChange();*/}}>
                                                <Metamask/>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='col-4 ml-0 pl-0'></div>
                        </div>
                    </div>
                );
    } 

    // If drizzle store is not initialized 
    // TODO: ...
    if (!initialized) {
        setTimeout(() => { setVisibility(true) }, 5000);
        return (    
                    <div className='container-fluid pl-0 pr-0 '>
                        <div className='row'>
                            <div className='col-4 ml-0 pl-0'></div>
                            <div className='col-4 mt-5'>
                                <div className="text-center mb-3">
                                    <div style={{width: '20px', height: '20px'}} className="spinner-border" role="status">
                                        <span className="sr-only"></span>
                                    </div>
                                    <b className="h4"> Loading...</b>
                                </div>
                                {
                                    visibility ?  (
                                        <div className="card">
                                            <div className="card-body">
                                                ⚠️ If the problem persist, please open your browser extensions and check if MetaMask is already opened.
                                            </div>
                                        </div>
                                    ) : (
                                        <></>
                                    )  
                                }
                            </div>
                            <div className='col-4 ml-0 pl-0'></div>
                        </div>
                    </div>
                );
    }

    // Check if MetaMask wallet is connected to the dapp 
    if (typeof(drizzleState.accounts[0])=== "undefined") {
        return (
                    <div className='container-fluid pl-0 pr-0 '>
                        <div className='row'>
                            <div className='col-4 ml-0 pl-0'></div>
                            <div className='col-4 mt-5'>
                                <div className="card">
                                    <div className="card-body">
                                        <h3 className="card-title d-flex justify-content-center">⚠️ Connect MetaMask</h3>
                                    </div>
                                </div>
                                <div className="d-flex justify-content-center mt-4">
                                    <div className="card" style={{width: '18rem'}}>
                                        <div className="card-body">
                                            <h5 className="card-title">Connect wallet</h5>
                                            <p className="card-text">
                                                By connecting a wallet, you agree to Social's <a href="/terms" className='text-dark'><b><u>Terms of Service</u></b></a> and acknowledge that you have read and understand the protocol disclaimer.
                                            </p>
                                            <button type="submit" className="btn btn-light border border-dark" onClick={ev => {ev.preventDefault(); connectWallet(); /*navigate(0);/*routeChange();*/}}>
                                                <Metamask/>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='col-4 ml-0 pl-0'></div>
                        </div>
                    </div>
                )
    } 

    return <>{children}</>

};

export default Loading;
