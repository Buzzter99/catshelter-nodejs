const button = document.querySelector('#submitButton');
const port = 5000;
button.addEventListener('click', (event) => {
    event.preventDefault();
    const breedName = document.getElementById('breed-name').value;
    if (!breedName) {
        alert('Please enter a breed name');
        return;
    }
    const baseUrl = `http://localhost:${port}/cats/add-breed`;
    const apiUrl = `${baseUrl}?breed=${breedName}`;
    fetch(apiUrl, {
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
