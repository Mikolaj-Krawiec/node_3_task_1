const loginForm = document.querySelector('#welcome-form');
const messagesSection = document.querySelector('#messages-section');
const messagesList = document.querySelector('#messages-list');
const addMessageForm = document.querySelector('#add-messages-form');
const userNameInput = document.querySelector('#username');
const messageContentInput = document.querySelector('#message-content');

let userName;

const socket = io();
socket.on('message', (event) => addMessage(event.author, event.content));

const login = (event) => {
  event.preventDefault();
  if (!userNameInput.value) {
    alert('Please type your name first');
  } else {
    userName = userNameInput.value;
    socket.emit('login', { name: userName });
    loginForm.classList.remove('show');
    messagesSection.classList.add('show');
  }
};

const sendMessage = (event) => {
  event.preventDefault();
  let messageContent = messageContentInput.value;
  if (!messageContent.length) {
    alert('You have to type something!');
  } else {
    addMessage(userName, messageContent);
    socket.emit('message', { author: userName, content: messageContent });
    messageContentInput.value = '';
  }
};

function addMessage(author, content) {
  const message = document.createElement('li');
  message.classList.add('message');
  message.classList.add('message--received');
  if (author === userName) message.classList.add('message--self');
  if (author === 'Chat Bot') message.classList.add('message--bot');
  message.innerHTML = `
      <h3 class="message__author">${userName === author ? 'You' : author}</h3>
      <div class="message__content">
        ${content}
      </div>
    `;
  messagesList.appendChild(message);
}

loginForm.addEventListener('submit', login);
addMessageForm.addEventListener('submit', sendMessage);
