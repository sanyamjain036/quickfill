import { switchStorage } from "@chrome-extension-boilerplate/shared";

let clickedElement: Element | null = null;

const elements = document.querySelectorAll("input, textarea");

elements.forEach((element) => {
  const updatePopupPosition = () => {
    const rect = element.getBoundingClientRect();
    const popupContainer = document.querySelector(
      "#chrome-extension-boilerplate-react-vite-content-view-root"
    )!;
    const popupShadowRoot =
      popupContainer.shadowRoot!.querySelector("#shadow-root");
    const popup = popupShadowRoot!.querySelector<HTMLElement>("#poppy-popup")!;
    popup.style.top = `${rect.bottom + window.scrollY + 20}px`;
    popup.style.left = `${rect.left + window.scrollX}px`;
  };

  element.addEventListener("focus", async function () {
    const res = await switchStorage.get();
    if (res === "off") return;
    updatePopupPosition();
    const popupContainer = document.querySelector(
      "#chrome-extension-boilerplate-react-vite-content-view-root"
    )!;
    const popupShadowRoot =
      popupContainer.shadowRoot!.querySelector("#shadow-root");
    const popup = popupShadowRoot!.querySelector<HTMLElement>("#poppy-popup")!;
    popup.style.display = "block";
    clickedElement = element;
    window.addEventListener("scroll", updatePopupPosition);
  });

  document.addEventListener("click", async function (event) {
    const popupContainer = document.querySelector(
      "#chrome-extension-boilerplate-react-vite-content-view-root"
    )!;
    const popupShadowRoot =
      popupContainer.shadowRoot!.querySelector("#shadow-root");
    const popup = popupShadowRoot!.querySelector<HTMLElement>("#poppy-popup")!;

    if (
      clickedElement &&
      !clickedElement.contains(event.target as Node) &&
      !popup.contains(event.target as Node)
    ) {
      popup.style.display = "none";
      window.removeEventListener("scroll", updatePopupPosition);
      clickedElement = null;
    }
  });
});

window.addEventListener("clickedQuestion", function (evt: any) {
  if (clickedElement) {
    (clickedElement as HTMLInputElement | HTMLTextAreaElement).value =
      evt.detail;

    // Dispatch input and change events
    const inputEvent = new Event("input", { bubbles: true });
    const changeEvent = new Event("change", { bubbles: true });
    clickedElement.dispatchEvent(inputEvent);
    clickedElement.dispatchEvent(changeEvent);
  }
});
