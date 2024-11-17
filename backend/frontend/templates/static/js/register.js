document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('register-form');

  form.addEventListener('submit', async function (event) {
      event.preventDefault(); // Prevent default submission
      console.log("Form submission prevented"); // Log for debugging

      const formData = new FormData(form);
      const submitButton = form.querySelector('button[type="submit"]');

      submitButton.disabled = true; // Disable the button to prevent multiple submissions

      try {
          const data = {};
          formData.forEach((value, key) => {
              data[key] = value;
          });

          // Check if passwords match
          if (data.password !== data.confirm_password) {
              alert('Passwords do not match!');
              submitButton.disabled = false;
              return;
          }

          console.log('Sending data:', JSON.stringify(data)); // Log data for debugging

          const response = await fetch('/brgy/users/', {
              method: 'POST',
              headers: {
                  "Content-Type": "application/json",
              },
              body: JSON.stringify(data)
          });

          console.log('Response:', response); // Log the response

          if (response.ok) {
              alert('Registration successful!');
              window.location.href = '/'; // Redirect to a success page
          } else {
              const errorData = await response.json();
              alert('Error: ' + errorData.message);
          }
      } catch (error) {
          console.error('Error:', error);
          alert('An error occurred. Please try again.');
      } finally {
          submitButton.disabled = false; // Re-enable the button
      }
  });
});
