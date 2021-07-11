import axios from 'axios';

const addBtn = document.querySelector('[add-btn]');
const newEvent = document.querySelector('[add-event-input]');
const message = document.querySelector('[success-message]');
const newListener = document.querySelector('[add-listener-input]');
const addEventForm = document.querySelector('[add-event-form]');

addEventForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const eventVal = newEvent.value;
  const listenerVal = newListener.value;

  if ([eventVal, listenerVal].includes('')) {
    return;
  }
  message.classList.add('d-none');
  changeDom(addBtn, 'saving', { cursor: 'not-allowed', pointerEvents: 'none' });
  const payload = {
    event: eventVal,
    listener: listenerVal,
  };
  const response = await axios.post(
    'https://socketapiserver.herokuapp.com/api/event',
    payload
  );
  if (response.status === 200) {
    changeDom(addBtn, 'save', { cursor: 'pointer', pointerEvents: 'auto' });
    message.classList.remove('d-none');
    newEvent.value = '';
    newListener.value = '';
  }
});

function changeDom(element, content = '', styles = {}) {
  if (content != '') element.textContent = content;

  Object.assign(element.style, styles);
}
