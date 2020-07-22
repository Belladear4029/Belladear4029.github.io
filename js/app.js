$(() => {
  let mouseIsDown = false;
  let selectedSlide = 0;
  let carouselPosition = 0;
  const $carousel = $(".carousel");
  const $slideSelector = $(".slide-selector");
  const slideNumber = $carousel[0].children.length;

  $(document).on("click", 'a[href^="#"]', function (event) {
    event.preventDefault();

    $("html, body").animate(
      {
        scrollTop: $($.attr(this, "href")).offset().top - 100,
      },
      700
    );
  });

  window.addEventListener('resize', function (event) {
    setSelectedSlide();
  });

  const setCarouselPosition = (position) => {
    const threshold = 100;

    if (-(slideNumber - 1) * window.innerWidth - threshold < position && position < threshold) {
      $carousel[0].style.transform = `translateX(${position}px)`;
    }
  };

  const setSelectedSlide = (slideIndex) => {
    if (0 <= slideIndex && slideIndex < $carousel[0].children.length) {
      selectedSlide = slideIndex;
    }
    carouselPosition = -selectedSlide * window.innerWidth;
    setCarouselPosition(-selectedSlide * window.innerWidth);
  };

  $slideSelector.on("click", function (event) {
    const slideIndex = Array.from(event.target.parentNode.children).indexOf(event.target);
    setSelectedSlide(slideIndex);
  });

  const snapToSlide = (event) => {
    $carousel[0].style.transition = 'transform ease 1s';
    mouseIsDown = false;
    endingPosition = event.screenX;
    let selectedSlideIndex;
    const difference = startingPosition - endingPosition;
    const threshold = 150;

    if (difference > threshold) {
      selectedSlideIndex = selectedSlide + 1;
    } else if (difference < -threshold) {
      selectedSlideIndex = selectedSlide - 1;
    } else {
      selectedSlideIndex = selectedSlide;
    }

    setSelectedSlide(selectedSlideIndex)
  }

  let startingPosition;
  let endingPosition;

  $carousel.on("mousedown", (event) => {
    $carousel[0].style.transition = '';
    mouseIsDown = true;
    startingPosition = event.screenX;
  });

  $carousel.on("mousemove", (event) => {
    if (mouseIsDown) {
      event.preventDefault()
      const dragDistance = startingPosition - event.screenX;
      const dragPosition = carouselPosition - dragDistance;
      setCarouselPosition(dragPosition);
    }
  });

  $carousel.on("mouseleave", (event) => {
    if (mouseIsDown) {
      snapToSlide(event)
    }
  });

  $carousel.on("mouseup", (event) => {
    snapToSlide(event)
  });
});
