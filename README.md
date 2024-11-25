# Barangay Information Management System (BIMS) Features
![Python](https://img.shields.io/badge/Python-3.9%2B-blue)
![Django](https://img.shields.io/badge/Django-4.0-green)
![React](https://img.shields.io/badge/React-17.0-blue)

## Features Overview

The **Barangay Information Management System (BIMS)** provides an efficient and user-friendly interface for managing barangay-related data. Below is an overview of its features:

### 1. Residents Management
**Purpose:** Track and manage data about residents within the barangay.

**Features:**
- Add, edit, and delete resident records.
- Search and filter residents by specific criteria.

---

### 2. Households Management
**Purpose:** Group residents into households and manage household-related data.

**Features:**
- View all households within the barangay.
- Add, edit, and delete household records.
- Generate reports for households.

---

### 3. Barangay Officials and Staff Management
**Purpose:** Maintain records of barangay officials and staff.

**Features:**
- Add, edit, and delete official and staff details.
- Assign roles and responsibilities.

---

### 4. Complaints Management
**Purpose:** Manage complaints filed by residents.

**Features:**
- File new complaints.
- Update the status of complaints (e.g., pending, resolved).
- Track complaints history.

---

### 5. Sitio Management
**Purpose:** Organize and manage data for sitios (smaller areas within the barangay).

**Features:**
- View a list of all sitios with details like ID, Sitio Name, Address, and Population.
- **Actions Available:**
  - Edit Sitio details.
  - Delete a Sitio.
  - Add new sitios.
  - Print Sitio details for reporting purposes.

---

### 6. Document Management (Clearances)
**Purpose:** Streamline the issuance of barangay clearances and other documents.

**Features:**
- Generate and print barangay clearances.
- Track issued clearances.
- Customize clearance templates.

---

### 7. Population Management (Barangay)
**Purpose:** Track the barangay population and its distribution.

**Features:**
- View and analyze population data.
- Generate demographic reports.

---

## Key Interface Features

- **User Dashboard:** Displays an overview of barangay activities and statistics.
- **Navigation Menu:** Provides easy access to Residents, Households, Sitio Management, and other modules.
- **Search and Filter:** Quickly find records in all modules using the search bar and filter options.
- **Responsive Design:** Accessible on desktop and mobile devices.

---

## User Roles

### Admin (e.g., Barangay Captain)
- Full access to all modules and functionalities.
- Create, edit, delete records and manage complaints.

### Staff
- Limited access based on assigned roles.
- Perform specific tasks like updating records or generating reports.

---

## Technologies Used

- **Frontend:** HTML, CSS, JavaScript (React for UI components).
- **Backend:** Python (Django framework).
- **Database:** Firebase or Google Cloud for data storage.
- **Other Tools:** Figma for UI design references.

---

## Links

- **Gantt Chart:** [View here](https://cebuinstituteoftechnology-my.sharepoint.com/:x:/g/personal/geannaricci_pacana_cit_edu/Ef_6t0V0L5xIrbo-nFWUYRwBE-ALFo-Mt81vwhgoaGq4Kw?e=7dE9V7)
- **UI/UX Design:** [View here](https://www.figma.com/design/cGeJra3y2jRemYDJfZQise/System-UI%2FUX?node-id=0-1)
- **ERD:** [View here](https://lucid.app/lucidchart/12304d27-045f-4494-a284-0830d7ddd8ae/edit?viewport_loc=718%2C144%2C1233%2C631%2C0_0&invitationId=inv_12ac53d9-1b79-44bb-a6d1-d866e6a50d95)

---

## Getting Started

Follow these steps to set up and run the project locally.

### Prerequisites

Ensure you have the following installed on your system:
- Python
- Django
- Virtualenv

### Backend Setup

1. Clone the repository and navigate to the project directory:
    ```bash
    cd BRGY-Python-django
    ```

2. Navigate to the backend directory:
    ```bash
    cd backend
    ```

3. Create a virtual environment:
    ```bash
    python -m venv venv
    ```

4. Activate the virtual environment:
   - On Windows:
        ```bash
        venv\Scripts\activate
        ```
   - On MacOS/Linux:
        ```bash
        source venv/bin/activate
        ```

5. Install the required dependencies:
    ```bash
    pip install -r requirements.txt
    ```

6. Apply the database migrations:
    ```bash
    python manage.py makemigrations
    python manage.py migrate
    ```

7. Create a superuser to access the Django admin interface:
    ```bash
    python manage.py createsuperuser
    ```
   Follow the prompts to enter a username, email, and password for the superuser.

8. Run the development server:
    ```bash
    python manage.py runserver
    ```

9. Access the admin interface by navigating to `{server}/admin` in your web browser and log in with your superuser account.

10. Update the role of the superuser as required.

--- 

