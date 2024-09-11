console.log('Loading...')

document.querySelector('#myForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const formData = new FormData(this);
    const json = {};
    formData.forEach(function (value, key) {
        json[key] = value;
    });
    const subImg = []
    const link = document.querySelectorAll('#subList li a')
    if (link) {
        link.forEach((e) => {
            subImg.push(e.textContent)
        })
    }
    json.subImg = subImg
    console.log(json)

    const url = '/admin/products';

    fetch(url, {
        method: 'POST',
        body: JSON.stringify(json),// Convert JSON object to string
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => {
            if (response.ok) {
                // Redirect after successful POST request
                window.location.href = '/admin/products';
            } else {
                // Handle non-OK response
                console.error('Error:', response.statusText);
            }
        })
        .catch(error => console.error('Error:', error)); // Log any errors
});
document.querySelector("#myForm").addEventListener("keypress", function (event) {
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


