import {drizzleReactHooks} from '@drizzle/react-plugin';
import {useNavigate} from "react-router-dom";

const Signup = () => {

    const { useDrizzleState } = drizzleReactHooks;
    const drizzleState = useDrizzleState(state => state);

    let navigate = useNavigate(); 

    return(  
            <div className='container-fluid pl-0 pr-0'>
                <div className='row'>
                </div>
                <div className='row p-4'>
                    <div className='col-4 ml-0 pl-0'></div>
                    <div className='col-4'>
                        <form>
                            <div className="form-group mb-2">
                                <label>Ethereum address</label>
                                <input type="" className="form-control shadow-none" id="" value={drizzleState.accounts[0]} readOnly/>
                            </div>
                        </form>
                        <button type="button" className="btn btn-dark" onClick={ev => {ev.preventDefault(); navigate("/account/providers");}}> 
                            Sign up 
                        </button>
                    </div>
                    <div className='col-4'></div>
                </div>
            </div>
    );
};

export default Signup;