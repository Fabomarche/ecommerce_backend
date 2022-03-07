document.getElementById('loginForm').addEventListener('submit', (e) => {
    e.preventDefault()
    const form = document.getElementById('loginForm')
    const formData = new FormData(form)

const user = {
    email: formData.get('email'),
    password: formData.get('password')
}

fetch('/session/login', {
    method: 'POST',
    body: JSON.stringify(user),
    headers: {
    'Content-Type': 'application/json'
    }
})
    .then(result => result.json())
    .then(response => { 
    if (response.status === 'success') {
        location.replace('../home.html')
    } else {
        Swal.fire({
        title: 'Error!',
        text: response.message,
        icon: 'error',
        })
    }
    })
})