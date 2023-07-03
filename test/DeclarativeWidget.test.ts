// describe("Initialising a DeclarativeWidget", () => {
//   test("test", async () => {
//     const el = (await fixture(
//       html`<squatch-embed widget="widget"></squatch-embed>`
//     )) as DeclarativeEmbedWidget;

import { DeclarativeEmbedWidget } from "../src/widgets/declarative/DeclarativeWidgets";
import { fixture, html, fixtureCleanup } from "@open-wc/testing-helpers";

//     console.log(el.getAttribute("widget"));
//     console.log(el.type);

//     // const component = document.querySelector("squatch-embed");
//     // expect(component).not.toBe(null);

//     // // @ts-ignore
//     // expect(component.type).toBe("EMBED");
//   });
// });

describe("Embed", () => {
  test("test", async () => {
    try {
      const el = (await fixture(
        html`<squatch-embed></squatch-embed>`
      )) as DeclarativeEmbedWidget;

      expect(el).toBeInstanceOf(DeclarativeEmbedWidget);
    } catch (e) {
      console.error("ERROR");
    }
  });

  afterEach(() => {
    fixtureCleanup();
  });
});
