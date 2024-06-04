import { switchStorage } from "@chrome-extension-boilerplate/shared";

let clickedElement: Element | null = null;
let popupContainer: HTMLElement | null = null;
let popup: HTMLElement | null = null;

/**
 * Function to initialize the popup elements.
 * It sets the references to the popup container and popup elements.
 */
function initializePopup() {
  popupContainer = document.querySelector("#poppy-popup-container");
  if (popupContainer) {
    const popupShadowRoot =
      popupContainer.shadowRoot?.querySelector("#shadow-root");
    popup = popupShadowRoot?.querySelector<HTMLElement>("#poppy-popup") || null;
  }
}

// EVENT LISTENERS

// Add event listener to the document to handle clicks on specific input and textarea elements
document.addEventListener("click", (event: MouseEvent) => {
  const target = event.target as Element;
  if (
    target.matches(
      "input:not([type='search']):not([type='range']):not([type='datetime-local']):not([type='month']):not([type='time']):not([type='week']):not([type='date']):not([type='color']):not([type='reset']):not([type='radio']):not([type='image']):not([type='button']):not([type='checkbox']):not([type='file']):not([type='hidden']), textarea"
    )
  ) {
    handleFocus(target);
    return;
  }
  handleOutsideClick(event);
});

// Add event listener to the document to handle focus on specific input and textarea elements
document.addEventListener("focus", (event: FocusEvent) => {
  const target = event.target as Element;
  if (
    target.matches(
      "input:not([type='search']):not([type='range']):not([type='datetime-local']):not([type='month']):not([type='time']):not([type='week']):not([type='date']):not([type='color']):not([type='reset']):not([type='radio']):not([type='image']):not([type='button']):not([type='checkbox']):not([type='file']):not([type='hidden']), textarea"
    )
  ) {
    handleFocus(target);
  }
}, true);


// Add event listener for custom "clickedQuestion" event
window.addEventListener("clickedQuestion", (e: Event) => {
  handleCustomEvent(e as CustomEvent);
});

// CALLBACK FUNCTIONS

/**
 * Function to handle element focus.
 * @param {Element} element - The focused element.
 */
async function handleFocus(element: Element) {
  try {
    const res = await switchStorage.get();
    if (res === "off") return;

    // Initialize popup elements if not already done
    if (!popupContainer || !popup) {
      initializePopup();
    }

    if (popup) {
      const rect = element.getBoundingClientRect();
      popup.style.top = `${rect.bottom + window.scrollY + 10}px`;
      popup.style.left = `${rect.left + window.scrollX}px`;
      popup.style.display = "block";
      clickedElement = element;
    }
  } catch (error) {
    console.error("Error handling focus:", error);
  }
}

/**
 * Function to handle clicks outside the popup.
 * @param {MouseEvent} event - The mouse event.
 */
function handleOutsideClick(event: MouseEvent) {
  if (clickedElement && popup) {
    if (
      !clickedElement.contains(event.target as Node) &&
      !popup.contains(event.target as Node)
    ) {
      popup.style.display = "none";
      clickedElement = null;
    }
  }
}

/**
 * Function to handle custom "clickedQuestion" event.
 * @param {CustomEvent} event - The custom event.
 */
function handleCustomEvent(event: CustomEvent) {
  try {
    if (clickedElement) {
      (clickedElement as HTMLInputElement | HTMLTextAreaElement).value =
        event.detail;

      // Dispatch input and change events
      const inputEvent = new Event("input", { bubbles: true });
      const changeEvent = new Event("change", { bubbles: true });
      clickedElement.dispatchEvent(inputEvent);
      clickedElement.dispatchEvent(changeEvent);
    }
  } catch (error) {
    console.error("Error handling custom event:", error);
  }
}
