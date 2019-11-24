function openMenu() {
  let mobileMenu = document.getElementById("mobile-menu");
  // let mobileMenuList = document.getElementById("mobile-menu-list");
  // mobileMenu.style.width = "100%";
  if (mobileMenu.style.display === "flex") {
    mobileMenu.style.display = "none";
  } else {
    mobileMenu.style.display = "flex";
  }
}
function closeMenu() {
  let mobileMenu = document.getElementById("mobile-menu");
  mobileMenu.style.width = "0";
}