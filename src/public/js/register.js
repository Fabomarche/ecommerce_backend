const form = document.getElementById('registerForm')
form.addEventListener('submit', (e) => {
    e.preventDefault()

    const formData = new FormData(form)

    const user = {
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        email: formData.get('email'),
        password: formData.get('password'),
        age: formData.get('age'),
        address: formData.get('address'),
        phone: formData.get('phone'),
        avatar: formData.get('avatar')
    }

    if (!user.firstName || !user.lastName || !user.email || !user.password || !user.age || user.avatar.size === 0) {
        Swal.fire({
        title: 'Error!',
        text: 'The fields have to be completed.',
        icon: 'error',
        })
    } else {
        fetch('/session/register', {
        method: 'POST',
        body: formData
        })
        .then(result => result.json())
        .then(response => {
            if (response.status === 'success') {
            form.reset()
            Swal.fire({
                title: 'Registered!',
                text: 'You have been successfully registered.',
                icon: 'success',
            })
            } else {
            Swal.fire({
                title: 'Error!',
                text: response.message,
                icon: 'error',
            })
            }
        })
    }
})

