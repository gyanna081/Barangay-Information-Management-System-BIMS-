document.addEventListener("DOMContentLoaded", () => {
    const populationList = document.getElementById("populationContainer");
    const createPopulationForm = document.getElementById("createPopulationForm");
    const confirmDeleteBtn = document.getElementById("confirmDeletePopulationBtn");
    const modalElement = document.getElementById("createPopulationModal");
    const modalInstance = new bootstrap.Modal(modalElement);

    // Add the print button event listener
    const printPopulationBtn = document.getElementById("printPopulationBtn");
    if (printPopulationBtn) {
        printPopulationBtn.addEventListener("click", () => {
            printPopulations();
        });
    }

    fetchPopulations();

    function setFormMethod(method) {
        createPopulationForm.dataset.method = method;
        if (method === "POST") {
            createPopulationForm.reset();
            document.getElementById("populationId").value = "";
            document.getElementById("createPopulationModalLabel").textContent = "Create Population";
            document.getElementById("formErrorMessage").classList.add("d-none");
        } else if (method === "PUT") {
            document.getElementById("createPopulationModalLabel").textContent = "Edit Population";
        }
    }

    modalElement.addEventListener("hidden.bs.modal", () => {
        setFormMethod("POST");
        createPopulationForm.reset();
    });

    createPopulationForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        const formData = new FormData(createPopulationForm);
        const data = {
            id: document.getElementById("populationId").value,
            barangay_id: document.getElementById("barangayId").value,
            name: document.getElementById("barangayName").value,
            address: document.getElementById("barangayAddress").value,
            population: document.getElementById("barangayPopulation").value
        };

        const method = createPopulationForm.dataset.method || "POST";
        const url = method === "PUT" ? `/brgy/populations/${data.id}/` : "/brgy/populations/";

        try {
            const response = await fetch(url, {
                method: method,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                fetchPopulations();
                createPopulationForm.reset();
                document.getElementById("formErrorMessage").classList.add("d-none");
                modalInstance.hide();
            } else {
                const errorMsg = await response.json();
                document.getElementById("formErrorMessage").textContent = errorMsg.error || "Failed to save population.";
                document.getElementById("formErrorMessage").classList.remove("d-none");
            }
        } catch (error) {
            console.error("Error saving population:", error);
        }
    });

    confirmDeleteBtn.addEventListener("click", async () => {
        const populationId = confirmDeleteBtn.dataset.populationId;
        try {
            const response = await fetch(`/brgy/populations/${populationId}/`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });

            if (response.ok) {
                fetchPopulations();
                const deleteModal = bootstrap.Modal.getInstance(document.getElementById("deletePopulationConfirmationModal"));
                deleteModal.hide();
            } else {
                console.error("Failed to delete population");
            }
        } catch (error) {
            console.error("Error deleting population:", error);
        }
    });

    async function fetchPopulations() {
        const token = localStorage.getItem("token");
        if (!token) {
            window.location.href = "/";
            return;
        }

        try {
            const response = await fetch("/brgy/populations/", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const populations = await response.json();
                displayPopulations(populations);
            } else if (response.status === 401) {
                localStorage.removeItem("token");
                window.location.href = "/";
            } else {
                console.error("Failed to fetch populations");
                populationList.innerHTML = "<p>Failed to load populations. Please try again later.</p>";
            }
        } catch (error) {
            console.error("Error fetching populations:", error);
            populationList.innerHTML = "<p>An error occurred while loading populations. Please try again later.</p>";
        }
    }

    function displayPopulations(populations) {
        const table = document.createElement("table");
        table.className = "table table-striped table-hover glass-effect shadow-lg";
        table.innerHTML = `
            <thead>
                <tr class="text-center">
                    <th>ID</th>
                    <th>Name</th>
                    <th>Address</th>
                    <th>Population</th>
                    <th>${userType === "Brgy. Admin" ? "Actions" : ""}</th>
                </tr>
            </thead>
            <tbody>
                ${populations.map(population => `
                    <tr class="text-center">
                        <td>${population.id}</td>
                        <td>${population.name}</td>
                        <td>${population.address}</td>
                        <td>${population.population}</td>
                        <td>
                          ${userType === "Brgy. Admin" ? `
                            <i class="fas fa-edit me-2 edit-icon" data-id="${population.id}" style="color: #28a745;" data-bs-toggle="tooltip" title="Edit Population"></i>
                            <i class="fas fa-trash delete-icon" data-id="${population.id}" style="color: #dc3545;" data-bs-toggle="tooltip" title="Delete Population"></i>
                          ` : ""}
                        </td>
                    </tr>
                `).join("")}
            </tbody>
        `;

        populationList.innerHTML = "";
        populationList.appendChild(table);

        if (userType === "Brgy. Admin") {
            populations.forEach(population => {
                const editIcon = document.querySelector(`.edit-icon[data-id="${population.id}"]`);
                const deleteIcon = document.querySelector(`.delete-icon[data-id="${population.id}"]`);

                if (editIcon) {
                    editIcon.addEventListener("click", () => {
                        console.log(`Editing Population ID: ${population.id}`); // Debugging output
                        setFormMethod("PUT");
                        populateForm(population);
                        modalInstance.show();
                    });
                }

                if (deleteIcon) {
                    deleteIcon.addEventListener("click", () => {
                        console.log(`Deleting Population ID: ${population.id}`); // Debugging output
                        confirmDeleteBtn.dataset.populationId = population.id;
                        const deleteModal = new bootstrap.Modal(document.getElementById("deletePopulationConfirmationModal"));
                        deleteModal.show();
                    });
                }
            });
        }
    }

    function populateForm(population) {
        document.getElementById("populationId").value = population.id;
        document.getElementById("barangayId").value = population.barangay_id; // Ensure the correct field exists
        document.getElementById("barangayName").value = population.name;
        document.getElementById("barangayAddress").value = population.address;
        document.getElementById("barangayPopulation").value = population.population;
    }

    function printPopulations() {
        const printWindow = window.open("", "_blank");
        const table = document
            .querySelector("#populationContainer table")
            .cloneNode(true);

        const headers = table.querySelectorAll("th");
        const rows = table.querySelectorAll("tbody tr");

        if (headers.length > 0) {
            headers[headers.length - 1].remove();
        }
        rows.forEach((row) => row.deleteCell(-1));

        const printContent = `
            <html>
                <head>
                    <title>Population Data</title>
                    <style>
                        body { font-family: Arial, sans-serif; }
                        table { border-collapse: collapse; width: 100%; }
                        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                        th { background-color: #f2f2f2; }
                    </style>
                </head>
                <body>
                    <h3>Population Table</h3>
                    ${table.outerHTML}
                </body>
            </html>
        `;

        printWindow.document.write(printContent);
        printWindow.document.close();
        printWindow.print();
    }

    const printBtn = document.getElementById("printPopulationBtn");
    if (printBtn) {
        printBtn.addEventListener("click", printPopulations);
    }
});
