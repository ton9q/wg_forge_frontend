class SearchRow {
  static getTemplate() {
    return `
      <tr class='search-row'>
        <th colspan='3'>Search:</th>
        <th colspan='4'><input type='text' id='search' class='search'></td>
      </tr>
    `;
  }
}



export default SearchRow;
