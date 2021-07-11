import axios from 'axios';
import { changeDom } from './script';

const addBtn = document.querySelector('[add-btn]');
const event = document.querySelector('[add-event-input]');
const message = document.querySelector('[success-message]');
const listener = document.querySelector('[add-listener-input]');
const addNewEventForm = document.querySelector('[add-event-form]');

addNewEventForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const eventVal = event.value;
  const listenerVal = listener.value;

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
  console.log(response);
  if (response.status === 200) {
    changeDom(addBtn, 'save', { cursor: 'pointer', pointerEvents: 'auto' });
    message.classList.remove('d-none');
    event.value = '';
    listener.value = '';
  }
});
