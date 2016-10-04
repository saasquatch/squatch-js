import { domready } from '../utils/domready';
import elementResizeDetectorMaker from 'element-resize-detector';
import debug from 'debug';

let _log = debug('squatch-js:widget');

class Widget {
  constructor(content) {
    _log('widget initializing ...');
    this.content = content;
    this.frame = document.createElement('iframe');
    this.frame.width = '100%';
    this.frame.style = 'border: 0; background-color: none;';
    this.erd = elementResizeDetectorMaker({ strategy: 'scroll'});
    // this.api = new WidgetApi(/*params*/)
  }

  load() {}
}

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

      erd.listenTo(frameDoc.body, function(element) {
        let height = element.offsetHeight;

        if (height > 0) frame.height = height;

        if (window.innerHeight > frame.height) {
          popupdiv.style.paddingTop = ((window.innerHeight - frame.height)/2) + "px";
        } else {
          popupdiv.style.paddingTop = "5px";
        }
      });

      let head = frameDoc.head;
      let scripts = head.getElementsByTagName('script');
      let widgetJs = scripts[scripts.length - 1];
      head.removeChild(widgetJs);
      let fbShare = frameDoc.getElementsByClassName('fbShare')[0];
      fbShare.href = 'https://referralsaasquatch.com';

      let fbClicked = function(e) {
        _log('widget event: Facebook share button ' + e.type);
        if (e.type == 'click') {
          e.preventDefault();

          let width = 620;
          let height = 400;
          let shareImage = frameWindow.squatch.user.facebook.shareImage;
          let fbUser = frameWindow.squatch.user.facebook.appId;
          let fbUserLink = frameWindow.squatch.user.facebook.link;
          let title = frameWindow.squatch.user.facebook.title;
          let description = frameWindow.squatch.user.facebook.summary;
          let pictureString = (shareImage == "" || shareImage === null) ? "" : "&picture="+ shareImage;
          let redirectUrl = frameWindow.squatch.user.facebook.redirectUrl;

          let url = `https://www.facebook.com/dialog/feed?app_id=${fbUser}&link=${fbUserLink}&name=${title}&description=${description}${pictureString}&redirect_uri=${redirectUrl}&display=popup`;

          let opts = `status=0,width=${width},height=${height}`;
          // window.open(url, 'fb', opts);
        }

        // track facebook button clicks here
      }
      // TODO: attachEvent IE support
      fbShare.addEventListener('click', fbClicked, false);
      fbShare.addEventListener('touchstart', fbClicked, false);
    })
  }

  close() {
    let popupdiv = this.popupdiv;
    let frameDoc = this.frame.contentWindow.document;
    let erd = this.erd;

    popupdiv.style.display = 'none';
    erd.uninstall(frameDoc.body);
  }

  _clickedOutside(e) {
    let popupdiv = this.popupdiv;

    if (e.target == this.popupdiv) {
      this.close()
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
