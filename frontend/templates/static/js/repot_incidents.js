// report_incident.js

document.addEventListener("DOMContentLoaded", function () {
    const reportIncidentForm = document.querySelector('#reportIncidentModal form');

    if (reportIncidentForm) {
        reportIncidentForm.addEventListener('submit', function (event) {
            event.preventDefault(); // Prevent default form submission
            
            // Get form data
            const formData = new FormData(reportIncidentForm);

            // Send data to server using fetch API
            fetch(reportIncidentForm.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'X-Requested-With': 'XMLHttpRequest', // For CSRF protection
                },
            })
            .then(response => {
                if (response.ok) {
                    // Handle success (e.g., close modal, reset form)
                    alert('Incident reported successfully!');
                    $('#reportIncidentModal').modal('hide'); // Hide the modal
                    reportIncidentForm.reset(); // Reset form fields
                } else {
                    // Handle error (e.g., show error message)
                    return response.json().then(data => {
                        alert(data.error || 'An error occurred. Please try again.');
                    });
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('An error occurred. Please try again.');
            });
        });
    }
});
