import {useNavigate} from "react-router-dom";

const Home = () => {

    let navigate = useNavigate();

    return (
            <div className='container mt-3'>
                <div className='row pt-5'>
                    <section className="d-flex align-items-center">
                        <div className="col-1"></div>
                        <div className="col-5 d-flex flex-column justify-content-center pe-4 me-3 mt-3">
                            <div style={{textAlign: "justify"}}>
                                <h1 className="display-5 ">Welcome to Social</h1>
                                <h3 className="lead" style={{color: "#2f5899", fontSize: "28px", textAlign: "justify"}} >The first Open and Decentralized platform.</h3>
                                <h3 className="lead small" style={{color: "#2f5899", fontSize: "22px", textAlign: "justify"}} >Manage your own keys, Social is the first social media implementing Self Sovereign Identity and Self Data Governance.</h3>
                            </div>
                            <div>
                                <div className="text-center text-lg-start mt-2">
                                    <style type="text/css">
                                                        {`
                                                            #getStartedButton{background-color:#c2377e !important; border-color:#af2e70; color:white}
                                                            #getStartedButton:hover{background-color:#861850 !important; border-color:#861850; color:white}
                                                        `}
                                    </style>
                                    <button id="getStartedButton" className="btn d-inline-flex align-items-center justify-content-center align-self-center" onClick={()=>{navigate("/signup")}}>
                                        <span>Get Started</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="col-5">
                            <img src="/hero-img.png" className="img-fluid m-5" alt="" width="450" height="450"></img>
                        </div>
                        <div className="col-1"></div>
                    </section>
                </div>
            </div> 
    );
}

export default Home;