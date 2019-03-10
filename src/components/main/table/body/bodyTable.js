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

class BodyTable {
  constructor(companies, orders, users) {
    this.companies = companies;
    this.orders = orders;
    this.users = users;

    this.tableDefault = this.getOrders();
    this.table = this.getOrders();
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

  getUserInfoById(id) {
    let userInfo = getObjectFromDataById(this.users, id);
  
    const gender = getPrefixGender(userInfo.gender);
    const birthday = getBirthDayFromTimestamp(userInfo.birthday);
    const infoAboutCompany = getObjectFromDataById(this.companies, userInfo.company_id);
    const companyInfo = infoAboutCompany === null ? { url: '#', title: '', industry: ''} : infoAboutCompany;

    userInfo = {
      ...userInfo,
      gender,
      birthday,
      companyInfo
    };
  
    return userInfo;
  };

  getOrders() {
    return this.orders.map(order => {
      const userInfo = this.getUserInfoById(order.user_id);

      const orderInfo = {
        ...order,
        userInfo
      };

      return orderInfo;
    });
  }
  
  getOrdersTemplate(orders) {
    return orders.map(order => {
      return BodyTable.getTemplateOrder(order);
    })

  }
  getBodyTableTemplate() {
    return this.getOrdersTemplate(this.table).join('');
  }

  static addEventListenerOnUserInfo() {
    document.querySelectorAll('table .user-data').forEach(userDataElement => {
      userDataElement.querySelector('a').addEventListener('click', (e) => {
        e.preventDefault();
        userDataElement.querySelector('.user-details').classList.toggle('hidden');
      });
    });
  }

  addEventListenerOnCells() {
    document.querySelectorAll('table th').forEach(th => {
      th.addEventListener('click', e => {
        e.preventDefault();
  
        if (th.querySelector('span') !== null) return;
        // if (e.target.cellIndex === 4) return;
        if (th.textContent === 'Card Number') return;

        const span = getSpanWithArrow();
  
        document.querySelectorAll('table th').forEach(thEl => {
          const spanEl =thEl.querySelector('span');
          if(spanEl !== null) spanEl.remove();
        });
  
        this.sort(e.target.cellIndex);
        th.append(span);
        document.querySelector('table tbody').innerHTML = this.getBodyTableTemplate();
      })
    });
  }

  sort(indexCell) {
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

    this.table.sort(compareArray);
  }
}

export default BodyTable;
