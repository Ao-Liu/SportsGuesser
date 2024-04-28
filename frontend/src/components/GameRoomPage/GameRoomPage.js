import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import io from "socket.io-client";

import { auth } from "../../firebase-config.js";

const GameRoomPage = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [roomDetails, setRoomDetails] = useState({});
  const [error, setError] = useState("");
  const [socket, setSocket] = useState(null);
  const [usernames, setUsernames] = useState(new Set());

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

  useEffect(() => {
    if (socket) {
      /**
       * Fetches room details from backend.
       */
      socket.emit("getRoomDetails", roomId);
      /**
       * Processes room details.
       */
      socket.on("roomDetails", (room) => {
        setRoomDetails(room);
        if (room.winnerCalculated) {
          navigate(`/game/${roomId}/results`);
        }
        for (const player of room.players) {
          socket.emit("getUsername", { roomId, uid: player });
        }
      });
      /**
       * Fetches username.
       */
      socket.on("username", (data) => {
        setUsernames((prevUsernames) => {
          const newSet = new Set(prevUsernames); // TODO: issue with identical name
          newSet.add(data);
          return newSet;
        });
      });
      /**
       * Listens to starting game.
       */
      socket.on("gameStarted", (data) => {
        console.log("Game has started!");
        alert("Game has started!");
        navigate(`/game/${roomId}/play`, {
          state: { roomId: roomId, level: data.level, coords: data.coords },
        });
      });
      socket.on("roomDetailsError", (errorMsg) => {
        setError(errorMsg);
      });
    }
  }, [socket, roomId, navigate]);

  /**
   * Starts a game.
   */
  const startGame = () => {
    if (socket) {
      console.log("Attempting to start game...");
      socket.emit("startGame", { roomId });
    }
  };

  const textStyle = {
    color: "#7B68EE",
    fontFamily: '"Baloo 2", cursive',
    fontWeight: "bold",
    fontSize: "30px",
    textAlign: "center",
    margin: "20px 0",
  };

  // Retrieve the UID from local storage
  const loginUserID = localStorage.getItem("userUID");

  return (
    <div>
      {/* <h1 style={textStyle}>Game Room: {roomId}</h1> */}
      {error && <p style={textStyle}>Error: {error}</p>}
      {!error && roomDetails && (
        <>
          <p style={textStyle}>Number of Levels: {roomDetails.numOfLevels}</p>
          <p style={textStyle}>
            Please share {roomDetails.inviteCode} to invite other players to
            join this game.
          </p>
          <p style={textStyle}>Players:</p>
          <ul>
            {[...usernames].map((username, index) => (
              <p key={username} style={textStyle}>
                {index + 1}: {username}
              </p>
            ))}
          </ul>
          {roomDetails.players?.[0] === loginUserID && (
            <button onClick={startGame}>Start Game</button>
          )}
        </>
      )}
    </div>
  );
};

export default GameRoomPage;
