var riot = require('riot')
require('./../tags/hello.tag');

var client = require('./client')
console.log(fetch)

var options = {
  greeting: 'Tere',
  title: 'Todo app',
  items: [
    { 
      title: 'Teen glob',
      done: true,
      completed: false
    }
  ]
}

riot.mount('hello', options)

//var tpl = require('./../partials/tpl.jade');

//$('body').empty().html(tpl);
