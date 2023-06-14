import { useEffect } from "react";

export default function App() {
  useEffect(() => {
    const chaosButton = document.createElement('div')
    chaosButton.classList.add('a-button-stack')

    const buttonSpan = document.createElement('span')
    buttonSpan.classList.add('a-button', 'a-spacing-small', 'a-button-icon')
    chaosButton.appendChild(buttonSpan)

    const buttonSpanInner = document.createElement('span')
    buttonSpanInner.classList.add('a-button-inner')

    buttonSpan.appendChild(buttonSpanInner)

    const chaosText = document.createElement('span')
    chaosText.classList.add('a-button-text')
    chaosText.innerText = 'Chaos Shopper!'
    buttonSpanInner.appendChild(chaosText)

    document.getElementById('quantityRelocate_feature_div').after(chaosButton)
    console.log("content view loaded");

    chaosButton.addEventListener('click', chaosShopper)
  }, []);


  function chaosShopper() {
    const addToCart = document.getElementById('add-to-cart-button')
    let rng = Math.random()
    console.log(rng)
    if (rng > 0.5) {
      addToCart.click();
    } else {
      closeTab();
    }
  }

  function closeTab() {
    chrome.runtime.sendMessage(
      {
        msg: "no-buy"
      },
      function (response) {
        console.log("response from the bg", response)
      }
    );
  }


  return <div className="content-view">content view</div>;
}
