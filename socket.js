let io;
const socket = require('socket.io')
module.exports = {
    init: (server) => {
        io = socket(server, {
            path: "/my-custom-path/",
            pingTimeout: 20000,
            cors: {
                origin: '*',
                method: ['GET']
            }
        })
        return io
    },
    getIO: () => {
        if (!io) {
            throw new Error('Socket Not Initialize')
        }
        return io
    }
}