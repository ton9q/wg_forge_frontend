class Table {
  constructor(head, body) {
    this.head = head;
    this.body = body;
  };

  static template(head, body) {
    return `
      <table>
        <thead>
          <tr>${head}</tr>
        </thead>
        <tbody>
          ${body}
        </tbody>
      </table>
    `;
  };

  getTableTemplate() {
    const bodyTemplate = this.body.join('');
    return Table.template(this.head, bodyTemplate);
  }
}

export default Table;
