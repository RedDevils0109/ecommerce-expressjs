let sideBar = document.querySelector(".sidebar")
window.addEventListener("resize", displayHideSideBar)


function displayHideSideBar() {
    let w = window.innerWidth;
    if (w >= 992) {
        sideBar.classList.add("noDisplay");
    }
    else {
        sideBar.classList.remove("noDisplay");
    }
}
