'use strict';

const axios = require('axios');
const DOMHelper = require('./dom-helper');
const EditorText = require('./editor-text');
const EditorImage = require('./editor-image');
const EditorMeta = require('./editor-meta');
require('./iframe-load');

module.exports = class Editor {
  constructor() {
    this.iframe = document.querySelector('iframe');
  }

  open(page, cb) {
    this.currentPage = page;
    axios.get('../' + page)
      .then(res => DOMHelper.pageStrToDom(res.data))
      .then(res => DOMHelper.wrapTextNodes(res))
      .then(res => DOMHelper.wrapImages(res))
      .then(dom => {
        this.virtualDom = dom;
        return dom;
      })
      .then(dom => DOMHelper.serializeDomToStr(dom))
      .then(html => axios.post('./api/saveTempPage.php', { html: html }))
      .then(() => this.iframe.load('../fgfdhtetrerd45315_vbnbvnc.html'))
      .then(() => axios.post('./api/deleteTempPage.php'))
      .then(() => this.enableEditing())
      .then(() => this.injectStyles())
      .then(cb);
  }

  enableEditing() {
    this.iframe.contentDocument.body.querySelectorAll('text-editor').forEach(element => {
      const id = element.getAttribute('nodeid');
      const virtualElement = this.virtualDom.body.querySelector(`[nodeid="${id}"]`);
      new EditorText(element, virtualElement);
    });
    this.iframe.contentDocument.body.querySelectorAll('[editableimgid]').forEach(element => {
      const id = element.getAttribute('editableimgid');
      const virtualElement = this.virtualDom.body.querySelector(`[editableimgid="${id}"]`);
      if (element.width > 2 || element.height > 2) {
        new EditorImage(element, virtualElement);
      }
    });
    this.metaEditor = new EditorMeta(this.virtualDom);
  }

  injectStyles() {
    const style = this.iframe.contentDocument.createElement('style');
    style.innerHTML = `
      text-editor:hover, [editableimgid]:hover {
        outline: 3px dashed #ffd700;
        outline-offset: 8px;
      }
      text-editor:focus {
        outline: 3px dashed #00ffff;
        outline-offset: 8px;
      }
    `;
    this.iframe.contentDocument.head.append(style);
  }

  save(onSuccess, onError) {
    const newDom = this.virtualDom.cloneNode(this.virtualDom);
    DOMHelper.unwrapTextNodes(newDom);
    DOMHelper.unwrapImages(newDom);
    const html = DOMHelper.serializeDomToStr(newDom);
    axios.post('./api/savePage.php', { pageName: this.currentPage, html }).then(onSuccess).catch(onError);
  }
};
