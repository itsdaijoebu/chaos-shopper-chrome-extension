import { useEffect } from "react";

export default function App() {
  useEffect(() => {
    let quantityButton = document.getElementById('quantityRelocate_feature_div')

    if (quantityButton) {
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

      quantityButton.after(chaosButton)
      chaosButton.addEventListener('click', chaosShopper)
    } 
    console.log("content view loaded");
  }, []);


  function chaosShopper() {
    let rng = Math.random()
    console.log(rng)
    if (rng > 0.5) {
      document.getElementById('add-to-cart-button').click();
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
