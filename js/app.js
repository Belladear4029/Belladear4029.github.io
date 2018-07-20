$(() => {

  const $window = $(window);
  const $main = $('.main');
  const $h1 = $('h1');

  $window.on('load', function() {
    window.setTimeout(function() {
      $main.removeClass('is-preload');
      $h1.removeClass('is-preload');
    }, 500);
  });


});
