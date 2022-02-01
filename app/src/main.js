const $ = require('jquery');

const getPagesList = () => {
  $('h1').remove();
  $.get('./api', data => {
    data.forEach(file => {
      $('body').append('<h1>' + file + '</h1>')
    });
  }, 'JSON');
};

getPagesList();

$('button[name="create"]').on('click', () => {
  $.post('./api/createNewPageHtml.php', {
    'name': $('input').val(),
  }, () => {
    getPagesList();
  }).fail(() => {
    alert('Такая страница уже существует!')
  });
});

$('button[name="delete"]').on('click', () => {
  $.post('./api/deletePageHtml.php', {
    'name': $('input').val(),
  }, () => {
    getPagesList();
  }).fail(() => {
    alert('Страница не существует!')
  });
});
