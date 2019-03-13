import {
  orderFieldMapping,
  getDateFromTimestamp,
  getBirthDayFromTimestamp,
  getCardReplacedStars, 
  getPrefixGender,
  getObjectFromDataById,
  compare,
  getSpanWithArrow
} from '../../../../utils/index';

// import SearchRow from './../head/searchRow';
import StaticticsRows from './statisticsRows';

class BodyTable {
  constructor(companies, orders, users) {
    this.companies = companies;
    this.orders = orders;
    this.users = users;

    this.table = [];

    this.arrayTotalFemale = [];
    this.arrayTotalMale = [];
  }

  static getTemplateUserInfo(userInfo) {
    return `
      <a href='#'>${userInfo.gender} ${userInfo.first_name} ${userInfo.last_name}</a>
  
      <div class='user-details hidden'>
        <p>Birthday: ${userInfo.birthday}</p>
        <p><img src='${userInfo.avatar}' width='100px'></p>
        <p>Company:
          <a href='${userInfo.companyInfo.url}' target='_blank' rel='noopener noreferrer'>
            ${userInfo.companyInfo.title}
          </a>
        </p>
        <p>Industry: ${userInfo.companyInfo.industry}</p>
      </div>
    `;
  }

  static getTemplateOrder(order) {
    return `
      <tr id='order_${order.id} class='order_${order.id}'>
        <td>${order.transaction_id}</td>
        <td class='user-data'>${BodyTable.getTemplateUserInfo(order.userInfo)}</td>
        <td>${getDateFromTimestamp(order.created_at)}</td>
        <td>$${order.total}</td>
        <td>${getCardReplacedStars(order.card_number)}</td>
        <td>${order.card_type}</td>
        <td>${order.order_country} (${order.order_ip})</td>
      <tr/>
    `;
  }

  static addEventListenerOnUserInfo() {
    document.querySelectorAll('table .user-data').forEach(userDataElement => {
      userDataElement.querySelector('a').addEventListener('click', (e) => {
        e.preventDefault();
        userDataElement.querySelector('.user-details').classList.toggle('hidden');
      });
    });
  }

  static getUserInfoById(users, companies, id) {
    let userInfo = getObjectFromDataById(users, id);
  
    const gender = getPrefixGender(userInfo.gender);
    const birthday = getBirthDayFromTimestamp(userInfo.birthday);
    const infoAboutCompany = getObjectFromDataById(companies, userInfo.company_id);
    const companyInfo = infoAboutCompany === null ? { url: '#', title: '', industry: ''} : infoAboutCompany;

    userInfo = {
      ...userInfo,
      gender,
      birthday,
      companyInfo
    };
  
    return userInfo;
  };
  
  static filterOrders(orders, value) {
    return orders.filter(order => {
      if (order.userInfo.first_name.toLowerCase().includes(value.toLowerCase())) return order;
      if (order.userInfo.last_name.toLowerCase().includes(value.toLowerCase())) return order;
      if (order.id.toString().includes(value.toString())) return order;
      if (order.transaction_id.toLowerCase().includes(value.toLowerCase())) return order;
      if (order.user_id.toString().includes(value.toString())) return order;
      if (order.total.toString().includes(value.toString())) return order;
      if (order.card_type.toLowerCase().includes(value.toLowerCase())) return order;
      if (order.order_country.toLowerCase().includes(value.toLowerCase())) return order;
      if (order.order_ip.toString().includes(value.toString())) return order;
      return false;
    });
  }

