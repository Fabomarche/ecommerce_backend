let userName = document.getElementById('userName')
let avatar = document.getElementById('avatar')
let email = document.getElementById('email')
const socket = io()

//-----------Socket Events------------//
socket.on('deliverProducts', data => {
    fetch('templates/productsTable.handlebars')
    .then(string => string.text())
    .then(template => {
        const processedTemplate = Handlebars.compile(template)
        const templateObj = {
            products:data
        }
        const html = processedTemplate(templateObj)
        let div = document.getElementById('productTable')
        div.innerHTML = html
    })
})

//-----------Fin Socket Events-----------//

fetch('/session/current').then(response => response.json())
.then(data => {
    userName.innerHTML = data.firstName
    avatar.innerHTML = `<img src="./avatars/${data.avatar}" class="w-25" alt="">`
    email.innerHTML = data.email
    console.log(data)
})
