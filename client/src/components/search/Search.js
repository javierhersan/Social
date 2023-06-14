import {drizzleReactHooks} from '@drizzle/react-plugin';
import { useState, useEffect} from "react";
import {useNavigate} from "react-router-dom";
import Dropdown from 'react-bootstrap/Dropdown';

const Search = () => {

    let navigate = useNavigate();
    // const { useDrizzle } = drizzleReactHooks;
    // const {useCacheCall, /*useCacheSend*/} = useDrizzle();

    let [text, setText] = useState("");

    let [searchByAddress, setSearchByAddress] = useState(true);
    let [searchByUsername, setSearchByUsername] = useState(false);

    const { useDrizzle } = drizzleReactHooks;
    const {useCacheCall, /*useCacheSend*/} = useDrizzle();
    let usernameOwner = useCacheCall("DNS", "dns", text);
    useEffect(()=>{
        
    }, [searchByAddress, searchByUsername]);

    let search = () => {
        if(searchByAddress){
            let address = text;
            navigate("/account/"+address);
        } else if (searchByUsername){
            let address = usernameOwner;
            navigate("/account/"+address);
        }
        
    }

    return(  
            <div className='container-fluid pl-0 pr-0'>
                <div className='row pt-4'>
                    <div className='col-4 ml-0 pl-0'></div>
                    <div className='col-4 mb-5'>
                        <form>
                            <div className="input-group mb-1">
                                <input type="" value={text} className="form-control shadow-none" id="" placeholder={searchByAddress ? "0x87A1F179A2d2272f2Fc326fFAFcB12Eca6C867a1" : "Enter username"} onChange={ev => {ev.preventDefault(); setText(ev.target.value);}}/>
                                <Dropdown>
                                    <style>
                                        {`
                                            .dropdown-item:active{ background-color: gray; }
                                        `}
                                    </style>
                                    <Dropdown.Toggle className="bg-secondary rounded-0 rounded-end border border-secondary" variant="success" id="dropdown-basic">
                                        {searchByAddress ? "By address " : ""}
                                        {searchByUsername ? "By username " : ""}
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu>
                                        <Dropdown.Item onClick={(ev) => {setSearchByAddress(true); setSearchByUsername(false);}}>By address</Dropdown.Item>
                                        <Dropdown.Item onClick={(ev) => {setSearchByAddress(false); setSearchByUsername(true);}}>By username</Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                            </div>
                            <div className="">
                                <button type="submit" className="btn btn-dark mr-2" onClick={ev => {ev.preventDefault(); search();}}>
                                    Search
                                </button>
                            </div>
                            <div className="text-danger ml-2">{}</div>
                            
                        </form>
                    </div>
                    <div className='col-4'></div>
                </div>
            </div>
    );
};

export default Search;