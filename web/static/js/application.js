import 'babel-polyfill';

import React from 'react';
import ReactDOM from 'react-dom';
import App from './containers/app';

import { Router, Route, browserHistory, IndexRedirect } from 'react-router'

ReactDOM.render(
  <Router history={browserHistory}>
    <Route path="/" component={App}>
      <IndexRedirect to="/all" />
      <Route path="/:filter"/>
    </Route>
  </Router>
, document.getElementById('app'));
