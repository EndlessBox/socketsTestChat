const express = require('express');
const app = express();
const port = 3000;
const http = require('http').createServer(app);
const io = require('socket.io')(http);
var users = []

app.use(express.static("public"))

io.on('connection', (socket) => {
    console.log("user connected")
    socket.on('username', (username)=> {
        if (username)
        {
            let user = {socketID: socket.id, username: username}
            users.push(user);
            io.emit("users online", (users.map(user => user.username)))
        }
    })
    socket.on('new message', (msg) => {
        let user = users.filter((user) => user.socketID == socket.id);
        socket.broadcast.emit('new message', {
            'username': user[0].username,
            'msg': msg
        })
    })
    socket.on('disconnect', () => {
        users = users.filter(user => user.socketID !== socket.id)
        console.log('user disconnected');
    })
})

http.listen(port, () => {
    console.log(`Server listening on port ${port}`);
})