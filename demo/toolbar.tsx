import React, { Component, version } from "react";
import { render } from "react-dom";

import {
  popup,
  embed,
  embedNew,
  embedReferred,
  popupNew,
  popupReferred,
  script,
  toURL,
  users,
  href,
} from "./sandbox";
import { getVersions } from "./versions";
import { delay } from "./util";
import { widgets, worker } from "./generate";
import { rest } from "msw";
import classic from "./templates/classic";
import MintGA from "./templates/MintGA";
import VanillaGA from "./templates/VanillaGA";

console.log("me old sandbox", window["sandbox"]);

console.log("my worker", { worker });

// 2. Define request handlers and response resolvers.

const modes = ["POPUP", "EMBED"];
const widgetTypes = [
  "REFERRER_WIDGET",
  "CONVERSION_WIDGET",
  "p/tuesday-test/w/referrerWidget",
];
const staticVersions = ["HEAD", "latest", "alpha", "next"];

/**
 * Use the addUrlProps higher-order component to hook-in react-url-query.
 */
class App extends Component {
  constructor(props) {
    super(props);
    worker.start({
      findWorker: (scriptURL, _mockServiceWorkerUrl) =>
        scriptURL.includes("mockServiceWorker"),
      onUnhandledRequest(req) {
        console.error(
          "Found an unhandled %s request to %s",
          req.method,
          req.url.href
        );
      },
    });
  }
  state = {
    versions: staticVersions,
    toolbarOpen: true,
  };
  async componentWillMount() {
    const apiVersions = await getVersions();
    const versions = [...staticVersions, ...apiVersions];
    this.setState({ versions });
  }
  render() {
    return (
      <div>
        <button
          onClick={() =>
            this.setState({ toolbarOpen: !this.state.toolbarOpen })
          }
          style={{ float: "right" }}
        >
          {this.state.toolbarOpen ? `<` : `>`}
        </button>
        <div style={{ display: this.state.toolbarOpen ? "block" : "none" }}>
          <hr />
          <div>
            <ParamArea />
            <hr />
            <h2>Quick pick variables</h2>
            <details>
              <summary>Tenant / Program</summary>
              <ul>
                <li>
                  <a href={href(popup)}>Popup (classic)</a>
                </li>
                <li>
                  <a href={href(embed)}>Embed (classic)</a>
                </li>
                <li>
                  <a href={href(popupNew)}>Popup (new program)</a>
                </li>
                <li>
                  <a href={href(embedNew)}>Embed (new program)</a>
                </li>
                <li>
                  <a href={href(popupReferred)}>
                    Popup (classic referred widget)
                  </a>
                </li>
                <li>
                  <a href={href(embedReferred)}>
                    Embed (classic referred widget)
                  </a>
                </li>
              </ul>
            </details>
            <WidgetType />
            <ModeList />
            <UserList />
            <VersionList {...this.state} />
            <MockedWidgets />
          </div>
          <hr />

          <button onClick={() => recordPurchase()}>Record Purchase</button>
          <hr />

          <button onClick={() => runEventBomb()}>Event Bomb</button>
        </div>
      </div>
    );
  }
}

function ParamArea() {
  return (
    <div>
      <h2>Squatch.js Config</h2>
      <div>
        <textarea id="area1" rows={15} cols={70} style={{ maxWidth: "100%" }}>
          {JSON.stringify(window["sandbox"], null, 2)}
        </textarea>
      </div>
      <div>
        <button
          onClick={() => {
            let json: Sandbox = JSON.parse(
              // @ts-ignore
              document.getElementById("area1").value
            );
            toURL(json);
          }}
        >
          Reload Config
        </button>
        <button
          onClick={() => {
            navigator.clipboard.writeText(window.location.toString());
          }}
        >
          Share Current Config
        </button>
      </div>
    </div>
  );
}

