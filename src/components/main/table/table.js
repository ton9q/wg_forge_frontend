import companies from '../../../../data/companies.json';
import orders from '../../../../data/orders.json';
import users from '../../../../data/users.json';

import { orderFieldMapping } from '../../../utils/index';

import Head from './head/head';
import BodyTable from './body/bodyTable' ;
import StaticticsRows from './body/statisticsRows';

const getTable = () => {
  const bodyTable = new BodyTable(companies, orders, users);

  const table = `
    <table>
      <thead>
        <tr>${Head.create(orderFieldMapping)}</tr>
      </thead>
      <tbody>
        ${bodyTable.getArrayOrders()}
        ${StaticticsRows}
      </tbody>
    </table>
  `;

  return table;
}

export default getTable();
