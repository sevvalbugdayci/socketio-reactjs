import './App.css';
import {useEffect, useState} from "react";
import {socket, connectWebSocket} from './websocket'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
ChartJS.register(ArcElement, Tooltip, Legend);
function App() {
    const [data,setData]=useState( {
        labels: ['A Partisi', 'B Partisi', 'C Partisi', 'D Partisi', 'E Partisi', 'F Partisi'],
        datasets: [
            {
                label: '# of Votes',
                data: [50, 19, 3, 5, 2, 3],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)',
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                ],
                borderWidth: 1,
            },
        ],
    })
    const [text,setText]=useState("")
    const [photo,setPhoto]=useState("")
    const [socketInput, setSocketInput] = useState("")
    const [socketText,setSocketText]=useState("")
    useEffect(() => {

        connectWebSocket()
        socket.on('typeText',(data)=>{
            setSocketText(data)
        })
        socket.on('broadcastPhoto',(data)=>{
            if(data.id !== window.socketID){
                setPhoto(data.photo)
            }
        })
        socket.on('dataResult',(dataSet)=>{
            let _data=data.datasets[0].data
            for (let i=0;i<_data.length;i++){
                _data[i]+=dataSet[i]
            }
            setData({...data,datasets:[ {
                    label: '# of Votes',
                    data: _data,
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 159, 64, 0.2)',
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)',
                    ],
                    borderWidth: 1,
                },] })
            console.log('data',data)
        })
    }, [])
    return (
        <>
            <button onClick={() => {
                socket.emit('client', 'Merhaba ben client sana bilgi gönderiyorum')
            }}>Servere Mesaj Gönder
            </button>

            <input value={socketInput} onChange={(e) => {
                setSocketInput(e.target.value)
            }}/>

            <button onClick={() => {
                socket.emit('sendCustomMessage', {socketId: socketInput, message: 'Merhaba '})
            }}>Spesifik Bir Kullanıcıya Mesaj Gönder
            </button>


            <button onClick={() => {
                socket.emit('publicMessage', {id: window.socketID, message: Date.now()})
            }}>Yayınla
            </button>

            <button onClick={() => {
                socket.emit('join room', 'roomA')
            }}> A Odasına Katıl
            </button>

            <button onClick={() => {
                socket.emit('message room', {room:'roomA',msg:'Merhabaaaaa'})
            }}> A Odasına Mesaj Gönder
            </button>

            <button onClick={() => {
                fetch('http://localhost:5000?text=Merhaba&id='+window.socketID).then((res)=>res.json()).then((data)=>{
                    console.log('data',data)
                })
            }}> Kayıt Olustur
            </button>

            <button onClick={() => {
                fetch('http://localhost:5000/sendPhoto?photo=https://images.unsplash.com/photo-1645583918683-39fd75293e80?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1183&q=80=&id='+window.socketID).then((res)=>res.json()).then((data)=>{
                    console.log('data',data)
                })
            }}> Fotoğraf Gönder
            </button>
            <div style={{display:"flex", alignItems:"center",justifyContent:"center"}}>
                <div style={{width:"500px",height:"500px"}}>
                    <Doughnut data={data} />;
                </div>
            </div>

            <img width={500} height={500} src={photo}/>


            <input value={text} onChange={(e) => {
                setText(e.target.value)
                socket.emit('text', e.target.value)

            }}/>


            {socketText}





        </>

    );
}

export default App;
