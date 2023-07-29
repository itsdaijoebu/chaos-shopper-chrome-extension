import React, { useState, useEffect } from "react";
import logo from "@assets/img/logo.png";
import kofi from "@assets/img/ko-fi-me.png"
import OptionsToggle from "@pages/.components/options-toggle/OptionsToggle";

import "@pages/options/Options.scss";

export default function Options() {
  const [isLoaded, setIsLoaded] = useState<boolean>();
  const [closeOnCartAdd, setCloseOnCartAdd] = useState<boolean>()
  const [useAnimations, setUseAnimations] = useState<boolean>()
  const [buyPercent, setBuyPercent] = useState<number>()
  const changeSourceName = 'options-page'

  useEffect(() => {
    chrome.storage.local.get(['closeOnCartAdd', 'useAnimations', 'buyPercent'], result => {
      if (result.closeOnCartAdd !== undefined) setCloseOnCartAdd(result.closeOnCartAdd)
      if (result.useAnimations !== undefined) setUseAnimations(result.useAnimations)
      if (result.buyPercent !== undefined) setBuyPercent(result.buyPercent)
    })
    setIsLoaded(true);
  }, [])

  useEffect(() => {
    const chromeOptionsListener = () => {
      chrome.storage.local.get(['changeSource', 'closeOnCartAdd', 'useAnimations', 'buyPercent'], result => {
        if (result.changeSource === changeSourceName) return
        if (result.closeOnCartAdd !== undefined) setCloseOnCartAdd(result.closeOnCartAdd)
        if (result.useAnimations !== undefined) setUseAnimations(result.useAnimations)
        if (result.buyPercent !== undefined) setBuyPercent(result.buyPercent)
      })
    }

    // listen for changes in extension options
    chrome.storage.onChanged.addListener(chromeOptionsListener)

    return () => {
      chrome.storage.onChanged.removeListener(chromeOptionsListener)
    }
  }, [])

  useEffect(() => {
    const optionsRange = document.getElementById('options-range');
    optionsRange.addEventListener('dblclick', () => {
      setBuyPercent(50);
    })
  }, [])

  useEffect(() => {
    chrome.storage.local.set({ closeOnCartAdd: closeOnCartAdd, changeSource: changeSourceName })
  }, [closeOnCartAdd])
  useEffect(() => {
    chrome.storage.local.set({ useAnimations: useAnimations, changeSource: changeSourceName })
  }, [useAnimations])
  useEffect(() => {
    chrome.storage.local.set({ buyPercent: buyPercent, changeSource: changeSourceName })
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
    console.log('handlebuypercentrange', buyPercent)
  }

  return <div className="options-container">
    <header className="options-header">
      <img src={logo} alt="logo" className="center logo" />
      <h1>Chaos Shopper Settings</h1>
    </header>


    <div className="options">
      <div>
        <label htmlFor="buy-percent">Percentage chance to buy:</label>
        <div className="buy-percent-input-container">
          <input type='percent' name="buy-percent" id="buy-percent-input" className="buy-percent-input" min='0' max='100' value={buyPercent} onChange={handleBuyPercentInput} />
          <span>%</span>
          <input type="range" className="options-range" id="options-range" min='0' max='100' value={buyPercent} onChange={handleBuyPercentRange} />
        </div>
      </div>

      <OptionsToggle name="close-on-cart-add" text="Close tab if item added to cart?" checked={closeOnCartAdd} onChange={handleCloseOnCartAdd} isLoaded={isLoaded}/>
      <OptionsToggle name="use-animation" text="Use animations?" checked={useAnimations} onChange={handleUseAnimations} isLoaded={isLoaded}/>

      <footer>
      <a href="https://ko-fi.com/itsdaijoebu" target="_blank" rel="noopener"><img src={kofi} alt="Buy me a Ko-fi" /></a>
    </footer>
    </div>
  </div>;
};