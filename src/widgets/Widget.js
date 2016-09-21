import { domready } from '../utils/domready';
import elementResizeDetectorMaker from 'element-resize-detector';

export class Widget {
  constructor(element, content, mode) {
    this.element = element;
    this.content = content;
    this.mode = mode;
    this.frame = document.createElement('iframe');
    this.frame.width = '100%';
    this.frame.id = 'widget';
    this.frame.style = 'border: 0; background-color: none;';
  }

  load() {
    let frame = this.frame;
    let mode = this.mode;
    let erd = elementResizeDetectorMaker({ strategy: 'scroll' });
    let popupdiv = document.createElement('div');
    let popupcontent = document.createElement('div');
    let squatchpop = document.getElementById('squatchpop');

    if (this.mode === 'EMBED') {
      this.element.appendChild(frame);
    } else if (this.mode === 'POPUP') {


      frame.style = 'border: 0; background-color: white;';

      popupdiv.setAttribute('id', 'squatchModal');
      popupdiv.style = "display: none; position: fixed; z-index: 1; padding-top: 5%; left: 0; top: 0; width: 100%; height: 100%; overflow: auto; background-color: rgb(0,0,0); background-color: rgba(0,0,0,0.4);";
      popupcontent.style = "margin: auto; width: 80%; max-width: 500px;";
      popupdiv.appendChild(popupcontent);
      document.body.appendChild(popupdiv);
      this.element = popupcontent;
      this.element.appendChild(frame);

      squatchpop.onclick = function() {
        popupdiv.style.display = 'table';
      }

      //TODO: This needs to change, possibly overwriting stuff from clients
      document.onclick = function(event) {
        if (event.target == popupdiv) {
          popupdiv.style.display = 'none';
        }
      }
    }

    frame.contentWindow.document.open();
    frame.contentWindow.document.write(this.content);
    frame.contentWindow.document.close();

    domready(frame.contentWindow.document, function() {
      frame.height = frame.contentWindow.document.body.scrollHeight;

      // Adjust frame height when size of body changes
      erd.listenTo(frame.contentWindow.document.body, function(element) {
        let height = element.offsetHeight;
        frame.height = height;
        if (mode === 'POPUP') {
          if (window.innerHeight < frame.height) {
            popupdiv.style.paddingTop = "5px";
          } else {
            popupdiv.style.paddingTop = ((window.innerHeight - frame.height)/2) + "px";
          }
        }

      });
    });
  }
}
