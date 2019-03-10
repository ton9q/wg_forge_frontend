const Head = {
  create(object) {
    const headItemsArray = [];

    for (let key in object) {
      headItemsArray.push(`<th>${object[key]}</th>`)
    }

    return headItemsArray.join('');
  }
};

export default Head;
