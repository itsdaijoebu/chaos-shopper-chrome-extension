// todo: ensure that if "close on add to cart" is on, the page doesn't close if the item wasn't added due to a size/color/etc option wasn't selected

import { features } from "process";
import { useEffect } from "react";
// import "@pages/content/style.scss";
import { gsap } from 'gsap';

type ChaosShopperButton = {
  addToCartButton?: HTMLElement,
  addToCartSelector?: string,
  domain: string
}

export default function App({ addToCartButton = undefined, addToCartSelector = undefined, domain }: ChaosShopperButton) {
  // const [closeOnCartAdd, setCloseOnCartAdd] = useState(false);
  let closeOnCartAdd = false;
  let useAnimations = false;

  // keep track of extension option changes and set them on mount
  useEffect(() => {
    const optionsListener = () => {
      chrome.storage.sync.get(['closeOnCartAdd', 'useAnimations'], result => {
        // setCloseOnCartAdd(result.closeOnCartAdd)
        closeOnCartAdd = result.closeOnCartAdd;
        useAnimations = result.useAnimations;
      })
    }

    //set options on mount
    optionsListener();

    // listen for changes in extension options
    chrome.storage.onChanged.addListener(optionsListener)

    return () => {
      chrome.storage.onChanged.removeListener(optionsListener)
    }
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

  function chaosAnimationSVG() {
    const svgNS = 'http://www.w3.org/2000/svg'

    const chaosSvg = document.createElementNS(svgNS, 'svg');
    chaosSvg.classList.add("svg-filter")

    const defs = document.createElement('defs')
    chaosSvg.appendChild(defs)

    const filter = document.createElementNS(svgNS, 'filter')
    filter.id = 'filter'
    defs.appendChild(filter)

    const feTurbulence = document.createElementNS(svgNS, 'feTurbulence')
    feTurbulence.setAttributeNS(null, 'type', 'fractalNoise')
    feTurbulence.setAttributeNS(null, 'baseFrequency', '0.00001 0.00001')
    feTurbulence.setAttributeNS(null, 'numOctaves', '1')
    feTurbulence.setAttributeNS(null, 'result', 'warp')
    filter.appendChild(feTurbulence)

    const feDisplacement = document.createElementNS(svgNS, 'feDisplacementMap')
    feDisplacement.setAttributeNS(null, 'xChannelSelector', 'R')
    feDisplacement.setAttributeNS(null, 'yChannelSelector', 'G')
    feDisplacement.setAttributeNS(null, 'scale', '30')
    feDisplacement.setAttributeNS(null, 'in', 'SourceGraphic')
    feDisplacement.setAttributeNS(null, 'in2', 'warpOffset')
    filter.appendChild(feDisplacement)
    return chaosSvg
  }

  function addChaosAnimation(bt: HTMLElement) {
    let chaosSVG = chaosAnimationSVG();
    bt.append(chaosSVG)

    let turbVal = { val: 0.000001 };
    const turb = chaosSVG.querySelector('feTurbulence');
    let btTl = gsap.timeline({
      paused: true,
      onUpdate: () => {
        turb.setAttributeNS(null, 'baseFrequency', '0' + turbVal.val)
      }
    })
    btTl.to(turbVal, 0.2, { val: 0.3 });
    btTl.to(turbVal, 0.2, { val: 0.000001 });
    bt.addEventListener('mouseenter', function() {
      btTl.restart();
      });
  }

  function renderAmazonChaosButton(addToCartButton: HTMLElement) {
    // checks for the existance of the twister form, which allows for users to change the color, size, etc of their purchase without needing to reload the page
    // however, it does reload the buybox, the sidebar containing the add to cart and chaos buttons, so if there is a twister form, then we need to make sure
    // to recreate the chaos button whenever a twister selection reloads the buybox
    const checkTwister = () => {
      const twister = document.getElementById('twister')
      if (twister) {
        const rightCol = document.getElementById('rightCol')
        const twistedObserver = new MutationObserver((mutations, observer) => {
          for (let mutation of mutations) {
            for (let element of mutation.addedNodes) {
              const e = element as HTMLElement
              if (e.id && e.id === 'buybox') {
                addToCartButton = document.querySelector(addToCartSelector)
                makeChaosButton();
                return;
              }
            }
          }
        })
        twistedObserver.observe(rightCol, { childList: true, subtree: true });
      }
    }
    // twister is loaded after the add to cart button, so need to check it at a different timing
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

      const addToCartSubmit = addToCartButton.querySelector('#add-to-cart-button') as HTMLElement
      chaosButton.addEventListener('click', () => chaosShopper(addToCartSubmit))
      addChaosAnimation(chaosButton);
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
        addChaosAnimation(chaosButton);

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
