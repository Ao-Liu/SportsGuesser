import React from "react";
import { useLocation } from "react-router-dom";

const GamePlayPage = () => {
  const location = useLocation();
  const { level, coords } = location.state || {};

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
      <h1 style={textStyle}>Game Level: {level}</h1>
      <br/>
      <p style={textStyle}> Coordinates: </p>
      <p style={textStyle}> Latitude: {coords?.lat}  </p>
      <p style={textStyle}> Longitude: {coords?.lng} </p>
    </div>
  );
};

export default GamePlayPage;
