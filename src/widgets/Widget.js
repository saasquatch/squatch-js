import { domready } from '../utils/domready';
import elementResizeDetectorMaker from 'element-resize-detector';
import debug from 'debug';

let _log = debug('squatch-js:widget');

/**
 *
 * The Widget class is the base class for the different widget types available
 *
 * Creating widget type:
 *    class CustomWidget extends Widget {
 *      constructor(content,eventBus,stuff) {
 *        super(content,eventBus);
 *        // do stuff
 *      }
 *
 *      load() {
 *        // custom loading of widget
 *       }
 *    }
 *
 */
class Widget {
  /**
   * Initialize a new {@link Widget} instance.
   *
   * Creates an <iframe></iframe> in which the html content of the widget gets
   * embedded.
   * Uses element-resize-detector (https://github.com/wnr/element-resize-detector)
   * for listening to the height of the widget content and make the iframe responsive.
   * The EventBus listens for events that get triggered in the widget.
   *
   * @param {string} content The html of the widget
   * @param {EventBus} eventBus (https://github.com/krasimir/EventBus.git)
   *
   */
  constructor(content, eventBus) {
    _log('widget initializing ...');
    this.eventBus = eventBus;
    this.content = content;
    this.frame = document.createElement('iframe');
    this.frame.width = '100%';
    this.frame.style = 'border: 0; background-color: none;';
    this.erd = elementResizeDetectorMaker({ strategy: 'scroll'/*, debug: 'true'*/});
    // this.api = new AnalyticsApi(/*params*/)

    this.eventBus.addEventListener('fb_btn_clicked', function() { _log("fb btn clicked"); });
    this.eventBus.addEventListener('tw_btn_clicked', function() { _log("tw btn clicked"); });
    this.eventBus.addEventListener('email_btn_clicked', function() { _log("email btn clicked") });
  }
}

export class PopupWidget extends Widget {
  constructor(content, eventBus, triggerId = 'squatchpop') {
    super(content, eventBus);
    let me = this;
    // me.frame.id = 'someId';
    me.frame.style.backgroundColor = '#fff';
    me.triggerElement = document.getElementById(triggerId);

    if (!me.triggerElement) throw new Error("elementId \'" + triggerId + "\' not found.");

    me.popupdiv = document.createElement('div');
    me.popupdiv.id = 'squatchModal';
    me.popupdiv.style = 'display: none; position: fixed; z-index: 1; padding-top: 5%; left: 0; top: -2000px; width: 100%; height: 100%; overflow: auto; background-color: rgb(0,0,0); background-color: rgba(0,0,0,0.4);';

    me.closebtn = document.createElement('span');
    me.closebtn.style = 'position: absolute; right: 5px; top: 5px; font-size: 11px; font-family: "Helvetica Neue",Helvetica,Arial,sans-serif; color: #4486E1; cursor: pointer;';
    me.closebtn.innerHTML = 'Close';

    me.popupcontent = document.createElement('div');
    me.popupcontent.style = "margin: auto; width: 80%; max-width: 500px; position: relative;";
    me.popupcontent.appendChild(me.closebtn);

    me.triggerElement.onclick = function() { me.open(); };
    me.popupdiv.onclick = function(event) { me._clickedOutside(event); };
    me.closebtn.onclick = function() { me.close(); };
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
    _log('Popup template loaded into iframe');
  }

  open() {
    let popupdiv = this.popupdiv;
    let frame = this.frame;
    let frameWindow = frame.contentWindow;
    let frameDoc = frameWindow.document;
    let erd = this.erd;

    // Adjust frame height when size of body changes
    domready(frameDoc, function() {
      frameDoc.body.style.overflowY = 'hidden';
      popupdiv.style.display = 'table';
      popupdiv.style.top = '0';

      erd.listenTo(frameDoc.getElementsByClassName('squatch-container'), function(element) {
        let height = element.offsetHeight;

        if (height > 0) frame.height = height;

        if (window.innerHeight > frame.height) {
          popupdiv.style.paddingTop = ((window.innerHeight - frame.height)/2) + "px";
        } else {
          popupdiv.style.paddingTop = "5px";
        }
      });

      _log('Popup opened');
    })
  }

  close() {
    let popupdiv = this.popupdiv;
    let frameDoc = this.frame.contentWindow.document;
    let erd = this.erd;

    popupdiv.style.display = 'none';
    erd.uninstall(frameDoc.body);

    _log('Popup closed');
  }

  _clickedOutside(e) {
    let popupdiv = this.popupdiv;

    if (e.target == this.popupdiv) {
      this.close()
    }
  }
}

export class EmbedWidget extends Widget {
  constructor(content, eventBus, elementId = 'squatchembed') {
    super(content, eventBus);
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
      me.erd.listenTo(frameDoc.getElementsByClassName('squatch-container'), function(element) {
        let height = element.offsetHeight;
        me.frame.height = height;
      });
    });
  }
}
