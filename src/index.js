const React = require('react');
const ReactDOM = require('react-dom');

const App = require('./views/app.js');

const container = document.getElementById('app-container');
ReactDOM.render(<App/>, container);
