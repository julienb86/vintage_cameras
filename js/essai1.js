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
              <h2 class="name">${getDetail.name}</h2>
              <p class="price">${getDetail.price/100}$</p>
              <p>${getDetail.description}</p>
              <label for="lenses">Lenses</label>
                <select id="lenses">
                  ${lenses}
               </select>
              <button class="linkCart btn btn-primary">Add To Cart</button>
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

// Display one camera in html
  async getDataOneCam(){
    var getDetails = await this.fetchOneCam();
    this.displayOneCam(getDetails);
  }

  // Query parameter
    getUrlParams(){
      var param = window.location.search;
      var newUrl = new URLSearchParams(param);
      return newUrl.get("id");
    }

    async setStorage(){
      var cartItems = [];
      await this.fetchOneCam();
      document.querySelector('.linkCart').addEventListener("click", () => {
      var name = document.querySelector('.name').textContent;
      cartItems.push(name);
      var json = JSON.stringify(name);
      return localStorage.setItem('camera', json);
    });
  }


}


class Cart{

  displayCart(item){
    var items = this.getItems();
    var html = "";
    // for (let item of items){
      var card =
      `
      <div class="d-flex flex-row align-items-baseline">
        <p class="name mr-auto p-2">${item.name}</p>
        <p>${item.price}</p>
        <input type="text">
        <button class="btn btn-danger">Remove</button>
      </div>
      `
      html += card;
    // }
    const products = document.querySelector('.products');
    products.innerHTML = html;
  }
    getItems(){

      var cartItems = [];
      var json = localStorage.getItem("camera");
      if(json){
        cartItems = JSON.parse(json);
      }
      return json;

  }
  showCart(){
    var item = this.getItems();
    this.displayCart(item);
  }
}
