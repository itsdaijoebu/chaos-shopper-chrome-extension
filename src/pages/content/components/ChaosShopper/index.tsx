import { createRoot } from "react-dom/client";
import App from "@src/pages/content/components/ChaosShopper/app";
import refreshOnUpdate from "virtual:reload-on-update-in-view";

refreshOnUpdate("pages/content");

const root = document.createElement("div");
root.id = "chrome-extension-boilerplate-react-vite-content-view-root";

// Get the domain of the current site
const hostname = window.location.hostname.split('.')
const domain = hostname[1]
console.log(hostname)

// Define the target element you want to ob,serve
let targetLocationId: string

// if (domain === 'amazon') {
//     const region = hostname[2]
//     console.log('region', region)
//     switch (region) {
//         case 'com':
//         case 'ca':
//             targetLocationId = 'quantityRelocate_feature_div';
//             break;
//     }
// }
switch (domain) {
    case 'amazon':
        targetLocationId = 'quantityRelocate_feature_div';
        break;
}

if (targetLocationId) {
    // Create a MutationObserver instance
    const observer = new MutationObserver((mutationsList, observer) => {
        // Check if the targetLocation element exists in the DOM
        const targetLocationElement = document.getElementById(targetLocationId);
        console.log('observing')
        if (targetLocationElement) {
            // Your logic to render the button
            document.body.append(root);
            console.log('targetLocation', targetLocationId);
            createRoot(root).render(<App targetLocationId={targetLocationId} />);
            // Disconnect the observer since we no longer need it
            observer.disconnect();
        }
    });

    // Start observing mutations in the DOM
    observer.observe(document, { childList: true, subtree: true });
}