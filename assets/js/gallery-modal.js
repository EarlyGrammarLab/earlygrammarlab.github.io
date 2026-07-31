(function () {
  const modal    = document.getElementById('imageModal');
  const modalImg = document.getElementById('modalImage');
  const caption  = document.getElementById('caption');
  const closeBtn = modal.querySelector('.close');
  const prevBtn  = modal.querySelector('.nav-prev');
  const nextBtn  = modal.querySelector('.nav-next');

  let images = [];
  let currentIndex = 0;

  function open(imageList, startIndex) {
    images = imageList;
    currentIndex = startIndex;
    
    // Check if ANY image in the group has data-modal-no-nav="true"
    const noNavRequested = images.some(img => img.dataset.modalNoNav === 'true');
    
    // Show nav only if there are multiple images AND no image requested hiding it
    const shouldShowNav = images.length > 1 && !noNavRequested;
    prevBtn.style.display = shouldShowNav ? '' : 'none';
    nextBtn.style.display = shouldShowNav ? '' : 'none';
    
    showImage(currentIndex);
    modal.style.display = 'block';
  }

  function close() {
    modal.style.display = 'none';
    modalImg.classList.remove('zoom');
  }

  function showImage(index) {
    currentIndex = index;
    modalImg.src = images[currentIndex].dataset.src
      || images[currentIndex].src;
    caption.textContent = images[currentIndex].dataset.alt
      || images[currentIndex].alt;
    modalImg.classList.remove('zoom');
    void modalImg.offsetWidth;
    modalImg.classList.add('zoom');
  }

  function next() {
    currentIndex = (currentIndex + 1) % images.length;
    showImage(currentIndex);
  }

  function prev() {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    showImage(currentIndex);
  }

  closeBtn.onclick = close;
  prevBtn.onclick  = (e) => { e.stopPropagation(); prev(); };
  nextBtn.onclick  = (e) => { e.stopPropagation(); next(); };
  modal.onclick    = (e) => { if (e.target === modal) close(); };

  document.addEventListener('keydown', (e) => {
    if (modal.style.display !== 'block') return;
    if (e.key === 'Escape')          close();
    else if (e.key === 'ArrowLeft')  prev();
    else if (e.key === 'ArrowRight') next();
  });

  // --- Wire up any container with zoomable images ---
  // Horizontal galleries get smooth wheel-scroll;
  // Other containers (e.g. experiment thumbnails) just get click-to-open.
  document.querySelectorAll('.horizontal-gallery, .experiment-thumbnail').forEach(function (containerEl) {

    const imgs = Array.from(containerEl.querySelectorAll('img.zoomable'));

    imgs.forEach(function (img, index) {
      img.addEventListener('click', function (e) {
        // If the image is inside an <a> tag, prevent the link navigation
        if (img.closest('a')) e.preventDefault();
        open(imgs, index);
      });
    });

    // Smooth wheel-to-horizontal scroll — only for horizontal galleries
    if (containerEl.classList.contains('horizontal-gallery')) {
      let targetScroll  = containerEl.scrollLeft;
      let animFrameId   = null;
      let lastSetScroll = containerEl.scrollLeft;

      containerEl.addEventListener('wheel', function (e) {
        e.preventDefault();
        targetScroll += e.deltaY;
        targetScroll = Math.max(0,
          Math.min(targetScroll, containerEl.scrollWidth - containerEl.clientWidth));
        if (animFrameId === null) {
          animFrameId = requestAnimationFrame(animate);
        }
      }, { passive: false });

      function animate() {
        if (Math.abs(containerEl.scrollLeft - lastSetScroll) > 1) {
          targetScroll = containerEl.scrollLeft;
        }
        const diff = targetScroll - containerEl.scrollLeft;
        if (Math.abs(diff) < 0.5) {
          lastSetScroll = containerEl.scrollLeft;
          animFrameId = null;
          return;
        }
        containerEl.scrollLeft += diff * 0.15;
        lastSetScroll = containerEl.scrollLeft;
        animFrameId = requestAnimationFrame(animate);
      }

      containerEl.addEventListener('scroll', function () {
        if (animFrameId === null) {
          targetScroll = containerEl.scrollLeft;
          lastSetScroll = containerEl.scrollLeft;
        }
      });
    }
  });
})();