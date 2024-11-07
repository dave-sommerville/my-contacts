'use strict';

/*------------------------------------------------------------------------->

<-------------------------------------------------------------------------*/

function select(selector, scope = document) {
  return scope.querySelector(selector);
}

function listen(event, element, callback) {
  return element.addEventListener(event, callback);
}

/*------------------------------------------------------------------------->

<-------------------------------------------------------------------------*/
const nameInput = select('.name-input');
const cityInput = select('.city-input');
const emailInput = select('.email-input');
const submitButton = select('.submit-btn');
const contactDisplay = select('.card-wrapper');

const contacts = [];
const availableIds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]; 

/*------------------------------------------------------------------------->

<-------------------------------------------------------------------------*/

class Contact {
  #id;
  #name;
  #city;
  #email;

  constructor(id, userName, city, email) {
    this.id = id;
    this.name = userName;
    this.city = city;
    this.email = email;
  }

  set id(contactId) {
    if (Number.isInteger(contactId) && contactId > 0) {
      this.#id = contactId;
    } else {
      throw new Error('Invalid ID');
    }
  }

  set name(contactName) {
    if (typeof contactName === 'string' && contactName.trim() !== '') {
      this.#name = contactName;
    } else {
      throw new Error('Invalid name');
    }
  }

  set city(city) {
    if (typeof city === 'string' && city.trim() !== '') {
      this.#city = city;
    } else {
      throw new Error('Invalid city');
    }
  }

  set email(email) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;  // Basic email regex
    if (emailPattern.test(email)) {
      this.#email = email;
    } else {
      throw new Error('Invalid email');
    }
  }

  get id() {
    return this.#id;
  }

  get name() {
    return this.#name;
  }

  get city() {
    return this.#city;
  }

  get email() {
    return this.#email;
  }
}

function collectInput() {
  const contactInput = [nameInput.value, cityInput.value, emailInput.value];
  return contactInput;
}

/*------------------------------------------------------------------------->

<-------------------------------------------------------------------------*/

listen('click', submitButton, () => {
  const contactInput = collectInput();

  try {
    if (availableIds.length === 0) {
      alert("Sorry, no more contact slots available."); ///////////// Display elsewhere 
      return;``
    }
    const contactId = availableIds.shift(); 
    const contact1 = new Contact(
			contactId, contactInput[0], contactInput[1], contactInput[2]
		);
    contacts.push(contact1);
    displayAllContacts(); 

  } catch (error) {
    console.error(error.message);  ////////////////////////display elsewhere
  }

  nameInput.value = '';
  cityInput.value = '';
  emailInput.value = '';
});

/*------------------------------------------------------------------------->

<-------------------------------------------------------------------------*/

function displayAllContacts() {
  contactDisplay.innerHTML = '';

  contacts.forEach(contact => {
    const card = document.createElement('div');
    card.id = `contact-${contact.id}`; 
    card.innerHTML = `
      <p><span>Name:</span> ${contact.name}</p>
      <p><span>City:</span> ${contact.city}</p>
      <p><span>Email:</span> ${contact.email}</p> 
      <button class="delete-btn"><i class="fa-solid fa-trash"></i></button> 
			<a href="mailto:${contact.email}"><i class="fa-regular fa-envelope"></i></a>
		`;											/// Unsure why this won't work as a select() 
    const deleteButton = card.querySelector('.delete-btn');
    listen('click', deleteButton, () => {
      deleteContact(contact.id); 
    });

    contactDisplay.appendChild(card);
  });
}

function deleteContact(contactId) {
  const index = contacts.findIndex(contact => contact.id === contactId);
  if (index !== -1) {
    contacts.splice(index, 1);  
    availableIds.push(contactId); 

    displayAllContacts();
  }
}

