document.addEventListener("DOMContentLoaded", () => {
    const tbody = document.querySelector('#dataTable tbody');
    const addBtn = document.getElementById("add-btn");

    const modal = document.getElementById("modal");
    const closeModal = document.getElementById("closeModal");
    const addForm = document.getElementById("addForm");

    const name = document.getElementById("nameInput");
    const phone = document.getElementById("phoneInput");
    const address = document.getElementById("addressInput");

    let editingUserId = null;

    // Function to show modal and pre-fill (or clear) fields
    function showModal(edit = false, user = null) {
        modal.style.display = "block";
        if (edit && user) {
            name.value = user.name;
            phone.value = user.mobile_no;
            address.value = user.address;
        } else {
            name.value = "";
            phone.value = "";
            address.value = "";
        }
    }

    // Render table rows
    function allDataInsert(data) {
        tbody.innerHTML = '';

        data.forEach(user => {
            const row = `
                <tr data-userid="${user.id}">
                    <td>${user.id}</td>
                    <td>${user.name}</td>
                    <td>${user.mobile_no}</td>
                    <td>${user.address}</td>
                    <td>
                        <button class="edit-btn">Edit</button>
                        <button class="delete-btn">Delete</button>
                    </td>
                </tr>
            `;
            tbody.insertAdjacentHTML('beforeend', row);
        });
    }

    // Fetch and display all data
    function reloadData() {
        fetch('/api/customers/')
            .then(response => response.json())
            .then(data => allDataInsert(data))
            .catch(error => {
                console.error('Error fetching data:', error);
                tbody.innerHTML = `<tr><td colspan="5">Error loading data</td></tr>`;
            });
    }
    reloadData();

    // Delegated event listener for Edit and Delete buttons
    tbody.addEventListener('click', function (e) {
        const tr = e.target.closest("tr");
        if (!tr) return;

        const userId = tr.dataset.userid;

        if (e.target.classList.contains('delete-btn')) {
            // Delete logic
            if (confirm("Are you sure you want to delete this customer?")) {
                fetch(`/api/customers/${userId}/`, {
                    method: 'DELETE',
                    headers: {'Accept': 'application/json'}
                })
                    .then(res => {
                        if (!res.ok) throw new Error("Delete failed");
                        // Remove row directly or reload table
                        reloadData();
                    })
                    .catch(error => {
                        alert('Error deleting customer.');
                        console.error('Error:', error);
                    });
            }
        } else if (e.target.classList.contains('edit-btn')) {
            // Pre-fill modal for editing
            editingUserId = userId;
            // Get user data from table
            const cells = tr.querySelectorAll('td');
            showModal(true, {
                id: userId,
                name: cells[1].textContent,
                mobile_no: cells[2].textContent,
                address: cells[3].textContent
            });
        }
    });

    // Handle Add button
    addBtn.addEventListener("click", () => {
        editingUserId = null;
        showModal(false, null);
    });

    // Form submit handler
    addForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const customerData = {
            mobile_no: phone.value,
            name: name.value,
            address: address.value
        };
        let url = '/api/customers/';
        let method = 'POST';

        if (editingUserId) {
            // EDIT mode
            url = `/api/customers/${editingUserId}/`;
            method = 'PUT';
        }

        fetch(url, {
            method,
            body: JSON.stringify(customerData),
            headers: {
                'Content-Type': 'application/json'
            },
        }).then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            return response.json();
        })
            .then(data => {
                modal.style.display = "none";
                addForm.reset();
                reloadData();
            })
            .catch(error => {
                alert("Error saving data.");
                console.error('Error:', error);
            });
    });

    // Modal close handler
    closeModal.addEventListener("click", () => {
        modal.style.display = "none";
        addForm.reset();
        editingUserId = null;
    });

    // Allow clicking outside modal to close
    window.addEventListener("click", (event) => {
        if (event.target === modal) {
            modal.style.display = "none";
            addForm.reset();
            editingUserId = null;
        }
    });
});
