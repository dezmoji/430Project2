const Alert = (props) =>{
    return (
    <div class="alert alert-danger alert-dismissible" role="alert">
        <p id="errorMessage">{props.message}</p>
        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
            <span aria-hidden="true">&times;</span>
        </button>
    </div>);
};

//  <button type="button" id="closeButton" onClick={removeAlert}>&times;</button>
const removeAlert = () =>{
    $("#error").remove(".alert");
};

const handleError = (message) =>{
    ReactDOM.render(
        <Alert message={message} />, document.querySelector("#error"));
};

const redirect = (response) => {
    window.location = response.redirect;
};

const sendAjax = (type, action, data, success) =>{
    $.ajax({
        cache: false,
        type: type,
        url: action,
        data: data,
        dataType: "json",
        success: success,
        error: function(xhr, status, error){
            var messageObj = JSON.parse(xhr.responseText);
            handleError(messageObj.error);
        }
    });
};

const getToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        setup(result.csrfToken);
    });
};

$(document).ready(function() {
    getToken();
});