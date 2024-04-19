import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import io from "socket.io-client";

const GameRoomPage = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [roomDetails, setRoomDetails] = useState({});
  const [error, setError] = useState("");
  const [socket, setSocket] = useState(null);

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
      });
      /**
       * Listens to starting game.
       */
      socket.on("gameStarted", (data) => {
        console.log("Game has started!");
        alert("Game has started!");
        navigate(`/game/${roomId}/play`, { state: { roomId: roomId, level: data.level, coords: data.coords } });
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

  let dummyUserID = "1234"; // TODO: replace this with signed in user info (firebase ID).

  return (
    <div>
      <h1 style={textStyle}>Game Room: {roomId}</h1>
      {error && <p style={textStyle}>Error: {error}</p>}
      {!error && roomDetails && (
        <>
          <p style={textStyle}>Number of Levels: {roomDetails.numOfLevels}</p>
          <p style={textStyle}>Players:</p>
          <ul>
            {roomDetails.players &&
              roomDetails.players.map((player, index) => (
                <p key={index} style={textStyle}>
                  {index + 1}: {player}
                </p>
              ))}
          </ul>
          {roomDetails.players?.[0] === dummyUserID && (
            <button onClick={startGame}>Start Game</button>
          )}
        </>
      )}
    </div>
  );
};

export default GameRoomPage;
