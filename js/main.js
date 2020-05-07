'use strict';

// day 1
const cartButton = document.querySelector("#cart-button");
const modal = document.querySelector(".modal");
const close = document.querySelector(".close");
const buttonAuth = document.querySelector('.button-auth');
const modalAuth = document.querySelector('.modal-auth');
const closeAuth = document.querySelector('.close-auth');
const logInForm = document.querySelector('#logInForm');
const loginInput = document.querySelector('#login');
const userName = document.querySelector('.user-name');
const buttonOut = document.querySelector('.button-out');
const cardsRestaurants = document.querySelector('.cards-restaurants');
const containerPromo = document.querySelector('.container-promo');
const restaurants = document.querySelector('.restaurants');
const menu = document.querySelector('.menu');
const logo = document.querySelector('.logo');
const cardsMenu = document.querySelector('.cards-menu');
const restaurantInfo = document.querySelector('.restaurant-info');

let login = localStorage.getItem('login');

const getData = async function(url) {
    const response = await fetch(url);

    if(!response.ok){
        throw new Error(`Ошибка по адресу ${url}, статус ошибки ${response.status}!`);
    }
    return await response.json();
};


function toggleModal() {
    modal.classList.toggle("is-open");
}
function toggleModalAuth() {
    modalAuth.classList.toggle('is-open')
}
function authorized() {

    function logOut() {
        login = null;
        localStorage.removeItem('login');
        buttonAuth.style.display = '';
        userName.style.display = '';
        buttonOut.style.display = '';
        buttonOut.removeEventListener('click', logOut);
        checkAuth();
    }

    userName.textContent = login;

    buttonAuth.style.display = 'none';
    userName.style.display = 'inline';
    buttonOut.style.display = 'block';

    buttonOut.addEventListener('click', logOut);
}
function notAuthoried() {

    function logIn(event) {
        event.preventDefault();
        login = loginInput.value;
        let valid = /^[A-Za-z0-9]*$/.test(login);
        if (valid) {
            localStorage.setItem('login', login);

            toggleModalAuth();
            buttonAuth.removeEventListener('click', toggleModalAuth);
            closeAuth.removeEventListener('click', toggleModalAuth);
            logInForm.removeEventListener('submit', logIn);
            document.querySelector('.form-error').classList.remove('show');
            logInForm.reset();
            checkAuth();
        } else {
            logInForm.reset();
            document.querySelector('.form-error').classList.add('show');
        }
    }

    buttonAuth.addEventListener('click', toggleModalAuth);
    closeAuth.addEventListener('click', toggleModalAuth);
    logInForm.addEventListener('submit', logIn);

}
function checkAuth() {
    if (login) {
        authorized();
    } else {
        notAuthoried();
    }
}
function createCardRestaurants(restaurant) {
    const { image, kitchen, name, price, stars, products, time_of_delivery } = restaurant;
    const card = `<a class="card card-restaurant" data-products="${products}" data-name="${name}" data-price="${price}" data-kitchen="${kitchen}" data-stars="${stars}">
						<img src="${image}" alt="image" class="card-image"/>
						<div class="card-text">
							<div class="card-heading">
								<h3 class="card-title">${name}</h3>
								<span class="card-tag tag">${time_of_delivery}</span>
							</div>
							<div class="card-info">
								<div class="rating">
									${stars}
								</div>
								<div class="price">От ${price} ₽</div>
								<div class="category">${kitchen}</div>
							</div>
						</div>
					</a>`;
    cardsRestaurants.insertAdjacentHTML(`beforeend`, card);
}
function createCardGood(goods) {
    const { description, id, image, name, price } = goods;
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `<img src="${image}" alt="image" class="card-image"/>
						<div class="card-text">
							<div class="card-heading">
								<h3 class="card-title card-title-reg">${name}</h3>
							</div>
							<div class="card-info">
								<div class="ingredients">${description}
								</div>
							</div>
							<div class="card-buttons">
								<button class="button button-primary button-add-cart">
									<span class="button-card-text">В корзину</span>
									<span class="button-cart-svg"></span>
								</button>
								<strong class="card-price-bold">${price} ₽</strong>
							</div>
						</div>`;

    cardsMenu.insertAdjacentElement('beforeend',card);
}
function openGoods(event) {

    if (login) {
        const target = event.target;
        const restaurant = target.closest('.card-restaurant');
        if (restaurant) {
            restaurantInfo.textContent = '';
            const {name, price, stars, kitchen} = restaurant.dataset;
            const headerInfo = document.createElement('div');
            headerInfo.className = 'Info';
            headerInfo.innerHTML = `<h2 class="section-title restaurant-title">${name}</h2>
					<div class="card-info">
						<div class="rating">
							${stars}
						</div>
						<div class="price">От ${price} ₽</div>
						<div class="category">${kitchen}</div>
					</div>`;
            restaurantInfo.insertAdjacentElement(`beforeend`, headerInfo);

            cardsMenu.textContent = '';
            containerPromo.classList.add('hide');
            restaurants.classList.add('hide');
            menu.classList.remove('hide');

            getData(`./db/${restaurant.dataset.products}`).then(function (data) {
                data.forEach(createCardGood);
            });

        }
    } else {
        toggleModalAuth();
    }
}

function init(){
    getData('./db/partners.json').then(function(data){
        data.forEach(createCardRestaurants)
    });

    cardsRestaurants.addEventListener('click', openGoods);
    logo.addEventListener('click', function () {
        containerPromo.classList.remove('show');
        restaurants.classList.remove('hide');
        menu.classList.add('hide');
    });
    cartButton.addEventListener("click", toggleModal);
    close.addEventListener("click", toggleModal);

    checkAuth();
}

init();