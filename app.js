const button = document.querySelector('#submitButton');
button.addEventListener('click', (event) => {
    event.preventDefault();
    const breedName = document.getElementById('breed-name').value;
    if (!breedName) {
        alert('Please enter a breed name');
        return;
    }
    
});