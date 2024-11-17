document.addEventListener("DOMContentLoaded", function () {
  var offcanvasElements = [].slice.call(
    document.querySelectorAll(".offcanvas")
  );
  offcanvasElements.map(function (offcanvasEl) {
    return new bootstrap.Offcanvas(offcanvasEl);
  });

  document
    .querySelectorAll("#logout-btn, #logout-btn-mobile")
    .forEach(function (btn) {
      btn.addEventListener("click", function (e) {
        e.preventDefault();
        localStorage.removeItem("token");
        window.location.href = "/";
      });
    });
});
