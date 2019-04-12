window.loginUser = function(){

	let payload = {};
	let manifest = require('../../../../../webpack/manifest.js');

	payload["email"] = document.getElementById("login-user-email").value;
	payload["password"] = document.getElementById("login-user-password").value;

    $.ajax({
        url: manifest.PETER_URL + 'auth/login',

        type: "POST",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(payload),

        success: function(response){
        	localStorage.setItem('logged_in', true);
        	localStorage.setItem('PETER_API_KEY', response["Authorization"]);
            localStorage.setItem('mica_version', response["mica_version"]);
            localStorage.setItem('username', response["username"]);
            localStorage.setItem('org_id', response["org_id"]);
		    window.location.href = "/regulation_schema.html";
        }, 

        error: function(XMLHttpRequest, textStatus, errorThrown) { 
        	localStorage.setItem('logged_in', false);
        	alert("Incorrect Login Credentials");
        }
	})	
}

window.logoutUser = function(){
    localStorage.setItem('logged_in', false);
    localStorage.setItem('PETER_API_KEY', null);
}

window.logoutIfBadToken = function(errorMessage){

    let possibleBadMessages = ["Signature expired. Please log in again.", "Invalid token. Please log in again."];

    if (possibleBadMessages.includes(errorMessage)){
        logoutUser();   
        window.location.href = "index.html";
    }

}