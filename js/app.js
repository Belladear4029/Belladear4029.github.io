$(() => {
  let mouseIsDown = false;
  let selectedSlideIndex = 0;
  let carouselPosition = 0;
  const $carousel = $(".carousel");
  const $slideSelectors = $(".slide-selectors");
  const $slideSelector = $(".slide-selector");
  const slideSelectors = Array.from($slideSelectors[0].children);
  const slideCount = $carousel[0].children.length;

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

  const setCarouselPosition = (position) => {
    const threshold = 100;

    if (-(slideCount - 1) * window.innerWidth - threshold < position && position < threshold) {
      $carousel[0].style.transform = `translateX(${position}px)`;
    }
  };

  const setActiveStates = (slideIndex) => {
    slideSelectors.forEach(slideSelector => slideSelector.classList.remove('active'))
    const selectedSlideSelector = slideSelectors.find((slideSelector, i) => i === slideIndex)
    selectedSlideSelector.classList.add('active');
  }

  const setSelectedSlideIndex = (slideIndex) => {
    if (0 <= slideIndex && slideIndex < slideCount) {
      selectedSlideIndex = slideIndex;
    }

    carouselPosition = -selectedSlideIndex * window.innerWidth;
    setCarouselPosition(-selectedSlideIndex * window.innerWidth);
    setActiveStates(slideIndex);
  };

  $slideSelector.on("click", function (event) {
    const slideIndex = Array.from(event.target.parentNode.children).indexOf(event.target);
    setSelectedSlideIndex(slideIndex);
  });

  const snapToSlide = (event) => {
    $carousel[0].style.transition = 'transform ease 1s';
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

  let startingPosition;
  let endingPosition;

  $carousel.on("mousedown", (event) => {
    $carousel[0].style.transition = 'none';
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
