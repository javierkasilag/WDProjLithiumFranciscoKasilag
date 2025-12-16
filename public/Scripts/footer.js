document.querySelectorAll('.nav-button').forEach(btn => {
  if (btn.href === window.location.href) {
    btn.classList.add('active-page');
  }
});