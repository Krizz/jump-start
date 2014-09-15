var Hello = require('./hello');
var math = require('./lib/math');
var $ = require('jquery');
var React = require('react');

React.renderComponent(
  Hello({
    name: 'World!'
  }),
  $('#hello').get(0)
)
