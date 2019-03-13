class Table {
  constructor(head, body) {
    this.head = head;
    this.body = body;
  };

  static template(head, body) {
    return `
      <table>
        <thead>
          ${head}
        </thead>
        <tbody>
          ${body}
        </tbody>
      </table>
    `;
  };

  getTableTemplate() {
    return Table.template(this.head, this.body);
  }
}

export default Table;
