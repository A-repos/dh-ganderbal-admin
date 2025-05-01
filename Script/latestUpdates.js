// Get references to form and list container
const form = document.getElementById('latestUpdatesForm');
const list = document.getElementById('latestUpdatesList');

// 👉 Start by loading all saved PDF updates when page loads

// 📤 Handle form submission when admin uploads a new PDF
form.addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent page reload

    const description = document.getElementById('title').value;
    const pdfFile = document.getElementById('pdf').files[0];

    // Check if file and description are provided
    if (!description || !pdfFile) {
        alert('Please enter a description and select a PDF file.');
        return;
    }

    uploadPDFUpdate(description, pdfFile);
});

/* ============================================================
   FUNCTION: Load all updates from backend and display on page
============================================================ */
export function loadAllPDFUpdates() {
    fetch('https://dh-ganderbal-backend.onrender.com/api/latest-updates')
        .then(res => res.json())
        .then(data => {
            data.forEach(entry => displayPDFUpdate(entry));
        })
        .catch(error => {
            console.error('Error fetching updates:', error);
            alert('Failed to load PDF updates.');
        });
}

/* ============================================================
   FUNCTION: Upload a new PDF to backend
============================================================ */
function uploadPDFUpdate(description, pdfFile) {
    const formData = new FormData();
    formData.append('title', description);
    formData.append('pdf', pdfFile);

    fetch('https://dh-ganderbal-backend.onrender.com/api/latest-updates', {
        method: 'POST',
        body: formData,
        credentials: 'include',
    })
        .then(response => {
            return response.json().then(data => {
                return {
                    status: response.status,
                    ok: response.ok,
                    data: data
                };
            });
        })

        .then(result => {
            if (!result.ok) {
                throw new Error(result.data.error || 'Upload failed');
            }

            alert('PDF uploaded successfully!');
            displayPDFUpdate(entry); // Show new update on page
            form.reset(); // Clear form inputs
        })
        .catch(error => {
            console.error('Upload error:', error);
            alert('Something went wrong while uploading.');
        });
}

/* ============================================================
   FUNCTION: Show one PDF update on the page
============================================================ */
function displayPDFUpdate(entry) {
    const item = document.createElement('div');
    item.id = `update-${entry.id}`;
    item.className = 'data-entry';
    item.innerHTML = `
    <p>
      <a href="https://dh-ganderbal-backend.onrender.com${entry.PDFfileUrl}" style="text-decoration:none" download>${entry.title}</a>
      <button onclick="deletePDFUpdate(${entry.id})" style="margin-left:10px;">Delete</button>
    </p>
  `;

    list.prepend(item);
}

/* ============================================================
   FUNCTION: Delete a PDF entry from backend and page
============================================================ */
window.deletePDFUpdate = function (id) {
    const confirmDelete = confirm('Are you sure you want to delete this PDF?');
    if (!confirmDelete) return;

    fetch(`https://dh-ganderbal-backend.onrender.com/api/latest-updates/${id}`, {
        method: 'DELETE',
        credentials: 'include',
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Delete failed');
            }

            document.getElementById(`update-${id}`).remove(); // Remove the div with this ID from the page from page
            alert('Deleted successfully!');
        })
        .catch(error => {
            console.error('Delete error:', error);
            alert('Failed to delete PDF.');
        });
};
