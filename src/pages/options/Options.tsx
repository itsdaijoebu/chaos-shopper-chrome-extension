import React from "react";
import "@pages/options/Options.css";

const Options: React.FC = () => {
  return <div className="OptionsContainer">
    <h1>Chaos Shopper Settings</h1>
    <div className="option">
      <label htmlFor="close-on-add-to-cart">Close on Add to Cart?</label>
      <input type="checkbox" />
    </div>
  </div>;
};

export default Options;
