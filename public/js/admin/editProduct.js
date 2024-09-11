
const id = document.querySelector('#productId').value
console.log(id)


document.getElementById('editMyForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const formData = new FormData(this);
    const json = {};
    formData.forEach(function (value, key) {
        json[key] = value;
    });

    const id = document.querySelector('#productId').value;

    const subImg = [];
    const link = document.querySelectorAll('#subList li a');
    if (link) {
        link.forEach((e) => {
            subImg.push(e.textContent);
        });
    }
    json.subImg = subImg;

    const url = `/admin/products/${id}`;

    fetch(url, {
        method: 'PUT',

        body: JSON.stringify(json),
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => {

            if (response.ok) {
                window.location.href = `/admin/products/${id}`;
            } else {
                console.error('Error:', response.statusText);
            }
        })
        .catch(error => console.error('Error:', error));
});

function deleteListItem(button) {
    const listItem = button.closest('li'); // Get the closest <li> ancestor of the button
    listItem.remove(); // Remove the <li> element
}
document.querySelectorAll('#subList li button').forEach(function (button) {
    button.addEventListener('click', function () {
        deleteListItem(this); // Call the deleteListItem function with the clicked button as argument
    });
});


document.querySelector("#editMyForm").addEventListener("keypress", function (event) {
    if (event.keyCode === 13) { // Check if Enter key is pressed
        event.preventDefault(); // Prevent default form submission
    }
});
document.getElementById('addImg').addEventListener('click', function () {
    // Get the value of the input field
    var inputValue = document.getElementById('subImg').value;

    // Check if the input value is not empty
    if (inputValue) {
        // Create a new list item element
        const li = document.createElement('li');

        // Create a link element
        const a = document.createElement('a');
        a.href = inputValue;
        a.textContent = inputValue;
        a.target = "_blank";

        // Create a delete button
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'X';
        deleteBtn.classList.add('btn', 'btn-danger', 'ms-2'); // Adding Bootstrap classes
        deleteBtn.addEventListener('click', function () {
            li.remove(); // Remove the corresponding list item
        });

        // Append the link and delete button to the list item
        li.appendChild(a);
        li.appendChild(deleteBtn);

        // Append the new list item to the unordered list
        document.getElementById('subList').appendChild(li);
    }

    // Clear the input field
    document.getElementById('subImg').value = '';
});



