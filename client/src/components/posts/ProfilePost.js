import { filter } from "../../helpers/filters";
import { useState, useEffect} from "react";

const ProfilePost = (props) => {

    let [hide, setHide] = useState(filter(props.post.content));
    useEffect(()=>{

    }, [hide]);

    if(hide){
        return(
            <div className="card w-100 pt-2 pb-2 mt-2 text-center" style={{backgroundColor:"rgb(247 247 247)"}} key={props.post.header.post_id}>
                <button className="text-center btn" style={{display:"block"}} onClick={()=>{setHide(false)}}>
                    Show {" "}
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-eye" viewBox="0 0 16 16">
                        <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z"/>
                        <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z"/>
                    </svg>
                </button>
                <p style={{display:"none"}}>
                    {props.post ? props.post.header.post_id : ""}: {props.post ? props.post.content : ""}
                </p>
            </div>
            
        );
    } else {
        return(
            <div className="card w-100 pt-3 pb-0 ps-2 mt-2" style={{backgroundColor:"rgb(247 247 247)"}} key={props.post.header.post_id}>
                <p>
                    {props.post ? props.post.header.post_id : ""}: {props.post ? props.post.content : ""}
                </p>
            </div>
            
        );
    }
}

export default ProfilePost;