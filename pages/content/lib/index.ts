import { switchStorage } from "@chrome-extension-boilerplate/shared";

let clickedElement: Element | null = null;

// Select all input and textarea elements excluding specific types
const elements = document.querySelectorAll(
  "input:not([type='search']):not([type='range']):not([type='datetime-local']):not([type='month']):not([type='time']):not([type='week']):not([type='date']):not([type='color']):not([type='reset']):not([type='radio']):not([type='image']):not([type='button']):not([type='checkbox']):not([type='file']):not([type='hidden']), textarea"
);

// EVENT LISTENERS

// Add event listeners to the input and textarea elements
elements.forEach((element) => {
  element.addEventListener("focus", () => handleFocus(element));
});

// Add event listener to the document to handle clicks outside the popup
document.addEventListener("click", handleClick);

// Add event listener for custom "clickedQuestion" event
window.addEventListener("clickedQuestion", (e: Event) => {
  handleCustomEvent(e as CustomEvent);
});

// CALLBACK FUNCTIONS

// Function to handle element focus
async function handleFocus(element: Element) {
  const res = await switchStorage.get();
  if (res === "off") return;
  updatePopupPosition(element);
  const popupContainer = document.querySelector("#poppy-popup-container")!;
  const popupShadowRoot =
    popupContainer.shadowRoot!.querySelector("#shadow-root");
  const popup = popupShadowRoot!.querySelector<HTMLElement>("#poppy-popup")!;
  popup.style.display = "block";

  clickedElement = element;
  window.addEventListener("scroll", () => updatePopupPosition(element));
}

// Function to update the position of the popup
function updatePopupPosition(element: Element) {
  const rect = element.getBoundingClientRect();
  const popupContainer = document.querySelector("#poppy-popup-container")!;
  const popupShadowRoot =
    popupContainer.shadowRoot!.querySelector("#shadow-root");
  const popup = popupShadowRoot!.querySelector<HTMLElement>("#poppy-popup")!;

  popup.style.top = `${rect.bottom + window.scrollY + 10}px`;
  popup.style.left = `${rect.left + window.scrollX}px`;
}

// Function to handle document click
function handleClick(event: MouseEvent) {
  const popupContainer = document.querySelector("#poppy-popup-container")!;
  const popupShadowRoot =
    popupContainer.shadowRoot!.querySelector("#shadow-root");
  const popup = popupShadowRoot!.querySelector<HTMLElement>("#poppy-popup")!;

  if (
    clickedElement &&
    !clickedElement.contains(event.target as Node) &&
    !popup.contains(event.target as Node)
  ) {
    popup.style.display = "none";
    window.removeEventListener("scroll", () =>
      updatePopupPosition(clickedElement!)
    );
    clickedElement = null;
  }
}

// Function to handle custom "clickedQuestion" event
function handleCustomEvent(evt: CustomEvent) {
  if (clickedElement) {
    (clickedElement as HTMLInputElement | HTMLTextAreaElement).value =
      evt.detail;

    // Dispatch input and change events
    const inputEvent = new Event("input", { bubbles: true });
    const changeEvent = new Event("change", { bubbles: true });
    clickedElement.dispatchEvent(inputEvent);
    clickedElement.dispatchEvent(changeEvent);
  }
}
