document.addEventListener('DOMContentLoaded', function () {
    var carouselButtons = document.querySelectorAll('.carousel-indicator .carouselTargetButton');

    // Initial state
    carouselButtons[0].classList.add('active');

    document.getElementById('productCarousel').addEventListener('slide.bs.carousel', function (event) {
        var newIndex = event.to;
        carouselButtons.forEach(function (button, index) {
            if (index === newIndex) {
                button.classList.add('active');
            } else {
                button.classList.remove('active');
            }
        });
    });
});

window.onload = function () {
    var description = document.getElementById('productDescription');
    var toggleDescriptionLink = document.getElementById('toggleDescription');

    // If the scrollHeight (full content height) is more than the clientHeight (visible height), show the "Read More" link
    if (description.scrollHeight > description.clientHeight) {
        toggleDescriptionLink.style.display = 'inline';
    }

    toggleDescriptionLink.addEventListener('click', function (event) {
        event.preventDefault();
        if (description.style.maxHeight !== 'none') {
            description.style.maxHeight = 'none';
            event.target.textContent = 'Read Less';
        } else {
            description.style.maxHeight = '200px';
            event.target.textContent = 'Read More';
        }
    });
};
document.addEventListener('DOMContentLoaded', function () {
    // Function to get query parameters
    function getQueryParam(param) {
        let urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(param);
    }

    // Check if the 'duplicate' query parameter is present
    if (getQueryParam('duplicate') === 'true') {
        // Show the alert
        document.getElementById('alert-card').style.display = 'block';

        // Remove the 'duplicate' query parameter from the URL
        const url = new URL(window.location);
        url.searchParams.delete('duplicate');
        window.history.replaceState({}, document.title, url.toString());
    }
    document.querySelector('#close-alert').addEventListener('click', (e) => {
        document.getElementById('alert-card').style.display = 'none';
    })
});

document.addEventListener('DOMContentLoaded', function () {
    var carouselButtons = document.querySelectorAll('.carousel-indicator .carouselTargetButton');

    // Initial state
    carouselButtons[0].classList.add('active');

    document.getElementById('productCarousel').addEventListener('slide.bs.carousel', function (event) {
        var newIndex = event.to;
        carouselButtons.forEach(function (button, index) {
            if (index === newIndex) {
                button.classList.add('active');
            } else {
                button.classList.remove('active');
            }
        });
    });
});