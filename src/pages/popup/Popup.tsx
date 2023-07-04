import React, { useState, useEffect } from "react";
import logo from "@assets/img/logo.png";
import "@pages/popup/Popup.scss";
import "@pages/.components/options-toggle/OptionsToggle"
import OptionsToggle from "@pages/.components/options-toggle/OptionsToggle";

export default function Popup() {
  const [closeOnCartAdd, setCloseOnCartAdd] = useState(false)
  const [useAnimations, setUseAnimations] = useState(true)
  const [buyPercent, setBuyPercent] = useState(75)

  useEffect(() => {
    chrome.storage.sync.get(['closeOnCartAdd', 'useAnimations', 'buyPercent'], (result) => {
      if (result.closeOnCartAdd !== undefined) setCloseOnCartAdd(result.closeOnCartAdd)
      if (result.useAnimations !== undefined) setUseAnimations(result.useAnimations)
      if (result.buyPercent !== undefined) setBuyPercent(result.buyPercent)
    })
  }, [])

  useEffect(() => {
    chrome.storage.sync.set({ closeOnCartAdd: closeOnCartAdd })
  }, [closeOnCartAdd])
  useEffect(() => {
    chrome.storage.sync.set({ useAnimations: useAnimations })
  }, [useAnimations])
  useEffect(() => {
    chrome.storage.sync.set({ buyPercent: buyPercent })
  })

  function handleCloseOnCartAdd(e: React.ChangeEvent<HTMLInputElement>) {
    setCloseOnCartAdd(e.target.checked)
  }
  function handleUseAnimations(e: React.ChangeEvent<HTMLInputElement>) {
    setUseAnimations(e.target.checked)
  }
  function handleBuyPercent(e: React.ChangeEvent<HTMLInputElement>) {
    let value = Number(e.target.value);
    if (value > 100) value = 100;
    else if (value < 0) value = 0;
    setBuyPercent(value)
  }

  return (
    <div className="App">
      <img src={logo} alt="logo" width='48' height="48" />
      <h1 className="App-header">
        Options
      </h1>

      <label htmlFor="buy-percent">Percentage chance to buy:</label>
      <div>
        <input type="range" min='0' max='100' value={buyPercent} onChange={handleBuyPercent} />
        <input type='percent' name="buy-percent" id="buy-percent-input" className="buy-percent-input" min='0' max='100' value={`${buyPercent}%`} onChange={handleBuyPercent} />
      </div>

      <OptionsToggle name="close-on-cart-add" text="Close tab if item added to cart?" checked={closeOnCartAdd} onChange={handleCloseOnCartAdd}/>
      <OptionsToggle name="use-animation" text="Use animations?" checked={useAnimations} onChange={handleUseAnimations}/>
    </div>
  );
};