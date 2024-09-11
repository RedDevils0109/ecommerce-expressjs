//Get input field and button
let nameInput = document.querySelector("#exampleInputName");
let emailInput = document.querySelector("#exampleInputEmail1");
let passwordInput = document.querySelector("#exampleInputPassword1");
let reEnterInput = document.querySelector("#exampleInputPassword2");
let button = document.querySelector("#button");
let nameError = document.querySelector("#nameError");
let emailError = document.querySelector("#emailError");
let passwordError = document.querySelector("#passwordError");
let reEnterError = document.querySelector("#reEnterError");

//Event listener when submit form
button.addEventListener("click", validate)

//validate function
function validate(Event) {
    //reset to default
    nameError.innerHTML = "";
    emailError.innerHTML = "";
    passwordError.innerHTML = "";
    reEnterError.innerHTML = "";
    let validated = true;

    //regular expression to check for email
    const emailPattern = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

    //array to store element need focus
    let needFocus = [];

    //check for name input
    if (nameInput.value === "") {
        nameError.innerHTML = "Enter your name  *"
        needFocus.push(nameInput);
        validated = false;
    }

    //check for email input
    if (emailInput.value === "") {
        emailError.innerHTML = "Enter your email * "
        needFocus.push(emailInput);
        validated = false;
    }

    //check email format
    else if (emailPattern.test(emailInput.value) === false) {
        emailError.innerHTML = "Enter a valid email address *"
        needFocus.push(emailInput);
        validated = false;
    }

    //check for password input
    if (passwordInput.value.length < 6) {
        passwordError.innerHTML = "Minimum 6 characters is required *"
        needFocus.push(passwordInput);
        validated = false;
    }

    //check for re-enter password input
    else if (reEnterInput.value === "") {
        reEnterError.innerHTML = "Type your password again *"
        needFocus.push(reEnterInput);
        validated = false;
    }
    else if (reEnterInput.value !== passwordInput.value) {
        reEnterError.innerHTML =  "Password must match *"
        needFocus.push(reEnterInput);
        validated = false;
    }

    //focus on first wrong input field
    needFocus[0].focus();

    //check to not send form
    if (validated === false) {
        Event.preventDefault(); 
    }
}