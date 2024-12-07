document.addEventListener("DOMContentLoaded", () => {
  const complaintsList = document.getElementById("complaintContainer");
  const createComplaintForm = document.getElementById("createComplaintForm");
  const confirmDeleteBtn = document.getElementById("confirmDeleteComplaintBtn");
  const modalElement = document.getElementById("createComplaintModal");
  const modalInstance = new bootstrap.Modal(modalElement);
  const searchInput = document.getElementById("searchInput"); // Search input
  const filterStatus = document.getElementById("filterStatus"); // Filter dropdown
  let allComplaints = []; // Store all complaints for filtering

  // Add the print button event listener
  const printComplaintBtn = document.getElementById("printComplaintBtn");
  if (printComplaintBtn) {
    printComplaintBtn.addEventListener("click", printComplaintsData);
  }

  fetchComplaints();

  // Event listener for search
  searchInput.addEventListener("input", () => {
    const query = searchInput.value.toLowerCase();
    const filteredComplaints = allComplaints.filter(complaint =>
      complaint.incident_details.toLowerCase().includes(query) ||
      complaint.status.toLowerCase().includes(query)
    );
    displayComplaints(filteredComplaints);
  });

  // Event listener for filter
  filterStatus.addEventListener("change", () => {
    const status = filterStatus.value;
    const filteredComplaints = status
      ? allComplaints.filter(complaint => complaint.status === status)
      : allComplaints;
    displayComplaints(filteredComplaints);
  });

  function setFormMethod(method) {
    createComplaintForm.dataset.method = method;
    if (method === "POST") {
      createComplaintForm.reset();
      document.getElementById("complaintId").value = "";
      document.getElementById("createComplaintModalLabel").textContent = "Create Complaint";
      document.getElementById("formErrorMessage").classList.add("d-none");
    } else if (method === "PUT") {
      document.getElementById("createComplaintModalLabel").textContent = "Edit Complaint";
    }
  }

  modalElement.addEventListener("hidden.bs.modal", () => {
    setFormMethod("POST");
    createComplaintForm.reset();
  });

  createComplaintForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const data = {
      id: document.getElementById("complaintId").value,
      date_filed: document.getElementById("dateFiled").value,
      incident_date: document.getElementById("incidentDate").value,
      complaint_details: document.getElementById("complaintDetails").value,
      incident_details: document.getElementById("incidentDetails").value,
      status: document.getElementById("status").value,
    };

    const method = createComplaintForm.dataset.method || "POST";
    const url = method === "PUT" ? `/brgy/complaints/${data.id}/` : "/brgy/complaints/";

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
        fetchComplaints();
        createComplaintForm.reset();
        document.getElementById("formErrorMessage").classList.add("d-none");
        modalInstance.hide();
      } else {
        const errorMsg = await response.json();
        document.getElementById("formErrorMessage").textContent = errorMsg.error || "Failed to save complaint.";
        document.getElementById("formErrorMessage").classList.remove("d-none");
      }
    } catch (error) {
      console.error("Error saving complaint:", error);
    }
  });

  confirmDeleteBtn.addEventListener("click", async () => {
    const complaintId = confirmDeleteBtn.dataset.complaintId;
    try {
      const response = await fetch(`/brgy/complaints/${complaintId}/`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.ok) {
        fetchComplaints();
        const deleteModal = bootstrap.Modal.getInstance(document.getElementById("deleteComplaintConfirmationModal"));
        deleteModal.hide();
      } else {
        console.error("Failed to delete complaint");
      }
    } catch (error) {
      console.error("Error deleting complaint:", error);
    }
  });

  async function fetchComplaints() {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/";
      return;
    }

    try {
      const response = await fetch("/brgy/complaints/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        allComplaints = await response.json(); // Store for filtering
        displayComplaints(allComplaints);
      } else if (response.status === 401) {
        localStorage.removeItem("token");
        window.location.href = "/";
      } else {
        console.error("Failed to fetch complaints");
        complaintsList.innerHTML = "<p>Failed to load complaints. Please try again later.</p>";
      }
    } catch (error) {
      console.error("Error fetching complaints:", error);
      complaintsList.innerHTML = "<p>An error occurred while loading complaints. Please try again later.</p>";
    }
  }

  function displayComplaints(complaints) {
    const table = document.createElement("table");
    table.className = "table table-striped table-hover glass-effect shadow-lg";
    table.innerHTML = `
      <thead>
          <tr class="text-center">
              <th>ID</th>
              <th>Date Filed</th>
              <th>Incident Date</th>
              <th>Complaint Details</th>
              <th>Incident Details</th>
              <th>Status</th>
              <th>${userType === "Brgy. Admin" ? "Actions" : ""}</th>
          </tr>
      </thead>
      <tbody>
          ${complaints.map(complaint => `
              <tr class="text-center">
                  <td>${complaint.id}</td>
                  <td>${complaint.date_filed}</td>
                  <td>${complaint.incident_date}</td>
                  <td>${complaint.complaint_details}</td>
                  <td>${complaint.incident_details}</td>
                  <td>${complaint.status}</td>
                  <td>
                    ${userType === "Brgy. Admin" ? `
                      <i class="fas fa-edit me-2 edit-icon" data-id="${complaint.id}" style="color: #28a745;" data-bs-toggle="tooltip" title="Edit Complaint"></i>
                      <i class="fas fa-trash delete-icon" data-id="${complaint.id}" style="color: #dc3545;" data-bs-toggle="tooltip" title="Delete Complaint"></i>
                    ` : ""}
                  </td>
              </tr>
          `).join("")}
      </tbody>
    `;

    complaintsList.innerHTML = "";
    complaintsList.appendChild(table);

    document.querySelectorAll(".edit-icon").forEach(editIcon => {
      editIcon.addEventListener("click", () => {
        const complaintId = editIcon.getAttribute("data-id");
        const complaint = complaints.find(c => c.id == complaintId);
        if (complaint) {
          setFormMethod("PUT");
          populateForm(complaint);
          modalInstance.show();
        }
      });
    });

    document.querySelectorAll(".delete-icon").forEach(deleteIcon => {
      deleteIcon.addEventListener("click", () => {
        const complaintId = deleteIcon.getAttribute("data-id");
        confirmDeleteBtn.dataset.complaintId = complaintId;
        const deleteModal = new bootstrap.Modal(document.getElementById("deleteComplaintConfirmationModal"));
        deleteModal.show();
      });
    });
  }

  function populateForm(complaint) {
    document.getElementById("complaintId").value = complaint.id;
    document.getElementById("dateFiled").value = complaint.date_filed;
    document.getElementById("incidentDate").value = complaint.incident_date;
    document.getElementById("complaintDetails").value = complaint.complaint_details;
    document.getElementById("incidentDetails").value = complaint.incident_details;
    document.getElementById("status").value = complaint.status;
  }

  function printComplaintsData() {
    const printWindow = window.open("", "_blank");
    const table = document.querySelector("#complaintContainer table").cloneNode(true);

    const headers = table.querySelectorAll("th");
    const rows = table.querySelectorAll("tbody tr");

    if (headers.length > 0) {
      headers[headers.length - 1].remove();
    }
    rows.forEach(row => row.deleteCell(-1));

    const printContent = `
      <html>
        <head>
          <title>Complaints Data</title>
          <style>
            body { font-family: Arial, sans-serif; }
            table { border-collapse: collapse; width: 100%; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
          </style>
        </head>
        <body>
          <h3>Complaints Table</h3>
          ${table.outerHTML}
        </body>
      </html>
    `;

    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.print();
  }
});
