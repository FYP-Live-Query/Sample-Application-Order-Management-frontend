import axios from 'axios';
// FOR t IN NetworkTrafficTable COLLECT browser = t.browser WITH COUNT INTO value SORT value DESC RETURN { browser: browser, totalCount: value }

class BrowserService{

    postData(){
      return axios.post('http://localhost:8081/orderInfo', {
        query: 'select order.orderId@string, item.itemType@string, item.unitPrice@float, order.totalRevenue@float, order.totalCost@float, order.totalProfit@float from item join order on item.itemType@string=order.itemType@string;',
        id: "QWERTY"
      });

    }  
  }

export default new BrowserService();