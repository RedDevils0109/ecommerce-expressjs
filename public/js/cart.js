// const { updateSearchIndex } = require("../../models/order");
// const Product = require("../../models/product");

//Dom get element
let checkBtn = document.querySelectorAll(".checkbox2");
let fixBarPrice = document.querySelector("#fixBarPrice");
let checkAllBtn = document.querySelector("#selectAll");
let arrayPrice = document.querySelectorAll(".price");
let arrayQuantity = document.querySelectorAll(".quantityNum");
let deleteBtn = document.querySelectorAll(".delete");
let increaseBtn = document.querySelectorAll(".increase");
let reduceBtn = document.querySelectorAll(".reduce");

//add event listener 
checkBtn.forEach(btn => {
    btn.addEventListener('click', calculateTotal);
});

checkAllBtn.addEventListener("click", selectAll);


// deleteBtn.forEach(btn => {
//     btn.addEventListener('click', deleteProduct);
// });
increaseBtn.forEach(btn => {
    btn.addEventListener('click', increaseQuantity);
});

reduceBtn.forEach(btn => {
    btn.addEventListener('click', reduceQuantity);
});

arrayQuantity.forEach(input => {
    input.addEventListener('change', adjustQuantityInput)
    input.addEventListener('input', quantityWarning)
})

let totalPrice = 0;


function autoClick(event) {
    // Get the corresponding checkbox for the changed input
    const checkbox = event.target.closest('.product').querySelector('.checkbox2');
    console.log(checkbox)

    // Check the checkbox
    checkbox.checked = true;

    // Call calculateTotal function
    calculateTotal();
};

function calculateTotal() {
    let total = 0;
    checkBtn.forEach((btn, index) => {
        if (btn.checked && btn.disabled === false) {
            let price = parseFloat(arrayPrice[index].innerText);
            let quantity = parseInt(arrayQuantity[index].value);
            total += price * quantity;
        }
    });
    totalPrice = total;
    fixBarPrice.innerHTML = "$" + totalPrice.toFixed(2);
}

function selectAll() {
    if (checkAllBtn.checked === true) {
        for (let x = 0; x < checkBtn.length; x++) {
            if (checkBtn[x].disabled === false) {
                checkBtn[x].checked = true;
            }

        }

        calculateTotal()
    }

    else {
        for (let x = 0; x < checkBtn.length; x++) {
            checkBtn[x].checked = false;
        }

        totalPrice = 0;
        fixBarPrice.innerHTML = "$" + 0
    }

}

function checkForAllChecked() {
    let allChecked = true;
    for (let x = 0; x < checkBtn.length; x++) {
        if (checkBtn[x].checked == false) {
            allChecked = false;
            break;
        }
    }

    if (!allChecked) {
        for (let i = 0; i < checkBtn.length; i++) {
            checkBtn[i].checked = false;
        }
    }

    return allChecked;
}


function reduceQuantity(event) {
    let quantityInput = event.target.nextElementSibling;
    let quantity = parseInt(quantityInput.value);
    if (quantity > 1) {
        quantity--;
        quantityInput.value = quantity;

    }
    autoClick(event)
}



function increaseQuantity(event) {
    let quantityInput = event.target.previousElementSibling;
    let quantity = parseInt(quantityInput.value);
    let maxQuantity = parseInt(quantityInput.getAttribute('max'));
    if (quantity < maxQuantity) {
        quantity++;
        quantityInput.value = quantity;

    }
    autoClick(event)
}

function quantityWarning(event) {
    let currentValue = parseInt(event.target.value);
    let min = parseInt(this.getAttribute("min"));
    let max = parseInt(this.getAttribute("max"));
    const warning = event.target.closest('.product').querySelector('#quantity-warning');
    if (currentValue > max) {
        warning.textContent = `Max ${max} orders`
    } else {
        warning.textContent = ''
    }

}
function adjustQuantityInput(event) {
    let currentValue = parseInt(event.target.value);
    let min = parseInt(this.getAttribute("min"));
    let max = parseInt(this.getAttribute("max"));
    const checkbox = event.target.closest('.product').querySelector('.checkbox2');



    if (isNaN(currentValue) || currentValue == 0) {
        event.target.value = min;

        console.log(checkbox)




    } else {


        if (currentValue < min) {
            event.target.value = min;
        } else if (currentValue > max) {
            event.target.value = max;
        }
        const warning = event.target.closest('.product').querySelector('#quantity-warning');
        warning.textContent = ""
    }
    calculateTotal()
}



