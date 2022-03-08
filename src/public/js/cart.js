let userName = document.getElementById('userName')
let avatar = document.getElementById('avatar')
let email = document.getElementById('email')
let carrito = document.getElementById('carrito')
const socket = io()

//-----------Socket Events------------//
// socket.on('deliverProducts', data => {
//     fetch('templates/productsTable.handlebars')
//     .then(string => string.text())
//     .then(template => {
//         const processedTemplate = Handlebars.compile(template)
//         const templateObj = {
//             products:data
//         }
//         const html = processedTemplate(templateObj)
//         let div = document.getElementById('productTable')
//         div.innerHTML = html
//     })
// })

//-----------Fin Socket Events-----------//

fetch('/session/current').then(response => response.json())
.then(data => {
    userName.innerHTML = data.firstName
})

fetch('/session/current').then(response => response.json())
.then(data => {
        console.log(data.cart)
        data.cart.map( product => {
        console.log(product)
        fetch(`/products/${product.id}`)
        .then(resp => resp.json())
        .then(data => {
            console.log(data)
            carrito.innerHTML += `<div class="card w-25 text-center m-1 shadow">
                                    <h3>${data.title}</h3>
                                    <p>price: ${data.price}</p>
                                    <img src=${data.thumbnail} alt="">
                                </div>`
        })
    })
})
