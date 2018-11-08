"use strict";

var handleLogin = function handleLogin(e) {
    e.preventDefault();

    if ($("#user").val() == '' || $("#pass").val() == '') {
        handleError("Username or password is empty");
        return false;
    }

    sendAjax('POST', $("#loginForm").attr("action"), $("#loginForm").serialize(), redirect);

    return false;
};

var handleSignup = function handleSignup(e) {
    e.preventDefault();

    if ($("#user").val() == '' || $("#pass").val() == '' || $("#pass2").val() == '') {
        handleError("All fields are required!");
        return false;
    }

    if ($("#pass").val() !== $("#pass2").val()) {
        handleError("Passwords do not match!");
        return false;
    }

    sendAjax('POST', $("#signupForm").attr("action"), $("#signupForm").serialize(), redirect);

    return false;
};

var LoginWindow = function LoginWindow(props) {
    return React.createElement(
        "form",
        { id: "loginForm",
            name: "loginForm",
            onSubmit: handleLogin,
            action: "/login",
            method: "POST",
            className: "mainForm"
        },
        React.createElement(
            "div",
            { "class": "form-group row" },
            React.createElement(
                "label",
                { "class": "col-sm-2 col-form-label", htmlFor: "username" },
                "Username: "
            ),
            React.createElement("input", { "class": "form-control", id: "user", type: "text", name: "username", placeholder: "username" })
        ),
        React.createElement(
            "div",
            { "class": "form-group row" },
            React.createElement(
                "label",
                { "class": "col-sm-2 col-form-label", htmlFor: "pass" },
                "Password: "
            ),
            React.createElement("input", { "class": "form-control", id: "pass", type: "password", name: "pass", placeholder: "password" })
        ),
        React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf }),
        React.createElement(
            "button",
            { "class": "btn btn-primary", type: "submit" },
            "Sign In"
        )
    );
};

var SignupWindow = function SignupWindow(props) {
    return React.createElement(
        "form",
        { id: "signupForm",
            name: "signupForm",
            onSubmit: handleSignup,
            action: "/signup",
            method: "POST",
            className: "mainForm"
        },
        React.createElement(
            "div",
            { "class": "form-group row" },
            React.createElement(
                "label",
                { htmlFor: "username" },
                "Username: "
            ),
            React.createElement("input", { "class": "form-control", id: "user", type: "text", name: "username", placeholder: "username" })
        ),
        React.createElement(
            "div",
            { "class": "form-group row" },
            React.createElement(
                "label",
                { htmlFor: "pass" },
                "Password: "
            ),
            React.createElement("input", { "class": "form-control", id: "pass", type: "password", name: "pass", placeholder: "password" })
        ),
        React.createElement(
            "div",
            { "class": "form-group row" },
            React.createElement(
                "label",
                { htmlFor: "pass2" },
                "Password: "
            ),
            React.createElement("input", { "class": "form-control", id: "pass2", type: "password", name: "pass2", placeholder: "retype password" })
        ),
        React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf }),
        React.createElement(
            "button",
            { "class": "btn btn-outline-primary", type: "submit" },
            "Sign Up"
        )
    );
};

var createLoginWindow = function createLoginWindow(csrf) {
    ReactDOM.render(React.createElement(LoginWindow, { csrf: csrf }), document.querySelector("#content"));
};

var createSignupWindow = function createSignupWindow(csrf) {
    ReactDOM.render(React.createElement(SignupWindow, { csrf: csrf }), document.querySelector("#content"));
};

var setup = function setup(csrf) {
    var loginButton = document.querySelector("#loginButton");
    var signupButton = document.querySelector("#signupButton");

    signupButton.addEventListener("click", function (e) {
        e.preventDefault();
        createSignupWindow(csrf);
        return false;
    });

    loginButton.addEventListener("click", function (e) {
        e.preventDefault();
        createLoginWindow(csrf);
        return false;
    });

    createLoginWindow(csrf);
};

var Alert = function Alert(props) {
    return React.createElement(
        "div",
        { "class": "alert alert-danger alert-dismissible", role: "alert" },
        React.createElement(
            "p",
            { id: "errorMessage" },
            props.message
        ),
        React.createElement(
            "button",
            { type: "button", "class": "close", "data-dismiss": "alert", "aria-label": "Close" },
            React.createElement(
                "span",
                { "aria-hidden": "true" },
                "\xD7"
            )
        )
    );
};

//  <button type="button" id="closeButton" onClick={removeAlert}>&times;</button>
var removeAlert = function removeAlert() {
    $("#error").remove(".alert");
};

var handleError = function handleError(message) {
    ReactDOM.render(React.createElement(Alert, { message: message }), document.querySelector("#error"));
};

var redirect = function redirect(response) {
    window.location = response.redirect;
};

var sendAjax = function sendAjax(type, action, data, success) {
    $.ajax({
        cache: false,
        type: type,
        url: action,
        data: data,
        dataType: "json",
        success: success,
        error: function error(xhr, status, _error) {
            var messageObj = JSON.parse(xhr.responseText);
            handleError(messageObj.error);
        }
    });
};

var getToken = function getToken() {
    sendAjax('GET', '/getToken', null, function (result) {
        setup(result.csrfToken);
    });
};

$(document).ready(function () {
    getToken();
});