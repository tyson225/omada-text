import React, { useEffect } from 'react';
import Index from './pages/Index.js';
import Login from './pages/Login';
import Register from './pages/Register';
import Navbar from './compoments/Navbar';
import Footer from './compoments/Footer';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import store from './store';
import { Provider } from 'react-redux';
import setAuthToken from './middleware/setAuthToken';
import { userLoaded } from './actions/auth.actions';

if (localStorage.getItem('token')) {
  setAuthToken(localStorage.getItem('token'));
}

const App = () => {
  useEffect(() => {
    store.dispatch(userLoaded());
  });
  return (
    <Router>
      <Provider store={store}>
        <Navbar />
        <Switch>
          <Route path='/' exact component={Index}></Route>
          <Route path='/register' exact component={Register}></Route>
          <Route path='/login' exact component={Login}></Route>
        </Switch>
        <Footer />
      </Provider>
    </Router>
  );
};

export default App;
