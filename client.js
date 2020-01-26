var response = {};
//var isLoggedIn = {};


window.onload = function(){
  //code that is executed as the page is loaded.
  if(localStorage.getItem("isLoggedIn") == null){
	  localStorage.setItem("isLoggedIn", false);
	  displayView(isLoggedIn=localStorage.getItem("isLoggedIn"));
  }else if(localStorage.getItem("isLoggedIn") == "true"){
	  displayView(isLoggedIn=localStorage.getItem("isLoggedIn"));
  }else if(localStorage.getItem("isLoggedIn") == "false"){
	  displayView(isLoggedIn=localStorage.getItem("isLoggedIn"));
  }
};

displayView = function(isLoggedIn){
  // the code required to display a view
  var welcome = document.getElementById("welcomeview").innerHTML;
  var profile = document.getElementById("profileview").innerHTML;
  if (isLoggedIn == "false") {
    var display = welcome;
  }
  else {
    var display = profile;
  }

  document.getElementById("content").innerHTML = display;

  if (display==profile){
    document.getElementById("defaultOpen").click();
  }
};

var check = function() {
	if(document.getElementById('signup_password').value.length>4){
	  if (document.getElementById('signup_password').value == document.getElementById('signup_rep_password').value) {
		document.getElementById('signup_message').style.color = 'green';
		document.getElementById('signup_message').innerHTML = 'Password matching';
	  } else {
		document.getElementById('signup_message').style.color = 'red';
		document.getElementById('signup_message').innerHTML = 'Password not matching';
	  }
	}else{
		document.getElementById('signup_message').style.color = 'red';
		document.getElementById('signup_message').innerHTML = "Password needs to be at least 5 digits!";
	}
}

var validSignInPassword = function(){
  // Validation of Password at SignIn
  // 1) Password is at least X characters long
  var password = document.getElementById("signin_password").value;
  var flag;
  var message;

  if(password.length>4){
	document.getElementById('signin_message').style.color = 'green';
    message = "Satisfies the length condition!";
    flag = true;
  }
  else{
	document.getElementById('signin_message').style.color = 'red';
    message = "Needs to be at least 5 digits!";
    flag = false;
  }
  
  document.getElementById("signin_message").innerHTML = message;
  return flag;
};

var signUpMechanism = function(){
	if(document.getElementById('signup_message').innerHTML=='Password matching'){
	  var m = document.getElementById("selectmenu");
	  var user = {
		email: document.getElementById('signup_username').value,
		password: document.getElementById('signup_password').value,
		firstname: document.getElementById('firstname').value,
		familyname: document.getElementById('lastname').value,
		gender: m.options[m.selectedIndex].value,
		city: document.getElementById('city').value,
		country: document.getElementById('country').value
	  };
	  response = serverstub.signUp(user);
	  if(response['message']=='User already exists.'){
		document.getElementById("signup_username_message").style.color = 'red';
		document.getElementById("signup_username_message").innerHTML = response['message'];
	  }else{
		document.getElementById("signup_username_message").style.color = 'green';
		document.getElementById("signup_username_message").innerHTML = response['message'];
	  }
	  if(response['success']){
		var frm = document.getElementById('formSignup');
		frm.reset();
		document.getElementById('signup_message').innerHTML = "";
		// User must be redirected/logged in to his/her page
	  }
	}
  
  //document.getElementById("signup_username_message").innerHTML = response['message'];
  //return response['success'];
};

var signInMechanism = function(){
	email = document.getElementById('signin_username').value;
	password = document.getElementById('signin_password').value;
	response = serverstub.signIn(email, password);

	if(response['success']){
		localStorage.setItem("isLoggedIn", true);
		displayView(isLoggedIn=localStorage.getItem("isLoggedIn"));
		
	}
	if(response['message']=="Wrong username or password."){
		document.getElementById("signin_message").style.color = 'red';
		document.getElementById("signin_message").innerHTML = response['message'];
	}
	
	return response['success'];
};

var signOutMechanism = function(){
	serverstub.signOut(response['data']);
	localStorage.setItem("isLoggedIn", false);
	displayView(isLoggedIn=localStorage.getItem("isLoggedIn"));
}

openTab = function(e, tabID){
  var i, tabcontent, tablinks;

  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }

  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }

  document.getElementById(tabID).style.display = "block";
  e.currentTarget.className += " active";
}