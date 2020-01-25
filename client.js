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
window.onload = function(){
  //code that is executed as the page is loaded.
  //You shall put your own custom code here.
  //window.alert() is not allowed to be used in your implementation.
  var welcome = document.getElementById("welcomeview").innerHTML;
  var profile = document.getElementById("profileview").innerHTML;
  displayView(welcome, profile);
};
