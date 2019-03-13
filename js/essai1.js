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
    btn.addEventListener("click", () => {
      var cart = new Cart();
      cart.addItem(this1.camData);
    });
  }
  // Function setTimeout
  // btn.innerHTML = "";
  // var footer = document.querySelector('.card-footer');
  // var message = document.createElement("p");
  // message.textContent = "item has been added to your cart";
  // footer.appendChild(message);
  // setTimeOut(()=> {
  //   message.Remove();
  // }, 2000)

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
    this.cartItems.push(app.camData);
    console.log(this.cartItems);
    var json = localStorage.setItem('cart-items', JSON.stringify(app.camData));
  }


  getStorage(){
    var json = localStorage.getItem('cart-items');
    if (json) {
      this.cartItems = JSON.parse(json);
      return this.cartItems;
    }
  }

  showCart(){
    var camera = this.getStorage();
    let html = "";
      let cart =
      ` <div class="d-flex flex-row align-items-baseline">
            <p class="mr-auto p-2">${camera.name}</p>
            <p>${camera.price/100}$</p>
            <input type="text">
            <button class="remove btn btn-danger">Remove</button>
          </div>
      `
      html+=cart;
    const products = document.querySelector('.products');
    products.innerHTML = html;
  }

  removeItem(){
    var removeBtn = document.querySelector('.remove');
    removeBtn.addEventListener("click", ()=>{
      document.querySelector('.d-flex').innerHTML = "";
      localStorage.clear();
    })
  }
  displayCart(){
    this.showCart();
    this.removeItem();
  }

}
