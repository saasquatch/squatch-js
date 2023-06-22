import Widget from "../widget/Widget";

export const createFrame = (container: string | HTMLElement, instance: Widget) => {
  if (!container) throw new Error("Nah");

  let element;
  if (typeof container === "string") {
    element = document.querySelector(container) as HTMLElement;
  } else if (container instanceof HTMLElement) {
    element = container;
  }

  const frame = document.createElement("iframe")
  frame['squatchJsApi'] = 
};
