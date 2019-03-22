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
          <img src="${camera.imageUrl}" alt="camera1">
          <div class="card-name d-flex flex-column align-items-center">
            <h2 class="text-center">${camera.name}</h2>
            <p>${camera.price/100}$</p>
            <a href="html/product.html?id=${camera._id}" class="btn">Details</a>
          </div>
        </div>`;
      html+= cardHtml;
    }
      const products = document.querySelector(this.productClass);
      products.innerHTML = html;
  }

  async getData(){
    let cameras = await this.fetchData();
    this.init(cameras);
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
              <p class="price">${getDetail.price/100}$</p>
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
      cart.message();
      cart.addItem(this1.camData);
      // cart.priceIcon();
    });
  }

  // Display one camera in html
    async getDataOneCam(){
      var getDetails = await this.fetchOneCam();
      this.camData = getDetails;
      this.displayOneCam(getDetails);
      this.addBtnListener();
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
    if(items !== null){
      this.cartItems = JSON.parse(items);
    }
    this.checkIfSameCard(camData);
    this.cartItems.push(camData);
    localStorage.setItem('cart-items', JSON.stringify(this.cartItems));
}

checkIfSameCard(camData){
  for (let cart of this.cartItems){
    if (cart._id === camData._id){
      alert("You have already added this card :)");
      // localStorage.setItem('cart-items', cart);
    }
  }
}

  // Function setTimeout
  message(){
    var body = document.querySelector('.card-footer');
    var message = document.createElement("p");
    message.textContent = "item has been added to your cart";
    body.appendChild(message);
    setTimeout(()=> {
      message.style.display = "none";
    }, 2000)
  }

  // get the amount in the cart icon
  priceIcon(){
    var cartIcon = document.querySelector('.nav-counter');
    cartIcon.textContent = (app.camData.price/100)+'$';
    localStorage.setItem("cart-price", cartIcon.textContent);
    localStorage.getItem("cart-price");
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
          <p class="col-1">${item.name}</p>
          <div class="col-3">
            <p class="price col-3">${item.price/100}</p>
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

  removeItem(){
    var removeBtns = document.querySelectorAll('.remove');
    var container = document.querySelectorAll('.content');
    removeBtns.forEach(btn => btn.addEventListener("click", ()=>{
      btn.parentElement.remove(this.container);
      this.totalCart();
      // localStorage.removeItem('cart-items', this.cartItems.splice(this.camData, this.camData));
      // need to remove item from localStorage
    }));
}

// removeItemLocalStorage(){
//   for(let cart of this.cartItems){
// }
//   }

  incrementQuantity(){
      var quantities = document.querySelectorAll('.quantity');
      quantities.forEach(quantity => quantity.addEventListener('change', (e) =>{
        var input = e.target;
        console.log(input);
        if(isNaN(input.value) || input.value <= 0){
            input.value = 1;
        }
        this.totalCart();
      }));

  }

// update the total element
  totalCart(){
    var container = document.querySelector('.cart-items');
    var cards = container.getElementsByClassName('content');
    var total = 0;
    for(let card of cards){
      var prices = card.querySelector('.price');
      var price = prices.textContent;
      var quantities = card.querySelector('.quantity');
      var quantity = quantities.value;
      total += (price * quantity);
    }
    var totalElt = document.querySelector('.total-cart');
    totalElt.innerText = total;
}


//display the cameras choosen by the user and the form to submit the order
  displayCart(){
    this.showCart();
    this.removeItem();
    this.incrementQuantity();
    this.totalCart();
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
    const form = {
      firstName: inputFirstName.value,
      lastName: inputLastName.value,
      address: inputAddress.value,
      city: inputCity.value,
      email: inputEmail.value
      // const arrayProducts = []; id of the products: strings
    }
    this.makeRequest(form);
  });
}

  makeRequest(data){
    return new Promise((resolve, reject)=>{
      let request = new XMLHttpRequest();
      request.open('POST', "http://localhost:3000/api/cameras/order");
      request.onreadystatechange = () =>{
        if(request.readyState === 4){
          if(request.status === 201){
            resolve(JSON.parse(request.response));
          }else{
          reject(JSON.parse(request.response));
          }
        }
      };
      request.setRequestHeader('Content-Type', 'application/json');
      request.send(JSON.stringify(data));
    });
  }


// it sends post info from the user to the server
 // makeRequest(data){

 //      const settings = {
 //      method: 'POST',
 //      headers: {
 //          Accept: 'application/json',
 //          'Content-Type': 'application/json',
 //      }
 // body
 //    }
 //      let response = fetch(url + "order", settings );
 //      let data = response.json();
 //      return data;
 //  }


// get the data back from the server
  async submitFormData(post){
    try{
      const requestPromise = this.makeRequest(post);
      const response = await requestPromise;
      this.displayOrder(response);
      console.log(this.displayOrder(response));
    }catch(errorResponse){
      console.log(errorResponse);
    }
  }

  // display the data from the server
  displayOrder(data){
    let html = "";
    let orderHtml =
    `<div>
      <p>${data.email}</p>
    </div>`;
    html += orderHtml;
    const products = document.querySelector('.products');
    products.innerHTML = html;
  }

  async getOrder(){
    await this.submitFormData();
    this.displayOrder();
  }
}
