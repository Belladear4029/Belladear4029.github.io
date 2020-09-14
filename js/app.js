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
  const slideSelectors = $slideSelectors && Array.from($slideSelectors[0].children);

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

  const setCarouselWidth = () => {
    if (window.innerWidth > 750) {
      carouselWidth = window.innerWidth * 0.385;
    } else {
      carouselWidth = window.innerWidth * 0.8;
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
    slideSelectors.forEach(slideSelector => slideSelector.classList.remove('active'))
    const selectedSlideSelector = slideSelectors.find((slideSelector, i) => i === slideIndex)
    selectedSlideSelector.classList.add('active');
  }

  const setSelectedSlideIndex = (slideIndex) => {
    setSlideCount();

    if (0 <= slideIndex && slideIndex < slideCount) {
      selectedSlideIndex = slideIndex;
    }

    carouselPosition = -selectedSlideIndex * carouselWidth;
    setCarouselPosition(-selectedSlideIndex * carouselWidth);

    if (slideSelectors) {
      setActiveStates(slideIndex);
    }
  };

  $slideSelectors.click(function (event) {
    const slideIndex = Array.from(event.target.parentNode.children).indexOf(event.target);
    setSelectedSlideIndex(slideIndex);
  });

  let startingPosition;
  let endingPosition;

  const snapToSlide = (event) => {
    $activeCarousel.style.transition = 'transform ease 1s';
    mouseIsDown = false;
    endingPosition = event.screenX;
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
    setSelectedSlideIndex(slideIndex)
  }

  $carousel.mousedown(function(event) {
    const exisitingPosition = $(this)[0].style.transform.replace(/[^\d.]/g, '');
    const selectedSlideIndex = Math.round(+exisitingPosition / carouselWidth);
    $activeCarousel = $(this)[0];
    setSelectedSlideIndex(selectedSlideIndex)
    $activeCarousel.style.transition = 'none';
    startingPosition = event.screenX;
    mouseIsDown = true;
  });

  $carouselContainer.mousedown(function(event) {
    $activeCarousel = $(this).find($carousel)[0];
    $slideSelectors = $(this).find($(".slide-selectors"));
  });

  $carousel.mousemove(function (event) {
    if (mouseIsDown) {
      event.preventDefault()
      const dragDistance = startingPosition - event.screenX;
      const dragPosition = carouselPosition - dragDistance;
      setCarouselPosition(dragPosition);
    }
  });

  $carousel.mouseleave(function (event) {
    if (mouseIsDown) {
      snapToSlide(event)
    }
  });

  $carousel.mouseup(function (event) {
    snapToSlide(event)
  });
});
