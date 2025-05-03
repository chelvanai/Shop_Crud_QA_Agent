document.addEventListener("DOMContentLoaded", () => {
    const tbody = document.querySelector('#dataTable tbody');
    const addBtn = document.getElementById("add-btn");

    const modal = document.getElementById("modal");
    const closeModal = document.getElementById("closeModal");
    const addForm = document.getElementById("addForm");

    const name = document.getElementById("nameInput");
    const price = document.getElementById("priceInput");
    const unit = document.getElementById("unitInput");

    let editingProductId = null;

    // Function to show modal and pre-fill (or clear) fields
    function showModal(edit = false, user = null) {
        modal.style.display = "block";
        if (edit && user) {
            name.value = user.name;
            price.value = user.price;
            unit.value = user.unit;
        } else {
            name.value = "";
            price.value = "";
            unit.value = "";
        }
    }

    // Render table rows
    function allDataInsert(data) {
        tbody.innerHTML = '';

        data.forEach(product => {
            const row = `
                <tr data-productid="${product.id}">
                    <td>${product.id}</td>
                    <td>${product.name}</td>
                    <td>${product.price}</td>
                    <td>${product.unit}</td>
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
        fetch('/api/products/')
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

        const productId = tr.dataset.productid;

        if (e.target.classList.contains('delete-btn')) {
            // Delete logic
            if (confirm("Are you sure you want to delete this customer?")) {
                fetch(`/api/products/${productId}/`, {
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
            editingProductId = productId;
            // Get user data from table
            const cells = tr.querySelectorAll('td');
            showModal(true, {
                id: productId,
                name: cells[1].textContent,
                price: cells[2].textContent,
                unit: cells[3].textContent
            });
        }
    });

    // Handle Add button
    addBtn.addEventListener("click", () => {
        editingProductId = null;
        showModal(false, null);
    });

    // Form submit handler
    addForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const productData = {
            name: name.value,
            price: price.value,
            unit: unit.value
        };
        let url = '/api/products/';
        let method = 'POST';

        if (editingProductId) {
            // EDIT mode
            url = `/api/products/${editingProductId}/`;
            method = 'PUT';
        }

        fetch(url, {
            method,
            body: JSON.stringify(productData),
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
        editingProductId = null;
    });

    // Allow clicking outside modal to close
    window.addEventListener("click", (event) => {
        if (event.target === modal) {
            modal.style.display = "none";
            addForm.reset();
            editingProductId = null;
        }
    });
});
