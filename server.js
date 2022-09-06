const express = require('express')
const socketIO = require('./socket')
const app = express()
const cors = require('cors')

let arr = []
const router = express.Router()

router.get('/', (req, res) => {
    res.json({ text: Date.now() })
    console.log(req.query.text)
    socketIO.getIO().sockets.emit('newRecord', { id: req.query.id, text: req.query.text })

})
router.get('/sendPhoto', (req, res) => {
    res.json({ text: Date.now() })
    socketIO.getIO().sockets.emit('broadcastPhoto', { id: req.query.id, photo: req.query.photo })

})



const server = app.listen(5000, () => {
    console.log('running on port 5000')
})

app.use(express.json())
app.use(cors())
app.use(router)


let users = []
let rooms = {
    roomA: [],
    roomB: []
}

let connectionUsers = []
let data = []
const io = socketIO.init(server)
io.on('connection', (socket) => {
    connectionUsers.push({ socketId: socket.id, connectionTime: Date.now() })
    users.push({ socketId: socket.id })

    // console.log(socket.handshake.headers);
    console.log('sana bağlanan socket', socket.id)

    socket.emit('onConnect', socket.id)

    socket.on('text', (text) => {
        io.sockets.emit('typeText', text)
    })

    // console.log(socket.handshake)
    socket.on("disconnect", (reason) => {
        let arr = [...connectionUsers]
        let findedDisconnectUser = arr.find((item) => item.socketId === socket.id)
        findedDisconnectUser.disconnectionTime = Date.now()
        findedDisconnectUser.time = Date.now() - findedDisconnectUser.connectionTime
        connectionUsers = arr

        console.log('cu', connectionUsers)


        console.log(reason)
        console.log('ayrılan socket', socket.id)
        let roomA = rooms.roomA.filter((item) => item !== socket.id)
        rooms = {...rooms, roomA: roomA }

        io.sockets.emit('joinedRoom', rooms)
    });
    socket.on("disconnecting", (reason) => {
        console.log('disconnecting', reason)
    });

    socket.emit('hey', 'Selam sockete bağlı oldugun saat' + Date.now())

    socket.on('client', (data) => {
        console.log('data', data)
    })

    socket.on('sendCustomMessage', (data) => {
        console.log('data', data)
        io.to(data.socketId).emit('message', data.message)
    })

    socket.on('publicMessage', (data) => {
        socket.broadcast.emit('publicMessage', data)
        io.sockets.emit('publicMessage2', data)
    })

    socket.on('join room', (roomName) => {
        rooms[roomName].push(socket.id)
        socket.join(roomName)
        io.sockets.emit('joinedRoom', rooms)
    })

    setInterval(() => {
        data = []
        for (let index = 0; index < 6; index++) {
            data.push(Math.floor(Math.random() * 1000) + 1)
        }
        socket.emit('dataResult', data)
    }, 5000)


    socket.on('message room', (data) => {
        io.to(data.room).emit('roomMessage', data.msg)
    })









    // setInterval(() => {
    //     socket.emit('time', Date.now())
    // }, 1000)
})