import React, { useState, useEffect } from "react";
import logo from "@assets/img/logo.svg";
import "@pages/popup/Popup.scss";

export default function Popup() {
  const [closeOnCartAdd, setCloseOnCartAdd] = useState(false)

  useEffect(() => {
    chrome.storage.sync.get(['closeOnCartAdd'], (result) => {
      if(result.closeOnCartAdd !== undefined) setCloseOnCartAdd(result.closeOnCartAdd)
    })
  }, [])

  useEffect(() => {
    chrome.storage.sync.set({ closeOnCartAdd: closeOnCartAdd })
  }, [closeOnCartAdd])

  function handleCloseOnCartAdd(e: React.ChangeEvent<HTMLInputElement>) {
    setCloseOnCartAdd(e.target.checked)
  }

  return (
    <div className="App">
      <h1 className="App-header">
        Options
      </h1>
      <label htmlFor="close-on-cart-add">Close tab if item added to cart?</label>
      <input type="checkbox" name="close-on-cart-add" id="close-on-cart-add-checkbox" checked={closeOnCartAdd} onChange={handleCloseOnCartAdd} />
    </div>
  );
};