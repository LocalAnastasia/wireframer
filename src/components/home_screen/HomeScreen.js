import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Redirect } from 'react-router-dom';
import { firestoreConnect } from 'react-redux-firebase';
import DiagramLinks from './DiagramLinks'
import { getFirestore } from 'redux-firestore';

class HomeScreen extends Component {

    state = {
        createNewDiagram: false,
        newDiagramID: null
    }

    handleNewDiagram = () => {
        const fireStore = getFirestore();
        const diagram = {
            name: '',
            height: 2000,
            width: 2000,
            lastModified: fireStore.Timestamp.now().seconds
        }
        const diagrams = JSON.parse(JSON.stringify(this.props.diagrams));
        diagrams.push(diagram);
        fireStore.collection('users').doc(this.props.auth.uid).update({
            diagrams: diagrams
        }).then(ref => this.setState({
            createNewList: true,
            newDiagramID: diagrams.length - 1
        }));
    }
    render() {
        const newDiagramID = this.state.newDiagramID;
        if (!this.props.auth.uid) {
            return <Redirect to="/login" />;
        }
        if(this.state.createNewDiagram) {
            return <Redirect to={'/edit/' + newDiagramID}/>;
        }
        return (
            <div className="dashboard container">
                <div className="row">
                    <div className="col s12 m4">
                        <DiagramLinks />
                    </div>

                    <div className="col s8">
                        <div className="banner">
                            Wireframe Diagram Maker
                        </div>
                        
                        <div className="home_new_list_container">
                                <button className="home_new_list_button" onClick={this.handleNewDiagram}>
                                    Create a New Diagram
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
      { collection: 'users' },
    ]),
)(HomeScreen);