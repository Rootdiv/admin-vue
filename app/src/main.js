const Vue = require('vue/dist/vue.js');
const axios = require('axios');

//let formData = new FormData();

new Vue({
  el: '#app',
  data: {
    pageList: [],
    newPageName: '',
  },
  methods: {
    createPage() {
      //formData.append('name', this.newPageName);
      axios.post('./api/createNewPageHtml.php', { 'name': this.newPageName })
        .then(() => this.updatePageList())
        .catch((error) => {
          alert('Такая страница уже существует!');
          console.error(error.statusText);
        });
    },
    updatePageList() {
      axios.get('./api/').then(response => this.pageList = response.data);
    },
    deletePage(page) {
      axios.post('./api/deletePage.php', { 'name': page })
        .then(() => this.updatePageList())
        .catch((error) => console.error(error.statusText));
    }
  },
  created() {
    this.updatePageList()
  },
});
