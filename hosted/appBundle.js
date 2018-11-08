"use strict";

var handlePost = function handlePost(e) {
    e.preventDefault();

    if ($("#title").val() == '' || $("#text").val() == '') {
        handleError("Please fill out all fields.");
        return false;
    };

    sendAjax('POST', $("#postForm").attr("action"), $("#postForm").serialize(), redirect);

    return false;
};

var handleDelete = function handleDelete(e) {
    e.preventDefault();

    sendAjax('DELETE', $("#deletePost").attr("action"), $("#deletePost").serialize(), function () {
        loadPostsFromServer($("#token").val());
    });
};

var PostAdd = function PostAdd(props) {
    return React.createElement(
        "form",
        { id: "postForm",
            name: "postForm",
            onSubmit: handlePost,
            action: "/addPost",
            method: "POST",
            className: "mainForm"
        },
        React.createElement(
            "div",
            { "class": "form-group row" },
            React.createElement("input", { "class": "form-control", id: "title", type: "text", name: "title", placeholder: "Title" })
        ),
        React.createElement(
            "div",
            { "class": "form-group" },
            React.createElement("textarea", { "class": "form-control", id: "text", name: "text", rows: "3", placeholder: "Text here" })
        ),
        React.createElement("input", { type: "hidden", id: "token", name: "_csrf", value: props.csrf }),
        React.createElement(
            "button",
            { "class": "btn btn-primary", type: "submit" },
            "Make Post"
        )
    );
};

var PostList = function PostList(props) {
    if (props.posts.length === 0) {
        return React.createElement(
            "div",
            { "class": "post" },
            React.createElement(
                "h3",
                null,
                "No posts yet"
            )
        );
    }

    var postNodes = props.posts.map(function (post) {
        if (post.owner === props.id) {
            return React.createElement(
                "div",
                { key: post._id, className: "post" },
                React.createElement(
                    "h3",
                    { className: "postTitle" },
                    post.title
                ),
                React.createElement(
                    "p",
                    { className: "postText" },
                    post.text
                ),
                React.createElement(
                    "form",
                    { id: "deletePost",
                        onSubmit: handleDelete,
                        name: "deletePost",
                        action: "/deletePost",
                        method: "DELETE"
                    },
                    React.createElement("input", { type: "hidden", name: "_id", value: post._id }),
                    React.createElement("input", { type: "hidden", id: "token", name: "_csrf", value: props.csrf }),
                    React.createElement("input", { type: "submit", value: "Delete?" })
                )
            );
        } else {
            return React.createElement(
                "div",
                { key: post._id, className: "post" },
                React.createElement(
                    "h3",
                    { className: "postTitle" },
                    post.title
                ),
                React.createElement(
                    "p",
                    { className: "postText" },
                    post.text
                )
            );
        }
    });

    return React.createElement(
        "div",
        { className: "postList" },
        postNodes
    );
};

var loadPostsFromServer = function loadPostsFromServer(csrf) {
    sendAjax('GET', '/getPosts', null, function (data) {
        ReactDOM.render(React.createElement(PostList, { posts: data.posts, csrf: csrf, id: data.userID }), document.querySelector("#content"));
    });
};

var createPostAddWindow = function createPostAddWindow(csrf) {
    ReactDOM.render(React.createElement(PostAdd, { csrf: csrf }), document.querySelector("#content"));
};

var setup = function setup(csrf) {
    var postButton = document.querySelector("#postButton");

    postButton.addEventListener("click", function (e) {
        e.preventDefault();
        createPostAddWindow(csrf);
        return false;
    });

    ReactDOM.render(React.createElement(PostList, { posts: [], csrf: csrf, id: -1 }), document.querySelector("#content"));

    loadPostsFromServer(csrf);
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