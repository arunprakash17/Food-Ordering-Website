const btnCart=document.querySelector('#cart-icon');
const cart=document.querySelector('.cart');
const btnClose=document.querySelector('#cart-close');


//search part

const inputBtn=document.querySelector('#frm');
const searchResult=document.querySelector('.shop-content');
const container=document.querySelector('.food-box');
let searchQuery='';

const APP_ID='f874dd82';
const APP_KEY='3494e4c360d60b053166d390643764b1';


inputBtn.addEventListener('submit',(e)=>{
  e.preventDefault();
  searchQuery=e.target.querySelector('input').value;
  fetchAPI(searchQuery);
});

async function fetchAPI(food){
  const baseURL=`https://api.edamam.com/search?q=${food}&app_id=${APP_ID}&app_key=${APP_KEY}`;
  const  response= await fetch(baseURL);
  const data=await response.json();
  console.log(data);
  generateHtML(data.hits);
}
function generateHtML(results){
  let generatedHTML='';
  results.map(result =>{
    generatedHTML+=
      `
      <div class="food-box">
        <div class="pic">
          <img src="${result.recipe.image}" class="food-img">
        </div>
        <h2 class="food-title">${result.recipe.label}</h2>
        <span class="food-price">Rs.${findRate(result.recipe.calories)}</span>
        <ion-icon name="cart" class="add-cart"></ion-icon>
      </div>

      `
  })
  searchResult.innerHTML=generatedHTML;
  loadContent();
}

btnCart.addEventListener('click',()=>{
  cart.classList.add('cart-active');
});

btnClose.addEventListener('click',()=>{
  cart.classList.remove('cart-active');
});

document.addEventListener('DOMContentLoaded',loadFood);

function loadFood(){
   loadContent();

}

function loadContent(){
  //Remove Food Items  From Cart
  let btnRemove=document.querySelectorAll('.cart-remove');
  btnRemove.forEach((btn)=>{
    btn.addEventListener('click',removeItem);
  });

  //Product Item Change Event
  let qtyElements=document.querySelectorAll('.cart-quantity');
  qtyElements.forEach((input)=>{
    input.addEventListener('change',changeQty);
  });

  //Product Cart
  
  let cartBtns=document.querySelectorAll('.add-cart');
  cartBtns.forEach((btn)=>{
    btn.addEventListener('click',addCart);
  });
  updateTotal();
}


//Remove Item
function removeItem(){
  if(confirm('Are Your Sure to Remove')){
    let title=this.parentElement.querySelector('.cart-food-title').innerHTML;
    itemList=itemList.filter(el=>el.title!=title);
    this.parentElement.remove();
    loadContent();
  }
}

//Change Quantity
function changeQty(){
  if(isNaN(this.value) || this.value<1){
    this.value=1;
  }
  loadContent();
}

let itemList=[];

//Add Cart
function addCart(){
 let food=this.parentElement;
 let title=food.querySelector('.food-title').innerHTML;
 let price=food.querySelector('.food-price').innerHTML;
 let imgSrc=food.querySelector('.food-img').src;
 console.log(title,price,imgSrc);
 
 let newProduct={title,price,imgSrc}

 //Check Product already Exist in Cart
 if(itemList.find((el)=>el.title==newProduct.title)){
  alert("Product Already added in Cart");
  return;
 }else{
  itemList.push(newProduct);
 }


let newProductElement= createCartProduct(title,price,imgSrc);
let element=document.createElement('div');
element.innerHTML=newProductElement;
let cartBasket=document.querySelector('.cart-content');
cartBasket.append(element);
loadContent();
}


function createCartProduct(title,price,imgSrc){

  return `
  <div class="cart-box">
  <img src="${imgSrc}" class="cart-img">
  <div class="detail-box">
    <div class="cart-food-title">${title}</div>
    <div class="price-box">
      <div class="cart-price">${price}</div>
       <div class="cart-amt">${price}</div>
   </div>
    <input type="number" value="1" class="cart-quantity">
  </div>
  <ion-icon name="trash" class="cart-remove"></ion-icon>
</div>
  `;
}

function updateTotal()
{
  const cartItems=document.querySelectorAll('.cart-box');
  const totalValue=document.querySelector('.total-price');

  let total=0;

  cartItems.forEach(product=>{
    let priceElement=product.querySelector('.cart-price');
    let price=parseFloat(priceElement.innerHTML.replace("Rs.",""));
    let qty=product.querySelector('.cart-quantity').value;
    total+=(price*qty);
    product.querySelector('.cart-amt').innerText="Rs."+(price*qty);

  });

  totalValue.innerHTML='Rs.'+total;


  // Add Product Count in Cart Icon

  const cartCount=document.querySelector('.cart-count');
  let count=itemList.length;
  cartCount.innerHTML=count;

  if(count==0){
    cartCount.style.display='none';
  }else{
    cartCount.style.display='block';
  }
};


 //  Show message to customer
document.getElementById('buy').addEventListener('click',()=>{
      var totalOrder = "";
      const cartItems = document.querySelectorAll('.cart-box');
      cartItems.forEach((product)=>{
        const title = product.querySelector('.cart-food-title').innerHTML;
        totalOrder+=title+"\n";
      });
      alert("Your have been ordered \n"+totalOrder+"\n Have a Nice Day \n Thank you");
});
function findRate(val){
  
    let k=Math.floor(Math.random()*val);
    if(k>1000)return Math.floor(k/10);
    return k;
}
