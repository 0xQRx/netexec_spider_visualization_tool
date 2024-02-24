document.addEventListener('DOMContentLoaded', () => {
    // Query all folder elements
    const folders = document.querySelectorAll('.folder');

    folders.forEach(folder => {
        folder.addEventListener('click', function() {
            this.classList.toggle('open'); // Toggle 'open' class on folder
            let childUl = this.nextElementSibling; // Assuming the UL is the next sibling
            if (childUl.style.display === 'none' || !childUl.style.display) {
                childUl.style.display = 'block'; // Show children if folder is opened
            } else {
                childUl.style.display = 'none'; // Hide children if folder is closed
            }
        });
    });
});

function deleteFile(fileName) {
    fetch(`/delete/${fileName}`, { method: 'DELETE' })
        .then(response => {
            if (response.ok) {
                window.location.reload();
            } else {
                alert('Failed to delete file.');
            }
        });
}

function clearAllData() {
    fetch('/clear-all', { method: 'DELETE' })
        .then(response => {
            if (response.ok) {
                window.location.reload();
            } else {
                alert('Failed to clear all data.');
            }
        });
}
