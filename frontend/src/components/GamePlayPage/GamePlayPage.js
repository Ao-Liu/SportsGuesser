import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import io from "socket.io-client";

const GamePlayPage = () => {
  const location = useLocation();
  const { roomId } = location.state || {};
  const [socket, setSocket] = useState(null);
  const [playerLat, setPlayerLat] = useState("");
  const [playerLng, setPlayerLng] = useState("");
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [levelInfo, setLevelInfo] = useState(null);
  const [levelCompleted, setLevelCompleted] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const newSocket = io(`http://localhost:3001`);
    setSocket(newSocket);
    newSocket.emit("getLevelInfo", { roomId });
    newSocket.on("levelInfoFetched", (data) => {
      setLevelInfo(data);
      console.log("Received level info:", data);
    });
    newSocket.on("levelCompleted", (data) => {
      setLevelCompleted(true);
      console.log("Level completed");
    });
    newSocket.on("levelInfoError", (errorMsg) => {
      setError(errorMsg);
      console.error("Level info error:", errorMsg);
    });
    newSocket.on("newLevelInfo", (data) => {
      setLevelInfo(data);
      console.log("Received new level info:", data);
    });
    return () => {
      newSocket.off("levelInfo");
      newSocket.off("levelInfoError");
      newSocket.disconnect();
    };
  }, [roomId]);

  const textStyle = {
    color: "#7B68EE",
    fontFamily: '"Baloo 2", cursive',
    fontWeight: "bold",
    fontSize: "30px",
    textAlign: "center",
    margin: "20px 0",
  };

  let dummyUserID = "12345"; // TODO: replace this with signed in user info (firebase ID).

  const handleSubmit = () => {
    if (socket) {
      const answer = {
        lat: playerLat,
        lng: playerLng,
      };
      socket.emit("submitGuess", {
        roomId,
        uid: dummyUserID,
        level: levelInfo.level,
        distance: 5, // TODO: calculate actual distance.
      });
      setHasSubmitted(true);
    }
  };

  const handleNextLevel = () => {
    if (socket) {
      console.log(levelInfo);
      socket.emit("nextLevel", {
        roomId,
        currentLevel: levelInfo.level,
      });
    }
  };

  return (
    <div>
      <h1 style={textStyle}>Game Level: {levelInfo?.level}</h1>
      {!hasSubmitted && (
        <div>
          <input
            type="number"
            value={playerLat}
            onChange={(e) => setPlayerLat(e.target.value)}
            placeholder="Your guess for Latitude"
            style={textStyle}
          />
          <input
            type="number"
            value={playerLng}
            onChange={(e) => setPlayerLng(e.target.value)}
            placeholder="Your guess for Longitude"
            style={textStyle}
          />
          <button onClick={handleSubmit} style={textStyle}>
            Submit Guess
          </button>
        </div>
      )}
      {hasSubmitted && levelInfo && (
        <div>
          <p style={textStyle}>Your Guess:</p>
          <p style={textStyle}>Latitude: {playerLat}</p>
          <p style={textStyle}>Longitude: {playerLng}</p>
          <p style={textStyle}>Correct Coordinates:</p>
          <p style={textStyle}>Latitude: {levelInfo.coords?.lat}</p>
          <p style={textStyle}>Longitude: {levelInfo.coords?.lng}</p>
        </div>
      )}
      {levelCompleted && (
        <button style={textStyle} onClick={handleNextLevel}>
          Next Level
        </button>
      )}
    </div>
  );
};

export default GamePlayPage;
