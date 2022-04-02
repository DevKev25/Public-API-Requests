const randomUserUrl =  "https://randomuser.me/api/?results=12&nat=gb";
const gallery = document.querySelector('.gallery')
let userArray = {};
let modalIndex;

//This function is a wrapper for the fetch function. 
const fetchData= (url) => {
    return fetch(url)
    .then(res => checkFetchStatus(res))
    .then(res => res.json())
    .catch(error => console.error(error))
}

//Checks a response from a fetch call has the HTTP status of 200. Otherwise it returns a rejected Promise with error
const checkFetchStatus = response => {
    if (response.ok) {
        return Promise.resolve(response)
    } else {
        return Promise.reject(response.statusText)
    }
}

// createGallery creates the gallery for the user array

const createGallery = users => {
    userArray = users.results

    for (let i = 0; i < userArray.length; i++) {
        const user = userArray[i]

        const cardDiv = document.createElement('div')
        cardDiv.className = 'card'
        cardDiv.addEventListener('click', () => showModal(i));

        const cardImgDiv = document.createElement('div')
        cardImgDiv.className = 'card-img-container';

        const img = document.createElement('img')
        img.className = 'card-img'
        img.src = user.picture.large
        cardImgDiv.appendChild(img)

        cardDiv.appendChild(cardImgDiv)

        const cardInfoDiv = document.createElement('div')
        cardInfoDiv.className = 'card-info-container';

        const nameh3 = document.createElement('h3');
        nameh3.id = 'name'
        nameh3.className = 'card-name cap';
        nameh3.innerHTML = `${user.name.first} ${user.name.last}`;
        cardInfoDiv.appendChild(nameh3);

        const emailP = document.createElement('p');
        emailP.className = 'card-text';
        emailP.innerHTML = `${user.email}`;
        cardInfoDiv.appendChild(emailP);

        const locationP = document.createElement('p');
        locationP.className = 'card-text cap';
        locationP.innerHTML = `${user.location.city}, ${user.location.state}`
        cardInfoDiv.appendChild(locationP);

        cardDiv.appendChild(cardInfoDiv);

        gallery.appendChild(cardDiv);

    }
}

// createModal creates the HTML markup for the modal
const createModal = () => {

    const containerDiv = document.createElement('div');
    containerDiv.className = 'modal-container';

    const modalDiv = document.createElement('div');
    modalDiv.className = 'modal';

    const closeBtn = document.createElement('button');
    closeBtn.type = 'button';
    closeBtn.id = 'modal-close-btn';
    closeBtn.className = 'modal-close-btn';
    closeBtn.innerHTML = '<strong>X</strong>';
    closeBtn.addEventListener('click', hideModal);
    modalDiv.appendChild(closeBtn);

    const modalContainer = document.createElement('div');
    modalContainer.className = 'modal-info-container';

    const modalImg = document.createElement('img');
    modalImg.className = 'modal-img';
    modalImg.alt = "profile picture";
    modalContainer.appendChild(modalImg);

    const modalName = document.createElement('h3');
    modalName.id = 'name';
    modalName.className = 'modal-name cap';
    modalDiv.appendChild(modalName);

    const modalEmail = document.createElement('p')
    modalEmail.className = 'modal-text';
    modalContainer.appendChild(modalEmail);

    const modalCity = document.createElement('p');
    modalCity.className = 'modal-text cap';
    modalContainer.appendChild(modalCity);

    const modalHr = document.createElement('hr');
    modalContainer.appendChild(modalHr);

    const modalPhone = document.createElement('p');
    modalPhone.className = 'modal-text';
    modalContainer.appendChild(modalPhone);

    const modalAddress = document.createElement('p');
    modalAddress.className = 'modal-text';
    modalContainer.appendChild(modalAddress);

    const modalBirthday = document.createElement('p')
    modalBirthday.className = 'modal-text';
    modalContainer.appendChild(modalBirthday);

    modalDiv.appendChild(modalContainer);

    const btnContainerDiv = document.createElement('div');
    btnContainerDiv.className = 'modal-button-container';

    const prevBtn = document.createElement('button');
    prevBtn.type = 'button';
    prevBtn.id = 'modal-prev';
    prevBtn.className = 'modal-prev btn';
    prevBtn.innerHTML = 'Prev';
    btnContainerDiv.appendChild(prevBtn);

    const nextBtn = document.createElement('button');
    nextBtn.type = 'button';
    nextBtn.id = 'modal-next';
    nextBtn.className = 'modal-next btn';
    nextBtn.innerHTML = 'Next';
    btnContainerDiv.appendChild(nextBtn);

    containerDiv.appendChild(modalDiv);
    containerDiv.appendChild(btnContainerDiv);

    gallery.insertAdjacentElement('afterend', containerDiv);
    hideModal();

}

