var socket = io();
var username = "";

// Hide chat part on login
$("#chat").css("display", "none");

window.onbeforeunload = () => {
  window.scrollTo(0, 0);
};

// add scroll on click and animation to down arrow
$(document).ready(() => {
  $("#down").on("click", () => {
    $("html").scrollTop(0);

    $("html, body").animate(
      {
        scrollTop: $("#login").offset().top,
      },
      1000
    );
  });
});


// handle username and visibility of chat and login.
$("#login").submit((e) => {
  e.preventDefault();
  username = $(".usernameValue").val();
  console.log(`houna ${username}`)
  if (username) {
    socket.emit("username", username);
    $(".usernameValue").val("");
    $("#login").css("display", "none");
    $("#chat").css("display", "flex");
  } else {
    console.log("ana hna a zayn")
    $(".usernameValue").addClass("error");
  }
});


// handle new messages, add directly sender message to chat !
$("#chatForm").submit((e) => {
  e.preventDefault();
  socket.emit("new message", $("#message").val());
  $("#messagesContainer").append(
    $('<div class="myNewMessage">').html(
      `<div class="username">${username}</div> 
        <p>${$("#message").val()}</p>`
    )
  );
  $("#message").val("");
  return false;
});


// listening for new messages ! 
socket.on("new message", (payload) => {
  $("#messagesContainer").append(
    $('<div class="newMessage">').html(
      `<div class="username">${payload.username}</div>
        <p>${payload.msg}</p>`
    )
  );
});

// Listening for new whos online ! update after each user connection.
socket.on("users online", (users) => {
  $('#onlineUsers').empty();
  users.map(element => {
    $('#onlineUsers').append(`<div class="user">${element}</div>`);
  })
});
