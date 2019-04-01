
// ////////////////////////////////////////////////////////////////////////////
////////////////////////        CART              /////////////////////////////
///////////////////////////////////////////////////////////////////////////////


export default class Cart{
    constructor(){
      this.cartItems = [];
    }
  
    addItem(camData){
      var items = localStorage.getItem('cart-items');
      var exist = false;
      if(items !== null){
        this.cartItems = JSON.parse(items);
      }
      for (let cart of this.cartItems){
        if (cart._id === camData._id){
          alert("You have already added this camera to your cart :)");
          exist = true;
          break;
        }
      }
      if (!exist){
        this.cartItems.push(camData);
        this.message();
        localStorage.setItem('cart-items', JSON.stringify(this.cartItems));
      }
    }
  
  
    // Function setTimeout when a card is added to the cart
    message(){
      var body = document.querySelector('.card-footer');
      var message = document.createElement("p");
      message.textContent = "item has been added to your cart";
      body.appendChild(message);
      setTimeout(()=> {
        message.style.display = "none";
      }, 2000)
    }
  
  
  // display the cards
    showCart(){
      var jsonitems = localStorage.getItem('cart-items');
      if (jsonitems !== null) {
        this.cartItems = JSON.parse(jsonitems);
      }
      let html = "";
      this.cartItems.forEach(item => {
        let cart =
        `
          <div class="row content d-flex align-items-center">
            <img class="col-2" src="${item.imageUrl}" height="75" width="75"/>
            <p class="col-1 name" data-id="${item._id}">${item.name}</p>
            <div class="col-4">
              <p class="price col-3">$ ${item.price/100}</p>
            </div>
            <input class="quantity col-2" type="number" value="1"/>
            <button class="remove btn">Remove</button>
          </div>
        `
              html+=cart;
      });
      const products = document.querySelector('.products');
      var cartItems = document.querySelector('.cart-items');
      products.appendChild(cartItems);
      cartItems.innerHTML = html;
    }
  
  
  /* remove item */
    removeItem(){
      var id = this.getCardId();
      var removeBtns = document.querySelectorAll('.remove');
      removeBtns.forEach(btn => btn.addEventListener("click", ()=>{
        var itemIndex = -1;
        for (let i = 0; i < this.cartItems.length; i++){
          if(this.cartItems[i]._id === id){
            itemIndex = i;
            break;
          }
        }
          if(itemIndex > -1){
            this.cartItems.splice(itemIndex, 1);
            localStorage.setItem('cart-items', JSON.stringify(this.cartItems));
            this.totalCart();
            this.displayCart();
          }
        }));
      }
  
    /* get the id of the camera */
    getCardId(){
      var nameElt = document.querySelector(".name");
      var id = nameElt.dataset.id;
      return id;
    }
  
    incrementQuantity(){
        var quantities = document.querySelectorAll('.quantity');
        quantities.forEach(quantity => quantity.addEventListener('change', (e) =>{
          var input = e.target;
          if(isNaN(input.value) || input.value <= 0){
              input.value = 1;
          }
          this.totalCart();
        }));
      }
  
  // update the total element
    totalCart(){
      var container = document.querySelector('.cart-items');
      var cards = container.querySelectorAll('.content');
      var total = 0;
      for(let card of cards){
        var prices = card.querySelector('.price');
        var price = prices.textContent;
        var newPrice = price.slice(1).trim();
        var quantities = card.querySelector('.quantity');
        var quantity = quantities.value;
        total += (newPrice * quantity);
      }
      var totalElt = document.querySelector('.total-cart');
      totalElt.innerText = "$ " + total;
      var counterIcon = document.querySelector('.nav-counter');
      counterIcon.innerText = this.cartIcon();
    }
  
  
  /* get the number of cameras in the html */
  cartIcon(){
    var numberOfCameras = this.cartItems.length;
    return numberOfCameras;
  }
  
  
  
  //display the cameras choosen by the user and the form to submit the order
    displayCart(){
      this.showCart();
      this.removeItem();
      this.incrementQuantity();
      this.totalCart();
    }
  
  
  
  ////////////////////////////////////////////////////////////////////////////////////
  // ////////////////////////POST REQUEST FOR THE ORDER PAGE//////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////
  
      /* array of the ids */
      arrayOfIds(){
        let productsArray = [];
        let items = this.cartItems;
        for (let item of items){
          let id = (item._id);
          productsArray.push(id);
        }
        return productsArray; 
      }
  
  //   // when the users clicks on submit button it returns an object with the users info.
    userData(){
      let inputLastName = document.getElementById('inputLastName');
      let inputFirstName = document.getElementById('inputFirstName');
      let inputAddress = document.getElementById('inputAddress');
      let inputCity = document.getElementById('inputCity');
      let inputEmail = document.getElementById('inputEmail');
      let submit = document.getElementById("submit-btn");
        submit.addEventListener("click", (e)=> {
        e.preventDefault();
      const form = 
      {
        contact : {
          firstName: inputFirstName.value,
          lastName: inputLastName.value,
          address: inputAddress.value,
          city: inputCity.value,
          email: inputEmail.value
        },
        
         products: this.arrayOfIds()
  
      };
      this.makeRequest(form);
      
    });
  }
  
    async makeRequest(data){
      const headers = new Headers();
      headers.append("Content-Type", "application/json");
      const options = {
        method: "POST",
        headers,
        body: JSON.stringify(data),
      };
      const response = await fetch("http://localhost:3000/api/cameras/order", options);
  
      const datas = await response.json();
  
      this.displayOrder(datas);
    }
  
  
    urlConfirmPage(){
      let url = window.location.search;
      const newUrl = new URLSearchParams(url);
      return newUrl.set("page", "confirm.html");
    }
  
  
    displayOrder(post){
       const confirmElt = document.querySelector(".confirm");
       let html = "";
       const orderHtml = 
       `
       <p>Thank you ${post.contact.firstName} ${post.contact.lastName} for your order</p>
  
        <p>Here is your id confirmation : ${post.orderId}</p>
  
        <a href="../index.html" class="btn">Continue Shopping</a>
  
       `
       html += orderHtml;
       confirmElt.innerHTML = html;
    }
  
  
    async getOrder(){
     this.userData();
    }
  }