  static sortTable(table, indexCell) {
    let key = Object.keys(orderFieldMapping)[indexCell];

    const userInfoKeys = [ 'first_name', 'last_name' ];
    const locationKeys = [ 'order_country', 'order_ip'];

    const compareArray = (a,b) => {
      if (key !== 'userInfo' && key !== 'location') { //any standart key
        return compare(a, b, key, key === 'total' ? 'number' : null);
      }
      
      if (key === 'userInfo') {
        for(let i = 0; i < userInfoKeys.length; i++) {
          const result = compare(a[key], b[key], userInfoKeys[i]);
          if (result !== 0) return result;
        }
  
        return 0;
      } 
      
      if (key === 'location') {
        for(let i = 0; i < locationKeys.length; i++) {
          const result = compare(a, b, locationKeys[i]);
          if (result !== 0) return result;
        }
  
        return 0;
      }
    }

    table.sort(compareArray);
    console.log(table)
    return table;
  }

  static getOrdersTemplate(orders) {
    return orders.map(order => {
      return BodyTable.getTemplateOrder(order);
    });
  }

  static emptyTable() {
    return `
      <tr>
        <td colspan='7'>Nothing found</td>
      </tr>
    `;
  }

  getOrders(value) {
    let arrayTotalFemale = [];
    let arrayTotalMale = [];

    let allOrders = this.orders.map(order => {
      const userInfo = BodyTable.getUserInfoById(this.users, this.companies, order.user_id);

      if (userInfo.gender.toLowerCase() === 'ms.') arrayTotalFemale.push(Number(order.total));
      else arrayTotalMale.push(Number(order.total));

      const orderInfo = {
        ...order,
        userInfo
      };

      return orderInfo;
    });

    if (value) {
      allOrders = BodyTable.filterOrders(allOrders, value);

      arrayTotalFemale = [];
      arrayTotalMale = [];

      allOrders.forEach(order => {
        if (order.userInfo.gender.toLowerCase() === 'ms.') 
          arrayTotalFemale.push(Number(order.total));
        else 
          arrayTotalMale.push(Number(order.total));
      });
    }

    this.arrayTotalFemale = [...arrayTotalFemale];
    this.arrayTotalMale = [...arrayTotalMale];

    return allOrders;
  }
  
  getBodyTableTemplate(first) {
    if (first) this.table = this.getOrders();

    let statisticsRowsData;

    if (this.table.length !== 0) {
    statisticsRowsData = StaticticsRows.getObjectDataFromArrays(
      this.arrayTotalFemale, 
      this.arrayTotalMale
    );
    }

    return `
      ${this.table.length !== 0 ? BodyTable.getOrdersTemplate(this.table).join('') : BodyTable.emptyTable()}
      ${this.table.length !== 0 ? StaticticsRows.getTemplate(statisticsRowsData) : ''}
    `;
  }

  addEventListenerOnCells() {
    document.querySelectorAll('table tr.head th').forEach(th => {
      th.addEventListener('click', e => {
        e.preventDefault();
  
        if (th.querySelector('span') !== null) return;
        if (th.textContent === 'Card Number') return;  // if (e.target.cellIndex === 4) return;

        const span = getSpanWithArrow();
  
        document.querySelectorAll('table tr.head th').forEach(thEl => {
          const spanEl =thEl.querySelector('span');
          if(spanEl !== null) spanEl.remove();
        });

        this.table = BodyTable.sortTable(this.table, e.target.cellIndex);
        th.append(span);

        document.querySelector('table tbody').innerHTML = this.getBodyTableTemplate();
        
        BodyTable.addEventListenerOnUserInfo();
      })
    });
  }

  addListenerOnChangeInputValue() {
    const input = document.getElementById('search');

    input.addEventListener('keydown', e => {
      if (e.which === 13) {
        let indexSort = -1;
        document.querySelectorAll('table tr.head th').forEach((thEl, index) => {
          const spanEl =thEl.querySelector('span');
          if(spanEl !== null) indexSort = index;
        });

        this.table = this.getOrders(e.target.value);
        if (indexSort !== -1) this.table = BodyTable.sortTable(this.table, indexSort);

        document.querySelector('table tbody').innerHTML = this.getBodyTableTemplate();

        this.addEventListenerOnCells();
        BodyTable.addEventListenerOnUserInfo();
      }
    });
  }
}

export default BodyTable;
