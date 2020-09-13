$(() => {
  let mouseIsDown = false;
  let selectedSlideIndex = 0;
  let slideCount;
  let carouselPosition = 0;
  let $activeCarousel;
  const $carouselContainer = $(".carousel-container");
  const $carousel = $(".carousel");
  const $slideSelectors = $(".slide-selectors");
  const $slideSelector = $(".slide-selector");
  const slideSelectors = $slideSelectors[0] && Array.from($slideSelectors[0].children);

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
    setSelectedSlideIndex();
  });

  const setSlideCount = () => {
    slideCount = $activeCarousel && $activeCarousel.children.length;
  }

  const setCarouselPosition = (position) => {
    const threshold = 100;

    if (-(slideCount - 1) * (window.innerWidth * 0.4) - threshold < position && position < threshold) {
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

    carouselPosition = -selectedSlideIndex * (window.innerWidth * 0.4);
    setCarouselPosition(-selectedSlideIndex * (window.innerWidth * 0.4));

    if (slideSelectors) {
      setActiveStates(slideIndex);
    }
  };

  $slideSelector.click(function (event) {
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
    $activeCarousel = $(this)[0];
    setSelectedSlideIndex(+exisitingPosition / (window.innerWidth * 0.4))
    $activeCarousel.style.transition = 'none';
    startingPosition = event.screenX;
    mouseIsDown = true;
  });

  $carouselContainer.mousedown(function(event) {
    $activeCarousel = $(this).find($carousel)[0];
  })

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
