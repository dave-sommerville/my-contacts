'use strict';

/*------------------------------------------------------------------------->
	Utility Functions 
<-------------------------------------------------------------------------*/

function select(selector, scope = document) {
  return scope.querySelector(selector);
}

function listen(event, element, callback) {
  return element.addEventListener(event, callback);
}

/*------------------------------------------------------------------------->
	Intial Declarations 
<-------------------------------------------------------------------------*/
const nameInput = select('.name-input');
const cityInput = select('.city-input');
const emailInput = select('.email-input');
const submitButton = select('.submit-btn');
const errorCatcher = select('.error-catcher');
const contactDisplay = select('.card-wrapper');
const contactCounter = select('.contact-counter');

const contacts = [];
const availableIds = [1, 2, 3, 4, 5, 6, 7, 8, 9]; 

/*------------------------------------------------------------------------->
	Class Delcarations
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
		if (typeof contactName === 'string' && contactName.trim().length >= 2) {
			this.#name = contactName;
		} else {
			throw new Error('Invalid name: must be 2 characters or more');
		}
	}
	
	set city(city) {
		if (typeof city === 'string' && city.trim().length >= 2) {
			this.#city = city;
		} else {
			throw new Error('Invalid city name: must be 2 characters or more');
		}
	}

  set email(email) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;  // Basic email regex
    if (emailPattern.test(email)) {
      this.#email = email;
    } else {
      throw new Error('Email must be in format "name@email.com"');
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

/*------------------------------------------------------------------------->
	Specialty Functions 
<-------------------------------------------------------------------------*/

function collectInput() {
  const contactInput = [nameInput.value, cityInput.value, emailInput.value];
  return contactInput;
}

function counterUpdate() {
  contactCounter.innerHTML = 
	`<span>Current Contacts:</span> ${contacts.length}`;
}

function displayAllContacts() {
  contactDisplay.innerHTML = '';

  contacts.forEach(contact => {
    const card = document.createElement('div');
    card.id = `contact-${contact.id}`; 
    card.innerHTML = `
      <p><span>Name:</span> ${contact.name}</p>
      <p><span>City:</span> ${contact.city}</p>
      <p><span>Email:</span> ${contact.email}</p> 
      <button 
				class="delete-btn" 
				title="Delete Contact">
				<i class="fa-solid fa-trash"></i>
			</button> 
			<a 
				class="email-btn" 
				href="mailto:${contact.email}" 
				title="Send Email to Contact">
				<i class="fa-solid fa-envelope"></i>
			</a>`;
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
function errorStyling(input) {
	input.focus();
	input.classList.add("error-styling")
}

function resetErrorStyling() {
  const inputs = [nameInput, cityInput, emailInput];
  inputs.forEach(input => {
    input.classList.remove('error-styling');  
  });
	errorCatcher.textContent = ''; 
}

/*------------------------------------------------------------------------->
	BOM Observers 
<-------------------------------------------------------------------------*/

listen('click', submitButton, () => {
	resetErrorStyling()
  const contactInput = collectInput();

  try {
    if (availableIds.length === 0) {
      throw new Error('Your Contacts are full!');
    }
    const contactId = availableIds.shift(); 
    const contact1 = new Contact(
			contactId, contactInput[0], contactInput[1], contactInput[2]
		);
    contacts.push(contact1);
    displayAllContacts(); 

  	nameInput.value = '';
  	cityInput.value = '';
  	emailInput.value = '';

  } catch (error) {
		let input = '';
    errorCatcher.textContent = error.message; 
		if (error.message.includes('Invalid name')) {
      input = nameInput;
    } else if (error.message.includes('Invalid city')) {
      input = cityInput;
    } else if (error.message.includes('name@email.com')) {
      input = emailInput;
    }
		errorStyling(input);
  }
	

});

counterUpdate();
setInterval(counterUpdate, 100);


