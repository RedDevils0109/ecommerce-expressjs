const image_input = document.querySelector("#image_input");
var uploaded_image = "";

image_input.addEventListener("change", function () {

    const reader = new FileReader();

    reader.addEventListener("load", () => {
        uploaded_image = reader.result;
        console.log(uploaded_image);
        document.querySelector("#display_image").style.backgroundImage = `url("${uploaded_image}")`;
    });

    reader.readAsDataURL(this.files[0]);
});
document.querySelector('#passwordChangeForm').addEventListener('submit', function (event) {
    let passwordError = document.querySelector("#passwordError");
    let reEnterError = document.querySelector("#reEnterError");

    // Reset error messages
    passwordError.innerHTML = "";
    reEnterError.innerHTML = "";

    let validated = true;

    const passwordInput = document.querySelector('#newPassword');
    const reEnterInput = document.querySelector('#confirmNewPassword');

    // Check for password input
    if (passwordInput.value.length < 6) {
        passwordError.innerHTML = "Minimum 6 characters is required *";
        validated = false;
    } else if (reEnterInput.value !== passwordInput.value) {
        reEnterError.innerHTML = "Password must match *";
        validated = false;
    }

    // Prevent form submission if validation fails
    if (!validated) {
        event.preventDefault();
    }
});