document.addEventListener("DOMContentLoaded", () => {
  const logoutBtn = document.getElementById("logout-btn");
  const residentsList = document.getElementById("residentContainer");
  const createResidentForm = document.getElementById("createResidentForm");
  const confirmDeleteBtn = document.getElementById("confirmDeleteBtn");
  const modalElement = document.getElementById("createResidentModal");
  const modalInstance = new bootstrap.Modal(modalElement);
  const printBtn = document.getElementById("printRecordBtn");
  const createResidentBtn = document.getElementById("createResidentBtn"); // New Button Reference

  let residentsData = [];

  // Logout button functionality
  if (logoutBtn) {
    logoutBtn.addEventListener("click", (event) => {
      event.preventDefault();
      localStorage.removeItem("token");
      window.location.href = "/";
    });
  }

  // Fetch residents on page load
  fetchResidents();

  // Set form method (POST or PUT)
  function setFormMethod(method) {
    createResidentForm.dataset.method = method;

    if (method === "POST") {
      createResidentForm.reset();
      document.getElementById("residentId").value = "";
      document.getElementById("createResidentModalLabel").textContent =
          "Create Resident";
      document.getElementById("formErrorMessage").classList.add("d-none");
    } else if (method === "PUT") {
      document.getElementById("createResidentModalLabel").textContent =
          "Edit Resident";
    }
  }

  // Reset form when modal is closed
  modalElement.addEventListener("hidden.bs.modal", () => {
    setFormMethod("POST");
    createResidentForm.reset();
  });

  // Handle form submission
  createResidentForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const formData = new FormData(createResidentForm);
    const data = Object.fromEntries(formData.entries());
    const method = createResidentForm.dataset.method || "POST";
    const residentId = document.getElementById("residentId").value; // Get resident ID for PUT
    const url =
        method === "PUT" ? `/brgy/residents/${residentId}/` : "/brgy/residents/";

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
        fetchResidents();
        createResidentForm.reset();
        document.getElementById("formErrorMessage").classList.add("d-none");
        modalInstance.hide();
      } else {
        const errorMsg = await response.json();
        document.getElementById("formErrorMessage").textContent =
            errorMsg.error || "Failed to save resident.";
        document.getElementById("formErrorMessage").classList.remove("d-none");
      }
    } catch (error) {
      console.error("Error saving resident:", error);
    }
  });

  // Confirm delete resident
  confirmDeleteBtn.addEventListener("click", async () => {
    const residentId = confirmDeleteBtn.dataset.residentId;
    try {
      const response = await fetch(`/brgy/residents/${residentId}/`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.ok) {
        fetchResidents();
        const modal = bootstrap.Modal.getInstance(
            document.getElementById("deleteConfirmationModal")
        );
        modal.hide();
      } else {
        console.error("Failed to delete resident");
      }
    } catch (error) {
      console.error("Error deleting resident:", error);
    }
  });

  // Fetch residents from the backend
  async function fetchResidents() {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/";
      return;
    }

    try {
      const response = await fetch("/brgy/residents/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        residentsData = await response.json();
        displayResidents(residentsData);
      } else if (response.status === 401) {
        localStorage.removeItem("token");
        window.location.href = "/";
      } else {
        console.error("Failed to fetch residents");
        residentsList.innerHTML =
            "<p>Failed to load residents. Please try again later.</p>";
      }
    } catch (error) {
      console.error("Error fetching residents:", error);
      residentsList.innerHTML =
          "<p>An error occurred while loading residents. Please try again later.</p>";
    }
  }

  // Display residents in the table
  function displayResidents(residents) {
    const table = document.createElement("table");
    table.className = "table table-striped table-hover glass-effect shadow-lg";
    table.innerHTML = `
      <thead>
        <tr class="text-center">
          <th>ID</th>
          <th>Name</th>
          <th>Birth Date</th>
          <th>Gender</th>
          <th>Civil Status</th>
          <th>Contact Number</th>
          <th>Address</th>
          <th>${userType === "Brgy. Admin" ? "Actions" : ""}</th>
        </tr>
      </thead>
      <tbody>
        ${residents
        .map(
            (resident) => `
            <tr class="text-center">
              <td>${resident.id}</td>
              <td>${resident.first_name} ${resident.middle_name || ""} ${
                resident.last_name
            }</td>
              <td>${resident.birth_date}</td>
              <td>${resident.gender}</td>
              <td>${resident.civil_status}</td>
              <td>${resident.contact_number}</td>
              <td>${resident.address}</td>
              <td>
                ${
                userType === "Brgy. Admin"
                    ? `
                  <i class="fas fa-edit me-2 edit-icon" data-id="${
                        resident.id
                    }" style="color: #28a745;" title="Edit Resident"></i>
                  <i class="fas fa-trash delete-icon" data-id="${
                        resident.id
                    }" style="color: #dc3545;" title="Delete Resident"></i>
                `
                    : ""
            }
              </td>
            </tr>
          `
        )
        .join("")}
      </tbody>
    `;

    residentsList.innerHTML = "";
    residentsList.appendChild(table);

    if (userType === "Brgy. Admin") {
      document.querySelectorAll(".edit-icon").forEach((editIcon) => {
        editIcon.addEventListener("click", () => {
          const residentId = editIcon.dataset.id;
          const resident = residentsData.find((r) => r.id == residentId);
          setFormMethod("PUT");
          populateForm(resident);
          modalInstance.show();
        });
      });

      document.querySelectorAll(".delete-icon").forEach((deleteIcon) => {
        deleteIcon.addEventListener("click", () => {
          confirmDeleteBtn.dataset.residentId = deleteIcon.dataset.id;
          const modal = new bootstrap.Modal(
              document.getElementById("deleteConfirmationModal")
          );
          modal.show();
        });
      });
    }
  }

  // Populate form for editing a resident
  function populateForm(resident) {
    document.getElementById("residentId").value = resident.id || "";
    document.getElementById("firstName").value = resident.first_name || "";
    document.getElementById("middleName").value = resident.middle_name || "";
    document.getElementById("lastName").value = resident.last_name || "";
    document.getElementById("birthDate").value = resident.birth_date || "";
    document.getElementById("gender").value = resident.gender || "";
    document.getElementById("civilStatus").value = resident.civil_status || "";
    document.getElementById("contactNumber").value =
        resident.contact_number || "";
    document.getElementById("address").value = resident.address || "";
  }

  // Print residents data
  function printResidentsData() {
    const printWindow = window.open("", "_blank");
    const table = document
        .querySelector("#residentContainer table")
        .cloneNode(true);

    const headers = table.querySelectorAll("th");
    const rows = table.querySelectorAll("tbody tr");

    headers[headers.length - 1].remove();
    rows.forEach((row) => row.deleteCell(-1));

    const printContent = `
      <html>
        <head>
          <title>Residents Data</title>
          <style>
            body { font-family: Arial, sans-serif; }
            table { border-collapse: collapse; width: 100%; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
          </style>
        </head>
        <body>
          <h3>Residents Table</h3>
          ${table.outerHTML}
        </body>
      </html>
    `;

    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.print();
  }

  // Add event listener for print button
  if (printBtn) {
    printBtn.addEventListener("click", printResidentsData);
  }

  // Add event listener for create button
  if (createResidentBtn) {
    createResidentBtn.addEventListener("click", () => {
      setFormMethod("POST");
    });
  }
});
