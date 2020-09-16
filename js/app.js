$(() => {
  let mouseIsDown = false;
  let selectedSlideIndex = 0;
  let slideCount;
  let carouselPosition = 0;
  let carouselWidth;
  let $activeCarousel;
  let $slideSelectors = $(".slide-selectors");
  const $carouselContainer = $(".carousel-container");
  const $carousel = $(".carousel");

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
    setCarouselWidth();
    setSelectedSlideIndex(selectedSlideIndex);
  });

  const setSelectedCarousel = (carouselContainer) => {
    $activeCarousel = carouselContainer.find($carousel)[0];
    $slideSelectors = carouselContainer.find($(".slide-selectors"));
  }

  const setCarouselWidth = () => {
    if (window.innerWidth > 750) {
      carouselWidth = window.innerWidth * 0.385;
    } else {
      carouselWidth = window.innerWidth * 0.74;
    }
  }

  setCarouselWidth();

  const setSlideCount = () => {
    slideCount = $activeCarousel && $activeCarousel.children.length;
  }

  const setCarouselPosition = (position) => {
    const threshold = 100;

    if (-(slideCount - 1) * carouselWidth - threshold < position && position < threshold) {
      $activeCarousel.style.transform = `translateX(${position}px)`;
    }
  };

  const setActiveStates = (slideIndex) => {
    const slideSelectors = Array.from($slideSelectors[0].children);
    slideSelectors.forEach(slideSelector => slideSelector.classList.remove('active'));
    const selectedSlideSelector = slideSelectors.find((slideSelector, i) => i === slideIndex);
    selectedSlideSelector.classList.add('active');
  }

  const setSelectedSlideIndex = (slideIndex) => {
    setSlideCount();

    if (0 <= slideIndex && slideIndex < slideCount) {
      selectedSlideIndex = slideIndex;
    }

    carouselPosition = -selectedSlideIndex * carouselWidth;
    setCarouselPosition(-selectedSlideIndex * carouselWidth);

    if (Array.from($slideSelectors[0].children)) {
      setActiveStates(selectedSlideIndex);
    }
  };

  let startingPosition;
  let endingPosition;

  const snapToSlide = (event, xPosition) => {
    $activeCarousel.style.transition = 'transform ease 1s';
    mouseIsDown = false;
    endingPosition = xPosition;
    let slideIndex;
    const difference = startingPosition - endingPosition;
    const threshold = 150;

    if (difference > threshold) {
      slideIndex = selectedSlideIndex + 1;
    } else if (difference < -threshold) {
      slideIndex = selectedSlideIndex - 1;
    } else {
      slideIndex = selectedSlideIndex;
    }
    setSelectedSlideIndex(slideIndex);
  }

  const onDragStart = (carousel, event, xPosition) => {
    const exisitingPosition = carousel.style.transform.replace(/[^\d.]/g, '');
    const selectedSlideIndex = Math.round(+exisitingPosition / carouselWidth);
    $activeCarousel = carousel;
    setSelectedSlideIndex(selectedSlideIndex);
    $activeCarousel.style.transition = 'none';
    startingPosition = xPosition;
    mouseIsDown = true;
  }

  const onDrag = (event, xPosition) => {
    if (mouseIsDown) {
      event.preventDefault();
      const dragDistance = startingPosition - xPosition;
      const dragPosition = carouselPosition - dragDistance;
      setCarouselPosition(dragPosition);
    }
  }

  const onDragEnd = (event, xPosition) => {
    if (mouseIsDown) {
      snapToSlide(event, xPosition);
    }
  }

  $slideSelectors.click(function () {
    const slideIndex = Array.from(event.target.parentNode.children).indexOf(event.target);
    setSelectedSlideIndex(slideIndex);
  });

  //DESKTOP
  $carouselContainer.mousedown(function() {
    const carouselContainer = $(this);
    setSelectedCarousel(carouselContainer);
  });

  $carousel.mousedown(function() {
    const carousel = $(this)[0];
    const xPosition = event.screenX;

    onDragStart(carousel, event, xPosition);
  });

  $carousel.mousemove(function () {
    const xPosition = event.screenX;
    onDrag(event, xPosition);
  });

  $carousel.mouseup(function () {
    const xPosition = event.screenX;
    onDragEnd(event, xPosition);
  });

  $carousel.mouseleave(function () {
    const xPosition = event.screenX;
    onDragEnd(event, xPosition);
  });

  //MOBILE
  $carouselContainer.on('touchstart', function() {
    const carouselContainer = $(this);
    setSelectedCarousel(carouselContainer);
  });

  $carousel.on('touchstart', function() {
    const carousel = $(this)[0];
    const xPosition = event.touches[0].clientX;

    onDragStart(carousel, event, xPosition);
  });

  $carousel.on('touchmove', function() {
    const xPosition = event.touches[0].clientX;
    onDrag(event, xPosition);
  });

  $carousel.on('touchend', function() {
    const xPosition = event.changedTouches[0].clientX;
    onDragEnd(event, xPosition);
  });

  $carousel.on('touchcancel', function() {
    const xPosition = event.changedTouches[0].clientX;
    onDragEnd(event, xPosition);
  });
});
