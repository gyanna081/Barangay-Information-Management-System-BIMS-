document.addEventListener("DOMContentLoaded", () => {
  const barangayList = document.getElementById("barangayContainer");
  const createBarangayForm = document.getElementById("createBarangayForm");
  const confirmDeleteBtn = document.getElementById("confirmDeleteBarangayBtn");
  const modalElement = document.getElementById("createBarangayModal");
  const modalInstance = new bootstrap.Modal(modalElement);
  const searchInput = document.getElementById("searchInput"); // Search input
  const filterPopulation = document.getElementById("filterPopulation"); // Filter dropdown
  let allBarangays = []; // Store all barangays for filtering

  // Add the print button event listener
  const printBarangayBtn = document.getElementById("printBarangayBtn");
  if (printBarangayBtn) {
    printBarangayBtn.addEventListener("click", () => {
      printBarangays();
    });
  }

  fetchBarangays();

  // Event listener for search
  searchInput.addEventListener("input", () => {
    const query = searchInput.value.toLowerCase();
    const filteredBarangays = allBarangays.filter(barangay =>
      barangay.name.toLowerCase().includes(query)
    );
    displayBarangays(filteredBarangays);
  });

  // Event listener for filter
  filterPopulation.addEventListener("change", () => {
    const populationCategory = filterPopulation.value;
    const filteredBarangays = populationCategory
      ? allBarangays.filter(barangay => {
          if (populationCategory === "low") return barangay.population < 1000;
          if (populationCategory === "medium")
            return barangay.population >= 1000 && barangay.population <= 5000;
          if (populationCategory === "high") return barangay.population > 5000;
          return true;
        })
      : allBarangays;
    displayBarangays(filteredBarangays);
  });

  function setFormMethod(method) {
    createBarangayForm.dataset.method = method;
    if (method === "POST") {
      createBarangayForm.reset();
      document.getElementById("barangayId").value = "";
      document.getElementById("createBarangayModalLabel").textContent = "Create Sitio";
      document.getElementById("formErrorMessage").classList.add("d-none");
    } else if (method === "PUT") {
      document.getElementById("createBarangayModalLabel").textContent = "Edit Sitio";
    }
  }

  modalElement.addEventListener("hidden.bs.modal", () => {
    setFormMethod("POST");
    createBarangayForm.reset();
  });

  createBarangayForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const formData = new FormData(createBarangayForm);
    const data = {
      id: document.getElementById("barangayId").value,
      barangay_id: document.getElementById("barangayId").value,
      name: document.getElementById("barangayName").value,
      address: document.getElementById("barangayAddress").value,
      population: document.getElementById("barangayPopulation").value
    };

    const method = createBarangayForm.dataset.method || "POST";
    const url = method === "PUT" ? `/brgy/barangays/${data.id}/` : "/brgy/barangays/";

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
        fetchBarangays();
        createBarangayForm.reset();
        document.getElementById("formErrorMessage").classList.add("d-none");
        modalInstance.hide();
      } else {
        const errorMsg = await response.json();
        document.getElementById("formErrorMessage").textContent = errorMsg.error || "Failed to save barangay.";
        document.getElementById("formErrorMessage").classList.remove("d-none");
      }
    } catch (error) {
      console.error("Error saving barangay:", error);
    }
  });

  confirmDeleteBtn.addEventListener("click", async () => {
    const barangayId = confirmDeleteBtn.dataset.barangayId;
    try {
      const response = await fetch(`/brgy/barangays/${barangayId}/`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.ok) {
        fetchBarangays();
        const deleteModal = bootstrap.Modal.getInstance(document.getElementById("deleteBarangayConfirmationModal"));
        deleteModal.hide();
      } else {
        console.error("Failed to delete barangay");
      }
    } catch (error) {
      console.error("Error deleting barangay:", error);
    }
  });

  async function fetchBarangays() {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/";
      return;
    }

    try {
      const response = await fetch("/brgy/barangays/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        allBarangays = await response.json(); // Store for filtering
        displayBarangays(allBarangays);
      } else if (response.status === 401) {
        localStorage.removeItem("token");
        window.location.href = "/";
      } else {
        console.error("Failed to fetch barangays");
        barangayList.innerHTML = "<p>Failed to load sitios. Please try again later.</p>";
      }
    } catch (error) {
      console.error("Error fetching barangays:", error);
      barangayList.innerHTML = "<p>An error occurred while loading sitios. Please try again later.</p>";
    }
  }

  function displayBarangays(barangays) {
    const table = document.createElement("table");
    table.className = "table table-striped table-hover glass-effect shadow-lg";
    table.innerHTML = `
      <thead>
          <tr class="text-center">
              <th>ID</th>
              <th>Sitio Name</th>
              <th>Address</th>
              <th>Population</th>
              <th>${userType == "Brgy. Admin" ? "Actions" : ""}</th>
          </tr>
      </thead>
      <tbody>
          ${barangays.map(barangay => `
              <tr class="text-center">
                  <td>${barangay.barangay_id}</td>
                  <td>${barangay.name}</td>
                  <td>${barangay.address}</td>
                  <td>${barangay.population}</td>
                  <td>
                    ${userType == "Brgy. Admin" ? `
                      <i class="fas fa-edit me-2 edit-icon" data-id="${barangay.barangay_id}" style="color: #28a745;" data-bs-toggle="tooltip" title="Edit Barangay"></i>
                      <i class="fas fa-trash delete-icon" data-id="${barangay.barangay_id}" style="color: #dc3545;" data-bs-toggle="tooltip" title="Delete Barangay"></i>
                    ` : ""}
                  </td>
              </tr>
          `).join("")}
      </tbody>
    `;

    barangayList.innerHTML = "";
    barangayList.appendChild(table);

    document.querySelectorAll(".edit-icon").forEach(editIcon => {
      editIcon.addEventListener("click", () => {
        const barangayId = editIcon.getAttribute("data-id");
        const barangay = barangays.find(b => b.barangay_id == barangayId);
        if (barangay) {
          setFormMethod("PUT");
          populateForm(barangay);
          modalInstance.show();
        }
      });
    });

    document.querySelectorAll(".delete-icon").forEach(deleteIcon => {
      deleteIcon.addEventListener("click", () => {
        const barangayId = deleteIcon.getAttribute("data-id");
        confirmDeleteBtn.dataset.barangayId = barangayId;
        const deleteModal = new bootstrap.Modal(document.getElementById("deleteBarangayConfirmationModal"));
        deleteModal.show();
      });
    });
  }

  function populateForm(barangay) {
    document.getElementById("barangayId").value = barangay.barangay_id;
    document.getElementById("barangayName").value = barangay.name;
    document.getElementById("barangayAddress").value = barangay.address;
    document.getElementById("barangayPopulation").value = barangay.population;
  }

  function printBarangays() {
    const printWindow = window.open("", "_blank");
    const table = document.querySelector("#barangayContainer table").cloneNode(true);

    const headers = table.querySelectorAll("th");
    const rows = table.querySelectorAll("tbody tr");

    if (headers.length > 0) {
      headers[headers.length - 1].remove();
    }
    rows.forEach(row => row.deleteCell(-1));

    const printContent = `
      <html>
        <head>
          <title>Sitio Data</title>
          <style>
            body { font-family: Arial, sans-serif; }
            table { border-collapse: collapse; width: 100%; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
          </style>
        </head>
        <body>
          <h3>Sitio Table</h3>
          ${table.outerHTML}
        </body>
      </html>
    `;

    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.print();
  }
});
