const deleteButtons = document.querySelectorAll('.delete-btn');
deleteButtons.forEach(button => {
  button.addEventListener('click', function(event) {
    event.preventDefault();
    const catId = this.closest('li').querySelector('.cat').value;
    if (!catId) {
        alert('Error deleting the cat');
        return;
    }
    fetch(`/cats/delete/${catId}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (response.ok) {
            alert('Cat has been deleted successfully');
            document.getElementById(`element-${catId}`).remove();
        } else {
            alert('Error deleting the cat');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error deleting the cat');
    });
  });
});
      