import ProfilePost from "./ProfilePost";

const ProfilePosts = (props) => {

    let rows = []
    
    for (let i = 0; i < props.posts.length; i++) {
        if(typeof(props.posts[i].content)!=='object'){
            rows.push(
                <ProfilePost post={props.posts[i]} key={props.posts[i].header.post_id}></ProfilePost>
            );
        }
    }

    return <div>{rows}</div>;
};

export default ProfilePosts;