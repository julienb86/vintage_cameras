let url = "http://localhost:3000/api/cameras/";


class DisplayCameras{
  constructor(productClass){
    this.productClass = productClass;
  }

   async fetchData(){
     try{
       let response = await fetch(url);
       let data = await response.json();
       return data;
     }catch{
       console.log(error);
     }
   }


  init(cameras){
    let html = '';
    for (let camera of cameras){
      let cardHtml =
      `
        <div class="card">
        <a href="html/product.html?id=${camera._id}">
          <img src="${camera.imageUrl}" alt="camera1">
          <div class="card-name d-flex flex-column align-items-center">
            <h2 class="text-center">${camera.name}</h2>
            <p>$ ${camera.price/100}</p>
        
        </div>
        </a>
        </div>`;
      html+= cardHtml;
    }
      const products = document.querySelector(this.productClass);
      products.innerHTML = html;    
  }

  async getData(){
    let cameras = await this.fetchData();
    this.init(cameras);
    var counterIcon = document.querySelector('.nav-counter');
    counterIcon.innerText = cart.cartIcon(); 
    }

/////////////////////////////////////////////////////////////////////////////////////////////

// fetch the url with the id returned
   async fetchOneCam(){
    var id = this.getUrlParams();
    let response = await fetch(url + id);
    let info = await response.json();
    return info;
  }


// create the html
    displayOneCam(getDetail){
      let lenses = this.numberOfLenses();
      let html = "";
      let cardHtml =
      `
        <div class="card">
          <img src="${getDetail.imageUrl}" alt="camera1">
            <div class="card-body">
              <h2 class="name">${getDetail.name}</h2>
              <p class="price">$ ${getDetail.price/100}</p>
              <h4>Description</h4>
              <p>${getDetail.description}</p>
              <label for="lenses">Choose a lense </label>
                <select id="lenses"></select>
            </div>
            <div class="card-footer">
              <button class="linkCart btn">Add To Cart</button>
            </div>
        </div>`;

      html+= cardHtml;
      const products = document.querySelector(this.productClass);
       products.innerHTML = html;
    }

// return the lenses
  async numberOfLenses(){
    let listHtml = "";
    var camera = await this.fetchOneCam();
    for (let lense of camera.lenses){
      let lenseItem =
      `
      <option id="lense" value="${lense}">${lense}</option>
      `
      listHtml+=lenseItem;
    }
      var listOfLenses = document.querySelector('#lenses');
      listOfLenses.innerHTML = listHtml;
  }

  // Query parameter
  getUrlParams(){
    var param = window.location.search;
    var newUrl = new URLSearchParams(param);
    return newUrl.get("id");
  }

  addBtnListener(){
    var this1 = this;
    var btn = document.querySelector('.linkCart');
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      var cart = new Cart();
      cart.addItem(this1.camData);
      window.location.reload();
    });
  }

//
  // Display one camera in html
    async getDataOneCam(){
      var getDetails = await this.fetchOneCam();
      this.camData = getDetails;
      this.displayOneCam(getDetails);
      this.addBtnListener();
      var counterIcon = document.querySelector('.nav-counter');
      counterIcon.innerText = cart.cartIcon(); 
    }
}


// ////////////////////////////////////////////////////////////////////////////
////////////////////////        CART              /////////////////////////////
///////////////////////////////////////////////////////////////////////////////


class Cart{
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
          <p class="col-1 name">${item.name}</p>
          <div class="col-4">
            <p class="price col-3">$ ${item.price/100}</p>
          </div>
          <input class="quantity col-2" type="number" value="1"/>
          <button data-id="${item._id}" class="remove btn">Remove</button>
        </div>
      `
            html+=cart;
    });
    var cartItems = document.querySelector('.cart-items');
    cartItems.innerHTML = html;
  }


/* remove item */
  removeItem(){
/*     var id = this.getCardId(); */
    let removeBtns = document.querySelectorAll('.remove');
    removeBtns.forEach(btn => btn.addEventListener("click", ()=>{
      let id = btn.dataset.id;
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
      if(this.cartItems <= 0){
        total = 0;
      }
    }
    var totalElt = document.querySelector('.total-cart');
    totalElt.innerText = "$ " + total;
    var counterIcon = document.querySelector('.nav-counter');
    counterIcon.innerText = this.cartIcon();
  }


/* get the number of cameras in the html */
cartIcon(){
  var itemsInCart = localStorage.getItem('cart-items');
  var json = JSON.parse(itemsInCart);
  return json.length;
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
        let id = item._id;
        productsArray.push(id);
      }
      return productsArray; 
    }

//   
  userData(){ 
    let submit = document.getElementById("submit-btn");
    let cartThis = this;

      submit.addEventListener("click", async (e)=> {
        let inputLastName = document.getElementById('inputLastName');
        let inputFirstName = document.getElementById('inputFirstName');
        let inputAddress = document.getElementById('inputAddress');
        let inputCity = document.getElementById('inputCity');
        let inputEmail = document.getElementById('inputEmail');
      e.preventDefault();
    var form = 
    {
      contact : {
        firstName: inputFirstName.value,
        lastName: inputLastName.value,
        address: inputAddress.value,
        city: inputCity.value,
        email: inputEmail.value
      },
      
       products: cartThis.arrayOfIds()

    };
    let formUser = await cartThis.makeRequest(form);
    console.log(formUser);
  
    cartThis.redirectToConfirmPage(formUser);
  });
}

  async makeRequest(data){
    try{
      const headers = new Headers();
      headers.append("Content-Type", "application/json");
      const options = {
        method: "POST",
        headers,
        body: JSON.stringify(data),
      };

      let response = await fetch("http://localhost:3000/api/cameras/order", options);

      const datas = await response.json();
      
      return datas;

    }catch (error){
      console.log(error);    
    }
  }

  redirectToConfirmPage(orderResponse){
    let confirmUrl = `confirm.html?orderId=${orderResponse.orderId}`;
    window.location = confirmUrl;
    }


 getOrder(){
    this.userData();
  }
}