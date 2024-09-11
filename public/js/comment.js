//DOM get element
let btn = document.querySelectorAll(".dateButton");
let replyBtn = document.querySelectorAll(".reply");

//add event listener to filter date button
for (let i = 0; i < btn.length; i++) {
    btn[i].addEventListener("click", changeYellow)
}
for (let i = 0; i < btn.length; i++) {
    btn[i].addEventListener("blur", removeYellow)
}

//add event listener to reply button
for (let i = 0; i < replyBtn.length; i++) {
    replyBtn[i].addEventListener("click", openCloseForm)
}

//function to alter filter date button color
function changeYellow(event) {
    event.target.classList.toggle("makeYellow")
}

function removeYellow(event) {
    event.target.classList.remove("makeYellow")
}

//function to open or close form when press reply button
function openCloseForm(event) {
    event.target.parentElement.nextElementSibling.classList.toggle("noDisplay");
}