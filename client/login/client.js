const handleLogin = (e) => {
    e.preventDefault();

    if($("#user").val() == '' || $("#pass").val() == '') {
        handleError("Username or password is empty");
        return false;
    }
    
    sendAjax('POST', $("#loginForm").attr("action"), $("#loginForm").serialize(), redirect);

    return false;
}

const handleSignup = (e) => {
    e.preventDefault();


    if($("#user").val() == '' || $("#pass").val() == '' || $("#pass2").val() == '') {
        handleError("All fields are required!");
        return false;
    }

    if($("#pass").val() !== $("#pass2").val()) {
        handleError("Passwords do not match!");
        return false;
    }

    sendAjax('POST', $("#signupForm").attr("action"), $("#signupForm").serialize(), redirect);

    return false;
};

const LoginWindow = (props) => {
    return (
        <form id="loginForm" 
            name="loginForm" 
            onSubmit={handleLogin} 
            action="/login" 
            method="POST" 
            className="mainForm"
        >
            <div class="form-group row">
                <label class="col-sm-2 col-form-label" htmlFor="username">Username: </label>
                <input class="form-control" id="user" type="text" name="username" placeholder="username"/>
            </div>
            <div class="form-group row">
                <label class="col-sm-2 col-form-label" htmlFor="pass">Password: </label>
                <input class="form-control" id="pass" type="password" name="pass" placeholder="password"/>
            </div>
            <input type="hidden" name="_csrf" value={props.csrf}/>
            <button class="btn btn-primary" type="submit">Sign In</button>
        </form>
    );
};

const SignupWindow = (props) => {
    return (
        <form id="signupForm" 
            name="signupForm" 
            onSubmit={handleSignup} 
            action="/signup" 
            method="POST" 
            className="mainForm"
        >
            <div class="form-group row">
                <label htmlFor="username">Username: </label>
                <input class="form-control" id="user" type="text" name="username" placeholder="username"/>
            </div>
            <div class="form-group row">
                <label htmlFor="pass">Password: </label>
                <input class="form-control" id="pass" type="password" name="pass" placeholder="password"/>
            </div>
            <div class="form-group row">
                <label htmlFor="pass2">Password: </label>
                <input class="form-control" id="pass2" type="password" name="pass2" placeholder="retype password"/>
            </div>
            <input type="hidden" name="_csrf" value={props.csrf}/>
            <button class="btn btn-outline-primary" type="submit">Sign Up</button>
        </form>
    );
};

const createLoginWindow = (csrf) => {
    ReactDOM.render(
        <LoginWindow csrf={csrf} />,
        document.querySelector("#content")
    );
};

const createSignupWindow = (csrf) => {
    ReactDOM.render(
        <SignupWindow csrf={csrf} />,
        document.querySelector("#content")
    );
};

const setup = (csrf) => {
    const loginButton = document.querySelector("#loginButton");
    const signupButton = document.querySelector("#signupButton");

    signupButton.addEventListener("click", (e) => {
        e.preventDefault();
        createSignupWindow(csrf);
        return false;
    });

    loginButton.addEventListener("click", (e) => {
        e.preventDefault();
        createLoginWindow(csrf);
        return false;
    });

    createLoginWindow(csrf);
};
