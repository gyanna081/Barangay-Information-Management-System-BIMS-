document.addEventListener("DOMContentLoaded", () => {
  const personnelContainer = document.getElementById("personnelContainer");
  const searchInput = document.getElementById("searchInput");
  const filterPosition = document.getElementById("filterPosition");

  let allPersonnel = [];

  const fetchPersonnel = async () => {
    try {
      const response = await fetch("/brgy/users/");
      if (!response.ok) {
        throw new Error("Failed to fetch personnel");
      }
      const data = await response.json();
      allPersonnel = data; // Store all personnel data for filtering and search
      renderPersonnel(allPersonnel);
    } catch (error) {
      console.error("Error fetching personnel:", error);
      personnelContainer.innerHTML =
        '<div class="alert alert-danger" role="alert">Failed to load personnel data.</div>';
    }
  };

  const renderPersonnel = (personnel) => {
    if (personnel.length === 0) {
      personnelContainer.innerHTML = "<p>No personnel found.</p>";
      return;
    }

    const table = document.createElement("table");
    table.className = "table table-striped table-hover glass-effect shadow-lg";
    table.innerHTML = `
      <thead>
        <tr class="text-center">
          <th>ID</th>
          <th>Name</th>
          <th>Email</th>
          <th>Position</th>
          <th>Birth Date</th>
          <th>Gender</th>
          <th>Username</th>
          <th>Address</th>
          <th>${userType == "Brgy. Admin" ? "Actions" : ""}</th>
        </tr>
      </thead>
      <tbody>
        ${personnel
          .map(
            (person) => `
          <tr class="text-center">
            <td>${person.id}</td>
            <td>${person.first_name} ${person.middle_name || ""} ${
              person.last_name
            }</td>
            <td>${person.email}</td>
            <td>${person.position || "-"}</td>
            <td>${person.birth_date}</td>
            <td>${person.gender}</td>
            <td>${person.username}</td>
            <td>${person.address || "-"}</td>
            <td>
              ${
                userType == "Brgy. Admin"
                  ? `
              <i class="fas fa-edit me-2 edit-personnel" data-personnel='${JSON.stringify(
                person
              )}' style="color: #28a745;" data-bs-toggle="tooltip" data-bs-placement="top" title="Edit Personnel"></i>
              <i class="fas fa-trash delete-personnel" data-personnel-id="${
                person.id
              }" style="color: #dc3545;" data-bs-toggle="tooltip" data-bs-placement="top" title="Delete Personnel"></i>
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

    personnelContainer.innerHTML = "";
    personnelContainer.appendChild(table);

    // Attach event listeners for edit and delete icons
    if (userType == "Brgy. Admin") {
      document.querySelectorAll(".edit-personnel").forEach((icon) => {
        icon.addEventListener("click", handleEditClick);
      });

      document.querySelectorAll(".delete-personnel").forEach((icon) => {
        icon.addEventListener("click", handleDeleteClick);
      });
    }

    // Initialize Bootstrap tooltips
    const tooltipTriggerList = [].slice.call(
      document.querySelectorAll('[data-bs-toggle="tooltip"]')
    );
    tooltipTriggerList.map((tooltipTriggerEl) => new bootstrap.Tooltip(tooltipTriggerEl));
  };

  const handleSearchAndFilter = () => {
    const searchTerm = searchInput.value.toLowerCase();
    const positionFilter = filterPosition.value;

    const filteredPersonnel = allPersonnel.filter((person) => {
      const matchesSearch =
        person.first_name.toLowerCase().includes(searchTerm) ||
        person.middle_name?.toLowerCase().includes(searchTerm) ||
        person.last_name.toLowerCase().includes(searchTerm) ||
        person.position?.toLowerCase().includes(searchTerm);

      const matchesFilter =
        !positionFilter || person.position === positionFilter;

      return matchesSearch && matchesFilter;
    });

    renderPersonnel(filteredPersonnel);
  };

  const handleEditClick = (event) => {
    const person = JSON.parse(event.target.getAttribute("data-personnel"));

    document.getElementById("first_name").value = person.first_name;
    document.getElementById("middle_name").value = person.middle_name;
    document.getElementById("last_name").value = person.last_name;
    document.getElementById("email").value = person.email;
    document.getElementById("birthDate").value = person.birth_date;
    document.getElementById("gender").value = person.gender;
    document.getElementById("address").value = person.address;
    document.getElementById("position").value = person.position;
    document.getElementById("username").value = person.username;
    document.getElementById("password").value = person.password;
    document.getElementById("password").disabled = true;

    document.getElementById("createPersonnelModalLabel").textContent =
      "Edit Personnel";
    document.querySelector(
      '#createPersonnelForm button[type="submit"]'
    ).textContent = "Update";

    document
      .getElementById("createPersonnelForm")
      .setAttribute("data-personnel-id", person.id);

    const modal = new bootstrap.Modal(
      document.getElementById("createPersonnelModal")
    );
    modal.show();
  };

  const handleDeleteClick = (event) => {
    const personnelId = event.target.getAttribute("data-personnel-id");
    document
      .getElementById("confirmDeleteBtn")
      .setAttribute("data-personnel-id", personnelId);
    const modal = new bootstrap.Modal(
      document.getElementById("deleteConfirmationModal")
    );
    modal.show();
  };

  const deletePersonnel = async (personnelId) => {
    try {
      const response = await fetch(`/brgy/users/${personnelId}/`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete personnel");
      }

      alert("Personnel deleted successfully");
      fetchPersonnel().then(renderPersonnel);
    } catch (error) {
      console.error("Error:", error);
      alert(error.message);
    }
  };

  document.getElementById("confirmDeleteBtn").addEventListener("click", (event) => {
    const personnelId = event.target.getAttribute("data-personnel-id");
    deletePersonnel(personnelId);
    const modal = bootstrap.Modal.getInstance(
      document.getElementById("deleteConfirmationModal")
    );
    modal.hide();
  });

  searchInput.addEventListener("input", handleSearchAndFilter);
  filterPosition.addEventListener("change", handleSearchAndFilter);

  fetchPersonnel();
});

document.getElementById("createPersonnelForm").addEventListener("submit", async (event) => {
  event.preventDefault();
  const first_name = document.getElementById("first_name").value;
  const middle_name = document.getElementById("middle_name").value;
  const last_name = document.getElementById("last_name").value;
  const email = document.getElementById("email").value;
  const birthDate = document.getElementById("birthDate").value;
  const gender = document.getElementById("gender").value;
  const address = document.getElementById("address").value;
  const position = document.getElementById("position").value;
  const personnelId = event.target.getAttribute("data-personnel-id");
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  const url = personnelId ? `/brgy/users/${personnelId}/` : "/brgy/users/";
  const method = personnelId ? "PUT" : "POST";

  try {
    const response = await fetch(url, {
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        first_name,
        middle_name,
        last_name,
        email,
        username,
        password,
        birth_date: birthDate,
        gender,
        address,
        position,
      }),
    });

    if (!response.ok) {
      throw new Error(
        personnelId
          ? "Failed to update personnel"
          : "Failed to create personnel"
      );
    }

    alert(
      personnelId
        ? "Personnel updated successfully"
        : "Personnel created successfully"
    );
    location.reload();
  } catch (error) {
    console.error("Error:", error);
    alert(error.message);
  }
});

// Reset modal form when hidden
document.getElementById("createPersonnelModal").addEventListener("hidden.bs.modal", () => {
  document.getElementById("createPersonnelModalLabel").textContent =
    "Create Personnel";
  document.querySelector(
    '#createPersonnelForm button[type="submit"]'
  ).textContent = "Submit";
  document
    .getElementById("createPersonnelForm")
    .removeAttribute("data-personnel-id");
  document.getElementById("createPersonnelForm").reset();

  const passwordField = document.getElementById("password");
  passwordField.disabled = false;
});

// Print functionality
const printPersonnelData = () => {
  const printWindow = window.open("", "_blank");
  const personnelTable = document
    .querySelector("#personnelContainer table")
    .cloneNode(true);

  personnelTable
    .querySelectorAll("thead th:last-child, tbody td:last-child")
    .forEach((el) => el.remove());

  const printContent = `
    <html>
      <head>
        <title>Personnel Data</title>
        <style>
          body { font-family: Arial, sans-serif; }
          table { border-collapse: collapse; width: 100%; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f2f2f2; }
        </style>
      </head>
      <body>
        <h3>Personnel Table</h3>
        ${personnelTable.outerHTML}
      </body>
    </html>
  `;

  printWindow.document.write(printContent);
  printWindow.document.close();
  printWindow.print();
};

document
  .getElementById("printRecordBtn")
  .addEventListener("click", printPersonnelData);
