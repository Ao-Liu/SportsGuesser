import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import { useNavigate } from "react-router-dom";
import { Typography } from "@mui/material";


import { auth } from '../../firebase-config.js';

/**
 * For backend testing purposes.
 * Subject to change.
 */
const GameIndexPage = () => {
  const [socket, setSocket] = useState(null);
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

  // const [loginUser, setLoginUser] = useState(null);
  // useEffect(() => {
  //   const fetchLoginUser = async () => {
  //     try {
  //       const user = await auth.currentUser;
  //       if (user) {
  //         setLoginUser(user);
  //       } else {
  //         navigate(`/login`);
  //       }
  //     } catch (error) {
  //       console.error("Error fetching login user:", error);
  //       navigate(`/`);
  //     }
  //   };
  //   fetchLoginUser();
  // }, [navigate]);

  // const loginUserID = loginUser ? loginUser.uid : null;

  // Retrieve the UID from local storage
  const loginUserID = localStorage.getItem('userUID');

  const createRoom = () => {
    if (!loginUserID) {
      alert("Please log in to start a game");
      return;
    } 
    if (socket) {
      socket.emit("createRoom", {
        numOfLevels: numOfLevels,
        userId: loginUserID,
      });
    }
  };

  const joinRoom = () => {
    if (!loginUserID) {
      alert("Please log in to join a game");
      return;
    } 
    if (socket && inviteCode) {
      socket.emit("joinRoom", {
        inviteCode: inviteCode,
        userId: loginUserID,
      });
    }
  };

  useEffect(() => {
    if (socket) {
      /**
       * Handles game room creation.
       */
      socket.on("roomCreated", (data) => {
        if (loginUserID === data.room.players[0]) {
          setResponse(`Room Created! Invite Code: ${data.inviteCode}`);
          navigate(`/game/${data.room._id}`);
        }
      });
      /**
       * Handles joining game room.
       */
      socket.on("joinedRoom", (room) => {
        setResponse(`Joined Room: ${room._id}`);
        navigate(`/game/${room._id}`);
      });

      socket.on("gameStarted", () => {
        setResponse(`Cannot join room as game has already started.`);
      });

      socket.on("error", (error) => {
        setResponse(`Error: ${error}`);
      });
    }
  }, [socket]);

  const textStyle = {
    color: "#7B68EE",
    fontFamily: '"Baloo 2", cursive',
    fontWeight: "bold",
    fontSize: "30px",
    textAlign: "center",
    margin: "20px 0",
  };

  return (
    <div>
      <Typography style={textStyle}>
        Create a Game Room
      </Typography>
      <input
        value={numOfLevels}
        onChange={(e) => setNumOfLevels(e.target.value)}
        type="number"
        placeholder="Number of Levels"
      />
      <button onClick={createRoom}>Create Room</button>

      <Typography style={textStyle}>
        OR
      </Typography>
      <Typography style={textStyle}>
        Join a Game Room
      </Typography>
      <input
        value={inviteCode}
        onChange={(e) => setInviteCode(e.target.value)}
        type="text"
        placeholder="Enter Invite Code"
      />
      <button onClick={joinRoom}>Join Room</button>
      <Typography style={textStyle}>
        {response}
      </Typography>
    </div>
  );
};

export default GameIndexPage;
