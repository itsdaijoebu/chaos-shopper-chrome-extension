import { useEffect } from "react";
// import "@pages/content/style.scss";

type ChaosShopperButton = {
  addToCartButton: HTMLElement,
  domain: string
}

export default function App({ addToCartButton, domain }: ChaosShopperButton) {
  useEffect(() => {
    switch (domain) {
      case 'amazon':
        renderAmazonChaosButton(addToCartButton);
        break;
      case 'shein':
        renderSheinChaosButton(addToCartButton);
        break;
    }
    console.log("content view loaded");
  }, []);

  // Either adds item to cart or closes window based on random chance
  function chaosShopper(addToCartButton : HTMLElement) {
    console.log('button', addToCartButton)
    let rng = Math.random()
    if (rng > 0.5) {
      console.log('add to cart')
      addToCartButton.click();
    } else {
      console.log('close')
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

  function renderAmazonChaosButton(addToCartButton: HTMLElement) {
    if (addToCartButton) {
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

      addToCartButton.before(chaosButton)

      let addToCartSubmit = addToCartButton.querySelector('#add-to-cart-button') as HTMLElement
      chaosButton.addEventListener('click', () => chaosShopper(addToCartSubmit))
    }
  }

  function renderSheinChaosButton(addToCartButton: HTMLElement) {
    const sheinCartSelector = ".she-btn-black"
    const observer = new MutationObserver((mutationsList, observer) => {
      // Check if the targetLocation element exists in the DOM
      const cartInputButton = addToCartButton.querySelectorAll(sheinCartSelector);
      if (cartInputButton.length > 1) {
        // const locationButton = addToCartButton.querySelector('.product-intro__add-status')
        console.log('cart button loaded', cartInputButton[1])
        observer.disconnect();

        const chaosContainer = document.createElement('div')
        chaosContainer.classList.add('product-intro__add')

        const chaosClearfix = document.createElement('div')
        chaosClearfix.classList.add('she-clearfix', 'product-intro__add-wrap')
        chaosContainer.append(chaosClearfix)

        const chaosAddStatus = document.createElement('div')
        chaosAddStatus.classList.add('product-intro__add-status')
        chaosAddStatus.style.width = '100%';
        chaosClearfix.append(chaosAddStatus)

        const chaosAddButton = document.createElement('div')
        chaosAddButton.classList.add('product-intro__add-btn')
        chaosAddStatus.append(chaosAddButton)

        const chaosButton = document.createElement('button')
        chaosButton.classList.add('she-btn-xl', 'she-btn-black')
        chaosButton.id = 'chaos-shopper'
        chaosAddButton.append(chaosButton)
        
        const chaosText = document.createElement('div')
        chaosText.classList.add('she-btn-xl__container')
        chaosText.innerText = 'Chaos Shopper!'
        chaosButton.append(chaosText)
        
        chaosButton.addEventListener('click', () => chaosShopper(cartInputButton[1] as HTMLElement))

        addToCartButton.before(chaosContainer)


      }
    });

    // Start observing mutations in the DOM
    observer.observe(document, { childList: true, subtree: true });
  }




  return <div className="content-view">content view</div>;
}
