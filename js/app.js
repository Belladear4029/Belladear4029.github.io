$(() => {

  const $home = $('.home-link');
  const $about = $('.about-link');
  const $work = $('.work-link');
  const $contact = $('.contact-link');

  const scroll = function(position) {
    window.scroll({
      top: position,
      left: 0,
      behavior: 'smooth'
    });
  };

  $home.click(() => scroll(0));
  $about.click(() => scroll(600));
  $work.click(() => scroll(950));
  $contact.click(() => scroll(2300));

});
