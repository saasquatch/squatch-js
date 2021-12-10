import { fromURL, popup } from "./sandbox";
import { rest, setupWorker } from "msw";
import classic from "./templates/classic";
import MintGA from "./templates/MintGA";
import VanillaGA from "./templates/VanillaGA";
import { getQueryStringParams } from "./util";
import QuirksVanillaGA from "./templates/QuirksVanillaGA";
import QuirksMintGA from "./templates/QuirksMintGA";
import MintGAContainer from "./templates/MintGAContainer";
import VanillaGANoContainer from "./templates/VanillaGANoContainer";

// const params = getQueryStringParams(window.location.search);
export const widgets = {
  classic,
  MintGA,
  VanillaGA,
  QuirksVanillaGA,
  QuirksMintGA,
  MintGAContainer,
  VanillaGANoContainer
};
// console.log(params, window.location.search)
export const handlers = window["mockWidget"] && [
  rest.put("https://staging.referralsaasquatch.com/api/*", (req, res, ctx) => {
    return res(
      // ctx.delay(500),
      ctx.status(202, "Mocked status"),
      ctx.json(widgets[window["mockWidget"]])
    );
  }),
];
// Setup requests interception using the given handlers.

export const worker = setupWorker(...handlers);
// worker.start();

window["sandbox"] = fromURL();
