document.addEventListener("DOMContentLoaded", () => {
  const clearancesList = document.getElementById("clearanceContainer");
  const createClearanceForm = document.getElementById("createClearanceForm");
  const confirmDeleteBtn = document.getElementById("confirmDeleteClearanceBtn");
  const modalElement = document.getElementById("createClearanceModal");
  const modalInstance = new bootstrap.Modal(modalElement);

  // Add the print button event listener
  const printClearanceBtn = document.getElementById("printClearanceBtn");
  if (printClearanceBtn) {
      printClearanceBtn.addEventListener("click", printClearancesData);
  }

  fetchClearances();

  function setFormMethod(method) {
      createClearanceForm.dataset.method = method;
      if (method === "POST") {
          createClearanceForm.reset();
          document.getElementById("clearanceId").value = "";
          document.getElementById("createClearanceModalLabel").textContent = "Create Clearance";
          document.getElementById("formErrorMessage").classList.add("d-none");
      } else if (method === "PUT") {
          document.getElementById("createClearanceModalLabel").textContent = "Edit Clearance";
      }
  }

  modalElement.addEventListener("hidden.bs.modal", () => {
      setFormMethod("POST");
      createClearanceForm.reset();
  });

  createClearanceForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      const data = {
          clearance_id: document.getElementById("clearanceId").value,
          name: document.getElementById("name").value,
          dob: document.getElementById("dob").value,
          gender: document.getElementById("gender").value,
      };

      const method = createClearanceForm.dataset.method || "POST";
      const url = method === "PUT" ? `/brgy/clearances/${data.clearance_id}/` : "/brgy/clearances/";

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
              fetchClearances();
              modalInstance.hide();
          } else {
              const errorMsg = await response.json();
              document.getElementById("formErrorMessage").textContent = errorMsg.error || "Failed to save clearance.";
              document.getElementById("formErrorMessage").classList.remove("d-none");
          }
      } catch (error) {
          console.error("Error saving clearance:", error);
      }
  });

  confirmDeleteBtn.addEventListener("click", async () => {
      const clearanceId = confirmDeleteBtn.dataset.clearanceId;
      try {
          const response = await fetch(`/brgy/clearances/${clearanceId}/`, {
              method: "DELETE",
              headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
          });

          if (response.ok) {
              fetchClearances();
              const deleteModal = bootstrap.Modal.getInstance(document.getElementById("deleteClearanceConfirmationModal"));
              deleteModal.hide();
          } else {
              console.error("Failed to delete clearance");
          }
      } catch (error) {
          console.error("Error deleting clearance:", error);
      }
  });

  async function fetchClearances() {
      const token = localStorage.getItem("token");
      if (!token) {
          window.location.href = "/";
          return;
      }

      try {
          const response = await fetch("/brgy/clearances/", {
              headers: {
                  Authorization: `Bearer ${token}`,
              },
          });

          if (response.ok) {
              const clearances = await response.json();
              displayClearances(clearances);
          } else if (response.status === 401) {
              localStorage.removeItem("token");
              window.location.href = "/";
          } else {
              console.error("Failed to fetch clearances");
              clearancesList.innerHTML = "<p>Failed to load clearances. Please try again later.</p>";
          }
      } catch (error) {
          console.error("Error fetching clearances:", error);
          clearancesList.innerHTML = "<p>An error occurred while loading clearances. Please try again later.</p>";
      }
  }

  function displayClearances(clearances) {
      const table = document.createElement("table");
      table.className = "table table-striped table-hover glass-effect shadow-lg";
      table.innerHTML = `
          <thead>
              <tr class="text-center">
                  <th>ID</th>
                  <th>Name</th>
                  <th>Date of Birth</th>
                  <th>Gender</th>
                  <th>${userType === "Brgy. Admin" ? "Actions" : ""}</th>
              </tr>
          </thead>
          <tbody>
              ${clearances.map(clearance => `
                  <tr class="text-center">
                      <td>${clearance.clearance_id}</td>
                      <td>${clearance.name}</td>
                      <td>${clearance.dob}</td>
                      <td>${clearance.gender}</td>
                      <td>
                        ${userType === "Brgy. Admin" ? `
                          <i class="fas fa-edit me-2 edit-icon" data-id="${clearance.clearance_id}" style="color: #28a745;" data-bs-toggle="tooltip" title="Edit Clearance"></i>
                          <i class="fas fa-trash delete-icon" data-id="${clearance.clearance_id}" style="color: #dc3545;" data-bs-toggle="tooltip" title="Delete Clearance"></i>
                        ` : ""}
                      </td>
                  </tr>
              `).join("")}
          </tbody>
      `;

      clearancesList.innerHTML = "";
      clearancesList.appendChild(table);

      if (userType === "Brgy. Admin") {
          clearances.forEach(clearance => {
              const editIcon = document.querySelector(`.edit-icon[data-id="${clearance.clearance_id}"]`);
              const deleteIcon = document.querySelector(`.delete-icon[data-id="${clearance.clearance_id}"]`);

              if (editIcon) {
                  editIcon.addEventListener("click", () => {
                      setFormMethod("PUT");
                      populateForm(clearance);
                      modalInstance.show();
                  });
              }

              if (deleteIcon) {
                  deleteIcon.addEventListener("click", () => {
                      confirmDeleteBtn.dataset.clearanceId = clearance.clearance_id;
                      const deleteModal = new bootstrap.Modal(document.getElementById("deleteClearanceConfirmationModal"));
                      deleteModal.show();
                  });
              }
          });
      }
  }

  function populateForm(clearance) {
      document.getElementById("clearanceId").value = clearance.clearance_id;
      document.getElementById("name").value = clearance.name;
      document.getElementById("dob").value = clearance.dob;
      document.getElementById("gender").value = clearance.gender;
  }

  function printClearancesData() {
      const printWindow = window.open("", "_blank");
      const table = document.querySelector("#clearanceContainer table").cloneNode(true);

      const headers = table.querySelectorAll("th");
      const rows = table.querySelectorAll("tbody tr");

      if (headers.length > 0) {
          headers[headers.length - 1].remove();
      }
      rows.forEach(row => row.deleteCell(-1));

      const printContent = `
          <html>
              <head>
                  <title>Clearances Data</title>
                  <style>
                      body { font-family: Arial, sans-serif; }
                      table { border-collapse: collapse; width: 100%; }
                      th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                      th { background-color: #f2f2f2; }
                  </style>
              </head>
              <body>
                  <h3>Clearances Table</h3>
                  ${table.outerHTML}
              </body>
          </html>
      `;

      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.print();
  }
});
