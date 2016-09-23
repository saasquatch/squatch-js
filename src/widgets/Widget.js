import { domready } from '../utils/domready';
import elementResizeDetectorMaker from 'element-resize-detector';

class Widget {
  constructor(content) {
    this.content = content;
    this.frame = document.createElement('iframe');
    this.frame.width = '100%';
    this.frame.style = 'border: 0; background-color: none;';
    this.erd = elementResizeDetectorMaker({ strategy: 'scroll', debug: 'true' });
    // this.api = new WidgetApi(/*params*/)
  }

  load() {}
}

// TODO: Add close button
export class PopupWidget extends Widget {
  constructor(content, triggerId = 'squatchpop') {
    super(content);
    let me = this;
    // me.frame.id = 'someId';
    me.frame.style.backgroundColor = '#fff';
    me.triggerElement = document.getElementById(triggerId);

    if (!me.triggerElement) throw new Error("elementId \'" + triggerId + "\' not found.");

    me.popupdiv = document.createElement('div');
    me.popupdiv.id = 'squatchModal';
    me.popupdiv.style = 'display: none; position: fixed; z-index: 1; padding-top: 5%; left: 0; top: -2000px; width: 100%; height: 100%; overflow: auto; background-color: rgb(0,0,0); background-color: rgba(0,0,0,0.4);';
    me.popupcontent = document.createElement('div');
    me.popupcontent.style = "margin: auto; width: 80%; max-width: 500px; position:";

    me.triggerElement.onclick = function() { me.open(); };

    // TODO: we're probably overwriting client's code ??
    document.onclick = document.onclick = function(event) { me.close(event); }
  }

  load() {
    let me = this;

    me.popupdiv.appendChild(me.popupcontent);
    document.body.appendChild(me.popupdiv);
    me.popupcontent.appendChild(me.frame);

    let frameDoc = me.frame.contentWindow.document;
    frameDoc.open();
    frameDoc.write(me.content);
    frameDoc.close();
  }

  open() {
    let popupdiv = this.popupdiv;
    let frame = this.frame;
    let frameDoc = frame.contentWindow.document;
    let erd = this.erd;

    console.log("OPEN");

    // Adjust frame height when size of body changes
    domready(frameDoc, function() {
      frameDoc.body.style.overflowY = 'hidden';
      popupdiv.style.display = 'table';
      popupdiv.style.top = "0";

      erd.listenTo(frameDoc.body, function(element) {
        let height = element.offsetHeight;

        if (height > 0) frame.height = height;

        if (window.innerHeight > frame.height) {
          popupdiv.style.paddingTop = ((window.innerHeight - frame.height)/2) + "px";
        } else {
          popupdiv.style.paddingTop = "5px";
        }
      });
    })
  }

  close(e) {
    let popupdiv = this.popupdiv;
    let frameDoc = this.frame.contentWindow.document;
    let erd = this.erd;

    if (e.target == popupdiv) {
      popupdiv.style.display = 'none';
      erd.uninstall(frameDoc.body);
    }
  }
}

export class EmbedWidget extends Widget {
  constructor(content, elementId = 'squatchembed') {
    super(content);
    // this.frame.id = 'someId';
    this.element = document.getElementById(elementId);

    if (!this.element) throw new Error("elementId \'" + elementId + "\' not found.");
  }

  load() {
    let me = this;

    me.element.appendChild(me.frame);

    let frameDoc = me.frame.contentWindow.document;
    frameDoc.open();
    frameDoc.write(me.content);
    frameDoc.close();

    domready(frameDoc, function() {
      me.frame.height = frameDoc.body.scrollHeight;

      // Adjust frame height when size of body changes
      me.erd.listenTo(frameDoc.body, function(element) {
        let height = element.offsetHeight;
        me.frame.height = height;
      });
    });
  }
}
