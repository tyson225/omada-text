import React from 'react';
import Index from './pages/Index.js';
import Login from './pages/Login';
import Register from './pages/Register';
import Navbar from './compoments/Navbar';
import Footer from './compoments/Footer';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

const App = () => {
  return (
    <Router>
      <Navbar />
      <Switch>
        <Route path='/' exact component={Index}></Route>
        <Route path='/register' exact component={Register}></Route>
        <Route path='/login' exact component={Login}></Route>
      </Switch>
      <Footer />
    </Router>
  );
};

export default App;
