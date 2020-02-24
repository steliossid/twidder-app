window.onload = function(){    /////DONE
  //code that is executed as the page is loaded.
  try{
    var req = new XMLHttpRequest();
    req.open("GET", "/users/check_if_user_signed_in/", true);
    req.setRequestHeader("Content-type", "application/json");
    req.onreadystatechange = function(){
      if (this.readyState == 4){
        if (this.status == 200){
          var response = JSON.parse(req.responseText);
          console.log(response["success"]);
          if(response["success"]){
            displayView(isLoggedIn="true")
          }else{
            console.log("Something went wrong!")
          }
        }else if (this.status == 500){
          displayView(isLoggedIn="false")
        }
      }
    };
    req.send(JSON.stringify())
  }
  catch(e){
    console.error(e);
  }
};

displayView = function(isLoggedIn){    //////DONE
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

var check = function() {      /////////DONE
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

var validSignInPassword = function(){   ///////DONE
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

var signUpMechanism = function(){   /////////DONE
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
    try{
      var req = new XMLHttpRequest();
      req.open("POST", "/users/sign_up/", true);
      req.setRequestHeader("Content-type", "application/json");
      req.onreadystatechange = function(){
        if (this.readyState == 4){
          if (this.status == 200){
            var response = JSON.parse(req.responseText);
            console.log(response);
            if(response["success"]){
              document.getElementById("signup_username_message").style.color = 'green';
          		document.getElementById("signup_username_message").innerHTML = response['message'];
              var frm = document.getElementById('formSignup');
              frm.reset();
              document.getElementById('signup_message').innerHTML = "";
            }else{
              console.log("Something went wrong!")
            }
          }else if (this.status == 500){
            document.getElementById("signup_username_message").style.color = 'red';
        		document.getElementById("signup_username_message").innerHTML = "Username already exists!";
          }
        }
      };
      req.send(JSON.stringify(user))
    }
    catch(e){
      console.error(e);
    }
 }
};

var signInMechanism = function(){   /////////DONE
  var user = {
    email: document.getElementById('signin_username').value,
    password: document.getElementById('signin_password').value
  };
  try{
    var req = new XMLHttpRequest();
    req.open("POST", "/users/sign_in/", true);
    req.setRequestHeader("Content-type", "application/json");
    req.onreadystatechange = function(){
      if (this.readyState == 4){
        if (this.status == 200){
          var response = JSON.parse(req.responseText);
          console.log(response);
          if(response["success"]){
            //localStorage.setItem("response", JSON.stringify(response));
            //localStorage.setItem("isLoggedIn", true);
            displayView(isLoggedIn="true");
          }else{
            console.log("Something went wrong!")
          }
        }else if (this.status == 500){
          document.getElementById("signin_message").style.color = 'red';
          document.getElementById("signin_message").innerHTML = "Wrong username or password!";
        }
      }
    };
    req.send(JSON.stringify(user))
  }
  catch(e){
    console.error(e);
  }
};

var signOutMechanism = function(){     /////////DONE
  ///sdfa
    try{
      var sreq = new XMLHttpRequest();
      sreq.open("GET", "/users/get_logged_in_data/", true);
      sreq.setRequestHeader("Content-type", "application/json");
      sreq.onreadystatechange = function(){
        if (this.readyState == 4){
          if (this.status == 200){
            var resp = JSON.parse(sreq.responseText);
            console.log(resp);
            console.log(resp["data"])
            if(resp["success"]){
              try{
                var req = new XMLHttpRequest();
                req.open("POST", "/users/sign_out/", true);
                req.setRequestHeader("Content-type", "application/json");
                req.setRequestHeader("Token", resp["data"]);
                req.onreadystatechange = function(){
                  if (this.readyState == 4){
                    if (this.status == 200){
                      var response = JSON.parse(req.responseText);
                      console.log(response);
                      if(response["success"]){
                        //localStorage.setItem("isLoggedIn", false);
                      	displayView(isLoggedIn="false");
                      }else{
                        console.log("Something went wrong!")
                      }
                    }else if (this.status == 500){
                      console.log("Something went wrong!")
                    }
                  }
                };
                req.send(JSON.stringify(resp["data"]))
              }catch(e){
                console.error(e);
              }
            }else{
              console.log("Something went wrong!")
            }
          }else if (this.status == 500){
            console.log("Something went wrong!")
          }
        }
      };
      sreq.send(JSON.stringify())
    }catch(e){
      console.error(e)
    }
}

openTab = function(e, tabID){       ////////DONE
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
var check_old_pass = function(){    //////DONE
  //response = JSON.parse(localStorage.getItem("response"));
  //console.log(response['data'])
  try{
    var sreq = new XMLHttpRequest();
    sreq.open("GET", "/users/get_logged_in_data/", true);
    sreq.setRequestHeader("Content-type", "application/json");
    sreq.onreadystatechange = function(){
      if (this.readyState == 4){
        if (this.status == 200){
          var resp = JSON.parse(sreq.responseText);
          console.log(resp);
          console.log(resp["data"])
          if(resp["success"]){
            if(document.getElementById('old_password').value.length>4){
              try{
                var req = new XMLHttpRequest();
                req.open("GET", "/users/get_user_data_by_token/", true);
                req.setRequestHeader("Content-type", "application/json");
                req.setRequestHeader("Token", resp['data']);
                req.onreadystatechange = function(){
                  if (this.readyState == 4){
                    if (this.status == 200){
                      var loggedinuser = JSON.parse(req.responseText);
                      if(loggedinuser["success"]){
                        try{
                          var sign_req = new XMLHttpRequest();
                          params = loggedinuser['data'][0]['email']+","+document.getElementById('old_password').value
                          sign_req.open("GET", "/users/check_old_password/"+ params, true);
                          sign_req.setRequestHeader("Content-type", "application/json");
                          sign_req.onreadystatechange = function(){
                            if (this.readyState == 4){
                              if (this.status == 200){
                                var sign_response = JSON.parse(sign_req.responseText);
                                console.log(sign_response);
                                if(sign_response["success"]){
                                  document.getElementById('old_password_message').style.color = 'green';
                              		document.getElementById('old_password_message').innerHTML = 'Old Password is correct';
                                }
                                else{
                                  document.getElementById('old_password_message').style.color = 'red';
                              		document.getElementById('old_password_message').innerHTML = 'Old Password is not correct';
                                  console.log("Something went wrong");
                                }
                              }else if (this.status == 500){
                                document.getElementById('old_password_message').style.color = 'red';
                                document.getElementById('old_password_message').innerHTML = 'Old Password is not correct';
                                console.log("Something went wrong");
                              }
                            }
                          };
                          sign_req.send(JSON.stringify());
                        }
                        catch(e){
                          console.error(e);
                        }
                      }else{
                        console.log("Something went wrong");
                      }
                    }else if (this.status == 500){
                      console.log("Something went wrong!");
                    }
                  }
                };
                req.send(JSON.stringify());
              }
              catch(e){
                console.error(e);
              }
            }else{
              document.getElementById('old_password_message').style.color = 'red';
              document.getElementById('old_password_message').innerHTML = "Password needs to be at least 5 digits!";
            }
          }else{
          console.log("Something went wrong!")
          }
        }else if (this.status == 500){
          console.log("Something went wrong!")
        }
      }
    };
    sreq.send(JSON.stringify())
  }
  catch(e){
    console.error(e)
  }
}

var check_pass_change = function() {    /////DONE
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
    else{
      document.getElementById('new_old_password_message').innerHTML = '';
    }
	}else{
		document.getElementById('new_password_message').style.color = 'red';
		document.getElementById('new_password_message').innerHTML = "Password needs to be at least 5 digits!";
	}
}

var changepassMechanism = function(){    /////DONE
  //response = JSON.parse(localStorage.getItem("response"));
  try{
    var sreq = new XMLHttpRequest();
    sreq.open("GET", "/users/get_logged_in_data/", true);
    sreq.setRequestHeader("Content-type", "application/json");
    sreq.onreadystatechange = function(){
      if (this.readyState == 4){
        if (this.status == 200){
          var resp = JSON.parse(sreq.responseText);
          console.log(resp);
          console.log(resp["data"])
          if(resp["success"]){
          	if(document.getElementById('new_password').value.length>4){ //Apo katw esvisa ena temp, den 3erw an xreiazetai
          		if ((document.getElementById('new_password').value == document.getElementById('rep_new_password').value) && (document.getElementById('new_password').value != document.getElementById('old_password').value)){
                var change_pass = {
                  oldpassword: document.getElementById('old_password').value,
              		newpassword: document.getElementById('new_password').value
            	  };
                try{
                  var req = new XMLHttpRequest();
                  req.open("PUT", "/users/change_password/", true);
                  req.setRequestHeader("Content-type", "application/json");
                  req.setRequestHeader("Token", resp["data"]);
                  req.onreadystatechange = function(){
                    if (this.readyState == 4){
                      if (this.status == 200){
                        var response = JSON.parse(req.responseText);
                        console.log(response);
                        if(response["success"]){
                          var frm = document.getElementById('formChangePassword');
                    			frm.reset();
                    			document.getElementById('old_password_message').innerHTML = "Password changed!";
                    			document.getElementById('new_password_message').innerHTML = "";
                        }else{
                          console.log("Something went wrong!")
                        }
                      }else if (this.status == 500){
                        console.log("Something went wrong!")
                      }
                    }
                  };
                  console.log(change_pass)
                  req.send(JSON.stringify(change_pass))
                }
                catch(e){
                  console.error(e);
                }
          		}
          	}
          }else{
          console.log("Something went wrong!")
          }
        }else if (this.status == 500){
          console.log("Something went wrong!")
        }
      }
    };
    sreq.send(JSON.stringify())
  }
  catch(e){
    console.error(e)
  }
}

var searchMechanism = function(){ ////DONE
  //response = JSON.parse(localStorage.getItem("response"));
  try{
    var sreq = new XMLHttpRequest();
    sreq.open("GET", "/users/get_logged_in_data/", true);
    sreq.setRequestHeader("Content-type", "application/json");
    sreq.onreadystatechange = function(){
      if (this.readyState == 4){
        if (this.status == 200){
          var response = JSON.parse(sreq.responseText);
          console.log(response);
          console.log(response["data"])
          if(response["success"]){
          	if(document.getElementById('search_email').value!=""){
              try{
                var req = new XMLHttpRequest();
                req.open("GET", "/users/get_user_data_by_email/" + document.getElementById('search_email').value, true);
                req.setRequestHeader("Content-type", "application/json");
                req.setRequestHeader("Token", response['data']);
                req.onreadystatechange = function(){
                  if (this.readyState == 4){
                    if (this.status == 200){
                      var resp = JSON.parse(req.responseText);
                      console.log(resp["success"]);
                      if (resp["success"]){
                        document.getElementById('user_search_message').style.color = 'green';
                  			document.getElementById('user_search_message').innerHTML = resp['message'];
                  			fillUserDetailsOthers();
                  			displayPostsOthers();
                      }else{
                        document.getElementById('user_search_message').style.color = 'red';
                  			document.getElementById('user_search_message').innerHTML = resp['message'];
                      }
                      }else if (this.status == 500){
                        console.log("Something went wrong!")
                        document.getElementById('user_search_message').style.color = 'red';
                  			document.getElementById('user_search_message').innerHTML = resp['message'];
                      }
                    }
                  };
                  req.send(JSON.stringify());
              }catch(e){
                console.error(e);
              }

          	}else{
          		document.getElementById('user_search_message').innerHTML = "";
          	}
          }else{
          console.log("Something went wrong!")
          }
        }else if (this.status == 500){
          console.log("Something went wrong!")
        }
      }
    };
    sreq.send(JSON.stringify())
  }
  catch(e){
    console.error(e)
  }
	//to resp exei mesa ta stoixeia
}

fillUserDetails = function(){  /////////DONE
  //response = JSON.parse(localStorage.getItem("response"));
  try{
    var sreq = new XMLHttpRequest();
    sreq.open("GET", "/users/get_logged_in_data/", true);
    sreq.setRequestHeader("Content-type", "application/json");
    sreq.onreadystatechange = function(){
      if (this.readyState == 4){
        if (this.status == 200){
          var response = JSON.parse(sreq.responseText);
          console.log(response);
          console.log(response["data"])
          if(response["success"]){
            try{
              var req = new XMLHttpRequest();
              req.open("GET", "/users/get_user_data_by_token/", true);
              req.setRequestHeader("Content-type", "application/json");
              req.setRequestHeader("Token", response['data']);
              req.onreadystatechange = function(){
                if (this.readyState == 4){
                  if (this.status == 200){
                    var loggedinuser = JSON.parse(req.responseText);
                    console.log(loggedinuser);
                    if(loggedinuser["success"]){
                      firstname = loggedinuser["data"][0]["firstname"];
                      familyname = loggedinuser["data"][0]["familyname"];
                      email = loggedinuser["data"][0]["email"];
                      gender = loggedinuser["data"][0]["gender"];
                      city = loggedinuser["data"][0]["city"];
                      country = loggedinuser["data"][0]["country"];
                      document.getElementById('right_first_name').innerHTML = firstname;
                      document.getElementById('right_family_name').innerHTML = familyname;
                      document.getElementById('right_email').innerHTML = email;
                      document.getElementById('right_gender').innerHTML = gender;
                      document.getElementById('right_city').innerHTML = city;
                      document.getElementById('right_country').innerHTML = country;
                    }else{
                      console.log("Something went wrong")
                    }
                  }else if (this.status == 500){
                    console.log("Something went wrong!")
                  }
                }
              };
              req.send(JSON.stringify());
            }
            catch(e){
              console.error(e);
            }
          }else{
          console.log("Something went wrong!")
          }
        }else if (this.status == 500){
          console.log("Something went wrong!")
        }
      }
    };
    sreq.send(JSON.stringify())
  }
  catch(e){
    console.error(e)
  }
}

postMessage = function(){    //////////DONE
  //response = JSON.parse(localStorage.getItem("response"));
  try{
    var sreq = new XMLHttpRequest();
    sreq.open("GET", "/users/get_logged_in_data/", true);
    sreq.setRequestHeader("Content-type", "application/json");
    sreq.onreadystatechange = function(){
      if (this.readyState == 4){
        if (this.status == 200){
          var response = JSON.parse(sreq.responseText);
          console.log(response);
          console.log(response["data"])
          if(response["success"]){
            try{
                var req = new XMLHttpRequest();
                req.open("GET", "/users/get_user_data_by_token/", true);
                req.setRequestHeader("Content-type", "application/json");
                req.setRequestHeader("Token", response['data']);
                req.onreadystatechange = function(){
                  if (this.readyState == 4){
                    if (this.status == 200){
                      var loggedinuser = JSON.parse(req.responseText);
                      console.log(loggedinuser);
                      if(loggedinuser["success"]){
                        var mess = {
                      		email: loggedinuser["data"][0]["email"],
                      		content: document.getElementById("post_text").value
                    	  };
                        try{
                          var post_req = new XMLHttpRequest();
                          post_req.open("POST", "/users/post_message/", true);
                          post_req.setRequestHeader("Content-type", "application/json");
                          post_req.setRequestHeader("Token", response['data']);
                          post_req.onreadystatechange = function(){
                            if (this.readyState == 4){
                              if (this.status == 200){
                                var resp = JSON.parse(post_req.responseText);
                                if(resp["success"]){
                                  console.log("Message posted")
                                  document.getElementById('post_message').style.color = 'green';
                                  post_message = resp["message"];
                                  displayPosts();
                                }else{
                                  document.getElementById('post_message').style.color = 'red';
                                  post_message = "Message couldn't be posted";
                                }
                                document.getElementById("post_message").innerHTML = post_message;
          	                    document.getElementById("post_text").value = "";
                              }else if (this.status == 500){
                                console.log("Something went wrong!")
                                document.getElementById('post_message').style.color = 'red';
                                post_message = "Message couldn't be posted";
                              }
                            }
                          };
                          console.log(content)
                          console.log(email)
                          post_req.send(JSON.stringify(mess));
                        }
                        catch(e){
                          console.error(e);
                        }
                      }
                      else{
                        console.log("Something went wrong!")
                      }
                    }else if (this.status == 500){
                      console.log("Something went wrong!")
                    }
                  }
                };
                req.send(JSON.stringify());
              }
              catch(e){
                console.error(e);
              }
            }else{
            console.log("Something went wrong!")
            }
          }else if (this.status == 500){
            console.log("Something went wrong!")
          }
        }
      };
      sreq.send(JSON.stringify())
    }
    catch(e){
      console.error(e)
    }
}


displayPosts = function(){  /////////DONE
  //response = JSON.parse(localStorage.getItem("response"));
  try{
    var sreq = new XMLHttpRequest();
    sreq.open("GET", "/users/get_logged_in_data/", true);
    sreq.setRequestHeader("Content-type", "application/json");
    sreq.onreadystatechange = function(){
      if (this.readyState == 4){
        if (this.status == 200){
          var response = JSON.parse(sreq.responseText);
          console.log(response);
          console.log(response["data"])
          if(response["success"]){
            try{
              var req = new XMLHttpRequest();
              req.open("GET", "/users/get_user_messages_by_token/", true);
              req.setRequestHeader("Content-type", "application/json");
              req.setRequestHeader("Token", response['data']);
              req.onreadystatechange = function(){
                if (this.readyState == 4){
                  if (this.status == 200){
                    var userMessages = JSON.parse(req.responseText);
                    console.log(userMessages);
                    if(userMessages["success"]){
                      var i;
                      document.getElementById("wall_posts").innerHTML = "";
                      n = userMessages["data"]["length"];
                      console.log(n)
                      if(n>0){
                        for(i = 0; i < n; i++){
                          message = userMessages["data"][i]["content"];
                          document.getElementById("wall_posts").innerHTML +=
                                "<p>".concat(message, "</p>");
                        }
                      }
                    }else{
                      console.log("Something went wrong!")
                    }
                  }
                }else if (this.status == 500){
                  console.log("Something went wrong!")
                }
              };
              req.send(JSON.stringify());
            }
            catch(e){
              console.error(e);
            }
          }else{
          console.log("Something went wrong!")
          }
        }else if (this.status == 500){
          console.log("Something went wrong!")
        }
      }
    };
    sreq.send(JSON.stringify())
  }
  catch(e){
    console.error(e)
  }
}

refreshWall = function(){  ///////DONE
	displayPosts();
}

refreshWallOthers = function(){ ////////DONE
	displayPostsOthers();
}

postMessageToOthers = function(){  ///////DONE
  //response = JSON.parse(localStorage.getItem("response"));
  try{
    var sreq = new XMLHttpRequest();
    sreq.open("GET", "/users/get_logged_in_data/", true);
    sreq.setRequestHeader("Content-type", "application/json");
    sreq.onreadystatechange = function(){
      if (this.readyState == 4){
        if (this.status == 200){
          var response = JSON.parse(sreq.responseText);
          console.log(response);
          console.log(response["data"])
          if(response["success"]){
            try{
                var req = new XMLHttpRequest();
                req.open("GET", "/users/get_user_data_by_token/", true);
                req.setRequestHeader("Content-type", "application/json");
                req.setRequestHeader("Token", response['data']);
                req.onreadystatechange = function(){
                if (this.readyState == 4){
                    if (this.status == 200){
                      var loggedinuser = JSON.parse(req.responseText);
                      console.log(loggedinuser);
                      if(loggedinuser["success"]){
                        var mess = {
                      		email: document.getElementById('search_email').value,
                      		content: document.getElementById("post_text_others").value
                    	  };
                        try{
                          var post_req = new XMLHttpRequest();
                          post_req.open("POST", "/users/post_message/", true);
                          post_req.setRequestHeader("Content-type", "application/json");
                          post_req.setRequestHeader("Token", response['data']);
                          post_req.onreadystatechange = function(){
                          if (this.readyState == 4){
                              if (this.status == 200){
                                var resp = JSON.parse(post_req.responseText);
                                if(resp["success"]){
                                  console.log("Message posted")
                                  document.getElementById('post_message_others').style.color = 'green';
                                  post_message = resp["message"];
                                  displayPostsOthers();
                                }
                                else{
                                  document.getElementById('post_message_others').style.color = 'red';
                                  post_message = "Message couldn't be posted";
                                }
                                window.alert("ASF");
                                document.getElementById("post_message_others").innerHTML = post_message;
          	                    document.getElementById("post_text_others").value = "";
                              }else if (this.status == 500){
                                document.getElementById('post_message_others').style.color = 'red';
                                post_message = "Message couldn't be posted";
                              }
                            }
                            };
                            post_req.send(JSON.stringify(mess));
                          }
                          catch(e){
                            console.error(e);
                          }
                        }
                        else{
                          console.log("Something went wrong!")
                        }
                    }else if (this.status == 500){
                      console.log("Something went wrong!")
                    }
                  }
                };
                req.send(JSON.stringify());
              }
              catch(e){
                console.error(e);
              }
            }else{
            console.log("Something went wrong!")
            }
          }else if (this.status == 500){
            console.log("Something went wrong!")
          }
        }
      };
      sreq.send(JSON.stringify())
    }
    catch(e){
      console.error(e)
    }
}

displayPostsOthers = function(){   //////////DONE
  //response = JSON.parse(localStorage.getItem("response"));
  try{
    var sreq = new XMLHttpRequest();
    sreq.open("GET", "/users/get_logged_in_data/", true);
    sreq.setRequestHeader("Content-type", "application/json");
    sreq.onreadystatechange = function(){
      if (this.readyState == 4){
        if (this.status == 200){
          var response = JSON.parse(sreq.responseText);
          console.log(response);
          console.log(response["data"])
          if(response["success"]){
            try{
              var req = new XMLHttpRequest();
              req.open("GET", "/users/get_user_messages_by_email/" + document.getElementById('search_email').value, true);
              req.setRequestHeader("Content-type", "application/json");
              req.setRequestHeader("Token", response['data']);
              req.onreadystatechange = function(){
                if (this.readyState == 4){
                  if (this.status == 200){
                    var userMessages = JSON.parse(req.responseText);
                    console.log(userMessages);
                    if(userMessages["success"]){
                      var i;
                      document.getElementById("others_wall_posts").innerHTML = "";
                      n = userMessages["data"]["length"];
                      console.log(userMessages["data"])
                      if(n>0){
                        for(i = 0; i < n; i++){
                          message = userMessages["data"][i]["content"];
                          document.getElementById("others_wall_posts").innerHTML +=
                                "<p>".concat(message, "</p>");
                        }
                      }
                    }else{
                      console.log("Something went wrong")
                    }
                  }else if (this.status == 500){
                    console.log("Something went wrong!")
                  }
                }
              };
              req.send(JSON.stringify());
            }
            catch(e){
              console.error(e);
            }
          }else{
          console.log("Something went wrong!")
          }
        }else if (this.status == 500){
          console.log("Something went wrong!")
        }
      }
    };
    sreq.send(JSON.stringify())
  }
  catch(e){
    console.error(e)
  }
}

fillUserDetailsOthers = function(){   //////DONE
  //response = JSON.parse(localStorage.getItem("response"));
  try{
    var sreq = new XMLHttpRequest();
    sreq.open("GET", "/users/get_logged_in_data/", true);
    sreq.setRequestHeader("Content-type", "application/json");
    sreq.onreadystatechange = function(){
      if (this.readyState == 4){
        if (this.status == 200){
          var response = JSON.parse(sreq.responseText);
          console.log(response);
          console.log(response["data"])
          if(response["success"]){
            try{
              var req = new XMLHttpRequest();
              req.open("GET", "/users/get_user_data_by_email/" + document.getElementById('search_email').value, true);
              req.setRequestHeader("Content-type", "application/json");
              req.setRequestHeader("Token", response['data']);
              req.onreadystatechange = function(){
                if (this.readyState == 4){
                  if (this.status == 200){
                    var resp = JSON.parse(req.responseText);
                    console.log(resp);
                    if(resp["success"]){
                      firstname = resp["data"][0]["firstname"];
                      familyname = resp["data"][0]["familyname"];
                      email = resp["data"][0]["email"];
                      gender = resp["data"][0]["gender"];
                      city = resp["data"][0]["city"];
                      country = resp["data"][0]["country"];
                      document.getElementById('right_first_name1').innerHTML = firstname;
                      document.getElementById('right_family_name1').innerHTML = familyname;
                      document.getElementById('right_email1').innerHTML = email;
                      document.getElementById('right_gender1').innerHTML = gender;
                      document.getElementById('right_city1').innerHTML = city;
                      document.getElementById('right_country1').innerHTML = country;
                    }else{
                      console.log("Something went wrong")
                    }
                  }else if (this.status == 500){
                    console.log("Something went wrong!")
                  }
                }
              };
              req.send(JSON.stringify());
            }
            catch(e){
              console.error(e);
            }
          }else{
          console.log("Something went wrong!")
          }
        }else if (this.status == 500){
          console.log("Something went wrong!")
        }
      }
    };
    sreq.send(JSON.stringify())
  }
  catch(e){
    console.error(e)
  }
}
