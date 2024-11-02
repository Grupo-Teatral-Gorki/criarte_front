// components/Section.js
import React from "react";
import Button from "@mui/material/Button";

const Section = ({ title, description, link }) => {
  return (
    <div className="section">
      <h3>{title}</h3>
      <p>{description}</p>
      <Button variant="text" href={link}>
        Ir
      </Button>
    </div>
  );
};

export default Section;
