import React, { useState, useEffect } from "react";
import io from "socket.io-client";

const WebSocketTest = () => {
  const [socket, setSocket] = useState(null);
  const [numOfPlayers, setNumOfPlayers] = useState("");
  const [numOfLevels, setNumOfLevels] = useState("");
  const [inviteCode, setInviteCode] = useState(""); // State to hold the invite code input
  const [response, setResponse] = useState("");

  useEffect(() => {
    const newSocket = io(`http://localhost:3001`, {
      withCredentials: true,
      extraHeaders: {
        "my-custom-header": "abcd",
      },
    });
    setSocket(newSocket);
    return () => newSocket.close();
  }, []);

  let dummyUserID = "ABCD12345"; // TODO: change this.

  const createRoom = () => {
    if (socket) {
      socket.emit("createRoom", {
        numOfPlayers: numOfPlayers,
        numOfLevels: numOfLevels,
        userId: dummyUserID, //TODO: change this 
      });
    }
  };

  const joinRoom = () => {
    if (socket && inviteCode) {
      socket.emit("joinRoom", {
        inviteCode: inviteCode,
        userId: dummyUserID, //TODO: change this 
      });
    }
  };

  useEffect(() => {
    if (socket) {
      socket.on("roomCreated", (data) => {
        console.log(data.inviteCode);
        setResponse(
          `Room Created! ID: ${data._id}, Invite Code: ${data.inviteCode}`
        );
      });
      socket.on("joinedRoom", (room) => {
        console.log(room.players);
        setResponse(`Joined Room: ${room._id}`);
      });
      socket.on("error", (error) => {
        setResponse(`Error: ${error}`);
      });
    }
  }, [socket]);

  return (
    <div>
      <h1>Create Game Room</h1>
      <input
        value={numOfPlayers}
        onChange={(e) => setNumOfPlayers(e.target.value)}
        type="number"
        placeholder="Number of Players"
      />
      <input
        value={numOfLevels}
        onChange={(e) => setNumOfLevels(e.target.value)}
        type="number"
        placeholder="Number of Levels"
      />
      <button onClick={createRoom}>Create Room</button>

      <h2>Join a Game Room</h2>
      <input
        value={inviteCode}
        onChange={(e) => setInviteCode(e.target.value)}
        type="text"
        placeholder="Enter Invite Code"
      />
      <button onClick={joinRoom}>Join Room</button>

      <h1>{response}</h1>
    </div>
  );
};

export default WebSocketTest;
