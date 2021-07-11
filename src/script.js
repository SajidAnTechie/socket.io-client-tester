import axios from 'axios';
import io from 'socket.io-client';
import setUpEditors from './setupEditor';

const event = document.querySelector('[socket-event]');
const searchBox = document.querySelector('[search-input]');
const connectBtn = document.querySelector('[connect-btn]');
const listener = document.querySelector('[socket-listener]');
const newEventForm = document.querySelector('[new-event-form]');
const newEventBtn = document.querySelector('[create-event-btn]');
const connectionUrl = document.querySelector('[local-server-url]');
const connectionForm = document.querySelector('[connection-form]');
const optionsTemplate = document.querySelector('[option-template]');
const optionsContainer = document.querySelector('[option-container]');
const responseContainer = document.querySelector('[json-responce-conatiner]');

let optionNodes;
let options;
let socket;

const { requestEditor, updateResponseEditor } = setUpEditors();

function getConnection(connectionUrl) {
  return io(connectionUrl);
}

connectionForm.addEventListener('submit', (e) => {
  e.preventDefault();

  changeDom(connectBtn, 'connecting');

  socket = getConnection(connectionUrl.value);

  socket.on('connect', () => {
    changeDom(connectBtn, 'connected', {
      backgroundColor: '#2ecc71',
      color: '#fff',
      border: '0',
    });
  });

  socket.on('disconnect', () => {
    changeDom(connectBtn, 'connect', {
      backgroundColor: 'transparent',
      color: '#999',
      border: '1px solid #999',
    });
    alert('Disconnected');
    socket.disconnect();
    sockets.close();
  });

  socket.on('connect_error', (error) => {
    changeDom(connectBtn, 'connect', {
      backgroundColor: 'transparent',
      color: '#999',
      border: '1px solid #999',
    });
    alert('Couldnt connect');
    socket.disconnect();
    socket.close();
  });
});

newEventForm.addEventListener('submit', (e) => {
  e.preventDefault();
  if (!socket?.connected) return;
  let data;
  try {
    data = JSON.parse(requestEditor.state.doc.toString() || null);
  } catch (err) {
    alert('JSON data is malformed');
    return;
  }

  changeDom(newEventBtn, 'sending');
  fireEvent(socket, event.innerHTML, data);
});

function fireEvent(socket, event, data) {
  socket.emit(event, data);
  listenEvent(socket, listener.value);
}

function listenEvent(socket, listenTo) {
  socket.on(listenTo, (data) => {
    responseContainer.classList.remove('d-none');
    updateResponseEditor(data);
    changeDom(newEventBtn, 'send');
    socket.removeListener(listenTo);
  });
}

event.addEventListener('click', () => {
  optionsContainer.classList.toggle('active');

  searchBox.value = '';
  filterList('');

  if (optionsContainer.classList.contains('active')) {
    searchBox.focus();
  }
});

searchBox.addEventListener('keyup', function (e) {
  filterList(e.target.value);
});

const filterList = (searchTerm) => {
  searchTerm = searchTerm.toLowerCase();
  optionNodes.forEach((option) => {
    let value = option.innerText.toLowerCase();
    if (value.indexOf(searchTerm) != -1) {
      changeDom(option, '', { display: 'block' });
    } else {
      changeDom(option, '', { display: 'none' });
    }
  });
};

(async () => {
  const { data } = await axios.get(
    'https://socketapiserver.herokuapp.com/api/event'
  );

  options = data.data;

  options.forEach((eve, key) => {
    const eventName = eve.event;
    optionsContainer.append(createOptions(eventName));
  });
  addClickEventListerToOptionList();
})();

function createOptions(value) {
  const element = optionsTemplate.content.cloneNode(true);
  const optiondiv = element.querySelector('[option]');
  optiondiv.textContent = value;
  return element;
}

function addClickEventListerToOptionList() {
  const optionNodeList = document.querySelectorAll('[option]');
  optionNodes = [...optionNodeList];
  optionNodes.forEach((option) => {
    option.addEventListener('click', () => {
      const value = option.textContent;
      event.innerHTML = value;
      optionsContainer.classList.remove('active');
      findListener(value);
    });
  });
}

function findListener(selectedEventValue) {
  const listenerIndex = options.findIndex(
    ({ event }) => event === selectedEventValue
  );

  if (listenerIndex >= 0) listener.value = options[listenerIndex].listener;
}

export function changeDom(element, content = '', styles = {}) {
  if (content != '') element.textContent = content;

  Object.assign(element.style, styles);
}
