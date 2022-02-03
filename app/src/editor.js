'use strict';

const axios = require('axios');
const DOMHelper = require('./dom-helper');
const EditorText = require('./editor-text');
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
      .then(dom => {
        this.virtualDom = dom;
        return dom;
      })
      .then(dom => DOMHelper.serializeDomToStr(dom))
      .then(html => axios.post('./api/saveTempPage.php', { html: html }))
      .then(() => this.iframe.load('../temp.html'))
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
  }

  injectStyles() {
    const style = this.iframe.contentDocument.createElement('style');
    style.innerHTML = `
      text-editor:hover {
        outline: 3px dashed gold;
        outline-offset: 8px;
      }
      text-editor:focus {
        outline: 3px dashed aqua;
        outline-offset: 8px;
      }
    `;
    this.iframe.contentDocument.head.append(style);
  }

  save(onSuccess, onError) {
    const newDom = this.virtualDom.cloneNode(this.virtualDom);
    DOMHelper.unwrapTextNodes(newDom);
    const html = DOMHelper.serializeDomToStr(newDom);
    axios.post('./api/savePage.php', { pageName: this.currentPage, html }).then(onSuccess).catch(onError);
  }
};
