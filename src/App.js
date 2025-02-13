import React, { Component } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { firebaseConnect } from 'react-redux-firebase';

import Navbar from './components/navbar/Navbar.js';
import RegisterScreen from './components/register_screen/RegisterScreen.js';
import LoginScreen from './components/login_screen/LoginScreen.js';
import HomeScreen from './components/home_screen/HomeScreen.js';
import EditScreen from './components/edit_screen/EditScreen.js';
import DatabaseTester from './test/DatabaseTester';

class App extends React.Component{
  render(){
    const {auth} = this.props;
    if (auth.isLoaded){ //TODO: Prevent user from directly accessing Edit page
      return(
        <BrowserRouter>
          <div className='App'>
            <Navbar />
            <Switch> 
              <Route exact path="/" component={HomeScreen} />
              <Route path="/login" component={LoginScreen} />
              <Route path="/register" component={RegisterScreen} />
              <Route path="/edit/:id" component={EditScreen} />
              <Route path="/databaseTester" component={DatabaseTester} />
              <Route path="/:any" component={HomeScreen} />
            </Switch>
          </div>
        </BrowserRouter>
      )
    }
    return null;
  }
}

const mapStateToProps = state => ({
  auth : state.firebase.auth
});

export default compose(
  firebaseConnect(),
  connect(mapStateToProps),
)(App);
