
import {
  getSumElementsFromArray,
  getMedianFromArray,
  getAverageFromArray,
} from '../../../../utils/index';

class StatisticsRows {
  static getTemplate(data) {
    return `
      <tr>
        <td colspan='3'>Orders Count</td>
        <td colspan='4'>${data.ordersCount}</td>
      </tr>
      <tr>
        <td colspan='3'>Orders Total</td>
        <td colspan='4'>$ ${data.ordersTotal}</td>
      </tr>
      <tr>
        <td colspan='3'>Median Value</td>
        <td colspan='4'>$ ${data.mediumValue}</td>
      </tr>
      <tr>
        <td colspan='3.5'>Average Check</td>
        <td colspan='4'>$ ${data.averageCheck}</td>
      </tr>
      <tr>
        <td colspan='3'>Average Check (Female)</td>
        <td colspan='4'>$ ${data.averageCheckFemale}</td>
      </tr>
      <tr>
        <td colspan='3'>Average Check (Male)</td>
        <td colspan='4'>$ ${data.averageCheckMale}</td>
      </tr>
    `;
  }

  static getObjectDataFromArrays(arrayFemale, arrayMale) {
    const averageCheckFemale = getAverageFromArray(arrayFemale);
    const averageCheckMale = getAverageFromArray(arrayMale);

    return {
      ordersCount: arrayFemale.length + arrayMale.length,
      ordersTotal: getSumElementsFromArray([...arrayFemale, ...arrayMale]),
      mediumValue: getMedianFromArray([...arrayFemale, ...arrayMale]),
      averageCheck: getAverageFromArray([...arrayFemale, ...arrayMale]),
      averageCheckFemale: averageCheckFemale,
      averageCheckMale: averageCheckMale
    }
  }
}



export default StatisticsRows;
