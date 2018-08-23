import React, { Component } from "react";
import { render } from "react-dom";
import { Button, ButtonToolbar } from "react-bootstrap";

import {popup, embed, embedNew, embedReferred, popupNew, popupReferred, toURL} from "./sandbox";

/**
 * Use the addUrlProps higher-order component to hook-in react-url-query.
 */
class App extends Component{
  render() {
    return (
      <ButtonToolbar>
        <Button bsStyle="primary" onClick={()=>toURL(popup)}>Popup (classic)</Button>
        <Button bsStyle="primary" onClick={()=>toURL(embed)}>Embed (classic)</Button>
        <Button bsStyle="primary" onClick={()=>toURL(popupNew)}>Popup (new program)</Button>
        <Button bsStyle="primary" onClick={()=>toURL(embedNew)}>Embed (new program)</Button>
        <Button bsStyle="primary" onClick={()=>toURL(popupReferred)}>Popup (classic referred widget)</Button>
        <Button bsStyle="primary" onClick={()=>toURL(embedReferred)}>Embed (classic referred widget)</Button>
      </ButtonToolbar>
    );
  }
}
const root = document.getElementById("app");
console.log("mount to", root);
render(<App />, root);
