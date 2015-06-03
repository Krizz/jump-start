
require('whatwg-fetch');
var fetch = window.fetch;
class Client {
  constructor(url) {
    this.url = url;
  }

  get(path) {
    console.log(fetch)
    var fullPath = `${this.url}${path}`;
    return window.fetch(fullPath)
      .then(function(response) {
        return new Promise(response.json());
      }).then(function(json) {
        return Promise.resolve(json);
      }).catch(function(ex) {
        console.log('parsing failed', ex)
      })
  }
}

var api = new Client('http://www.reddit.com');

api.get('/users')
.catch(function() {
  console.log('error')
})