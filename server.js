const express = require('express')
const app = express()
const server = require('http').Server(app)
const {v4 : uuidV4 } = require('uuid')
const io = require('socket.io')(server)


app.set('view engine', 'ejs')
app.use(express.static('public'))

app.get('/', (req, res) => {
    res.redirect(`/${uuidV4()}`)
})

app.get('/:room', (req, res) => {
    res.render('room', {
        roomID: req.params.room
    })
})

io.on('connection', socket => {
    socket.on('join-room', (roomID, userID) => {
        console.log(roomID, userID)
        socket.join(roomID)
        socket.to(roomID).emit('user-connected', userID)
    })

    socket.on('disconnect', (roomID, userID) => {
        socket.to(roomID).emit('user-disconnected', userID)
    })
})

server.listen(3000)


