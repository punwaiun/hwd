$(document).ready(function(){
  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyBQ5aMBSywbOgQHbJ1xFKwpnn6GelSJhog",
    authDomain: "chat-f4f06.firebaseapp.com",
    databaseURL: "https://chat-f4f06.firebaseio.com",
    projectId: "chat-f4f06",
    storageBucket: "chat-f4f06.appspot.com",
    messagingSenderId: "97273820894"
   };
  firebase.initializeApp(config);

  // Firebase database reference
  var dbChatRoom = firebase.database().ref().child('chatroom');
  var dbUser = firebase.database().ref().child('user');

  var photoURL;
  var $img = $('img');

  var $messageField = $('#messageInput');
  var $Enter = $('#Enter');
  var $messageList = $('#example-messages');
  var count=0;
  //var $userimg = $('#userimg');


  // REGISTER DOM ELEMENTS
  const $email = $('#email');
  const $password = $('#password');
  const $btnSignIn = $('#btnSignIn');
  const $btnSignUp = $('#btnSignUp');
  const $btnSignOut = $('#btnSignOut');
  const $hovershadow = $('.hover-shadow');
  const $btnSubmit = $('#btnSubmit');
  const $skip = $('#skip');
  const $signInfo = $('#sign-info');
  const $file = $('#file');
  const $profileName = $('#profile-name');
  const $profileEmail = $('#profile-email');
  const $profileAge = $('#age')

  // Hovershadow
  $hovershadow.hover(
    function(){
      $(this).addClass("mdl-shadow--4dp");
    },
    function(){
      $(this).removeClass("mdl-shadow--4dp");
    }
  );

  var storageRef = firebase.storage().ref();

  function handleFileSelect(evt) {
    evt.stopPropagation();
    evt.preventDefault();
    var file = evt.target.files[0];

    var metadata = {
      'contentType': file.type
    };

    // Push to child path.
    // [START oncomplete]
    storageRef.child('images/' + file.name).put(file, metadata).then(function(snapshot) {
      console.log('Uploaded', snapshot.totalBytes, 'bytes.');
      console.log(snapshot.metadata);
      photoURL = snapshot.metadata.downloadURLs[0];
      console.log('File available at', photoURL);
    }).catch(function(error) {
      // [START onfailure]
      console.error('Upload failed:', error);
      // [END onfailure]
    });
    // [END oncomplete]
  }

  dbChatRoom.limitToLast(10).on('child_added', function (snapshot) {
    //GET DATA
    var data = snapshot.val();
    //var username = data.name || "anonymous";
    var message = data.text;

    //CREATE ELEMENTS MESSAGE & SANITIZE TEXT
    var $messageElement = $("<li>");
    var $uimg = $("<img src='' class='userimg' width=60 >");
  //   $('userimg').attr("src", user.photoURL);
  //  $userimg.text(username);
    $messageElement.text(message).prepend($uimg);

    //ADD MESSAGE
    $messageList.append($messageElement)

    //SCROLL TO BOTTOM OF MESSAGE LIST
    $messageList[0].scrollTop = $messageList[0].scrollHeight;

  });

  window.onload = function() {
    $file.change(handleFileSelect);
    // $file.disabled = false;
  }

  // SignIn/SignUp/SignOut Button status
  var user = firebase.auth().currentUser;
/*if (user) {
    $btnSignIn.attr('disabled', 'disabled');
    $btnSignUp.attr('disabled', 'disabled');
    $btnSignOut.removeAttr('disabled')
  } else {
    $btnSignOut.attr('disabled', 'disabled');
    $btnSignIn.removeAttr('disabled')
    $btnSignUp.removeAttr('disabled')
  }*/

  // Sign In
  $btnSignIn.click(function(e){
    const email = $email.val();
    const pass = $password.val();
    const auth = firebase.auth();
    // signIn
    const promise = auth.signInWithEmailAndPassword(email, pass);
    promise.catch(function(e){
      console.log(e.message);
      $signInfo.html(e.message);
    });
    promise.then(function(){
      window.location.href = "./profile.html";
    });
  });

  // SignUp
  $btnSignUp.click(function(e){
    const email = $email.val();
    const pass = $password.val();
    const auth = firebase.auth();
    // signUp
    const promise = auth.createUserWithEmailAndPassword(email, pass);

  });

  // Listening Login User
  firebase.auth().onAuthStateChanged(function(user){
    if(user) {
      console.log(user.photoURL);
      var userId = firebase.auth().currentUser.uid;
      var dbUserInfo = firebase.database().ref('user/' + userId);

      dbUserInfo.on("value", function(snapshot){
        var age = snapshot.val().age;
        var occupation = snapshot.val().occupation;
        var username = snapshot.val().name;
        var description = snapshot.val().description;
        var email = snapshot.val().email;
      //  var imageUrl = snapshot.val().photo;

         $('img').attr("src", user.photoURL);
         $('#profile-age').html(age);
         $('#profile-occupation').html(occupation);
         $('#profile-email').html(email);
         $('#profile-name').html(username);
         $('#profile-description').html(description);
      });

      //console.log(user);
      const loginName = user.displayName || user.email;

      //$img.attr("src",user.photoURL);
    }
  });

  // SignOut
  $btnSignOut.click(function(){
    firebase.auth().signOut();
    /*console.log('LogOut');
    $signInfo.html('No one login...');
    $btnSignOut.attr('disabled', 'disabled');
    $btnSignIn.removeAttr('disabled')
    $btnSignUp.removeAttr('disabled')*/
  });
  $skip.click(function(){
      count=1;
      window.location.href = "./chatroom.html";
  });


  // Submit
  $btnSubmit.click(function(){
    var user = firebase.auth().currentUser;
    const $userName = $('#userName').val();

    const promise = user.updateProfile({
      displayName: $userName,
      photoURL: photoURL
    });

    promise.then(function() {
      console.log("Update successful.");
      user = firebase.auth().currentUser;
      if (user) {
        //$profileName.html(user.displayName);
        //$profileEmail.html(user.email);
        //$img.attr("src",user.photoURL);
        const loginName = user.displayName || user.email;
        $signInfo.html(loginName+" is login...");

        const dbUserid = dbUser.child(user.uid);

        dbUserid.update({
          name:user.displayName,
          email:user.email,
          photo:user.photoURL,
          age: $('#age').val(),
          occupation:$('#Occupation').val(),
          description:$('#Description').val()
        });
      }
      window.location.href = "./info.html";

    });
  });

});
