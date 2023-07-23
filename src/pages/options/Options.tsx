import React, { useState, useEffect } from "react";
import logo from "@assets/img/logo.png";
import kofi from "@assets/img/ko-fi-me.png"
import OptionsToggle from "@pages/.components/options-toggle/OptionsToggle";

import "@pages/options/Options.scss";



const Options: React.FC = () => {
  const [closeOnCartAdd, setCloseOnCartAdd] = useState(false)
  const [useAnimations, setUseAnimations] = useState(true)
  const [buyPercent, setBuyPercent] = useState(75)

  useEffect(() => {
    const chromeOptionsListener = () => {
      chrome.storage.sync.get(['closeOnCartAdd', 'useAnimations'], (result) => {
        if (result.closeOnCartAdd !== undefined) setCloseOnCartAdd(result.closeOnCartAdd)
        if (result.useAnimations !== undefined) setUseAnimations(result.useAnimations)
      })
    }
    const storageOptionsListener = () => {
      const storedBuyPercent = localStorage.getItem('buyPercent');
      if(buyPercent) setBuyPercent(Number(storedBuyPercent))
    }

    chromeOptionsListener();
    storageOptionsListener();

    // listen for changes in extension options
    chrome.storage.onChanged.addListener(chromeOptionsListener)
    const storageListener = window.addEventListener('storage', storageOptionsListener)

    return () => {
      chrome.storage.onChanged.removeListener(chromeOptionsListener)
      window.removeEventListener('storage', storageOptionsListener)
    }
  }, [])

  useEffect(() => {
    const optionsRange = document.getElementById('options-range');
    optionsRange.addEventListener('dblclick', () => {
      setBuyPercent(50);
    })
  }, [])

  useEffect(() => {
    chrome.storage.sync.set({ closeOnCartAdd: closeOnCartAdd })
  }, [closeOnCartAdd])
  useEffect(() => {
    chrome.storage.sync.set({ useAnimations: useAnimations })
  }, [useAnimations])
  useEffect(() => {
    localStorage.setItem('buyPercent', String(buyPercent))
  }, [buyPercent])

  function handleCloseOnCartAdd(e: React.ChangeEvent<HTMLInputElement>) {
    setCloseOnCartAdd(e.target.checked)
  }
  function handleUseAnimations(e: React.ChangeEvent<HTMLInputElement>) {
    setUseAnimations(e.target.checked)
  }
  function handleBuyPercentInput(e: React.ChangeEvent<HTMLInputElement>) {
    let value = Number(e.target.value);
    if (value > 100) value = 100;
    else if (value < 0) value = 0;
    setBuyPercent(value)
  }
  function handleBuyPercentRange(e: React.ChangeEvent<HTMLInputElement>) {
    setBuyPercent(Number(e.target.value));
  }

  return <div className="options-container">
    <header className="options-header">
      <img src={logo} alt="logo" className="center logo" />
      <h1>Chaos Shopper Settings</h1>
    </header>


    <div className="option">
      <label htmlFor="buy-percent">Percentage chance to buy:</label>
      <div className="buy-percent-input-container">
        <input type='percent' name="buy-percent" id="buy-percent-input" className="buy-percent-input" min='0' max='100' value={buyPercent} onChange={handleBuyPercentInput} />
        <span>%</span>
        <input type="range" className="options-range" id="options-range" min='0' max='100' value={buyPercent} onChange={handleBuyPercentRange} />
      </div>

      <OptionsToggle name="close-on-cart-add" text="Close tab if item added to cart?" checked={closeOnCartAdd} onChange={handleCloseOnCartAdd} />
      <OptionsToggle name="use-animation" text="Use animations?" checked={useAnimations} onChange={handleUseAnimations} />
    </div>

    <footer>
      <a href="https://ko-fi.com/itsdaijoebu" target="_blank"><img src={kofi} alt="Buy me a Ko-fi" /></a>
    </footer>
  </div>;
};

export default Options;
