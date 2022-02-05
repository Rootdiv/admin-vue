'use strict';

const Editor = require('./editor');
const Vue = require('vue/dist/vue.js');
const axios = require('axios');
const UIkit = require('uikit');
const Icons = require('uikit/dist/js/uikit-icons');

// loads the Icon plugin
UIkit.use(Icons);

window.editor = new Editor();

window.vue = new Vue({
  el: '#app',
  data: {
    page: 'index.html',
    pageList: [],
    showLoader: true,
    backupList: [],
    meta: {
      title: '',
      keywords: '',
      description: '',
    },
    auth: false,
    password: '',
    loginError: false,
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
          this.errorNotification('Ошибка сохранения!');
        },
      );
    },
    openPage(page) {
      this.page = page;
      this.loadBackupList();
      this.showLoader = true;
      window.editor.open(page, () => {
        this.showLoader = false;
        this.meta = window.editor.metaEditor.getMeta();
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
        })
        .then(() => {
          this.openPage(this.page);
        }).catch((err) => {
          console.warn('Восстановление отменено пользователем или произошла ошибка ' + err.message);
        });
    },
    applyMeta() {
      window.editor.metaEditor.setMeta(this.meta.title, this.meta.keywords, this.meta.description);
    },
    login() {
      if (this.password.length > 10) {
        axios.post('./api/login.php', { password: this.password }).then(res => {
          if (res.data.auth === true) {
            this.auth = true;
            this.start();
          } else {
            this.loginError = true;
          }
        });
      } else {
        this.loginError = true;
      }
    },
    logout() {
      axios.get('./api/logout.php').then(() => {
        window.location.replace('/vue');
      });
    },
    start() {
      this.openPage(this.page);
      axios.get('./api/pageList.php').then(response => {
        this.pageList = response.data;
      });
      this.loadBackupList();
    },
    enableLoader() {
      this.showLoader = true;
    },
    disableLoader() {
      this.showLoader = false;
    },
    errorNotification(msg) {
      UIkit.notification({ message: msg, status: 'danger' });
    },
  },
  created() {
    axios.get('./api/checkAuth.php').then(res => {
      if (res.data.auth === true) {
        this.auth = true;
        this.start();
      }
    });
  },
});
