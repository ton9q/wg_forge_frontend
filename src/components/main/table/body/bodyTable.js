import {
  getDateFromTimestamp,
  getBirthDayFromTimestamp,
  getCardReplacedStars, 
  getPrefixGender,
  getObjectFromDataById
} from '../../../../utils/index';

class BodyTable {
  constructor(companies, orders, users) {
    this.companies = companies;
    this.orders = orders;
    this.users = users;

    this.t;
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

  static getTemplateOrder(order, userInfo) {
    return `
      <tr id='order_${order.id} class='order_${order.id}'>
        <td>${order.transaction_id}</td>
        <td class='user-data'>${userInfo}</td>
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
  
    const template = BodyTable.getTemplateUserInfo(userInfo)
    return template;
  };

  getOrders() {
    return this.orders.map(order => {
      const userInfo = this.getUserInfoById(order.user_id);
      const template = BodyTable.getTemplateOrder(order, userInfo);
      
      return template;
    });
  }
  
  getArrayOrders() {
    return this.getOrders().join('');
  }
}

export default BodyTable;
