import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Redirect } from 'react-router-dom';
import { firestoreConnect } from 'react-redux-firebase';
import DiagramLinks from './DiagramLinks'
import { getFirestore } from 'redux-firestore';
import M from 'materialize-css';

class HomeScreen extends Component {

    state = {
        createNewDiagram: false,
        newDiagramID: null,
        toDeleteDiagramID: null
    }

    handleDeleteDiagram = (e) => {
        const fireStore = getFirestore();
        fireStore.collection('diagrams').doc(this.state.toDeleteDiagramID).delete();
    }

    handleShowDeleteModal = (diagramId, e) => {
        e.stopPropagation();
        e.preventDefault();
        const elem = document.getElementById('diagram_delete_modal');
        const instance = M.Modal.init(elem, {dismissible: false});
        instance.open();
        this.setState({
            toDeleteDiagramID: diagramId
        })
    }

    handleHideDeleteModal = (e) => {
        e.stopPropagation();
        e.preventDefault();
        const elem = document.getElementById('diagram_delete_modal');
        const instance = M.Modal.init(elem, {dismissible: false});
        instance.destroy();
        this.setState({
            toDeleteDiagramID: null
        })
    }

    handleNewDiagram = () => {
        const fireStore = getFirestore();
        fireStore.collection('diagrams').add({
            lastModified: fireStore.Timestamp.now().seconds,
            owner: this.props.auth.uid,
            name: '',
            height: 1000,
            width: 1000,
            controls: []
        }).then(ref => this.setState({
            createNewDiagram: true,
            newDiagramID: ref.id
        })).catch(error => console.log('Failed to create new diagram', error));
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
                        <DiagramLinks handleShowDeleteModal={this.handleShowDeleteModal}/>
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
                <div id="diagram_delete_modal" className="modal">
                    <div className="modal-content">
                        <h4>Delete Diagram</h4>
                        <h6>Are you sure you want to delete this diagram?</h6>
                        <p id="diagram_delete_modal_disclaimer">Note: This action can not be undone.</p>
                    </div>
                    <div className="modal-footer">
                        <div className="btn-flat diagram_modal_button" onClick={(e) => {this.handleDeleteDiagram(e); this.handleHideDeleteModal(e)}}>Delete</div>
                        <div className="btn-flat diagram_modal_button" onClick={this.handleHideDeleteModal}>Cancel</div>
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