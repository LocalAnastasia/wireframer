import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Redirect } from 'react-router-dom';
import { firestoreConnect } from 'react-redux-firebase';
import TodoListLinks from './TodoListLinks'
import { getFirestore } from 'redux-firestore';

class HomeScreen extends Component {

    state = {
        createNewList: false,
        newListID: null
    }

    handleNewList = () => {
        const fireStore = getFirestore();
        fireStore.collection('todoLists').add({
            name: '',
            owner: '',
            items: [],
            lastModified: fireStore.Timestamp.now().seconds
        }).then(ref => this.setState({
            createNewList: true,
            newListID: ref.id
        }));
    }
    render() {
        const newListID = this.state.newListID
        if (!this.props.auth.uid) {
            return <Redirect to="/login" />;
        }
        if(this.state.createNewList) {
            return <Redirect to={'/todoList/' + newListID}/>;
        }
        return (
            <div className="dashboard container">
                <div className="row">
                    <div className="col s12 m4">
                        <TodoListLinks />
                    </div>

                    <div className="col s8">
                        <div className="banner">
                            @todo<br />
                            List Maker
                        </div>
                        
                        <div className="home_new_list_container">
                                <button className="home_new_list_button" onClick={this.handleNewList}>
                                    Create a New To Do List
                                </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        auth: state.firebase.auth
    };
};

export default compose(
    connect(mapStateToProps),
    firestoreConnect([
      { collection: 'todoLists' },
    ]),
)(HomeScreen);