import React from 'react'
import {Redirect} from 'react-router-dom'
import { connect } from 'react-redux';
import diagramsJson from './TestDiagrams.json'
import { getFirestore } from 'redux-firestore';

class DatabaseTester extends React.Component {
    //Super user account must always exist 
    handleClear = () => {
        const fireStore = getFirestore();
        fireStore.collection('users').doc('JpYe7Jo7sVcd7heoHd6sFqoZkio1').update({
            diagrams: [] //Clear diagrams in super user account
        });
    }

    handleReset = () => { //Reset super user account
        const fireStore = getFirestore();
        const superuser = diagramsJson.users[0];
        fireStore.collection('users').doc('JpYe7Jo7sVcd7heoHd6sFqoZkio1').update({
            firstName: superuser.firstName,
            lastName: superuser.lastName,
            initials: superuser.initials,
            diagrams: superuser.diagrams
        }).then(() => {
            console.log("DATABASE RESET");
        }).catch((err) => {
            console.log(err);
        });
    }

    render() {
        const auth = this.props.auth;
        if (auth.uid === 'JpYe7Jo7sVcd7heoHd6sFqoZkio1'){ //Only the super user can access this page
            return (
                <div>
                    <button onClick={this.handleClear}>Clear Database</button>
                    <button onClick={this.handleReset}>Reset Database</button>
                </div>)
        }
        return (
            <Redirect path="/"/>
        )
    }
}

const mapStateToProps = function (state) {
    return {
        auth: state.firebase.auth,
        firebase: state.firebase
    };
}

export default connect(mapStateToProps)(DatabaseTester);