import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import { useNavigate } from "react-router-dom";
import { Typography } from "@mui/material";

/**
 * For backend testing purposes.
 * Subject to change.
 */
const GameIndexPage = () => {
  const [socket, setSocket] = useState(null);
  const [numOfPlayers, setNumOfPlayers] = useState("");
  const [numOfLevels, setNumOfLevels] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [response, setResponse] = useState("");
  const navigate = useNavigate();

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

  let dummyUserID = "ABCD"; // TODO: replace this with signed in user info (firebase ID).

  const createRoom = () => {
    if (socket) {
      socket.emit("createRoom", {
        numOfPlayers: numOfPlayers,
        numOfLevels: numOfLevels,
        userId: dummyUserID,
      });
    }
  };

  const joinRoom = () => {
    if (socket && inviteCode) {
      socket.emit("joinRoom", {
        inviteCode: inviteCode,
        userId: dummyUserID,
      });
    }
  };

  useEffect(() => {
    if (socket) {
      /**
       * Handles game room creation.
       */
      socket.on("roomCreated", (data) => {
        setResponse(`Room Created! Invite Code: ${data.inviteCode}`);
        navigate(`/game/${data.room._id}`);
      });
      /**
       * Handles joining game room.
       */
      socket.on("joinedRoom", (room) => {
        console.log(room.players);
        setResponse(`Joined Room: ${room._id}`);
        navigate(`/game/${room._id}`);
      });
      socket.on("error", (error) => {
        setResponse(`Error: ${error}`);
      });
      /**
       * Handles starting a game.
       */
      socket.on("gameStarted", (data) => {
        console.log("Game has started!");
        console.log("Level:", data.level);
        console.log("Coordinates:", data.coords.lat, data.coords.lng);
      });
    }
  }, [socket]);

  return (
    <div>
      <Typography
        variant="h4"
        align="center"
        sx={{
          color: "#7B68EE",
          fontFamily: '"Baloo 2", cursive',
          fontWeight: "bold",
          fontSize: "30px",
          margin: "20px 0",
        }}
      >
        Create a Game Room
      </Typography>
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

      <Typography
        variant="h4"
        align="center"
        sx={{
          color: "#7B68EE",
          fontFamily: '"Baloo 2", cursive',
          fontWeight: "bold",
          fontSize: "30px",
          margin: "20px 0",
        }}
      >
        OR
      </Typography>
      <Typography
        variant="h4"
        align="center"
        sx={{
          color: "#7B68EE",
          fontFamily: '"Baloo 2", cursive',
          fontWeight: "bold",
          fontSize: "30px",
          margin: "20px 0",
        }}
      >
        Join a Game Room
      </Typography>
      <input
        value={inviteCode}
        onChange={(e) => setInviteCode(e.target.value)}
        type="text"
        placeholder="Enter Invite Code"
      />
      <button onClick={joinRoom}>Join Room</button>
      <Typography
        variant="h4"
        align="center"
        sx={{
          color: "#7B68EE",
          fontFamily: '"Baloo 2", cursive',
          fontWeight: "bold",
          fontSize: "30px",
          margin: "20px 0",
        }}
      >
        {response}
      </Typography>
    </div>
  );
};

export default GameIndexPage;
