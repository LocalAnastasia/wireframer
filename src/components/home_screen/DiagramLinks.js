import React from 'react';
import { Link } from 'react-router-dom';
import { firestoreConnect } from "react-redux-firebase";
import { connect } from 'react-redux';
import { compose } from 'redux';
import DiagramCard from './DiagramCard';
import { getFirestore } from 'redux-firestore';

class DiagramLinks extends React.Component {
    compareByLastModified = (a, b) => {
        return a.lastModified > b.lastModified ? -1 : 1;
    }

    handleUpdateLastModified = (diagramId, e) => {
        const fireStore = getFirestore();
        fireStore.collection('users').doc(this.props.auth.uid).collection('diagrams').doc(diagramId).set({
            lastModified: fireStore.Timestamp.now().seconds
        });
    }

    async getDiagrams() { //BUG, UNUSED
        let diagrams = [];
        const fireStore = getFirestore();
        let diagramsRef = await fireStore.collection('users').doc(this.props.auth.uid).collection('diagrams').orderBy('lastModified').get().then(
            snapshot => {
                snapshot.forEach((doc => {
                    diagrams.push({
                        id: doc.id,
                        name: doc.data().name
                    })
                }));
                return diagrams;
        }).catch(error => {
            console.log('Error retrieving diagrams', error);
        })
        return diagramsRef;
    }

    render() {
        let diagrams = this.props.diagrams;
        return (
            <div className="todo-lists section">
                {diagrams && diagrams.sort(this.compareByLastModified).map(diagram => (
                    <Link to={'/edit/' + diagram.id} key={diagram.id} onClick={this.handleUpdateLastModified.bind(this, diagram.id)}>
                        <DiagramCard diagramName={diagram.name} diagramId={diagram.id} handleShowDeleteModal={this.props.handleShowDeleteModal}/>
                    </Link>
                ))}
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    const auth = state.firebase.auth;
    const diagrams = state.firestore.ordered.diagrams;
    return {
        auth: auth,
        diagrams: diagrams
    };
};

export default compose(connect(mapStateToProps),
firestoreConnect((props) => {
    if (!props.auth.uid) return []
    return [
        {collection: 'diagrams',
        where: [
           ['owner', '==', props.auth.uid]
        ]
    }
    ]
}))(DiagramLinks);