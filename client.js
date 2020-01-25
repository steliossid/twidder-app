window.onload = function(){
  //code that is executed as the page is loaded.
  var welcome = document.getElementById("welcomeview").innerHTML;
  var profile = document.getElementById("profileview").innerHTML;
  displayView(welcome, profile);
};

displayView = function(welcome, profile){
  // the code required to display a view
  var isLoggedIn = false;

  if (!isLoggedIn) {
    var display = welcome;
  }
  else {
    var display = profile;
  }
  document.getElementById("content").innerHTML = display;
};

var validSignupPassword = function(){
  // Validation of Password at Signup
  // 1) Both password fields must contain the same string
  // 2) Password is at least X characters long
  var password = document.getElementById("signup_password").value;
  var rep_password = document.getElementById("signup_rep_password").value;
  var flag;
  var message;

  if(password.length>4){
    if(password==rep_password){
      message = "Password correct!";
      flag = true;
    }
    else{
      message = "Passwords don't match!";
      flag = false;
    }
  }
  else{
    message = "Password needs to be at least 5 digits!";
    flag = false;
  }

  document.getElementById("signup_password_message").innerHTML = message;
  return flag;
};

var validSignInPassword = function(){
  // Validation of Password at SignIn
  // 1) Password is at least X characters long
  var password = document.getElementById("signin_password").value;
  var flag;
  var message;

  if(password.length>4){
    message = "Password correct!";
    flag = true;
  }
  else{
    message = "Password needs to be at least 5 digits!";
    flag = false;
  }
  document.getElementById("signin_password_message").innerHTML = message;
  return flag;
};

var signUpMechanism = function(){
  var m = document.getElementById("selectmenu");
  var user = {
    email: document.getElementById('email').value,
		password: document.getElementById('password').value,
		firstname: document.getElementById('firstname').value,
		familyname: document.getElementById('lastname').value,
		gender: m.options[m.selectedIndex].value,
		city: document.getElementById('city').value,
		country: document.getElementById('country').value
  };

	var response = serverstub.signUp(user);
  var frm = document.getElementsByName('formSignup')[0];
	frm.reset();
	return false;
};

var signInMechanism = function(){
  email = document.getElementById('signin_username').value;
	password = document.getElementById('signin_password').value;
	var response = serverstub.signIn(email, password);

  if(response['success'] == true){
		alert("Signed-in");
		document.getElementById("content").innerHTML = document.getElementById("profileview").innerHTML;
	};
};
