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


class Cart{
  constructor(){
    this.cartItems = [];
  }

  addItem(camData){
    var items = localStorage.getItem('cart-items');
    if(items != null){
      var json = JSON.parse(items);
      this.cartItems.push(json);
    }
    this.cartItems.push(camData);
    localStorage.setItem('cart-items', JSON.stringify(this.cartItems));
}


  // Function setTimeout
  message(){
    var body = document.querySelector('.card-footer');
    var message = document.createElement("p");
    message.textContent = "item has been added to your cart";
    var navbar = document.querySelector('.navbar');
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


  showCart(){
    var cameras = JSON.parse(localStorage.getItem('cart-items'));
    this.cartItems.push(cameras);
    let html = "";
    cameras.forEach(item => {
      let cart =
      ` <div class="d-flex flex-row align-items-baseline">
            <img src="${item.imageUrl}" height="75" width="75">
            <p class="mr-auto p-2">${item.name}</p>
            <p class="price">${item.price/100}</p>
            <input class="quantity" type="number" value="0">
            <button class="remove btn btn-danger">Remove</button>
            <div class="total">
              <p>Total: <span class="total-cart">0</span></p>
            </div>
          </div>
          <form>
            <div class="form-row row">
              <div class="form-group col-md-6">
                <label for="inputLastName">Last Name</label>
                <input type="text" autofocus="autofocus" class="form-control" id="inputLastName" minlength="3" placeholder="Last Name" required>
              </div>
              <div class="form-group col-md-6">
                <label for="inputFirstName">First Name</label>
                <input type="text" class="form-control" id="inputFirstName" minlength="3" placeholder="First Name" required>
              </div>
              <div class="form-group col-md-12">
                <label for="inputEmail">Email</label>
                <input type="text"  class="form-control" id="inputEmail" placeholder="Email" required>
              </div>
              <div class="form-group col-md-12">
                <label for="inputAddress">Address</label>
                <input type="text" class="form-control" id="inputAddress" minlength="3" placeholder="32st 32th" required>
              </div>
              <div class="form-group col-md-6">
                <label for="inputCity">City</label>
                <input type="text" class="form-control" id="inputCity" minlength="3" placeholder="City" required>
              </div>
              <div class="form-group col-md-3">
                <label for="inputZip">ZIP</label>
                <input type="text" class="form-control" id="inputZip"  placeholder="ZIP" required>
              </div>
            </div>
            <button type="submit" class="btn btn-primary btn-lg offset-md-5" id="submit-btn">Submit</button>
          </form>
      `
            html+=cart;
    });
    const products = document.querySelector('.products');
    products.innerHTML = html;
  }

  removeItem(){
    var removeBtns = document.querySelectorAll('.remove');
    removeBtns.forEach(btn => btn.addEventListener("click", ()=>{
      document.querySelector('.d-flex').innerHTML = "";
      localStorage.clear();
    }));
  }

  incrementQuantity(){
      var quantities = document.querySelectorAll('.quantity');
      quantities.forEach(quantity => quantity.addEventListener('change', (e) =>{
        var value = e.target.value;
        if(value <= 0){
            value = 1;
        }
        return value;
      }));
  }

  totalCart(){
    var total = document.querySelector('.total-cart');
    var price = document.querySelector('.price');
    var quantity = document.querySelector('.quantity');
    quantity.addEventListener('change', (e) => {
      var value = e.target.value;
      total.textContent =  value * price.textContent;
    });
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
      console.log(data);
    });
  }

  data(){
    var user = this.userData();
    this.makeRequest(user);
  }

// it sends post info from the user to the server
 // makeRequest(data){
 //      const settings = {
 //      method: 'POST',
 //      headers: {
 //          Accept: 'application/json',
 //          'Content-Type': 'application/json',
 //      }
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
      console.log(response);
      var datasDiv = document.querySelector('.data');
      datasDiv.textContent = response.email;
      // this.displayOrder(response);
    }catch(errorResponse){
      console.log(errorResponse);
    }
  }
}
