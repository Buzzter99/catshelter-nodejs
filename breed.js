const button = document.querySelector('#submitButton');
button.addEventListener('click', (event) => {
    event.preventDefault();
    const breedName = document.getElementById('breed-name').value;
    if (!breedName) {
        alert('Please enter a breed name');
        return;
    }
    const endpoint = `/cats/add-breed?breed=${breedName}`
    fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: ({name: breedName})
      })
        .then(response => response.json())
        .then(data => {
         alert(data.message);
        })
        .catch(error => {
          alert('Error:', error);
        });
        document.getElementById('breed-name').value = '';
});