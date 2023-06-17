import { useEffect } from "react";
// import "@pages/content/style.scss";

type ChaosShopperButton = {
  targetLocationId: string
}

export default function App({targetLocationId} : ChaosShopperButton) {
  useEffect(() => {
    renderChaosButton(targetLocationId)
    console.log("content view loaded");
  }, []);

  function renderChaosButton(targetLocationId) {
    let targetLocation = document.getElementById(targetLocationId)

    if (targetLocation) {
      const chaosButton = document.createElement('div')
      chaosButton.classList.add('a-button-stack')

      const buttonSpan = document.createElement('span')
      buttonSpan.classList.add('a-button', 'a-spacing-small', 'a-button-icon', 'chaos-primary')  //place color class on this button
      buttonSpan.id = "chaos-shopper"
      chaosButton.appendChild(buttonSpan)

      const buttonSpanInner = document.createElement('span')
      buttonSpanInner.classList.add('a-button-inner')

      buttonSpan.appendChild(buttonSpanInner)

      const chaosText = document.createElement('span')
      chaosText.classList.add('a-button-text')
      chaosText.innerText = 'Chaos Shopper!'
      buttonSpanInner.appendChild(chaosText)

      targetLocation.after(chaosButton)
      chaosButton.addEventListener('click', chaosShopper)
    } 
  }

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
