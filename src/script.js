import io from 'socket.io-client';
import setUpEditors from './setupEditor';
import eventOptions from './eventOptions';

const event = document.querySelector('[socket-event]');
const connectBtn = document.querySelector('[connect-btn]');
const listener = document.querySelector('[socket-listener]');
const newEventForm = document.querySelector('[new-event-form]');
const newEventBtn = document.querySelector('[create-event-btn]');
const connectionForm = document.querySelector('[connection-form]');
const connectionUrl = document.querySelector('[local-server-url]');
const responseContainer = document.querySelector('[json-responce-conatiner]');

const { requestEditor, updateResponseEditor } = setUpEditors();

let socket;

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
  fireEvent(socket, event.value, data);
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

(() => {
  const options = [...eventOptions];

  options.forEach((eve, key) => {
    const eventName = eve.event;
    event[key + 1] = new Option(eventName, eventName, false, false);
  });
})();

event.addEventListener('change', (e) => {
  const options = [...eventOptions];
  const selectedEventValue = e.target.value;
  const listenerIndex = options.findIndex(
    ({ event }) => event === selectedEventValue
  );

  if (listenerIndex >= 0) listener.value = options[listenerIndex].listener;
});

function changeDom(element, content = '', styles = {}) {
  element.textContent = content;
  Object.assign(element.style, styles);
}
