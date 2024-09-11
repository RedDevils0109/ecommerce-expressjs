document.addEventListener('DOMContentLoaded', function () {
    var categoryWrappers = document.querySelectorAll('.category');

    categoryWrappers.forEach(function (wrapper) {
        var categoryItems = wrapper.querySelector('.categoryItems');
        var categoryButtonLeft = wrapper.querySelector('.categoryButtonLeft');
        var categoryButtonRight = wrapper.querySelector('.categoryButtonRight');
        var numCards = categoryItems.querySelectorAll('.categoryCard').length;

        // Ensure all required elements are found
        if (!categoryItems || !categoryButtonLeft || !categoryButtonRight) {
            console.error('Required elements not found for category wrapper:', wrapper);
            return;
        }

        // Show/hide buttons on mouseover/mouseout
        wrapper.addEventListener('mouseover', function (event) {
            if (!event.target.classList.contains('categoryCard')) {
                categoryButtonLeft.style.opacity = '1';
                categoryButtonRight.style.opacity = '1';
            }
        });

        wrapper.addEventListener('mouseout', function (event) {
            if (!event.relatedTarget || !event.relatedTarget.classList.contains('categoryCard')) {
                categoryButtonLeft.style.opacity = '0';
                categoryButtonRight.style.opacity = '0';
            }
        });

        // Hide the left button initially
        categoryButtonLeft.style.visibility = 'hidden';

        // Define the scroll event handler
        function handleScroll() {
            // Hide/show right button
            if (categoryItems.scrollLeft + categoryItems.offsetWidth >= categoryItems.scrollWidth - 30) {
                categoryButtonRight.style.visibility = 'hidden';
            }
            else {
                categoryButtonRight.style.visibility = 'visible';
            }

            // Hide/show left button
            if (categoryItems.scrollLeft <= 60) {
                categoryButtonLeft.style.visibility = 'hidden';
            } else {
                categoryButtonLeft.style.visibility = 'visible';
            }
        }
        if (numCards > 3) {

            categoryItems.addEventListener('scroll', handleScroll);

            categoryButtonLeft.addEventListener('click', function () {
                categoryItems.scrollBy({ left: -300, behavior: 'smooth' });
            });

            categoryButtonRight.addEventListener('click', function () {
                categoryItems.scrollBy({ left: 300, behavior: 'smooth' });
            });
        } else {
            categoryButtonLeft.style.visibility = 'hidden';
            categoryButtonRight.style.visibility = 'hidden';
        }
    });
});