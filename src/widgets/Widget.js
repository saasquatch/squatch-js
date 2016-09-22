import { domready } from '../utils/domready';
import elementResizeDetectorMaker from 'element-resize-detector';

class Widget {
  constructor(content) {
    this.content = content;
    this.frame = document.createElement('iframe');
    this.frame.width = '100%';
    this.frame.style = 'border: 0; background-color: none;';
    this.erd = elementResizeDetectorMaker({ strategy: 'scroll' });
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
    me.popupdiv.style = 'display: none; position: fixed; z-index: 1; padding-top: 5%; left: 0; top: 0; width: 100%; height: 100%; overflow: auto; overflow-y: hidden; background-color: rgb(0,0,0); background-color: rgba(0,0,0,0.4);';
    me.popupcontent = document.createElement('div');
    me.popupcontent.style = "margin: auto; width: 80%; max-width: 500px;";

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

    domready(frameDoc, function() {
      me.frame.height = frameDoc.body.scrollHeight;

      // Adjust frame height when size of body changes
      me.erd.listenTo(frameDoc.body, function(element) {
        let height = element.offsetHeight;
        me.frame.height = height;

        if (window.innerHeight < me.frame.height) {
          me.popupdiv.style.paddingTop = "5px";
        } else {
          me.popupdiv.style.paddingTop = ((window.innerHeight - me.frame.height)/2) + "px";
        }

      });
    });
  }

  open() {
    let popupdiv = this.popupdiv;
    popupdiv.style.display = 'table';
  }

  close(e) {
    let popupdiv = this.popupdiv;

    if (e.target == popupdiv) {
      popupdiv.style.display = 'none';
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
