import SearchRow from './searchRow';

class Head {
  static create(object) {
    const headItemsArray = [];
    const searchRowTemplate = SearchRow.getTemplate();

    for (let key in object) {
      headItemsArray.push(`<th>${object[key]}</th>`)
    }

    return `
      ${searchRowTemplate}
      <tr class='head'>${headItemsArray.join('')}</tr>
    `;
  }
};

export default Head;
