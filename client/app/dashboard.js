const handlePost = (e) => {
    e.preventDefault();

    if($("#title").val() == '' || $("#text").val() == ''){
        handleError("Please fill out all fields.");
        return false;
    };
    
    sendAjax('POST', $("#postForm").attr("action"), $("#postForm").serialize(), redirect);

    return false;
};

const handleDelete = (e) => {
    e.preventDefault();

    sendAjax('DELETE', $("#deletePost").attr("action"), $("#deletePost").serialize(), function(){
        loadPostsFromServer($("#token").val());
    });
};

const PostAdd = (props) =>{
    return(
        <form id="postForm" 
        name="postForm" 
        onSubmit={handlePost} 
        action="/addPost" 
        method="POST" 
        className="mainForm"
        >
            <div class="form-group row">
                <input class="form-control" id="title" type="text" name="title" placeholder="Title"/>
            </div>
            <div class="form-group">
                <textarea class="form-control" id="text" name="text" rows="3" placeholder="Text here"></textarea>
            </div>
            <input type="hidden" id="token" name="_csrf" value={props.csrf}/>
            <button class="btn btn-primary" type="submit">Make Post</button>
        </form>
    );
};

const PostList = (props) =>{
    if(props.posts.length === 0){
        return(
            <div class="post">
                <h3>No posts yet</h3>
            </div>
        );
    }

    const postNodes = props.posts.map(function(post){
        if(post.owner === props.id){
        return (
            <div key={post._id} className="post">
                <h3 className="postTitle">{post.title}</h3>
                <p className="postText">{post.text}</p>
                <form id="deletePost"
                    onSubmit={handleDelete}
                    name="deletePost"
                    action="/deletePost"
                    method="DELETE"
                >
                    <input type="hidden" name="_id" value={post._id}/>
                    <input type="hidden" id="token" name="_csrf" value={props.csrf}/>
                    <input type="submit" value="Delete?"/>
                </form>
            </div>
        )}
        else{
            return (
                <div key={post._id} className="post">
                    <h3 className="postTitle">{post.title}</h3>
                    <p className="postText">{post.text}</p>
                </div>
            )
        }
    });

    return (
        <div className="postList">
            {postNodes}
        </div>
    )
}; 

const loadPostsFromServer = (csrf) =>{
    sendAjax('GET', '/getPosts', null, (data) =>{
        ReactDOM.render(
            <PostList posts={data.posts} csrf={csrf} id={data.userID}/>, document.querySelector("#content")
        );
    });
};

const createPostAddWindow = (csrf) => {
    ReactDOM.render(
        <PostAdd csrf={csrf} />, document.querySelector("#content")
    );
};

const setup = function(csrf) {
    const postButton = document.querySelector("#postButton");

    postButton.addEventListener("click", (e) => {
        e.preventDefault();
        createPostAddWindow(csrf);
        return false;
    });

    ReactDOM.render(
        <PostList posts={[]} csrf={csrf} id={-1}/>, document.querySelector("#content")
    );

    loadPostsFromServer(csrf);
};
