import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import io from "socket.io-client";

const GameResultPage = () => {
  const location = useLocation();
  const { roomId } = location.state || {};
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io("http://localhost:3001");
    setSocket(newSocket);

    if (roomId) {
      newSocket.emit("getResults", { roomId });
    }

    newSocket.on("results", (data) => {
      setResults(data);
      console.log(results)
    });

    newSocket.on("error", (errorMsg) => {
      setError(errorMsg);
      console.error("Error fetching results:", errorMsg);
    });

    return () => {
      newSocket.off("results");
      newSocket.off("error");
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

  return (
    <div>
      <h1 style={textStyle}>Game has ended!</h1>
      {error && <p>Error: {error}</p>}
      <h2 style={textStyle}>
        Player, Sum of distances between guesses and the correct answers
      </h2>
      <ul>
        {results && results.map((result, index) => (
          <p style={textStyle} key={index}>
            {result.displayName}, {result.totalDistance.toFixed(2)} km
          </p>
        ))}
      </ul>
    </div>
  );
};

export default GameResultPage;
