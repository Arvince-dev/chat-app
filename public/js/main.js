const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');

// Get username and room from URL
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true
});

const socket = io();

// Join chatroom
socket.emit('joinRoom', { username, room });

// Get room and users
socket.on('roomUsers', ({ room, users }) => {
    // outputRoomName(room);
    // outputUsers(users);
});

// Message from server
socket.on('message', message => {
    console.log(message);
    outputMessage(message);

    // Scroll down
    chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Message submit
chatForm.addEventListener('submit', e => {
    e.preventDefault();

    // Get message text
    const msg = e.target.elements.msg.value;

    // Emit message to server
    socket.emit('chatMessage', msg);

    // Clear input
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();
});

// Output message to DOM
function outputMessage(message) {
    const div = document.createElement('div');
    div.classList.add('message');
    if(username == message.username){
        div.innerHTML = `<p class="meta text-right" style="color: white;">${message.username} <span style="color: white;">${message.time}</span></p>
        <p class="text text-right" style="color: white;">
            ${message.text}
        </p>`;
        div.setAttribute('style', 'background-color: var(--dark-color-b)');
    } else {
        div.innerHTML = `<p class="meta text-left" style="color: black;">${message.username} <span style="color: black;">${message.time}</span></p>
        <p class="text text-left" style="color: black;">
            ${message.text}
        </p>`;
        div.setAttribute('style', 'background-color: #e5e5e5');
    }
    document.querySelector('.chat-messages').appendChild(div);
}

// Add room name to DOM
function outputRoomName(room) {
    roomName.innerText = "Room Name " + " : " + room;
}

// Add users to DOM
function outputUsers(users) {
    userList.innerHTML = `
        ${users.map(user => `<li>${user.username}</li>`).join('')}
    `;
}