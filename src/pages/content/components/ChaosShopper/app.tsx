import { useEffect } from "react";
// import "@pages/content/style.scss";

type ChaosShopperButton = {
  addToCartButton?: HTMLElement,
  domain: string
}

export default function App({ addToCartButton = undefined, domain }: ChaosShopperButton) {
  // const [closeOnCartAdd, setCloseOnCartAdd] = useState(false);
  let closeOnCartAdd = false;

  // keep track of extension option changes and set them on mount
  useEffect(() => {
    const optionsListener = () => {
      chrome.storage.sync.get(['closeOnCartAdd'], result => {
        // setCloseOnCartAdd(result.closeOnCartAdd)
        closeOnCartAdd = result.closeOnCartAdd;
        console.log('close on cart add listener', result.closeOnCartAdd)
      })
    }

    //set options on mount
    optionsListener();

    // listen for changes in extension options
    chrome.storage.onChanged.addListener(optionsListener)

    return () => {
      chrome.storage.onChanged.removeListener(optionsListener)
    }
    console.log("content view loaded");
  }, []);


  //determine which domain we're on so we know which button to render
  useEffect(() => {
    switch (domain) {
      case 'amazon':
        renderAmazonChaosButton(addToCartButton);
        break;
      case 'shein':
        renderSheinChaosButton(addToCartButton);
        break;
      // case 'wish':
      //   renderWishChaosButton();
      //   break;
    }
  }, [])

  // useEffect(() => {
  //   console.log('close on cart add useeffect', closeOnCartAdd)
  // }, [closeOnCartAdd])

  // Either adds item to cart or closes window based on random chance
  function chaosShopper(addToCartButton: HTMLElement) {
    console.log('button', addToCartButton)
    let rng = Math.random()
    console.log('rng', rng);
    if (rng < 0.25 || !addToCartButton) { //sometimes addtocartbutton fails to be found. Just chalk it up to the universe not wanting you to buy this thing
      console.log('close', addToCartButton)
      sendMessageToBg('close-tab');
    } else {
      console.log('add to cart')
      addToCartButton.click();
      if (closeOnCartAdd) {
        switch (domain) {
          case 'amazon':
            sendMessageToBg('close-on-navigation');
            setTimeout(() => sendMessageToBg('close-tab'), 2000)
            break;
          default:
            setTimeout(() => sendMessageToBg('close-tab'), 1000)
            break;
        }
      }
    }
  }

  function sendMessageToBg(msg: string) {
    console.log('send message:', msg)
    chrome.runtime.sendMessage(
      {
        msg: msg
      },
      function (response) {
        console.log("response from the bg", response)
      }
    );
  }

  function renderAmazonChaosButton(addToCartButton: HTMLElement) {
    // need to check for #twister_feature_div and if present, have a way to regen the chaos button if it's used
    // current idea for regen: extract the creation of button into its own method, then call it within a mutation observer is twister div exists
    // might need to check whether 
    const checkTwister = () => {
      console.log('check twister')
      const twister = document.getElementById('twister')
      if (twister) {
        console.log('twister', twister)
        let addToCartString = addToCartButton.id;
        const rightCol = document.getElementById('rightCol')
        const twistedObserver = new MutationObserver((mutations, observer) => {
          mutations.forEach(mutation => {
            Array.from(mutation.addedNodes).forEach(e => {
              if (e.id && e.id === 'buybox') {
                // const addToCartObserver = new MutationObserver((mutations, observer) => {
                //   console.log('observe addtocart')
                //   mutations.forEach(mutation => {
                //     Array.from(mutation.addedNodes).forEach(e => {
                //       console.log(e)
                //       if(e.id) {
                //         console.log(e.id)
                //         // makeChaosButton();
                //         // addToCartObserver.disconnect();
                //       }
                //     })
                //   })
                //   addToCartObserver.disconnect();
                // })
                // addToCartObserver.observe(e, {childList: true, subtree:true})
                console.log(e)
                addToCartButton = document.getElementById(addToCartString)
                makeChaosButton();
              }
            })
          })
        })
        // twistedObserver.observe(document, { childList: true, subtree: true });
        twistedObserver.observe(rightCol, { childList: true, subtree: true });
      }
    }
    window.addEventListener('DOMContentLoaded', () => {
      checkTwister();
    })

    if (addToCartButton) {
      //creating the same structure as the site's add to cart button
      makeChaosButton();
    }

    function makeChaosButton() {
      const chaosButton = document.createElement('div')
      chaosButton.classList.add('a-button-stack')

      const buttonSpan = document.createElement('span')
      buttonSpan.classList.add('a-button', 'a-spacing-small', 'a-button-icon', 'chaos-primary')
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

    //need to use a mutationobserver since shein adds their buttons programmatically, so need to wait for button to be created in the page
    const observer = new MutationObserver((mutations, observer) => {
      // Check if the targetLocation element exists in the DOM
      const cartInputButton = addToCartButton.querySelectorAll(sheinCartSelector);
      if (cartInputButton.length > 1) {
        // const locationButton = addToCartButton.querySelector('.product-intro__add-status')
        console.log('cart button loaded', cartInputButton[1])
        observer.disconnect();

        //creating the same structure as the site's add to cart button
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
        chaosButton.classList.add('she-btn-xl', 'she-btn-black', 'chaos-shopper')
        chaosButton.id = 'chaos-shopper'
        chaosAddButton.append(chaosButton)

        const chaosText = document.createElement('div')
        chaosText.classList.add('she-btn-xl__container')
        chaosText.innerText = 'Chaos Shopper!'
        chaosButton.append(chaosText)

        // Shein's site doesn't have ids on their elements, so have to get by class, and the add to cart button is the second button on the page with chosen selector
        // They also have a one click buy button with all the same classes as the ATC button, so have to grab it too
        chaosButton.addEventListener('click', () => chaosShopper(cartInputButton[1] as HTMLElement))

        addToCartButton.before(chaosContainer)
      }
    });
    // Start observing mutations in the DOM
    observer.observe(document, { childList: true, subtree: true });
  }

  // function renderWishChaosButton() {
  //   let modalOpen = false;
  //   const observer = new MutationObserver((mutations, observer) => {
  //     // Check if the targetLocation element exists in the DOM
  //     const addToCartButton = document.querySelector('[data-testid=add-to-cart]') as HTMLElement;
  //     console.log('observing')
  //     if (addToCartButton && !modalOpen) {
  //       console.log('wish cart button', addToCartButton)
  //       modalOpen = true;
  //       const chaosButton = document.createElement('div');
  //       chaosButton.classList.add('chaos-shopper', 'BuyButton__Button-uq0s5t-0 BuyButton__Buy-uq0s5t-1', 'gxVqNh', 'fAjCtG')
  //       chaosButton.id = 'chaos-shopper'

  //       chaosButton.innerText = 'Chaos Shopper!'
  //       addToCartButton.after(chaosButton)

  //       // Your logic to render the button
  //       // Disconnect the observer since we no longer need it
  //       // observer.disconnect();
  //     } else if (!addToCartButton && modalOpen) {
  //       modalOpen = false;
  //       console.log('should set modal open false. is now:', modalOpen)
  //     }
  //   });
  //   // Start observing mutations in the DOM
  //   observer.observe(document, { childList: true, subtree: true });

  //   console.log('wish')
  // }

  return <div className="content-view">content view</div>;
}
