import { createRoot } from "react-dom/client";
import App from "@src/pages/content/components/Amazon/app";
import refreshOnUpdate from "virtual:reload-on-update-in-view";

refreshOnUpdate("pages/content");

const root = document.createElement("div");
root.id = "chrome-extension-boilerplate-react-vite-content-view-root";

// Define the target element you want to observe
const targetId = 'quantityRelocate_feature_div';

// Create a MutationObserver instance
const observer = new MutationObserver((mutationsList, observer) => {
    // Check if the target element exists in the DOM
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
        // Your logic to render the button
        document.body.append(root);
        createRoot(root).render(<App />);
        // Disconnect the observer since we no longer need it
        observer.disconnect();
    }
});

// Start observing mutations in the DOM
observer.observe(document, { childList: true, subtree: true });