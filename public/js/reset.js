let emailInput = document.querySelector("#exampleInputEmail1");
let passwordInput = document.querySelector("#exampleInputPassword1");
let reEnterInput = document.querySelector("#exampleInputPassword2");
let button = document.querySelector("#button");
let emailError = document.querySelector("#emailError");
let passwordError = document.querySelector("#passwordError");
let reEnterError = document.querySelector("#reEnterError");
let resetError = document.querySelector("#resetError");
const form = document.getElementById("resetForm");

// Event listener when submit form
document.addEventListener("DOMContentLoaded", () => {
    button.addEventListener("click", validate);
});

// Validate function
async function validate(Event) {

    // Reset to default
    emailError.innerHTML = "";
    passwordError.innerHTML = "";
    reEnterError.innerHTML = "";
    resetError.innerHTML = "";
    let validated = true;

    // Regular expression to check for email
    const emailPattern = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

    // Array to store element need focus
    let needFocus = [];

    // Check for email input
    if (emailInput.value === "") {
        emailError.innerHTML = "Enter your email *";
        needFocus.push(emailInput);
        validated = false;
    }
    // Check email format
    else if (emailPattern.test(emailInput.value) === false) {
        emailError.innerHTML = "Enter a valid email address *";
        needFocus.push(emailInput);
        validated = false;
    }

    // Check for password input
    if (passwordInput.value.length < 6) {
        passwordError.innerHTML = "Minimum 6 characters is required *";
        needFocus.push(passwordInput);
        validated = false;
    }

    // Check for re-enter password input
    else if (reEnterInput.value === "") {
        reEnterError.innerHTML = "Type your password again *";
        needFocus.push(reEnterInput);
        validated = false;
    } else if (reEnterInput.value !== passwordInput.value) {
        reEnterError.innerHTML = "Password must match *";
        needFocus.push(reEnterInput);
        validated = false;
    }

    // Focus on first wrong input field
    if (needFocus.length > 0) {
        needFocus[0].focus();
    }

    // Check to not send form if not validated
    if (validated === false) {
        Event.preventDefault();
    }
}
