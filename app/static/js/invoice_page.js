document.addEventListener("DOMContentLoaded", () => {
    const itemsDiv = document.getElementById('items');
    const addItemBtn = document.getElementById('addItemBtn');
    const totalAmountEl = document.getElementById('totalAmount');
    const errorMsg = document.getElementById('error-msg');
    const orderBtn = document.getElementById('order-btn');
    const newBtn = document.getElementById('new-btn');

    const mobileInput = document.getElementById('mobile-no');
    const nameInput = document.getElementById('customer-name');
    const addressInput = document.getElementById('address');
    const resultsDiv = document.getElementById('mobile-results');

    mobileInput.value = ""
    nameInput.value = ""
    addressInput.value = ""

    let names;
    let customer_ids;
    let mobile_no;
    let address;
    let customer_selected = false;
    let selected_customer_id;

    let product_names;
    let product_id;
    let unit;
    let price;


    fetch('/api/products/')
        .then(response => response.json())
        .then(data => {
            console.log(data);
            product_id = data.map(data => data.id)
            product_names = data.map(data => data.name);
            unit = data.map(data => data.unit);
            price = data.map(data => data.price);

        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });

    fetch('/api/customers/')
        .then(response => response.json())
        .then(data => {
            console.log(data);
            customer_ids = data.map(data => data.id);
            names = data.map(data => data.name);
            mobile_no = data.map(data => data.mobile_no);
            address = data.map(data => data.address);

        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });

    function createItemRow() {
        const row = document.createElement('div');
        row.className = 'item-row';

        const productNameField = document.createElement('div');
        productNameField.className = 'item-field';
        productNameField.innerHTML = `<label>Product Name</label>
        <input type="text" id="productName" placeholder="Name" class="product-name">`;

        const productIdField = document.createElement('div');
        productIdField.className = 'item-field';
        productIdField.innerHTML = `<input type="text" id="productId" placeholder="Id" class="product-id" style="display: none">`;

        const dropDownRes = document.createElement('div');
        dropDownRes.className = 'dropdown-results';
        productNameField.appendChild(dropDownRes)

        const priceField = document.createElement('div');
        priceField.className = 'item-field';
        priceField.innerHTML = `<label>Price</label>
        <input type="number" placeholder="0.00" min="0" step="0.01" class="price">`;

        const unitField = document.createElement('div');
        unitField.className = 'item-field';
        unitField.innerHTML = `<label>Unit</label>
        <input type="text" placeholder="Unit" class="product-unit">`;

        const qtyField = document.createElement('div');
        qtyField.className = 'item-field';
        qtyField.innerHTML = `<label>Quantity</label>
        <input type="number" placeholder="1.00" min="1" step="0.01"  class="quantity" value="1">`;

        const amountField = document.createElement('div');
        amountField.className = 'item-field';
        amountField.innerHTML = `<label>Amount</label>
        <input type="number" class="amount" readonly value="0.00">`;

        const removeItemBtn = document.createElement('button');
        removeItemBtn.className = 'remove-item-btn';
        removeItemBtn.innerHTML = `-`;

        row.appendChild(productNameField);
        row.appendChild(productIdField);
        row.appendChild(priceField);
        row.appendChild(qtyField);
        row.appendChild(unitField)
        row.appendChild(amountField);
        row.appendChild(removeItemBtn)

        removeItemBtn.addEventListener('click', () => {
            row.remove();
            updateAmountAndTotal();
        })

        const productInput = productNameField.querySelector('input');
        const productId = productIdField.querySelector('input');
        const priceInput = priceField.querySelector('input');
        const qtyInput = qtyField.querySelector('input');
        const amountInput = amountField.querySelector('input');
        const unitInput = unitField.querySelector('input');


        productInput.addEventListener('input', () => {
            const inputValue = productInput.value;
            productId.value = ''
            unitInput.value = '';
            priceInput.value = '';
            amountInput.value = '';
            updateAmountAndTotal();

            if (!inputValue) {
                dropDownRes.innerHTML = '';
                return;
            }

            const filtered = product_names.filter(item => item.toLowerCase().includes(inputValue));

            if (filtered.length === 0) {
                dropDownRes.innerHTML = '<div>No results</div>';
            } else {
                dropDownRes.innerHTML = filtered.map(product_names => `<div>${product_names}</div>`).join('');
            }

        });

        dropDownRes.addEventListener('click', function (e) {
            productInput.value = e.target.textContent;
            const selected_index = product_names.indexOf(e.target.textContent);
            console.log(selected_index);


            if (e.target.textContent === 'No results') {
                productId.value = ''
                unitInput.value = '';
                priceInput.value = '';
                amountInput.value = '';
                updateAmountAndTotal();

            } else {
                productId.value = product_id[selected_index];
                unitInput.value = unit[selected_index];
                priceInput.value = price[selected_index];
                updateAmountAndTotal();
            }

            dropDownRes.innerHTML = '';
        });


        function updateAmountAndTotal() {
            const price = parseFloat(priceInput.value) || 0;
            const qty = parseFloat(qtyInput.value) || 0;
            const amt = price * qty;
            amountInput.value = amt.toFixed(2);
            updateTotal();
        }

        priceInput.addEventListener('input', updateAmountAndTotal);
        qtyInput.addEventListener('input', updateAmountAndTotal);

        itemsDiv.appendChild(row);
    }


    function updateTotal() {
        const amountInputs = itemsDiv.querySelectorAll('.amount');
        let total = 0;
        amountInputs.forEach(input => {
            total += parseFloat(input.value) || 0;
        });
        totalAmountEl.textContent = total.toFixed(2);
    }

    mobileInput.addEventListener("input", () => {
        nameInput.value = '';
        addressInput.value = '';
        customer_selected = false;
        const inputValue = mobileInput.value;

        if (!inputValue) {
            resultsDiv.innerHTML = '';
            return;
        }

        const filtered = mobile_no.filter(item => item.includes(inputValue));

        if (filtered.length === 0) {
            resultsDiv.innerHTML = '<div>No results</div>';
        } else {
            resultsDiv.innerHTML = filtered.map(mobile_numbers => `<div>${mobile_numbers}</div>`).join('');
        }
    });

    resultsDiv.addEventListener('click', function (e) {
        if (e.target && e.target.nodeName === "DIV") {
            mobileInput.value = e.target.textContent;
            const selected_index = mobile_no.indexOf(e.target.textContent)

            if (e.target.textContent === 'No results') {
                nameInput.value = '';
                addressInput.value = '';
                selected_customer_id = null;
                customer_selected = false
            } else {
                nameInput.value = names[selected_index];
                addressInput.value = address[selected_index];
                selected_customer_id = customer_ids[selected_index];
                errorMsg.innerText = ""
                customer_selected = true;
            }

            resultsDiv.innerHTML = '';
        }
    });

    addItemBtn.addEventListener('click', () => {
        if (customer_selected) {
            createItemRow();
        } else {
            errorMsg.innerText = "Please select a customer first."
        }
    });

    function getRowValues(rowNode) {
        const productId = rowNode.querySelector('.product-id')?.value || '';
        const productName = rowNode.querySelector('.product-name')?.value || '';
        const price = rowNode.querySelector('.price')?.value || '';
        const quantity = rowNode.querySelector('.quantity')?.value || '';
        const unit = rowNode.querySelector('.product-unit')?.value || '';
        const amount = rowNode.querySelector('.amount')?.value || '';

        // Put them in an array as requested
        return [productId, productName, price, quantity, unit, amount];
    }

    orderBtn.addEventListener('click', () => {
        const rows = document.querySelectorAll('.item-row');
        const itemsArray = [];

        if (customer_selected) {

            rows.forEach(rowNode => {
                const values = getRowValues(rowNode);
                if (values[0] !== "") {
                    itemsArray.push(values);
                }

            });

            if (itemsArray.length === 0) {
                alert("It is an empty invoice, You can not order it!");

            } else {
                const currentTime = new Date().toISOString();

                for (let i = 0; i < itemsArray.length; i++) {
                    console.log(itemsArray[i]);

                    const item_data = {
                        customer_id: selected_customer_id,
                        product_id: itemsArray[i][0],
                        quantity: itemsArray[i][3],
                        total_amount: itemsArray[i][5],
                        created_at: currentTime
                    };

                    console.log(item_data);

                    fetch('/api/orders/', {
                        method: "POST",
                        body: JSON.stringify(item_data),
                        headers: {
                            'Content-Type': 'application/json'
                        },
                    }).then(response => {
                        if (!response.ok) throw new Error('Network response was not ok');
                        return response.json();
                    })
                        .then(data => {
                            console.log("Inserted!");
                            orderBtn.textContent = "Ordered";
                            document.querySelectorAll('#invoice-content input, #invoice-content button').forEach(el => {
                                el.disabled = true;
                            });
                        })
                        .catch(error => {
                            alert("Error saving data.");
                            console.error('Error:', error);
                        });
                }

            }


        } else {
            errorMsg.innerText = "Please select a customer first."
        }


    });

    newBtn.addEventListener("click",()=>{
        location.reload();

    });

})