document.addEventListener("DOMContentLoaded", () => {
    const selectCategory = document.getElementById("table-category");
    const quesInput = document.getElementById("quesTextFiled");
    const searchBtn = document.getElementById("searchButton");
    const resultDiv = document.getElementById("result-div");

    function createTableFromObject(obj) {
        // Create a table element
        const table = document.createElement('table');
        table.classList.add('sample-data-table');

        // Create the table header row
        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');

        // Get the keys of the object, which will be the table headers
        const keys = Object.keys(obj);

        // Create a table header cell for each key
        keys.forEach(key => {
            const th = document.createElement('th');
            th.textContent = key;
            headerRow.appendChild(th);
        });

        thead.appendChild(headerRow);
        table.appendChild(thead);

        // Create the table body
        const tbody = document.createElement('tbody');

        // Find out how many rows there will be by getting the length of the first array in obj
        const numRows = obj[keys[0]].length;

        // Create a row for each index in the arrays
        for (let i = 0; i < numRows; i++) {
            const row = document.createElement('tr');

            keys.forEach(key => {
                const cell = document.createElement('td');
                cell.textContent = obj[key][i];
                row.appendChild(cell);
            });

            tbody.appendChild(row);
        }

        table.appendChild(tbody);

        return table;
    }

    searchBtn.addEventListener("click", () => {
        if (quesInput.value === "") {
            resultDiv.innerHTML = "Please enter a question.";
        } else {
            resultDiv.innerHTML = "generating...";

            const selectedValue = selectCategory.value;

            if (selectedValue === "product") {
                fetch("/api/analytics/products_ai_answer/", {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({question: quesInput.value})
                })
                    .then(r => r.json())
                    .then(data => {

                        const {python_code, result} = data;
                        console.log(result);
                        if (typeof result === 'object' && !Array.isArray(result)) {
                            const tableElement = createTableFromObject(result);
                            resultDiv.innerHTML = tableElement.outerHTML;
                        } else {
                            resultDiv.innerHTML = result;
                        }

                    });

            } else if (selectedValue === "customer") {
                fetch("/api/analytics/customers_ai_answer/", {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({question: quesInput.value})
                })
                    .then(r => r.json())
                    .then(data => {

                        const {python_code, result} = data;
                        console.log(result);
                        if (typeof result === 'object' && !Array.isArray(result)) {
                            const tableElement = createTableFromObject(result);
                            resultDiv.innerHTML = tableElement.outerHTML;
                        } else {
                            resultDiv.innerHTML = result;
                        }

                    });

            } else {
                fetch("/api/analytics/orders_ai_answer/", {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({question: quesInput.value})
                })
                    .then(r => r.json())
                    .then(data => {

                        const {python_code, result} = data;
                        console.log(result);
                        if (typeof result === 'object' && !Array.isArray(result)) {
                            const tableElement = createTableFromObject(result);
                            resultDiv.innerHTML = tableElement.outerHTML;
                        } else {
                            resultDiv.innerHTML = result;
                        }

                    });
            }

        }
    });

    selectCategory.addEventListener('change', () => {
        resultDiv.innerHTML = "";
    });

});