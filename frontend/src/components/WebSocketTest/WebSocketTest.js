import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const WebSocketTest = () => {
    const [socket, setSocket] = useState(null);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');

    useEffect(() => {
        const newSocket = io(`http://localhost:3001`);
        setSocket(newSocket);
        return () => newSocket.close();
    }, [setSocket]);

    useEffect(() => {
        if (socket) {
            socket.on('testResponse', message => {
                setMessages(prev => [...prev, message]);
            });
        }
    }, [socket]);

    const sendMessage = () => {
        if (socket) {
            socket.emit('test', { message: input });
            setInput('');
        }
    };

    return (
        <div>
            <h1>WebSocket Test</h1>
            <input
                value={input}
                onChange={e => setInput(e.target.value)}
                type="text"
                placeholder="Type a message..."
            />
            <button onClick={sendMessage}>Send</button>
            <ul>
                {messages.map((msg, index) => (
                    <li key={index}>{msg.message}</li>
                ))}
            </ul>
        </div>
    );
};

export default WebSocketTest;
