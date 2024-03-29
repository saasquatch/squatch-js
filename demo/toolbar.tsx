import React, { Component, useRef, useState, version } from "react";
import { render } from "react-dom";
import squatch from "../dist/squatch";

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

// 2. Define request handlers and response resolvers.

const modes = ["POPUP", "EMBED"];
const widgetTypes = [
  "REFERRER_WIDGET",
  "CONVERSION_WIDGET",
  "p/tuesday-test/w/referrerWidget",
];
const staticVersions = ["HEAD", "latest", "alpha", "next", "local"];

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
            <CustomMockedWidget />
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
      title={"User: " + window["sandbox"].initObj.user?.firstName}
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
                : v == "local"
                ? `./squatchjs.min.js`
                : `https://unpkg.com/@saasquatch/squatch-js@${v}`,
          })}
        >
          <button>{v}</button>
        </a>
      ))}
    </details>
  );
}

async function getCustomWidget(engagementMedium) {
  window["sandbox"].initObj = {
    ...window["sandbox"].initObj,
    engagementMedium,
  };

  const value = document.getElementById("custom-widget")?.value;
  worker.use(
    rest.put(
      "https://staging.referralsaasquatch.com/api/*",
      (req, res, ctx) => {
        return res(
          ctx.delay(500),
          ctx.status(202, "Mocked status"),
          ctx.json({ jsOptions: {}, user: {}, template: value })
        );
      }
    )
  );
  document.getElementById("squatchembed").innerHTML = "";
  window["squatch"].widgets().upsertUser({
    ...window["sandbox"].initObj,
  });
}

function MockedWidgets(props) {
  const { versions } = props;
  const [engagementMedium, setEngagementMedium] = useState("EMBED");
  const [usePreload, setUsePreload] = useState(false);
  const [showWidget, setShowWidget] = useState(false);
  const [widget, setWidget] = useState(undefined);
  const container = usePreload && document.getElementById("squatchembed");
  const [popupTrigger, setPopupTrigger] = useState(".squatchpop");

  async function getMockWidget(
    widget,
    containerOverride: string | undefined = undefined
  ) {
    window["mockWidget"] = widget;
    window["sandbox"].initObj = {
      ...window["sandbox"].initObj,
      engagementMedium,
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
    const defaultElement = document.getElementById(
      "squatchembed"
    ) as HTMLElement;
    defaultElement.innerHTML = "";
    document.getElementById("test-selector").innerHTML = "";

    if (!usePreload) defaultElement.setAttribute("style", "");
    const { widget: embedWidget } = await window["squatch"]
      .widgets()
      .upsertUser({
        ...window["sandbox"].initObj,
        container: (usePreload && containerOverride) || container,
        trigger: popupTrigger,
      });

    if (showWidget) embedWidget.open();
    setWidget(embedWidget);
  }

  return (
    <details
      title={"Version: " + window["sandbox"].version || "Head"}
      key={0}
      id={`dropdown-basic-1`}
    >
      <summary>Mocked Widgets</summary>
      <h4>Engagement Medium</h4>
      <form onSubmit={(e) => e.preventDefault()}>
        <label>Embed</label>

        <input
          type="radio"
          name="embed"
          checked={engagementMedium === "EMBED"}
          onClick={() => setEngagementMedium("EMBED")}
        ></input>

        <label>Popup</label>
        <input
          type="radio"
          name="popup"
          checked={engagementMedium === "POPUP"}
          onClick={() => setEngagementMedium("POPUP")}
        ></input>
        <br />
        <h4>Preload</h4>
        <label>true</label>
        <input
          type="radio"
          name="preload"
          checked={usePreload === true}
          onClick={() => setUsePreload(true)}
        ></input>

        <label>false</label>
        <input
          type="radio"
          name="noPreload"
          checked={usePreload === false}
          onClick={() => setUsePreload(false)}
        ></input>
        <br />
        <label>squatch popup trigger</label>
        <input
          value={popupTrigger}
          onChange={(e) => setPopupTrigger(e.target.value)}
        ></input>
      </form>
      <br />
      <button
        onClick={() => {
          if (showWidget) {
            setShowWidget(false);
            widget?.close();
          } else {
            setShowWidget(true);
            widget?.open();
          }
        }}
      >
        {showWidget ? "hide widget" : "show widget"}
      </button>
      {engagementMedium === "POPUP" ? (
        <button
          id={popupTrigger.substring(1)}
          className={popupTrigger.substring(1)}
        >
          Open popup
        </button>
      ) : (
        ""
      )}
      <hr />
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
      <button onClick={() => getMockWidget("QuirksMintGAContainer")}>
        Quirks mode - Mint - With Container
      </button>
      <button onClick={() => getMockWidget("MintGAContainerDisplayBlock")}>
        Mint - With Container + Display Block
      </button>
      <button
        onClick={() => getMockWidget("QuirksMintGAContainerDisplayBlock")}
      >
        Quirks mode - Mint - With Container + Display Block
      </button>
      <button onClick={() => getMockWidget("VanillaGANoContainer")}>
        Vanilla - No Container
      </button>
      <button onClick={() => getMockWidget("MintGA", "#test-selector")}>
        Mint - Selector
      </button>
      <hr />
    </details>
  );
}

function CustomMockedWidget(props) {
  const { versions } = props;
  const [engagementMedium, setEngagementMedium] = useState("EMBED");
  return (
    <details
      title={"Version: " + window["sandbox"].version || "Head"}
      key={0}
      id={`dropdown-basic-1`}
    >
      <summary>Custom Mocked Widget</summary>
      <label>Embed</label>
      <input
        type="radio"
        name="embed"
        checked={engagementMedium === "EMBED"}
        onClick={() => setEngagementMedium("EMBED")}
      ></input>

      <label>Popup</label>
      <input
        type="radio"
        name="popup"
        checked={engagementMedium === "POPUP"}
        onClick={() => setEngagementMedium("POPUP")}
      ></input>
      <br />
      <textarea
        id="custom-widget"
        rows={15}
        cols={70}
        style={{ maxWidth: "100%" }}
      ></textarea>
      <div>
        <button onClick={() => getCustomWidget(engagementMedium)}>
          Load Widget
        </button>
      </div>
    </details>
  );
}
const root = document.getElementById("app");

render(<App />, root);
