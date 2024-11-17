document.addEventListener("DOMContentLoaded", () => {
  const logoutBtn = document.getElementById("logout-btn");
  const residentsList = document.getElementById("residentContainer");
  const createResidentForm = document.getElementById("createResidentForm");
  const confirmDeleteBtn = document.getElementById("confirmDeleteBtn");
  const modalElement = document.getElementById("createResidentModal");
  const modalInstance = new bootstrap.Modal(modalElement);

  fetchResidents();

  logoutBtn.addEventListener("click", (event) => {
    event.preventDefault();
    localStorage.removeItem("token");
    window.location.href = "/";
  });

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

  modalElement.addEventListener("hidden.bs.modal", () => {
    setFormMethod("POST");
    createResidentForm.reset();
  });

  createResidentForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const formData = new FormData(createResidentForm);
    const data = Object.fromEntries(formData.entries());
    const method = createResidentForm.dataset.method || "POST";
    const url =
      method === "PUT" ? `/brgy/residents/${data.id}/` : "/brgy/residents/";

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
        const residents = await response.json();
        displayResidents(residents);
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
              <th> ${userType == "Brgy. Admin" ? "Actions" : ""}</th>
          </tr>
      </thead>
      <tbody>
          ${residents
            .map(
              (resident) => `
              <tr class="text-center">
                  <td>${resident.id}</td>
                  <td>${resident.first_name} ${resident.middle_name} ${
                resident.last_name
              }</td>
                  <td>${resident.birth_date}</td>
                  <td>${resident.gender}</td>
                  <td>${resident.civil_status}</td>
                  <td>${resident.contact_number}</td>
                  <td>${resident.address}</td>
                  <td>
                    ${
                      userType == "Brgy. Admin"
                        ? `
                      <i class="fas fa-edit me-2 edit-icon" data-id="${resident.id}" style="color: #28a745;" data-bs-toggle="tooltip" data-bs-placement="top" title="Edit Resident"></i>
                      <i class="fas fa-trash delete-icon" data-id="${resident.id}" style="color: #dc3545;" data-bs-toggle="tooltip" data-bs-placement="top" title="Delete Resident"></i>
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

    if (userType == "Brgy. Admin") {
      residents.forEach((resident) => {
        const editIcon = document.querySelector(
          `.edit-icon[data-id="${resident.id}"]`
        );
        const deleteIcon = document.querySelector(
          `.delete-icon[data-id="${resident.id}"]`
        );

        if (editIcon) {
          editIcon.addEventListener("click", () => {
            setFormMethod("PUT");
            populateForm(resident);
            modalInstance.show();
          });
        }

        if (deleteIcon) {
          deleteIcon.addEventListener("click", () => {
            confirmDeleteBtn.dataset.residentId = resident.id;
            const modal = new bootstrap.Modal(
              document.getElementById("deleteConfirmationModal")
            );
            modal.show();
          });
        }
      });
    }

    const tooltipTriggerList = [].slice.call(
      document.querySelectorAll('[data-bs-toggle="tooltip"]')
    );
    const tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
      return new bootstrap.Tooltip(tooltipTriggerEl);
    });
  }

  function populateForm(resident) {
    document.getElementById("residentId").value = resident.id;
    document.getElementById("firstName").value = resident.first_name;
    document.getElementById("middleName").value = resident.middle_name;
    document.getElementById("lastName").value = resident.last_name;
    document.getElementById("birthDate").value = resident.birth_date;
    document.getElementById("gender").value = resident.gender;
    document.getElementById("civilStatus").value = resident.civil_status;
    document.getElementById("contactNumber").value = resident.contact_number;
    document.getElementById("address").value = resident.address;
  }

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

  const printBtn = document.getElementById("printRecordBtn");
  if (printBtn) {
    printBtn.addEventListener("click", printResidentsData);
  }
});
