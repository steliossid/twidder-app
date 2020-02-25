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
    fillUserDetails();
    displayPosts();
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
		document.getElementById('signup_message').innerHTML = "Password has to be at least 5 digits!";
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
		country:  document.getElementById('country').value
	  };
    //var temp_string = JSON.paarse
	//console.log(user)
    //serverstub.signUp(user)
    localStorage.setItem("response", JSON.stringify(serverstub.signUp(user)));
    response = JSON.parse(localStorage.getItem("response"));

	  //response = serverstub.signUp(user);

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

  localStorage.setItem("response", JSON.stringify(serverstub.signIn(email, password)));
  response = JSON.parse(localStorage.getItem("response"));
	//response = serverstub.signIn(email, password);

	if(response['success']){
		localStorage.setItem("isLoggedIn", true);
		displayView(isLoggedIn=localStorage.getItem("isLoggedIn"));

	}
	if(response['message']=="Wrong username or password."){
		document.getElementById("signin_message").style.color = 'red';
		document.getElementById("signin_message").innerHTML = response['message'];
	}

	//return response['success'];
};

var signOutMechanism = function(){
  response = JSON.parse(localStorage.getItem("response"));
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

//serverstub.signIn(serverstub.getUserDataByToken(response['data'])['data']['email'],serverstub.signIn(email, password))
var check_old_pass = function(){
  response = JSON.parse(localStorage.getItem("response"));
	temp = serverstub.signIn(serverstub.getUserDataByToken(response['data'])['data']['email'],document.getElementById('old_password').value)
	if(document.getElementById('old_password').value.length>4){
	  if (temp['success']) {
		document.getElementById('old_password_message').style.color = 'green';
		document.getElementById('old_password_message').innerHTML = 'Old Password is correct';
	  }else {
		document.getElementById('old_password_message').style.color = 'red';
		document.getElementById('old_password_message').innerHTML = 'Old Password is not correct';
	  }
	}else{
		document.getElementById('old_password_message').style.color = 'red';
		document.getElementById('old_password_message').innerHTML = "Password needs to be at least 5 digits!";
	}
}

var check_pass_change = function() {
	if(document.getElementById('new_password').value.length>4){
	  if(document.getElementById('new_password').value == document.getElementById('rep_new_password').value) {
		document.getElementById('new_password_message').style.color = 'green';
		document.getElementById('new_password_message').innerHTML = 'Password matching';
	  }else{
		document.getElementById('new_password_message').style.color = 'red';
		document.getElementById('new_password_message').innerHTML = 'Password not matching';
	  }
	  if(document.getElementById('new_password').value == document.getElementById('old_password').value){
		document.getElementById('new_old_password_message').style.color = 'red';
		document.getElementById('new_old_password_message').innerHTML = 'Password needs to be different from the old password';
	  }
	}else{
		document.getElementById('new_password_message').style.color = 'red';
		document.getElementById('new_password_message').innerHTML = "Password needs to be at least 5 digits!";
	}
}

var changepassMechanism = function(){
	if(document.getElementById('new_password').value.length>4){
		if ((document.getElementById('new_password').value == document.getElementById('rep_new_password').value) && temp['success']==true && (document.getElementById('new_password').value != document.getElementById('old_password').value)){
			serverstub.changePassword(response['data'], document.getElementById('old_password').value, document.getElementById('new_password').value)
			var frm = document.getElementById('formChangePassword');
			frm.reset();
			document.getElementById('old_password_message').innerHTML = "";
			document.getElementById('new_password_message').innerHTML = "";
		}
	}
}

var searchMechanism = function(){
  response = JSON.parse(localStorage.getItem("response"));
	if(document.getElementById('search_email').value!=""){
		resp = serverstub.getUserDataByEmail(response['data'],document.getElementById('search_email').value)
		if(resp['success']){
			document.getElementById('user_search_message').style.color = 'green';
			document.getElementById('user_search_message').innerHTML = resp['message'];
			fillUserDetailsOthers();
			displayPostsOthers();
		}else{
			document.getElementById('user_search_message').style.color = 'red';
			document.getElementById('user_search_message').innerHTML = resp['message'];
		}
	}else{
		document.getElementById('user_search_message').innerHTML = "";
	}
	//to resp exei mesa ta stoixeia
}

fillUserDetails = function(){
  response = JSON.parse(localStorage.getItem("response"));
  //loggedinusers = JSON.parse(localStorage.getItem("loggedinusers"));
  //users = JSON.parse(localStorage.getItem("users"));
  //loggedinuser_details = users[loggedinusers[response["data"]]];
  //isLoggedIn = JSON.parse(localStorage.getItem("isLoggedIn"));
  loggedinuser = serverstub.getUserDataByToken(response["data"]);

  if(loggedinuser["success"]){
    firstname = loggedinuser["data"]["firstname"];
    familyname = loggedinuser["data"]["familyname"];
    email = loggedinuser["data"]["email"];
    gender = loggedinuser["data"]["gender"];
    city = loggedinuser["data"]["city"];
    country = loggedinuser["data"]["country"];

    document.getElementById('right_first_name').innerHTML = firstname;
    document.getElementById('right_family_name').innerHTML = familyname;
    document.getElementById('right_email').innerHTML = email;
    document.getElementById('right_gender').innerHTML = gender;
    document.getElementById('right_city').innerHTML = city;
    document.getElementById('right_country').innerHTML = country;
  }
}

postMessage = function(){
  response = JSON.parse(localStorage.getItem("response"));
  token = response["data"];
  loggedInUser = serverstub.getUserDataByToken(token);
  
  if(loggedInUser["success"]){
    message = document.getElementById("post_text").value;
    email = loggedInUser["data"]["email"];
    postMessage_res = serverstub.postMessage(token, message, email);
    if(postMessage_res["success"]){
	  document.getElementById('post_message').style.color = 'green';
      post_message = postMessage_res["message"];
    }
    else{
	  document.getElementById('post_message').style.color = 'red';
      post_message = "Message couldn't be posted";
    }
	
    document.getElementById("post_message").innerHTML = post_message;
	document.getElementById("post_text").value = "";
	displayPosts();
  }
}

displayPosts = function(){
  response = JSON.parse(localStorage.getItem("response"));
  token = response["data"];
  userMessages = serverstub.getUserMessagesByToken(token);
  var i;
  document.getElementById("wall_posts").innerHTML = "";
  n = userMessages["data"]["length"];
  if(n>0){
    for(i = 0; i < n; i++){
      message = userMessages["data"][i]["content"];
      document.getElementById("wall_posts").innerHTML +=
            "<p>".concat(message, "</p>");
    }
  }
}

refreshWall = function(){
	displayPosts();
}

refreshWallOthers = function(){
	displayPostsOthers();
}

postMessageToOthers = function(){
  response = JSON.parse(localStorage.getItem("response"));
  token = response["data"];
  loggedInUser = serverstub.getUserDataByToken(token);

  if(loggedInUser["success"]){
    message = document.getElementById("post_text_others").value;
    email = document.getElementById('search_email').value;
    postMessage_res = serverstub.postMessage(token, message, email);
    if(postMessage_res["success"]){
	  document.getElementById('post_message_others').style.color = 'green';
      post_message = postMessage_res["message"];
    }
    else{
	  document.getElementById('post_message_others').style.color = 'red';
      post_message = "Message couldn't be posted";
    }
    document.getElementById("post_message_others").innerHTML = post_message;
	displayPostsOthers();
  }
}

displayPostsOthers = function(){
  response = JSON.parse(localStorage.getItem("response"));
  token = response["data"];
  email = document.getElementById('search_email').value;
  userMessages = serverstub.getUserMessagesByEmail(token,email);
  var i;
  document.getElementById("others_wall_posts").innerHTML = "";
  n = userMessages["data"]["length"];
  if(n>0){
    for(i = 0; i < n; i++){
      message = userMessages["data"][i]["content"];
      document.getElementById("others_wall_posts").innerHTML +=
            "<p>".concat(message, "</p>");
    }
  }
}

fillUserDetailsOthers = function(){
  response = JSON.parse(localStorage.getItem("response"));
  //loggedinusers = JSON.parse(localStorage.getItem("loggedinusers"));
  //users = JSON.parse(localStorage.getItem("users"));
  //loggedinuser_details = users[loggedinusers[response["data"]]];
  //isLoggedIn = JSON.parse(localStorage.getItem("isLoggedIn"));
  email = document.getElementById('search_email').value;
  loggedinuser = serverstub.getUserDataByEmail(response["data"],email);

  if(loggedinuser["success"]){
    firstname = loggedinuser["data"]["firstname"];
    familyname = loggedinuser["data"]["familyname"];
    email = loggedinuser["data"]["email"];
    gender = loggedinuser["data"]["gender"];
    city = loggedinuser["data"]["city"];
    country = loggedinuser["data"]["country"];

    document.getElementById('right_first_name1').innerHTML = firstname;
    document.getElementById('right_family_name1').innerHTML = familyname;
    document.getElementById('right_email1').innerHTML = email;
    document.getElementById('right_gender1').innerHTML = gender;
    document.getElementById('right_city1').innerHTML = city;
    document.getElementById('right_country1').innerHTML = country;
  }
}


