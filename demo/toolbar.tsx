import React, { Component, version } from "react";
import { render } from "react-dom";
import {
  Button,
  ButtonToolbar,
  DropdownButton,
  MenuItem,
  OverlayTrigger,
  Popover
} from "react-bootstrap";

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
  href
} from "./sandbox";
import { getVersions } from "./versions";
import { delay } from "./util";

const modes = ["POPUP", "EMBED"];
const widgetTypes = [
  "REFERRER_WIDGET",
  "CONVERSION_WIDGET",
  "p/jorge3/w/referrerWidget"
];
const staticVersions = ["HEAD", "latest", "alpha"];

/**
 * Use the addUrlProps higher-order component to hook-in react-url-query.
 */
class App extends Component {
  state = {
    versions: staticVersions
  };
  async componentWillMount() {
    const apiVersions = await getVersions();
    const versions = [...staticVersions, ...apiVersions];
    this.setState({ versions });
  }
  render() {
    return (
      <div>
        <ButtonToolbar>
          <Button bsStyle="primary" href={href(popup)}>
            Popup (classic)
          </Button>
          <Button bsStyle="primary" href={href(embed)}>
            Embed (classic)
          </Button>
          <Button bsStyle="primary" href={href(popupNew)}>
            Popup (new program)
          </Button>
          <Button bsStyle="primary" href={href(embedNew)}>
            Embed (new program)
          </Button>
          <Button bsStyle="primary" href={href(popupReferred)}>
            Popup (classic referred widget)
          </Button>
          <Button bsStyle="primary" href={href(embedReferred)}>
            Embed (classic referred widget)
          </Button>
        </ButtonToolbar>
        <ButtonToolbar>
          <WidgetType />
          <ModeList />
          <UserList />
          <VersionList {...this.state} />
          <OverlayTrigger
            trigger="click"
            placement="bottom"
            overlay={popoverBottom}
          >
            <Button>Sandbox Props</Button>
          </OverlayTrigger>
        </ButtonToolbar>
        <Button bsStyle="success" onClick={() => recordPurchase()}>
          Record Purchase
        </Button>
        <Button bsStyle="danger" onClick={() => runEventBomb()}>
          Event Bomb
        </Button>
      </div>
    );
  }
}

const popoverBottom = (
  <Popover
    id="popover-positioned-bottom"
    title="Popover bottom"
    style={{ maxWidth: 600 }}
  >
    <textarea id="area1" rows={15} cols={80}>
      {JSON.stringify(window["sandbox"], null, 2)}
    </textarea>
    <Button
      onClick={() => {
        //@ts-ignore
        let json: Sandbox = JSON.parse(document.getElementById("area1").value);
        toURL(json);
      }}
    >
      Reload
    </Button>
  </Popover>
);
async function recordPurchase() {
  //@ts-ignore
  const { squatch, sandbox } = window;
  const {
    jwt,
    user: { id, accountId }
  } = sandbox.initObj;
  const fields = {
    // Optional
    total: 10.0,
    revenue: 10.0,
    tax: 5.0,
    currency: "USD"
  };

  await squatch.events().track(
    {
      userId: id,
      accountId: accountId,
      events: [
        {
          key: "purchase",
          fields: fields // Optional
          // id: "kjv12kbwktb13t3", // Optional id
          // dateTriggered: 1535136384753  // Optional date
        }
      ]
    },
    {
      jwt
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
    <DropdownButton
      title={window["sandbox"].initObj.widgetType}
      key={0}
      id={`dropdown-basic-1`}
    >
      {widgetTypes.map((widgetType, i) => (
        <MenuItem
          key={i}
          href={href({
            ...window["sandbox"],
            initObj: {
              ...window["sandbox"].initObj,
              widgetType: widgetType
            }
          })}
        >
          {widgetType}
        </MenuItem>
      ))}
    </DropdownButton>
  );
}
function ModeList(props) {
  return (
    <DropdownButton
      title={window["sandbox"].initObj.engagementMedium}
      key={0}
      id={`dropdown-basic-1`}
    >
      {modes.map((mode, i) => (
        <MenuItem
          key={i}
          href={href({
            ...window["sandbox"],
            initObj: {
              ...window["sandbox"].initObj,
              engagementMedium: mode
            }
          })}
        >
          {mode}
        </MenuItem>
      ))}
    </DropdownButton>
  );
}
function UserList(props) {
  return (
    <DropdownButton
      title={"User: " + window["sandbox"].initObj.user.firstName}
      key={0}
      id={`dropdown-basic-1`}
    >
      {users.map((user, i) => (
        <MenuItem
          key={i}
          href={href({
            ...window["sandbox"],
            initObj: {
              ...window["sandbox"].initObj,
              user: user
            }
          })}
        >
          {user["firstName"] || "Empty"}
        </MenuItem>
      ))}
    </DropdownButton>
  );
}
function VersionList(props) {
  const { versions } = props;
  return (
    <DropdownButton
      title={"Version: " + window["sandbox"].version || "Head"}
      key={0}
      id={`dropdown-basic-1`}
    >
      {versions.map((v, i) => (
        <MenuItem
          key={i}
          href={href({
            ...window["sandbox"],
            version: v,
            script:
              v.toLocaleLowerCase() == "head"
                ? script
                : `https://unpkg.com/@saasquatch/squatch-js@${v}`
          })}
        >
          {v}
        </MenuItem>
      ))}
    </DropdownButton>
  );
}
const root = document.getElementById("app");
console.log("mount to", root);
render(<App />, root);
