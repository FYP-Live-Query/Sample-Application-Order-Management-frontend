import axios from 'axios';
// FOR t IN NetworkTrafficTable COLLECT browser = t.browser WITH COUNT INTO value SORT value DESC RETURN { browser: browser, totalCount: value }

class BrowserService{

    postData(){
      return axios.post('http://localhost:8081/orderInfo', {
        query: 'SELECT browser@string, eventtimestamp@long, initial_data@string FROM networktraffictable LIMIT 4',
        id: "QWERTY"
      });

    }  
  }

export default new BrowserService();