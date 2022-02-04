'use strict';

const Editor = require('./editor');
const Vue = require('vue/dist/vue.js');
const axios = require('axios');
const UIkit = require('uikit');
const Icons = require('uikit/dist/js/uikit-icons');

// loads the Icon plugin
UIkit.use(Icons);

window.editor = new Editor();

new Vue({
  el: '#app',
  data: {
    page: 'index.html',
    pageList: [],
    showLoader: true,
    backupList: [],
  },
  methods: {
    onBtnSave() {
      this.showLoader = true;
      window.editor.save(
        () => {
          this.loadBackupList();
          this.showLoader = false;
          UIkit.notification({ message: 'Успешно сохранено!', status: 'success' });
        },
        () => {
          this.showLoader = false;
          UIkit.notification({ message: 'Ошибка сохранения!', status: 'danger' });
        },
      );
    },
    openPage(page) {
      this.page = page;
      this.loadBackupList();
      this.showLoader = true;
      window.editor.open(page, () => {
        this.showLoader = false;
      });
    },
    loadBackupList() {
      axios.get('./backups/backups.json').then(res => {
        this.backupList = res.data.filter(backup => backup.page === this.page);
      });
    },
    restoreBackup(backup) {
      UIkit.modal
        .confirm(
          'Вы действительно хотите восстановить страницу из этой резервной копии? Все не сохранённые изменения будут утеряны!', {
            labels: {
              ok: 'Восстановить',
              cancel: 'Отмена',
            },
          },
        )
        .then(() => {
          this.showLoader = true;
          return axios.post('./api/restoreBackup.php', { page: this.page, file: backup.file });
        }).then(() => {
          this.loadPage();
        });
    },
    loadPage() {
      window.editor.open(this.page, () => {
        this.showLoader = false;
      });
    }
  },
  created() {
    this.loadPage();
    axios.get('./api/pageList.php').then(response => {
      this.pageList = response.data;
    });
    this.loadBackupList();
  },
});