function validateOrderForm() {
    const addressInput = document.getElementById('address')
    const phoneInput = document.getElementById('phone')
    const emailInput = document.getElementById('email')
    let isValid = true;

    if (addressInput.value.trim() === '') {
        isValid = false;
        addressInput.classList.add('is-invalid')
    } else {
        addressInput.classList.remove('is-invalid')
    }

    // Validate phone number
    const phoneRegex = /^\d{10}$/
    if (!phoneRegex.test(phoneInput.value.trim())) {
        isValid = false
        phoneInput.classList.add('is-invalid')
    } else {
        phoneInput.classList.remove('is-invalid')
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailInput.value.trim())) {
        isValid = false
        emailInput.classList.add('is-invalid')
    } else {
        emailInput.classList.remove('is-invalid')
    }

    return isValid
}

document.addEventListener("DOMContentLoaded", () => {

    function getCheckedValues() {
        const checkboxes = document.querySelectorAll('.checkbox2:checked');
        const products = [];

        checkboxes.forEach(checkbox => {
            if (checkbox.checked) {
                const quantityInputs = document.querySelector(`input[id^="quantityNum-${checkbox.value}"]`);
                const product = {
                    productId: checkbox.value,
                    quantity: quantityInputs.value
                }
                products.push(product);
            }
        });

        return products;
    }

    const purchaseButton = document.querySelector('.purchase')
    purchaseButton.disabled = true



    const orderModal = document.getElementById('orderModal')
    purchaseButton.addEventListener('click', () => {
        orderModal.classList.add('show')
        orderModal.style.display = 'block'
        document.body.classList.add('modal-open')

        const selectedProductsCount = document.querySelectorAll('.checkbox2:checked').length
        const modalContent = document.querySelector('.product-info')
        modalContent.innerHTML = `
            <p>Number of products: ${selectedProductsCount}</p>
            <p>Total Amount: $${totalPrice.toFixed(2)}</p>
        `;
    });

    const confirmOrderBtn = document.getElementById('confirmOrderBtn')

    confirmOrderBtn.addEventListener('click', async (event) => {
        if (!validateOrderForm()) {
            event.preventDefault()
            return
        }
        const products = getCheckedValues()
        const order = {
            total: totalPrice,
            products: products,
            address: document.getElementById('address').value,
            phone: document.getElementById('phone').value,
            email: document.getElementById('email').value
        }
        console.log(order)

        try {
            fetch('/cart/order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(order)
            })
                .then(response => {
                    if (response.ok) {
                        window.location.href = '/cart'
                    } else {
                        console.error('Error:', response.statusText)
                    }
                })
                .catch(error => console.error('Error:', error))

        } catch (error) {
            console.error('Error:', error)
        }

        orderModal.classList.remove('show')
        orderModal.style.display = 'none'
        document.body.classList.remove('modal-open')
    });

    const closeBtn = document.querySelector('#btn-close');
    const close = document.querySelector('.btn-close');
    closeBtn.addEventListener('click', () => {
        orderModal.classList.remove('show')
        orderModal.style.display = 'none'
        document.body.classList.remove('modal-open')
    })

    close.addEventListener('click', () => {
        orderModal.classList.remove('show')
        orderModal.style.display = 'none'
        document.body.classList.remove('modal-open')
    })


    function checkProductSelected() {
        let productSelected = false;
        checkBtn.forEach(btn => {
            if (btn.checked) {
                productSelected = true;
            }
        });
        return productSelected;
    }

    function updatePurchaseButton() {
        if (checkProductSelected()) {
            purchaseButton.removeAttribute('disabled')
        } else {
            purchaseButton.setAttribute('disabled', 'disabled')
        }
    }

    document.addEventListener('click', (event) => {
        updatePurchaseButton()
    })


    const addressInput = document.getElementById('address')
    const phoneInput = document.getElementById('phone')
    const emailInput = document.getElementById('email')
    addressInput.addEventListener('input', validateOrderForm)
    phoneInput.addEventListener('input', validateOrderForm)
    emailInput.addEventListener('input', validateOrderForm)
})
