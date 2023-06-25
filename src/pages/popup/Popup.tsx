import React, { useState, useEffect } from "react";
import logo from "@assets/img/logo.svg";
import "@pages/popup/Popup.scss";

export default function Popup() {
  const [closeOnCartAdd, setCloseOnCartAdd] = useState(false)
  const [useAnimations, setUseAnimations] = useState(true)

  useEffect(() => {
    chrome.storage.sync.get(['closeOnCartAdd', 'useAnimations'], (result) => {
      if(result.closeOnCartAdd !== undefined) setCloseOnCartAdd(result.closeOnCartAdd)
      if(result.useAnimations !== undefined) setUseAnimations(result.useAnimations)
    })
  }, [])

  useEffect(() => {
    chrome.storage.sync.set({ closeOnCartAdd: closeOnCartAdd })
  }, [closeOnCartAdd])
  useEffect(() => {
    chrome.storage.sync.set({ useAnimations: useAnimations })
  }, [useAnimations])

  function handleCloseOnCartAdd(e: React.ChangeEvent<HTMLInputElement>) {
    setCloseOnCartAdd(e.target.checked)
  }
  function handleUseAnimations(e: React.ChangeEvent<HTMLInputElement>) {
    setUseAnimations(e.target.checked)
  }

  return (
    <div className="App">
      <h1 className="App-header">
        Options
      </h1>
      <div>
        <label htmlFor="close-on-cart-add">Close tab if item added to cart?</label>
        <input type="checkbox" name="close-on-cart-add" id="close-on-cart-add-checkbox" checked={closeOnCartAdd} onChange={handleCloseOnCartAdd} />
      </div>
      <div>
        <label htmlFor="use-animations">Use animations?</label>
        <input type="checkbox" name="use-animations" id="use-animations-checkbox" checked={useAnimations} onChange={handleUseAnimations} />
      </div>
    </div>
  );
};