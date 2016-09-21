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
    this.frame.style = 'border: 0;';
  }

  load() {
    let frame = this.frame;
    let erd = elementResizeDetectorMaker({ strategy: "scroll" });

    this.element.appendChild(frame);
    frame.contentWindow.document.open();
    frame.contentWindow.document.write(this.content);
    frame.contentWindow.document.close();

    domready(frame.contentWindow.document, function() {
      frame.height = frame.contentWindow.document.body.scrollHeight + 'px';

      // Adjust frame height when size of body changes
      erd.listenTo(frame.contentWindow.document.body, function(element) {
        let height = element.offsetHeight;
        frame.height = height;
      });
    });
  }
}
