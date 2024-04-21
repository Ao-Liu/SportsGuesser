import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();
  const mapRef = useRef(null);
  const userMarkerRef = useRef(null);

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
    newSocket.on("newLevelInfo", (data) => {
      setLevelInfo(data);
      console.log("Received new level info:", data);
    });
    newSocket.on("gameEnded", () => {
      console.log("Game ended");
      navigate(`/game/${roomId}/results`, { state: { roomId: roomId } });
    });
    newSocket.on("levelInfoError", (errorMsg) => {
      setError(errorMsg);
      console.error("Level info error:", errorMsg);
    });

    const loadMap = () => {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyCbwceX4lQH3QK5x3rbt_tKTHnM1864Bhw&callback=initMap&libraries=geometry`;
      script.async = true;
      script.defer = true;
      script.onerror = () => console.error("Google Maps script failed to load.");
      document.head.appendChild(script);
      window.initMap = initMap;
    };
    loadMap();

    return () => {
      newSocket.off("levelInfo");
      newSocket.off("levelInfoError");
      newSocket.disconnect();
    };
  }, [roomId, navigate]);

  const initMap = () => {
    const map = new window.google.maps.Map(mapRef.current, {
      center: { lat: 0, lng: 0 },
      zoom: 2,
    });

    map.addListener("click", (e) => {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      setPlayerLat(lat);
      setPlayerLng(lng);
      placeMarker({ lat, lng }, map);
    });
  };

  const placeMarker = (location, map) => {
    if (userMarkerRef.current) {
      userMarkerRef.current.setMap(null); // Remove the previous marker
    }
    const marker = new window.google.maps.Marker({
      position: location,
      map: map,
      icon: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
    });
    userMarkerRef.current = marker;
  };

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
    if (socket && playerLat && playerLng && levelInfo?.coords) {
      const playerLocation = new window.google.maps.LatLng(playerLat, playerLng);
      const correctLocation = new window.google.maps.LatLng(levelInfo.coords?.lat, levelInfo.coords?.lng);
      const distance = window.google.maps.geometry.spherical.computeDistanceBetween(playerLocation, correctLocation) / 1000; // distance in kilometers

      socket.emit("submitGuess", {
        roomId,
        uid: dummyUserID,
        level: levelInfo.level,
        distance: distance,
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
      setHasSubmitted(false);
      setLevelCompleted(false);
    }
  };

  return (
    <div>
      <h1 style={textStyle}>Game Level: {levelInfo?.level}</h1>
      <div ref={mapRef} style={{ height: '600px', width: '600px' }}></div>
      {!hasSubmitted && (
        <div>
          <input
            type="number"
            value={playerLat}
            onChange={(e) => setPlayerLat(e.target.value)}
            placeholder="Latitude"
            style={textStyle}
          />
          <input
            type="number"
            value={playerLng}
            onChange={(e) => setPlayerLng(e.target.value)}
            placeholder="Longitude"
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
