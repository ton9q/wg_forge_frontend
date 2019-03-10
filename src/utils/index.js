import loadFavicon from './loadFavicon';

const orderFieldMapping = {
  'transaction_id': 'Transaction ID',
  'userInfo': 'User Info',
  'created_at': 'Order Date',
  'total': 'Order Amount',
  'card_number': 'Card Number',
  'card_type': 'Card Type',
  'location': 'Location',
};

const getDateFromTimestamp = timestamp => {
  const dateFull = new Date(Number(timestamp) * 1000);
  const date = dateFull.toLocaleDateString().split('.').join('/');
  const time = dateFull.toLocaleTimeString('en-US');

  return `${date}, ${time}`;
};

const getBirthDayFromTimestamp = timestamp => {
  return timestamp === null ? '' : getDateFromTimestamp(timestamp).split(',')[0];
};

const getCardReplacedStars = card => {
  const start = card.slice(0,2);
  const end = card.slice(-4);
  const difference = card.length - start.length - end.length;

  return `${start}${'*'.repeat(difference)}${end}`;
};

const getSpanWithArrow = () => {
  const span = document.createElement('span');
  span.innerHTML = '&#8595;'; // ↓

  return span;
};

const getPrefixGender = gender => gender.toLowerCase().trim() === 'male' ? 'Mr.' : 'Ms.';

const getObjectFromDataById = (data, id) => {
  if (id === null) return null;

  let findedObj = null;
  data.forEach( obj => {
    if (obj.id === id) findedObj = obj;
  });

  return findedObj;
};

const compare = (a,b, keyArray, type) => {
  if (!type) {
    if (a[keyArray] < b[keyArray]) return -1;
    else if (a[keyArray] > b[keyArray]) return 1;
    return 0;
  } 

  if (type === 'number') {
    if (Number(a[keyArray]) < Number(b[keyArray])) return -1;
    else if (Number(a[keyArray]) > Number(b[keyArray])) return 1;
    return 0;
  }
};

export {
  loadFavicon,
  orderFieldMapping,
  getDateFromTimestamp,
  getBirthDayFromTimestamp,
  getCardReplacedStars,
  getSpanWithArrow,
  getPrefixGender,
  getObjectFromDataById,
  compare
}