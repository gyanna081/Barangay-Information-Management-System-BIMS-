document.addEventListener("DOMContentLoaded", () => {
  const householdContainer = document.getElementById("householdContainer");
  const searchInput = document.getElementById("searchInput"); // Search input
  const filterMembers = document.getElementById("filterMembers"); // Filter dropdown
  let allHouseholds = []; // Store all households for filtering

  const fetchHouseholds = async () => {
    try {
      const response = await fetch("/brgy/households/");
      if (!response.ok) {
        throw new Error("Failed to fetch households");
      }
      const data = await response.json();
      allHouseholds = data; // Store for filtering
      return data;
    } catch (error) {
      console.error("Error fetching households:", error);
      householdContainer.innerHTML =
        '<div class="alert alert-danger" role="alert">Failed to load household data.</div>';
    }
  };

  const renderHouseholds = (households) => {
    if (households.length === 0) {
      householdContainer.innerHTML = "<p>No households found.</p>";
      return;
    }

    const table = document.createElement("table");
    table.className = "table table-striped table-hover glass-effect shadow-lg";
    table.innerHTML = `
      <thead>
        <tr class="text-center">
          <th>ID</th>
          <th>Household ID</th>
          <th>Household Head</th>
          <th>Number of Members</th>
          <th>${userType == "Brgy. Admin" ? "Actions" : ""}</th>
        </tr>
      </thead>
      <tbody>
        ${households
          .map(
            (household) => `
          <tr class="text-center">
            <td>${household.id}</td>
            <td>${household.household_number}</td>
            <td>${household.household_head}</td>
            <td>${household.number_of_members}</td>
            <td>
              ${
                userType == "Brgy. Admin"
                  ? `
                <i class="fas fa-edit me-2 edit-household" data-household='${JSON.stringify(
                  household
                )}' style="color: #28a745;" data-bs-toggle="tooltip" data-bs-placement="top" title="Edit Household"></i>
                <i class="fas fa-trash delete-household" data-household-id="${
                  household.id
                }" style="color: #dc3545;" data-bs-toggle="tooltip" data-bs-placement="top" title="Delete Household"></i>
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

    householdContainer.innerHTML = "";
    householdContainer.appendChild(table);

    if (userType == "Brgy. Admin") {
      document.querySelectorAll(".edit-household").forEach((icon) => {
        icon.addEventListener("click", handleEditClick);
      });

      document.querySelectorAll(".delete-household").forEach((icon) => {
        icon.addEventListener("click", handleDeleteClick);
      });
    }

    const tooltipTriggerList = [].slice.call(
      document.querySelectorAll('[data-bs-toggle="tooltip"]')
    );
    const tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
      return new bootstrap.Tooltip(tooltipTriggerEl);
    });
  };

  const handleEditClick = (event) => {
    const household = JSON.parse(event.target.getAttribute("data-household"));

    document.getElementById("householdNumber").value =
      household.household_number;
    document.getElementById("householdHead").value = household.household_head;
    document.getElementById("numberOfMembers").value =
      household.number_of_members;

    document.getElementById("createHouseholdModalLabel").textContent =
      "Edit Household";
    document.querySelector(
      '#createHouseholdForm button[type="submit"]'
    ).textContent = "Update";

    document
      .getElementById("createHouseholdForm")
      .setAttribute("data-household-id", household.id);

    const modal = new bootstrap.Modal(
      document.getElementById("createHouseholdModal")
    );
    modal.show();
  };

  const handleDeleteClick = (event) => {
    const householdId = event.target.getAttribute("data-household-id");
    document
      .getElementById("confirmDeleteBtn")
      .setAttribute("data-household-id", householdId);
    const modal = new bootstrap.Modal(
      document.getElementById("deleteConfirmationModal")
    );
    modal.show();
  };

  const deleteHousehold = async (householdId) => {
    try {
      const response = await fetch(`/brgy/households/${householdId}/`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete household");
      }

      alert("Household deleted successfully");
      fetchHouseholds().then(renderHouseholds);
    } catch (error) {
      console.error("Error:", error);
      alert(error.message);
    }
  };

  // Event listener for search input
  searchInput.addEventListener("input", () => {
    const query = searchInput.value.toLowerCase();
    const filteredHouseholds = allHouseholds.filter(
      (household) =>
        household.household_number.toLowerCase().includes(query) ||
        household.household_head.toLowerCase().includes(query)
    );
    renderHouseholds(filteredHouseholds);
  });

  // Event listener for filter dropdown
  filterMembers.addEventListener("change", () => {
    const filter = filterMembers.value;
    const filteredHouseholds = allHouseholds.filter((household) => {
      if (filter === "small") return household.number_of_members <= 3;
      if (filter === "medium")
        return household.number_of_members >= 4 && household.number_of_members <= 6;
      if (filter === "large") return household.number_of_members >= 7;
      return true; // No filter applied
    });
    renderHouseholds(filteredHouseholds);
  });

  fetchHouseholds().then(renderHouseholds);
});

const printHouseholdData = () => {
  const printWindow = window.open("", "_blank");
  const householdTable = document
    .querySelector("#householdContainer table")
    .cloneNode(true);

  const headers = householdTable.querySelectorAll("th");
  const rows = householdTable.querySelectorAll("tbody tr");
  headers[headers.length - 1].remove();
  rows.forEach((row) => row.deleteCell(-1));

  const printContent = `
    <html>
      <head>
        <title>Household Data</title>
        <style>
          body { font-family: Arial, sans-serif; }
          table { border-collapse: collapse; width: 100%; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f2f2f2; }
        </style>
      </head>
      <body>
        <h3>Household Table</h3>
        ${householdTable.outerHTML}
      </body>
    </html>
  `;

  printWindow.document.write(printContent);
  printWindow.document.close();
  printWindow.print();
};

document
  .getElementById("printRecordBtn")
  .addEventListener("click", printHouseholdData);
