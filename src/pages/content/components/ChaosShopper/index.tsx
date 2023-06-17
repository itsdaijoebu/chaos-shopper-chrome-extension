import { createRoot } from "react-dom/client";
import App from "@src/pages/content/components/ChaosShopper/app";
import refreshOnUpdate from "virtual:reload-on-update-in-view";

refreshOnUpdate("pages/content");

const root = document.createElement("div");
root.id = "chrome-extension-boilerplate-react-vite-content-view-root";

// Get the domain of the current site
const hostname = window.location.hostname.split('.')
const domain = hostname[1]
console.log('hostname:', hostname)

// Define the target element you want to ob,serve
let addToCartSelector: string

switch (domain) {
    case 'amazon':
        addToCartSelector = '#addToCart_feature_div';
        break;
    case 'shein':
        addToCartSelector = '.product-intro__add'
}

if (addToCartSelector) {
    // Create a MutationObserver instance
    const observer = new MutationObserver((mutationsList, observer) => {
        // Check if the targetLocation element exists in the DOM
        const addToCartButton = document.querySelector(addToCartSelector) as HTMLElement;
        console.log('observing')
        if (addToCartButton) {
            // Your logic to render the button
            document.body.append(root);
            console.log('targetLocation', addToCartSelector);
            createRoot(root).render(<App addToCartButton={addToCartButton} domain={domain} />);
            // Disconnect the observer since we no longer need it
            observer.disconnect();
        }
    });

    // Start observing mutations in the DOM
    observer.observe(document, { childList: true, subtree: true });
}