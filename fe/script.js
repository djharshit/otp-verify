// Define a function to load the configuration
function loadConfig () {
  return fetch('config.json').then((response) => {
    if (!response.ok) {
      throw new Error('Failed to load configuration')
    }
    return response.json()
  })
}

// Use the DOMContentLoaded event to ensure the DOM is fully loaded
document.addEventListener('DOMContentLoaded', (event) => {
  // Load the configuration first
  loadConfig()
    .then((config) => {
      // Print the apiUrl to the console
      console.log('API URL:', config.apiUrl)

      // Once the configuration is loaded, access `config.apiUrl`
      if (document.getElementById('emailForm')) {
        document
          .getElementById('emailForm')
          .addEventListener('submit', function (e) {
            e.preventDefault()
            const email = document.getElementById('email').value
            localStorage.setItem('email', email)
            // Use `config.apiUrl` in your fetch request
            fetch(`${config.apiUrl}/send`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({ email })
            })
              .then((response) => response.json())
              .then((data) => {
                alert('OTP sent. Please check your email.')
                window.location.href = 'verify.html'
              })
              .catch((error) => {
                console.error('Error:', error)
                alert('An error occurred. Please try again.')
              })
          })
      } else if (document.getElementById('otpForm')) {
        document
          .getElementById('otpForm')
          .addEventListener('submit', function (e) {
            e.preventDefault()
            const otp = document.getElementById('otp').value
            const email = localStorage.getItem('email')
            if (!email) {
              alert(
                'Email not found. Please go back and submit your email again.'
              )
              return
            }
            // Again, use `config.apiUrl` for your fetch request
            fetch(`${config.apiUrl}/verify`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({ otp, email })
            })
              .then((response) => response.json())
              .then((data) => {
                if (data.status == 'ok') {
                  alert('OTP verified successfully.')
                  window.location.href = 'index.html'
                } else {
                  alert('Invalid OTP. Please try again.')
                }
              })
              .catch((error) => {
                console.error('Error:', error)
                alert('An error occurred. Please try again.')
              })
          })
      }
    })
    .catch((error) => {
      console.error('Failed to load config:', error)
    })
})
