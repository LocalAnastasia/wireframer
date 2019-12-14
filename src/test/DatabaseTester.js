import React from 'react'
import {Redirect} from 'react-router-dom'
import { connect } from 'react-redux';
import diagramsJson from './TestDiagrams.json'
import { getFirestore } from 'redux-firestore';

class DatabaseTester extends React.Component {
    //Super user account must always exist 
    handleClear = () => {
        const fireStore = getFirestore();
        fireStore.collection('diagrams').where('owner', '==', 'JpYe7Jo7sVcd7heoHd6sFqoZkio1').get().then(snapshot => {
            snapshot.forEach(doc => {
                doc.ref.delete(); //Clear diagrams in super user account
            });
        }).catch(error => console.log('Failed to clear database', error));
    }

    handleReset = () => { //Reset super user account
        const fireStore = getFirestore();
        const superuser = diagramsJson.users[0];
        fireStore.collection('users').doc('JpYe7Jo7sVcd7heoHd6sFqoZkio1').update({
            firstName: superuser.firstName,
            lastName: superuser.lastName,
            initials: superuser.initials,
        }).then(() => {
            superuser.diagrams.forEach((diagram) => {
                fireStore.collection('diagrams').add({
                    lastModified: fireStore.Timestamp.now().seconds,
                    owner: 'JpYe7Jo7sVcd7heoHd6sFqoZkio1',
                    name: diagram.name,
                    height: diagram.height,
                    width: diagram.width,
                    controls: diagram.controls
                })
            })
        }).then(() => {
            console.log("DATABASE RESET");
        }).catch((error) => {
            console.log('Failed to reset database', error);
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