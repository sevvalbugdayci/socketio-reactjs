import socketClient from 'socket.io-client'

let socket;
const SERVER='http://localhost:5001'
const logToConsole=(data)=>{
    console.log('data',new Date(data))
}
function notify(text){
        alert(text)
    if (Notification.permission !== "granted") {
        Notification.requestPermission();
    }
    else{
        var notification = new Notification('hello', {
            body: 'Hey yeni bir kayıt olusturuldu içeriğe bir göz at' + text,
        });
        notification.onclick = function () {
            window.open("http://google.com");
        };
    }
}
export const connectWebSocket=()=>{
    socket=socketClient(SERVER,{
        timeout:500000,
        reconnectionDelay:3000,
        path:'/my-custom-path/', extraHeaders: {
            "my-custom-header": "1234"
        }})

    socket.on('onConnect',(data)=>{
        console.log(data)
        window.socketID=data
    })
    socket.on('hey',(data)=>{
        console.log('data',data)
    })

    socket.on('publicMessage',(data)=>{
        if(data.id !== window.socketID){
            console.log('publicMessage',data)
        }
    })
    socket.on('publicMessage2',(data)=>{
        if(data.id !== window.socketID){
            console.log(data)
        }
    })

    socket.on('newRecord',(data)=>{
        if(data.id !== window.socketID){
            notify(data.text)
        }
    })


    socket.on('joinedRoom',(data)=>{
        console.log('data',data)
    })


    socket.on('roomMessage',(data)=>{
        console.log('dataRoom',data)
    })





    socket.on('message',(data)=>{
        console.log('Spesifik Mesaj',data)
    })
    socket.once('time',logToConsole)
   // socket.off('time',logToConsole)

   // socket.removeListener('time')

 //   socket.removeAllListeners('time')
}
export {socket}
