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
      <div class="card" style="width: 18rem;">
        <a href="html/product.html?id=${camera._id}" class="link text-decoration-none">
        <img src="${camera.imageUrl}" class="card-img-top" alt="product-img">
        <div class="card-body">
          <h5 class="card-title card-name d-flex flex-column align-items-center">${camera.name}</h5>
          <p class="card-text text-center">$ ${camera.price/100}</p>
        </a>
        </div>
      </div>

`;
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
      <div class="card mb-3" style="max-width: 100%;">
      <div class="row no-gutters">
        <div class="col-md-4">
          <img src="${getDetail.imageUrl}" class="card-img" alt="camera1">
        </div>
        <div class="col-md-8">
          <div class="card-body">
            <h5 class="card-title name">${getDetail.name}</h5>
            <p class="card-text price">$ ${getDetail.price/100}</p>
            <h4>Description</h4>
            <p class="card-text">${getDetail.description}</p>
            <label for="lenses">Choose a lense </label>
            <select id="lenses"></select>
          </div>
          <div class="card-footer d-flex justify-content-center">
           <button class="linkCart btn ">Add To Cart</button>
          </div>
        </div>
      </div>
    </div>
        `;

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
/*       this.message(); */
      localStorage.setItem('cart-items', JSON.stringify(this.cartItems));

    }
  }


  // Function setTimeout when a card is added to the cart
  message(){
    var body = document.querySelector('body');
    var message = document.createElement("p");
    message.id = "message";
    message.textContent = "the item has been successfully added to your cart";
    body.insertAdjacentElement("beforeBegin", message);
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
        <div class="card content">
           <img src="${item.imageUrl}" class="card-img-top" style="max-width: 100%;" >
           <div class="card-body">
             <h5 class="card-title name">${item.name}</h5>
             <p class="card-text price">$ ${item.price/100}</p>
             <input class="quantity col-12" type="number" value="1"/>
           </div>
           <div class="card-footer">
              <button data-id="${item._id}" class="remove btn">Remove</button>
           </div>
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
