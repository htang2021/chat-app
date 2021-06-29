import React, { useState, useEffect } from 'react';
import queryString from 'query-string';
import io from 'socket.io-client';
import './Chat.css';

import InfoBar from '../InfoBar/InfoBar';
let socket;

const Chat = ({ location }) => {

    const [name, setName] = useState('');
    const [room, setRoom] = useState('');
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);

    const ENDPOINT = 'localhost:5000';

    useEffect(() => {
        // const data = queryString.parse(location.search);
        // data returns an object with just name and room key/value pairs, so destructuring it
        const { name, room } = queryString.parse(location.search);

        // ==> , { transports: ['websocket', 'polling', 'flashsocket'] } object is added from
        // stackoverflow recommendation due to request access denied by CORS policy - unsure
        // what this transports object is for.
        // an instance of the socket
        socket = io(ENDPOINT, { transports: ['websocket', 'polling', 'flashsocket'] });

        setName(name);
        setRoom(room);

        // console.log(name, room);
        socket.emit('join', { name, room }, () => {

        });

        return () => {
            socket.emit('disconnect');
            socket.off();
        }
        
    }, [ENDPOINT, location.search]);

    useEffect(() => {
        socket.on('message', (message) => {
            setMessages([...messages, message]);
        })
    }, [messages]);

    // function for sending messages
    const sendMessage = (event) => {
        event.preventDefault();

        if(message) {
            socket.emit('sendMessage', message, () => setMessage(''));
        }
    }

    console.log(message, messages);
    
    return (
        <div className="outerContainer">
            <div className="container">
                <InfoBar room={room}/>
                {/* <input 
                value={message} 
                onChange={(event) => setMessage(event.target.value)}
                onKeyPress={event => event.key ==='Enter' ? sendMessage(event) : null}
                /> */}
            </div>
        </div>
    );
}

export default Chat;