//creates the markup for the search box
const createSearch = () => {

    const form = document.createElement('form')
    form.action = '#';
    form.method = 'get'

    const searchInput = document.createElement('input');
    searchInput.type = 'search';
    searchInput.id = 'search-input';
    searchInput.className = 'search-input';
    searchInput.placeholder = 'Search...'
    form.appendChild(searchInput);

    const submitInput = document.createElement('input');
    submitInput.type = 'submit';
    submitInput.value = '🔍';
    submitInput.id = 'submit-input';
    submitInput.className = 'submit-input';
    form.appendChild(submitInput);

    document.querySelector('div.search-container').appendChild(form);

}

//The following function is to search or hide and show the appropriate
const performSearch = (e) => {
    e.preventDefault();
    const searchTerm = document.querySelector('input.search-input').value.toLowerCase();

    const cards = document.querySelectorAll('div.card'); 

    for (let i = 0; i < cards.length; i++) {
        const card = cards[i];

        const name = card.querySelector('div.card-info-container > h3').innerText.toLowerCase();

        if(name.includes(searchTerm)) { 
            card.style.display = '';
        } else {
            card.style.display = 'none';
        }
    }
}

// shows the modal and shows and fills the appropriate properties 
const showModal = index => {
    const user = userArray[index];
    modalIndex = index;

    document.querySelector('img.modal-img').src = user.picture.large;
    document.querySelector('h3.modal-name').innerHTML = `${user.name.first} ${user.name.last}`;

    const modalPElements = document.querySelectorAll('p.modal-text');

    modalPElements[0].innerText = user.email;
    modalPElements[1].innerText = user.location.city;
    modalPElements[2].innerText = user.phone;
    modalPElements[3].innerText = `${user.location.street.number} ${user.location.street.name}, ${user.location.city}, ${user.location.state} ${user.location.postcode}`;
    modalPElements[4].innerText = `Birthday: ${getFormattedDate(new Date(user.dob.date))}`;
    
    if(userArray[index + 1] == null) {
        nextBtn.disabled = "true";
    } else {
        nextBtn.disabled = "";
    } 

    if(userArray[index - 1] == null) {
        prevBtn.disabled = "true";
    } else {
        prevBtn.disabled = "";
    } 

    document.querySelector('.modal-container').style.display = '';
}

//This function hides the current modal
const hideModal = () => {
    document.querySelector('.modal-container').style.display = 'none';
}

//The following function takes the user's date and returns it in dd/mm/yyyy format.
const getFormattedDate = date => {
    var year = date.getFullYear();
  
    var month = (1 + date.getMonth()).toString();
    month = month.length > 1 ? month : '0' + month;
  
    var day = date.getDate().toString();
    day = day.length > 1 ? day : '0' + day;
    
    return month + '/' + day + '/' + year;
}

//the following function allows the user to show the next user's modal.
const goNext = () => {
    showModal(modalIndex + 1);
}
//the following function allows the user to show the previous user's modal.
const goPrev = () => {
    showModal(modalIndex - 1);

}

//Runs the initial function.
fetchData(randomUserUrl)
    .then(createGallery);
createModal();
createSearch();

//Events
document.querySelector('form').addEventListener('submit', e => performSearch(e));

const nextBtn = document.querySelector('button#modal-next');
const prevBtn = document.querySelector('button#modal-prev');

nextBtn.addEventListener('click', () => {goNext()});
prevBtn.addEventListener('click', () => {goPrev()});