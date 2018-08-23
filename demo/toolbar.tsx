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
  toURL
} from "./sandbox";
import { getVersions } from "./versions";

const modes = ["POPUP", "EMBED"];
const widgetTypes = [
  "REFERRER_WIDGET",
  "CONVERSION_WIDGET",
  "p/jorge3/w/referrerWidget"
];
const staticVersions = ["HEAD","latest","alpha"];

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
          <Button bsStyle="primary" onClick={() => toURL(popup)}>
            Popup (classic)
          </Button>
          <Button bsStyle="primary" onClick={() => toURL(embed)}>
            Embed (classic)
          </Button>
          <Button bsStyle="primary" onClick={() => toURL(popupNew)}>
            Popup (new program)
          </Button>
          <Button bsStyle="primary" onClick={() => toURL(embedNew)}>
            Embed (new program)
          </Button>
          <Button bsStyle="primary" onClick={() => toURL(popupReferred)}>
            Popup (classic referred widget)
          </Button>
          <Button bsStyle="primary" onClick={() => toURL(embedReferred)}>
            Embed (classic referred widget)
          </Button>
        </ButtonToolbar>
        <ButtonToolbar>
          <WidgetType />
          <ModeList />
          {this.state.versions && <VersionList {...this.state} />}
          <OverlayTrigger
            trigger="click"
            placement="bottom"
            overlay={popoverBottom}
          >
            <Button>Sandbox Props</Button>
          </OverlayTrigger>
        </ButtonToolbar>
      </div>
    );
  }
}

const popoverBottom = (
  <Popover id="popover-positioned-bottom" title="Popover bottom">
    <pre>{JSON.stringify(window["sandbox"], null, 2)}</pre>
  </Popover>
);
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
          eventKey={i}
          onClick={() =>
            toURL({
              ...window["sandbox"],
              initObj: {
                ...window["sandbox"].initObj,
                widgetType: widgetType
              }
            })
          }
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
          eventKey={i}
          onClick={() =>
            toURL({
              ...window["sandbox"],
              initObj: {
                ...window["sandbox"].initObj,
                engagementMedium: mode
              }
            })
          }
        >
          {mode}
        </MenuItem>
      ))}
    </DropdownButton>
  );
}
function VersionList(props) {
  const { versions } = props;
  return (
    <DropdownButton
      title={window["sandbox"].version || "Head"}
      key={0}
      id={`dropdown-basic-1`}
    >
      {versions.map((v, i) => (
        <MenuItem
          key={i}
          eventKey={i}
          onClick={() =>{
            if(v.toLocaleLowerCase() =="head"){
              toURL({
                ...window["sandbox"],
                version: v,
                script: script
              })
            }else{
              toURL({
                ...window["sandbox"],
                version: v,
                script: `https://unpkg.com/@saasquatch/squatch-js@${v}`
              })
            }
          }
          }
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
