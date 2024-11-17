# BRGY-Python-django

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
    ```bash
    update the role of the super user
    ```


