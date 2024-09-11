document.getElementById('buyButton<%= card.id %>').addEventListener('click', function (event) {
    event.preventDefault();
});

document.addEventListener("DOMContentLoaded", () => {
    const quantityInput = document.getElementById("quantityNum");
    const decreaseButton = document.getElementById("decreaseBtn");
    const increaseButton = document.getElementById("increaseBtn");

    // Function to update quantity based on button clicked
    function updateQuantity(change) {
        let currentValue = parseInt(quantityInput.value) || 1;
        let newValue = currentValue + change;
        newValue = Math.max(newValue, 1);
        quantityInput.value = newValue;
    }

    decreaseButton.addEventListener("click", () => {
        updateQuantity(-1);
    });

    increaseButton.addEventListener("click", () => {
        updateQuantity(1);
    });
});