async function recordPurchase() {
  //@ts-ignore
  const { squatch, sandbox } = window;
  const {
    jwt,
    user: { id, accountId },
  } = sandbox.initObj;
  const fields = {
    // Optional
    total: 10.0,
    revenue: 10.0,
    tax: 5.0,
    currency: "USD",
  };

  await squatch.events().track(
    {
      userId: id,
      accountId: accountId,
      events: [
        {
          key: "purchase",
          fields: fields, // Optional
          // id: "kjv12kbwktb13t3", // Optional id
          // dateTriggered: 1535136384753  // Optional date
        },
      ],
    },
    {
      jwt,
    }
  );
  // TODO: Eventually we'd like an API like this:
  // squatch.events().track("purchase", { ...fields });
}
async function runEventBomb() {
  while (true) {
    await recordPurchase();
    await delay(100);
  }
}
function WidgetType(props) {
  return (
    <details
      title={window["sandbox"].initObj.widgetType}
      key={0}
      id={`dropdown-basic-1`}
    >
      {widgetTypes.map((widgetType, i) => (
        <a
          key={i}
          href={href({
            ...window["sandbox"],
            initObj: {
              ...window["sandbox"].initObj,
              widgetType: widgetType,
            },
          })}
        >
          {widgetType}
        </a>
      ))}
    </details>
  );
}
function ModeList(props) {
  return (
    <details
      title={window["sandbox"].initObj.engagementMedium}
      key={0}
      id={`dropdown-basic-1`}
    >
      <summary>Engagement Medium</summary>
      {modes.map((mode, i) => (
        <a
          key={i}
          href={href({
            ...window["sandbox"],
            initObj: {
              ...window["sandbox"].initObj,
              engagementMedium: mode,
            },
          })}
        >
          {mode}
        </a>
      ))}
    </details>
  );
}
function UserList(props) {
  return (
    <details
      title={"User: " + window["sandbox"].initObj.user.firstName}
      key={0}
      id={`dropdown-basic-1`}
    >
      <summary>User</summary>
      {users.map((user, i) => (
        <a
          key={i}
          href={href({
            ...window["sandbox"],
            initObj: {
              ...window["sandbox"].initObj,
              user: user,
            },
          })}
        >
          {user["firstName"] || "Empty"}
        </a>
      ))}
    </details>
  );
}
function VersionList(props) {
  const { versions } = props;
  return (
    <details
      title={"Version: " + window["sandbox"].version || "Head"}
      key={0}
      id={`dropdown-basic-1`}
    >
      <summary>Version</summary>
      {versions.map((v, i) => (
        <a
          key={i}
          href={href({
            ...window["sandbox"],
            version: v,
            script:
              v.toLocaleLowerCase() == "head"
                ? script
                : `https://unpkg.com/@saasquatch/squatch-js@${v}`,
          })}
        >
          {v}
        </a>
      ))}
    </details>
  );
}

function MockedWidgets(props) {
  const { versions } = props;

  async function getMockWidget(widget) {
    console.log("fetch");
    // window["squatch"].render()
    window["mockWidget"] = widget;
    window["sandbox"].initObj = {
      ...window["sandbox"].initObj,
      engagementMedium: "EMBED",
    };

    worker.use(
      rest.put(
        "https://staging.referralsaasquatch.com/api/*",
        (req, res, ctx) => {
          return res(
            ctx.delay(500),
            ctx.status(202, "Mocked status"),
            ctx.json(widgets[window["mockWidget"]])
          );
        }
      )
    );
    document.getElementById("squatchembed").innerHTML = "";
    window["squatch"].widgets().upsertUser(window["sandbox"].initObj);
    // window.location.href = `/?widgetType=${widget}`;
  }
  return (
    <details
      title={"Version: " + window["sandbox"].version || "Head"}
      key={0}
      id={`dropdown-basic-1`}
    >
      <summary>Mocked Widgets</summary>
      <button onClick={() => getMockWidget("QuirksVanillaGA")}>
        Quirks mode - Vanilla
      </button>
      <button onClick={() => getMockWidget("QuirksMintGA")}>
        Quirks mode - Mint
      </button>
      <button onClick={() => getMockWidget("classic")}>Classic</button>
      <button onClick={() => getMockWidget("MintGA")}>GA - Mint</button>
      <button onClick={() => getMockWidget("VanillaGA")}>GA - Vanilla</button>
      <button onClick={() => getMockWidget("MintGAContainer")}>
        Mint - With Container
      </button>
      <button onClick={() => getMockWidget("VanillaGANoContainer")}>
        Vanilla - No Container
      </button>
    </details>
  );
}
const root = document.getElementById("app");

render(<App />, root);
