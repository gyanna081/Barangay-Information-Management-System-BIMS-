document.addEventListener("DOMContentLoaded", () => {
    const businessList = document.getElementById("businessContainer");
    const createBusinessForm = document.getElementById("createBusinessForm");
    const confirmDeleteBtn = document.getElementById("confirmDeleteBusinessBtn");
    const modalElement = document.getElementById("createBusinessModal");
    const modalInstance = new bootstrap.Modal(modalElement);
  
    // Add the print button event listener
    const printBusinessBtn = document.getElementById("printBusinessBtn");
    if (printBusinessBtn) {
      printBusinessBtn.addEventListener("click", () => {
        printBusinessData();
      });
    }
  
    fetchBusinesses();
  
    function setFormMethod(method) {
      createBusinessForm.dataset.method = method;
      if (method === "POST") {
        createBusinessForm.reset();
        document.getElementById("businessId").value = "";
        document.getElementById("createBusinessModalLabel").textContent = "Create Business";
        document.getElementById("formErrorMessage").classList.add("d-none");
      } else if (method === "PUT") {
        document.getElementById("createBusinessModalLabel").textContent = "Edit Business";
      }
    }
  
    modalElement.addEventListener("hidden.bs.modal", () => {
      setFormMethod("POST");
      createBusinessForm.reset();
    });
  
    createBusinessForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      const data = {
        id: document.getElementById("businessId").value,
        business_id: document.getElementById("businessId").value,
        business_name: document.getElementById("businessName").value,
        business_type: document.getElementById("businessType").value,
        permit_number: document.getElementById("permitNumber").value,
        date_issued: document.getElementById("dateIssued").value
      };
  
      const method = createBusinessForm.dataset.method || "POST";
      const url = method === "PUT" ? `/brgy/businesses/${data.id}/` : "/brgy/businesses/";
  
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
          fetchBusinesses();
          createBusinessForm.reset();
          document.getElementById("formErrorMessage").classList.add("d-none");
          modalInstance.hide();
        } else {
          const errorMsg = await response.json();
          document.getElementById("formErrorMessage").textContent = errorMsg.error || "Failed to save business.";
          document.getElementById("formErrorMessage").classList.remove("d-none");
        }
      } catch (error) {
        console.error("Error saving business:", error);
      }
    });
  
    confirmDeleteBtn.addEventListener("click", async () => {
      const businessId = confirmDeleteBtn.dataset.businessId;
      try {
        const response = await fetch(`/brgy/businesses/${businessId}/`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
  
        if (response.ok) {
          fetchBusinesses();
          const deleteModal = bootstrap.Modal.getInstance(document.getElementById("deleteBusinessConfirmationModal"));
          deleteModal.hide();
        } else {
          console.error("Failed to delete business");
        }
      } catch (error) {
        console.error("Error deleting business:", error);
      }
    });
  
    async function fetchBusinesses() {
      const token = localStorage.getItem("token");
      if (!token) {
        window.location.href = "/";
        return;
      }
  
      try {
        const response = await fetch("/brgy/businesses/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        if (response.ok) {
          const businesses = await response.json();
          console.log("Fetched businesses:", businesses); // Debugging line
          displayBusinesses(businesses);
        } else if (response.status === 401) {
          localStorage.removeItem("token");
          window.location.href = "/";
        } else {
          console.error("Failed to fetch businesses");
          businessList.innerHTML = "<p>Failed to load businesses. Please try again later.</p>";
        }
      } catch (error) {
        console.error("Error fetching businesses:", error);
        businessList.innerHTML = "<p>An error occurred while loading businesses. Please try again later.</p>";
      }
    }
  
    function displayBusinesses(businesses) {
      const table = document.createElement("table");
      table.className = "table table-striped table-hover glass-effect shadow-lg";
      table.innerHTML = `
        <thead>
            <tr class="text-center">
                <th>ID</th>
                <th>Business Name</th>
                <th>Type</th>
                <th>Permit Number</th>
                <th>Date Issued</th>
                <th>${userType == "Brgy. Admin" ? "Actions" : ""}</th>
            </tr>
        </thead>
        <tbody>
            ${businesses.map(business => `
                <tr class="text-center">
                    <td>${business.business_id}</td>
                    <td>${business.business_name}</td>
                    <td>${business.business_type}</td>
                    <td>${business.permit_number}</td>
                    <td>${business.date_issued}</td>
                    <td>
                      ${userType == "Brgy. Admin" ? `
                        <i class="fas fa-edit me-2 edit-icon" data-id="${business.id || ""}" style="color: #28a745;" data-bs-toggle="tooltip" title="Edit Business"></i>
                        <i class="fas fa-trash delete-icon" data-id="${business.id || ""}" style="color: #dc3545;" data-bs-toggle="tooltip" title="Delete Business"></i>
                      ` : ""}
                    </td>
                </tr>
            `).join("")}
        </tbody>
      `;
  
      businessList.innerHTML = "";
      businessList.appendChild(table);
  
      if (userType == "Brgy. Admin") {
        businesses.forEach(business => {
          const editIcon = document.querySelector(`.edit-icon[data-id="${business.id}"]`);
          const deleteIcon = document.querySelector(`.delete-icon[data-id="${business.id}"]`);
  
          if (editIcon) {
            editIcon.addEventListener("click", () => {
              setFormMethod("PUT");
              populateForm(business);
              modalInstance.show();
            });
          }
  
          if (deleteIcon) {
            deleteIcon.addEventListener("click", () => {
              confirmDeleteBtn.dataset.businessId = business.id;
              const deleteModal = new bootstrap.Modal(document.getElementById("deleteBusinessConfirmationModal"));
              deleteModal.show();
            });
          }
        });
      }
    }
  
    function populateForm(business) {
      document.getElementById("businessId").value = business.id || "";
      document.getElementById("businessName").value = business.business_name;
      document.getElementById("businessType").value = business.business_type;
      document.getElementById("permitNumber").value = business.permit_number;
      document.getElementById("dateIssued").value = business.date_issued;
    }
  
    function printBusinessData() {
      const printWindow = window.open("", "_blank");
      const table = document
        .querySelector("#businessContainer table")
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
            <title>Business Data</title>
            <style>
              body { font-family: Arial, sans-serif; }
              table { border-collapse: collapse; width: 100%; }
              th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
              th { background-color: #f2f2f2; }
            </style>
          </head>
          <body>
            <h3>Business Table</h3>
            ${table.outerHTML}
          </body>
        </html>
      `;
    
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.print();
    }
  });
  