import axios from 'axios';

const addBtn = document.querySelector('[add-btn]');
const message = document.querySelector('[success-message]');
const newEvent = document.querySelector('[add-event-input]');
const addEventForm = document.querySelector('[add-event-form]');
const newListener = document.querySelector('[add-listener-input]');

addEventForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const eventVal = newEvent.value;
  const listenerVal = newListener.value;

  const isInputValid = validateInput([eventVal, listenerVal]);

  if (!isInputValid) return;

  message.classList.add('d-none');
  changeDom(addBtn, 'saving', { cursor: 'not-allowed', pointerEvents: 'none' });
  const payload = {
    event: eventVal,
    listener: listenerVal,
  };
  try {
    const response = await axios.post(
      'https://socketapiserver.herokuapp.com/api/event',
      payload
    );
    if (response.status === 200) {
      message.classList.remove('d-none');
      newEvent.value = '';
      newListener.value = '';
    }
  } catch (err) {
    alert(err);
  } finally {
    changeDom(addBtn, 'save', { cursor: 'pointer', pointerEvents: 'auto' });
  }
});

function validateInput(values) {
  if (values.includes('')) {
    return false;
  }
  return true;
}

function changeDom(element, content = '', styles = {}) {
  if (content != '') element.textContent = content;

  Object.assign(element.style, styles);
}
