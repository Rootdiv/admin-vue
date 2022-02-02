'use strict';

require('./iframe-load');

module.exports = class Editor {
  constructor() {
    this.iframe = document.querySelector('iframe');
  }

  open(page) {
    this.iframe.load('../' + page, () => {
      const body = this.iframe.contentDocument.body;
      const textNodes = [];
      const recurse = element => {
        element.childNodes.forEach(node => {
          if (node.nodeName === '#text' && node.nodeValue.replace(/\s+/g, '').length > 0) {
            textNodes.push(node);
          } else {
            recurse(node);
          }
        });
      };
      recurse(body);

      textNodes.forEach(node => {
        const wrapper = this.iframe.contentDocument.createElement('text-editor');
        node.parentNode.replaceChild(wrapper, node);
        wrapper.appendChild(node);
        wrapper.contentEditable = 'true';
      });
    });
  }
};
