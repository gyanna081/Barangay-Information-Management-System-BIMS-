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
      allPersonnel = data;
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

    if (userType == "Brgy. Admin") {
      document.querySelectorAll(".edit-personnel").forEach((icon) => {
        icon.addEventListener("click", handleEditClick);
      });

      document.querySelectorAll(".delete-personnel").forEach((icon) => {
        icon.addEventListener("click", handleDeleteClick);
      });
    }
  };

  const handleEditClick = (event) => {
    const person = JSON.parse(event.target.getAttribute("data-personnel"));

    document.getElementById("first_name").value = person.first_name;
    document.getElementById("middle_name").value = person.middle_name || "";
    document.getElementById("last_name").value = person.last_name;
    document.getElementById("email").value = person.email;
    document.getElementById("birthDate").value = person.birth_date;
    document.getElementById("gender").value = person.gender;
    document.getElementById("address").value = person.address || "";
    document.getElementById("position").value = person.position || "";
    document.getElementById("username").value = person.username;
    document.getElementById("password").value = ""; // Clear password field
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

  document.getElementById("createPersonnelForm").addEventListener("submit", async (event) => {
    event.preventDefault();

    const form = event.target;
    const personnelId = form.getAttribute("data-personnel-id");
    const url = personnelId ? `/brgy/users/${personnelId}/` : "/brgy/users/";
    const method = personnelId ? "PUT" : "POST";

    const payload = {
      first_name: form.first_name.value,
      middle_name: form.middle_name.value || "",
      last_name: form.last_name.value,
      email: form.email.value,
      username: form.username.value,
      password: personnelId ? undefined : form.password.value, // Only send password for creation
      birth_date: form.birthDate.value,
      gender: form.gender.value,
      address: form.address.value || "",
      position: form.position.value || "",
    };

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to save personnel");
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

  fetchPersonnel();
});
