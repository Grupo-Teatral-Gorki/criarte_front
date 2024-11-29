/* eslint-disable react/prop-types */
import React from "react";

const CardGestao = ({ titulo, valor }) => {
  return (
    <div className="card-gestao">
      <p>{titulo}</p>
      <span>{valor}</span>
    </div>
  );
};

export default CardGestao;
