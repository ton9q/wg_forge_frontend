import Header from './components/header/header';
import Main from './components/main/main';
import Footer from './components/footer/footer';

import { loadFavicon, getSpanWithArrow } from './utils/index';

import './style/style.css';

export default (function() {
  const app = `
    <header>${Header}</header>
    <main>${Main}</main>
    <footer>${Footer}</footer>
  `;

  loadFavicon();

  document.getElementById('app').innerHTML = app;

  document.querySelectorAll('table .user-data').forEach(userDataElement => {
    userDataElement.querySelector('a').addEventListener('click', (e) => {
      e.preventDefault();
      userDataElement.querySelector('.user-details').classList.toggle('hidden');
    });
  });
})()
