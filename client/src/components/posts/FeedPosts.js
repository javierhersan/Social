import FeedPost from "./FeedPost";

const FeedPosts = (props) => {

    let rows = []
    
    for (let i = 0; i < props.posts.length; i++) {
        if(typeof(props.posts[i].content)!=='object'){
            rows.push(
                <FeedPost post={props.posts[i]} key={props.posts[i].header.address+props.posts[i].header.post_id}></FeedPost>
            );
        }
    }

    return <div>{rows}</div>;
};

export default FeedPosts;