document.addEventListener("DOMContentLoaded", function () {
  const sidebar = document.getElementById("sidebar");
  const content = document.querySelector("main");
  const toggleBtn = document.querySelector(".navbar-toggler");
  const navLinks = document.querySelectorAll("#sidebar .nav-link");

  // Toggle sidebar collapse
  toggleBtn.addEventListener("click", function () {
    sidebar.classList.toggle("collapsed");
    document.body.classList.toggle("sidebar-collapsed");

    if (sidebar.classList.contains("collapsed")) {
      content.style.marginLeft = "60px";
    } else {
      content.style.marginLeft = "250px";
    }
  });

  // Set active nav item
  navLinks.forEach(link => {
    link.addEventListener("click", function(e) {
      // Remove active class from all links
      navLinks.forEach(l => l.classList.remove("active"));
      
      // Add active class to clicked link
      this.classList.add("active");

      // If on mobile, close the sidebar after clicking a link
      if (window.innerWidth < 768) {
        const bsOffcanvas = bootstrap.Offcanvas.getInstance(sidebar);
        if (bsOffcanvas) {
          bsOffcanvas.hide();
        }
      }
    });
  });

  // Set initial active state based on current URL
  const currentPath = window.location.pathname;
  navLinks.forEach(link => {
    if (link.getAttribute("href") === currentPath) {
      link.classList.add("active");
    }
  });
});
