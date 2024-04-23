import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";

import { auth } from '../LogoutPage/firebase-config.js';

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
  const correctMarkerRef = useRef(null);
  const polylineRef = useRef(null);

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

  const placeCorrectMarker = (location, map) => {
    if (correctMarkerRef.current) {
      correctMarkerRef.current.setMap(null); // Remove the previous marker
    }
    const marker = new window.google.maps.Marker({
      position: location,
      map: map,
      icon: "http://maps.google.com/mapfiles/ms/icons/green-dot.png"
    });
    correctMarkerRef.current = marker;
  };

  const textStyle = {
    color: "#7B68EE",
    fontFamily: '"Baloo 2", cursive',
    fontWeight: "bold",
    fontSize: "30px",
    textAlign: "center",
    margin: "20px 0",
  };

  const drawPolyline = (playerLocation, correctLocation, map) => {
    if (polylineRef.current) {
      polylineRef.current.setMap(null);
    }
    const polyline = new window.google.maps.Polyline({
      path: [playerLocation, correctLocation],
      strokeColor: '#FF0000',
      strokeOpacity: 1.0,
      strokeWeight: 3,
      map: map
    });
    polylineRef.current = polyline;
    console.log("ha")
  };


  ////////////////////////////////////////////////////////

  const [loginUser, setLoginUser] = useState(null);
  useEffect(() => {
    const fetchLoginUser = async () => {
      try {
        const user = await auth.currentUser;
        if (user) {
          setLoginUser(user);
        } else {
          navigate(`/login`);
        }
      } catch (error) {
        console.error("Error fetching login user:", error);
        navigate(`/`);
      }
    };
    fetchLoginUser();
  }, [navigate]);

  const loginUserID = loginUser ? loginUser.uid : null;
  /////////////////////////////////////////////////////////////////////



  const handleSubmit = () => {
    if (socket && playerLat && playerLng && levelInfo?.coords) {
      const playerLocation = new window.google.maps.LatLng(playerLat, playerLng);
      const correctLocation = new window.google.maps.LatLng(levelInfo.coords.lat, levelInfo.coords.lng);
      const distance = window.google.maps.geometry.spherical.computeDistanceBetween(playerLocation, correctLocation) / 1000; // distance in kilometers
      console.log(levelInfo.coords)

      placeCorrectMarker(levelInfo.coords, mapRef.current); // FIXME the correct marker don't show up
      drawPolyline(playerLocation, correctLocation, mapRef.current); // FIXME the line don't show up

      socket.emit("submitGuess", {
        roomId,
        uid: loginUserID,
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
