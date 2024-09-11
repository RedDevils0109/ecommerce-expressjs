let inputTitle = document.querySelector(".inputTitle")
let nextBtnDiv = document.querySelector(".button")
let nextBtn = document.querySelector(".nextBtn")

let contentArea = document.querySelector(".content")
let inputImage = document.querySelector(".inputImage")
let inputImageBtn = document.querySelector(".inputImageBtn")
let inputContent = document.querySelector(".inputContent")
let submitBtnDiv = document.querySelector(".submitBtnDiv")
let submitBtn = document.querySelector(".submitBtn")

const errorContent = document.querySelector(".errorContent");
const errorTitle = document.querySelector(".errorTitle");

errorContent.innerHTML = ""
errorTitle.innerHTML = ""

inputTitle.addEventListener("keyup", makeBtnVisible)

nextBtn.addEventListener("click", removeBlur)

inputContent.addEventListener("keyup", makeSubmitBtnVisible)

let isValidate = false

document.getElementById('triggerButton').addEventListener('click', function () {
    if (isValidate) {
        document.getElementById('createPostForm').submit()
    }
})

inputContent.onchange = () => {
    isValidate = validateForm()
}

inputTitle.onchange = () => {
    isValidate = validateForm()
}


function validateForm() {

    let isValid = true;
    errorContent.innerHTML = ""
    errorTitle.innerHTML = ""

    // Check title
    console.log(inputTitle.value)
    if (inputTitle.value === '') {
        isValid = false
        inputTitle.classList.add('is-invalid')
        errorTitle.innerHTML = "Title is required"
    } else {
        inputTitle.classList.remove('is-invalid')
        errorTitle.innerHTML = ""
    }

    // Check content
    if (inputContent.value.trim() === '') {
        isValid = false
        inputContent.classList.add('is-invalid')
        errorContent.innerHTML = "Content is required"
    } else {
        inputContent.classList.remove('is-invalid')
        errorContent.innerHTML = ""
    }

    return isValid
}
const image_input = document.querySelector("#img");
var uploaded_image = "";

image_input.addEventListener("change", function () {

    const reader = new FileReader();


    reader.addEventListener("load", () => {
        uploaded_image = reader.result;
        console.log(uploaded_image);
        document.querySelector("#display_image").style = 'block'
        document.querySelector("#display_image").style.backgroundImage = `url("${uploaded_image}")`;
    });

    reader.readAsDataURL(this.files[0]);
})

const clearImg = document.querySelector('#clear_image')
clearImg.addEventListener('click', () => {


    document.querySelector("#display_image").style.display = 'none'
    document.querySelector("#display_image").style.backgroundImage = ``;
    document.querySelector("#img").value = ''; // Clear the file input value


})

function makeBtnVisible() {
    let titleValue = inputTitle.value
    titleValue = titleValue.trim()
    if (titleValue !== "") {
        nextBtnDiv.classList.remove("hide")
    }
    else {
        nextBtnDiv.classList.add("hide")
        contentArea.classList.add("blur")
        inputImage.disabled = true
        inputContent.disabled = true
        inputImageBtn.classList.add("disabledCursor")
    }
}

//function remove blur 
function removeBlur() {
    contentArea.classList.remove("blur")
    inputImage.disabled = false;
    inputImageBtn.classList.remove("disabledCursor")
    inputContent.disabled = false
}

//function make submit btn visible
function makeSubmitBtnVisible() {
    contentValue = inputContent.value
    contentValue = contentValue.trim()
    if (contentValue !== "") {
        submitBtnDiv.classList.remove("hide")
    }
    else {
        submitBtnDiv.classList.add("hide")
    }
}

const postList = document.getElementById("postContainer")
const posts = Array.from(postList.children)

function renderPosts(posts) {
    postList.innerHTML = ""
    posts.forEach(post => {
        postList.appendChild(post)
    })
}

const filter = document.getElementById("filter")
const groupby = document.getElementById("groupby")

filter.addEventListener("change", () => {
    filterPost()
})

groupby.addEventListener("change", () => {
    groupPost()
})


const filterPost = () => {
    const filter_by = filter.value
    if (filter_by === "default") {
        posts.forEach((item) => {
            item.hidden = false
        })
    } else if (filter_by === "laptop") {
        posts.forEach((item) => {
            item.hidden = (item.dataset.category === "laptop") ? false : true
        })
    } else if (filter_by === "mobile") {
        posts.forEach((item) => {
            item.hidden = (item.dataset.category === "mobile") ? false : true
        })
    } else if (filter_by === "headphone") {
        posts.forEach((item) => {
            item.hidden = (item.dataset.category === "headphone") ? false : true
        })
    }

    renderPosts(posts)
}

const groupPost = () => {
    const group_by = groupby.value
    let groupedPosts = []

    if (group_by === "default") {
        groupedPosts = [...posts]
    } else if (group_by === "category") {
        groupedPosts = [...posts].sort((a, b) => {
            a.dataset.category.localeCompare(b.dataset.category)
        })
    } else if (group_by === "date") {
        groupedPosts = [...posts].sort((a, b) => new Date(a.dataset.date) - new Date(b.dataset.date))
    }

    renderPosts(groupedPosts)
}


filterPost()
groupPost()
