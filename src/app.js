import companies from '../data/companies.json';
import orders from '../data/orders.json';
import users from '../data/users.json';

import Header from './components/header/header';
import Main from './components/main/main';
import Footer from './components/footer/footer';

import Table from './components/main/table/table';
import Head from './components/main/table/head/head';
import BodyTable from './components/main/table/body/bodyTable' ;

import { 
  loadFavicon, 
  orderFieldMapping
} from './utils/index';

import './style/style.css';

export default (function() {
  const HeadTemplate  = Head.create(orderFieldMapping);

  const bodyTable = new BodyTable(companies, orders, users);
  const bodyTableTemplate = bodyTable.getBodyTableTemplate(true);

  const table = new Table(HeadTemplate, bodyTableTemplate);
  const tableTemplate = table.getTableTemplate();

  const MainTemplate = Main(tableTemplate);

  const app = `
    <header>${Header}</header>
    <main>${MainTemplate}</main>
    <footer>${Footer}</footer>
  `;

  loadFavicon();

  document.getElementById('app').innerHTML = app;

  BodyTable.addEventListenerOnUserInfo();
  bodyTable.addEventListenerOnCells();
  bodyTable.addListenerOnChangeInputValue();
})()
