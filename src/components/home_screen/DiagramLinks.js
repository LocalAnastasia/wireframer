import React, { useImperativeHandle } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { compose } from 'redux';
import DiagramCard from './DiagramCard';
import { getFirestore } from 'redux-firestore';
import { firestoreConnect } from 'react-redux-firebase';

class DiagramLinks extends React.Component {
    compareByLastModified = (a, b) => {
        return a.lastModified > b.lastModified ? -1 : 1;
    }

    handleUpdateLastModified = (diagramId, e) => {
        const fireStore = getFirestore();
        const diagrams = JSON.parse(JSON.stringify(this.props.diagrams));
        console.log(diagrams);
        diagrams[diagramId].lastModified = fireStore.Timestamp.now().seconds;
        fireStore.collection('users').doc(this.props.auth.uid).update({
            diagrams: diagrams
        });
    }

    render() {
        const diagrams = this.props.diagrams;
        console.log(diagrams);
        return (
            <div className="todo-lists section">
                {diagrams && diagrams.sort(this.compareByLastModified).map((diagram, id) => (
                    <Link to={'/edit/' + id} key={id} onClick={this.handleUpdateLastModified.bind(this, id)}>
                        <DiagramCard diagram={diagram} />
                    </Link>
                ))}
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    const auth = state.firebase.auth;
    var diagrams = []
    if (state.firestore.ordered.users){
        var user = state.firestore.ordered.users.find(user => {
            return user.id === auth.uid;
        });
        if (user) {
            diagrams = user.diagrams;
        }
    }
    return {
        diagrams: diagrams,
        auth: auth,
    };
};

export default compose(connect(mapStateToProps))(DiagramLinks);