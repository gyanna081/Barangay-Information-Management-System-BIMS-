document.addEventListener("DOMContentLoaded", () => {
  const householdContainer = document.getElementById("householdContainer");
  const confirmDeleteBtn = document.getElementById("confirmDeleteBtn");
  const createHouseholdForm = document.getElementById("createHouseholdForm");
  const createHouseholdModal = document.getElementById("createHouseholdModal");
  const modalInstance = new bootstrap.Modal(createHouseholdModal);
  let allHouseholds = [];

  const fetchHouseholds = async () => {
    try {
      const response = await fetch("/brgy/households/");
      if (!response.ok) throw new Error("Failed to fetch households");
      const data = await response.json();
      allHouseholds = data;
      renderHouseholds(data);
    } catch (error) {
      console.error("Error fetching households:", error);
      householdContainer.innerHTML =
          '<div class="alert alert-danger">Failed to load household data.</div>';
    }
  };

  const renderHouseholds = (households) => {
    if (!households || households.length === 0) {
      householdContainer.innerHTML = "<p>No households found.</p>";
      return;
    }

    const table = document.createElement("table");
    table.className = "table table-striped table-hover glass-effect shadow-lg";
    table.innerHTML = `
      <thead>
        <tr class="text-center">
          <th>ID</th>
          <th>Household Number</th>
          <th>Household Head</th>
          <th>Number of Members</th>
          <th>Actions</th>
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
              <i class="fas fa-edit me-2 edit-household" data-id="${household.id}" style="color: #28a745;" title="Edit Household"></i>
              <i class="fas fa-trash delete-household" data-id="${household.id}" style="color: #dc3545;" title="Delete Household"></i>
            </td>
          </tr>
        `
        )
        .join("")}
      </tbody>
    `;
    householdContainer.innerHTML = "";
    householdContainer.appendChild(table);

    document.querySelectorAll(".edit-household").forEach((icon) => {
      icon.addEventListener("click", handleEditClick);
    });
    document.querySelectorAll(".delete-household").forEach((icon) => {
      icon.addEventListener("click", handleDeleteClick);
    });
  };

  const handleEditClick = async (event) => {
    const householdId = event.target.dataset.id;
    const household = allHouseholds.find((item) => item.id === parseInt(householdId));

    if (household) {
      document.getElementById("householdNumber").value = household.household_number;
      document.getElementById("householdHead").value = household.household_head;
      document.getElementById("numberOfMembers").value = household.number_of_members;

      createHouseholdForm.setAttribute("data-id", household.id);
      modalInstance.show();
    }
  };

  const handleDeleteClick = (event) => {
    const householdId = event.target.dataset.id;
    confirmDeleteBtn.dataset.id = householdId;
    const deleteModal = new bootstrap.Modal(
        document.getElementById("deleteConfirmationModal")
    );
    deleteModal.show();
  };

  confirmDeleteBtn.addEventListener("click", async () => {
    const householdId = confirmDeleteBtn.dataset.id;
    try {
      const response = await fetch(`/brgy/households/${householdId}/`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete household");
      alert("Household deleted successfully");
      fetchHouseholds();
    } catch (error) {
      console.error("Error deleting household:", error);
      alert(error.message);
    }
  });

  createHouseholdForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const householdId = createHouseholdForm.getAttribute("data-id");
    const url = householdId
        ? `/brgy/households/${householdId}/`
        : "/brgy/households/";
    const method = householdId ? "PUT" : "POST";

    const payload = {
      household_number: document.getElementById("householdNumber").value,
      household_head: document.getElementById("householdHead").value,
      number_of_members: document.getElementById("numberOfMembers").value,
    };

    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      if (!response.ok)
        throw new Error(
            method === "PUT"
                ? "Failed to update household"
                : "Failed to create household"
        );
      alert(
          method === "PUT"
              ? "Household updated successfully"
              : "Household created successfully"
      );
      modalInstance.hide();
      fetchHouseholds();
    } catch (error) {
      console.error("Error saving household:", error);
      alert(error.message);
    }
  });

  fetchHouseholds();
});
