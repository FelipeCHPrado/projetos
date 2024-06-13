const menu = document.getElementById("menu")
const cartBtn = document.getElementById("cart-btn")
const cartModal = document.getElementById("cart-modal")
const cartItemsContainer = document.getElementById("cart-items")
const cartTotal = document.getElementById("cart-total")
const checkoutBtn = document.getElementById("checkout-btn")
const closeModalBtn = document.getElementById("close-modal-btn")
const cartCounter = document.getElementById("cart-count")
const addressInput = document.getElementById("address")
const addressWarn = document.getElementById("address-warn")

let cart = [];

// abrir modal do carrinho
cartBtn.addEventListener("click", function() {
    updateCartModal()
    cartModal.style.display = "flex"
})

// fechar modal quando clicar fora
cartModal.addEventListener("click", function(event){
    if (event.target === cartModal){
        cartModal.style.display = "none"
    }
})

closeModalBtn.addEventListener("click", function() {
    cartModal.style.display = "none"
})

// adicionar no carrinho
menu.addEventListener("click", function(event) {
    
    let parentButton = event.target.closest(".add-to-cart-btn")
    if (parentButton){
        const name = parentButton.getAttribute("data-name")
        const price = parseFloat(parentButton.getAttribute("data-price"))

        // adicionar no carrinho
        addToCart(name,price)
    }
})

// funçao adicionar no carrinho
function addToCart(name, price){

    const isOpen = checkRestaurantOpen()
    if(!isOpen){
        Toastify({
            text: "Ops! O restaurante está fechado!",
            duration: 2500,
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "right", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
              background: "#ef4444",
            },
          }).showToast();
        return
    }

    const existingItem = cart.find(item => item.name === name)

    if (existingItem){  
        existingItem.quantity += 1;
        return
    }else{
        cart.push({
            name,
            price,
            quantity: 1,
        })
    }

    updateCartModal()
    
}

// atualiza o carrinho
function updateCartModal(){
    cartItemsContainer.innerHTML = "";
    let total = 0;

    cart.forEach(item => {
      const cartItemElement = document.createElement("div")
      cartItemElement.classList.add("flex", "justify-between", "mb-4", "flex-col")
      
      cartItemElement.innerHTML = `
        <div class="flex items-center justify-between">
            <div>
                <p class="font-medium">${item.name}</p>
                <p>Quantidade: ${item.quantity}</p>
                <p class="font-medium mt-2">Total: R$ ${item.price.toFixed(2)}</p>

            </div>

            <button class="remove-from-cart-btn" data-name="${item.name}">
                Remover
            </button>

        </div>        
    `

    total += item.quantity * item.price
        
    cartItemsContainer.appendChild(cartItemElement)

    })

    cartTotal.textContent = total.toLocaleString("pt-BR", {
        style:"currency",
        currency:"BRL"
    })


    cartCounter.innerText= cart.length
}

// funçao para remover o item do carrinho
cartItemsContainer.addEventListener("click", function(event) {
    if (event.target.classList.contains("remove-from-cart-btn")){
        const name = event.target.getAttribute("data-name")

        removeItemCard(name)
    }
})

function removeItemCard(name){
    const index = cart.findIndex(item => item.name === name)

    if (index !== -1){
        const item = cart[index]
        
        if (item.quantity > 1){
            item.quantity -= 1
            updateCartModal()
            return
        }

        cart.splice(index, 1)
        updateCartModal()
    }  
}

// pegar endereço
addressInput.addEventListener("input", function(event){
    let inputValue = event.target.value

    if (inputValue !== ""){
        addressInput.classList.remove("border-red-500")
        addressWarn.classList.add("hidden")
    }  
})

// finalizar carrinho
checkoutBtn.addEventListener("click", function(){
    if (cart.length === 0) return
    if(addressInput.value === ""){
        addressWarn.classList.remove("hidden")
        addressInput.classList.add("border-red-500")
        return
    }

    //enviar pelo whatsapp
    const cartItems = cart.map((item) => {
        return (
            `*${item.name}*\nQuantidade: ${item.quantity}\nPreço: R$ ${item.price.toFixed(2)}\n`
        )
    }).join("\n")

    const message = encodeURIComponent(cartItems + "\n\nEndereço: " + addressInput.value);
    const phone = "54991367097"
    
    window.open(`https://wa.me/${phone}?text=${message}`, "_blank")  
    
    cart = []
    updateCartModal()
})

// verificar se está aberto ou fechado
function checkRestaurantOpen(){
    const data = new Date()
    const hora = data.getHours()
    return hora >= 18 && hora < 22
}

const footer = document.getElementById("footer")

const spanItem =document.getElementById("date-span")
const isOpen = checkRestaurantOpen()

if(isOpen){
    spanItem.classList.remove("bg-red-500")
    spanItem.classList.add("bg-green-600")

}else{
    spanItem.classList.add("bg-red-500")
    spanItem.classList.remove("bg-green-600")
    footer.classList.add("hidden")
}