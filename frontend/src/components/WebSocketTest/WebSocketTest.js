import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const WebSocketTest = () => {
    const [socket, setSocket] = useState(null);
    const [numOfPlayers, setNumOfPlayers] = useState('');
    const [numOfLevels, setNumOfLevels] = useState('');
    const [response, setResponse] = useState('');

    useEffect(() => {
        const newSocket = io(`http://localhost:3001`, {
            withCredentials: true,
            extraHeaders: {
                "my-custom-header": "abcd"
            }
        });
        setSocket(newSocket);
        return () => newSocket.close();
    }, []);

    const createRoom = () => {
        if (socket) {
            socket.emit('createRoom', {
                numOfPlayers: numOfPlayers,
                numOfLevels: numOfLevels
            });
        }
    };

    useEffect(() => {
        if (socket) {
            socket.on('roomCreated', (data) => {
                setResponse(`Room Created! ID: ${data._id}`);
            });
            socket.on('error', (error) => {
                setResponse(`Error: ${error}`);
            });
        }
    }, [socket]);

    return (
        <div>
            <h1>Create Game Room</h1>
            <input
                value={numOfPlayers}
                onChange={e => setNumOfPlayers(e.target.value)}
                type="number"
                placeholder="Number of Players"
            />
            <input
                value={numOfLevels}
                onChange={e => setNumOfLevels(e.target.value)}
                type="number"
                placeholder="Number of Levels"
            />
            <button onClick={createRoom}>Create Room</button>
            <p>{response}</p>
        </div>
    );
};

export default WebSocketTest;
