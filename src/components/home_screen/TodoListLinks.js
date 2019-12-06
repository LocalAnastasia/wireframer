import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { compose } from 'redux';
import TodoListCard from './TodoListCard';
import { getFirestore } from 'redux-firestore';

class TodoListLinks extends React.Component {
    compareByLastModified = (a, b) => {
        return a.lastModified > b.lastModified ? -1 : 1;
    }

    handleUpdateLastModified = (todoListId, e) => {
        const fireStore = getFirestore();
        fireStore.collection('todoLists').doc(todoListId).update({
            lastModified: fireStore.Timestamp.now().seconds
        });
    }

    render() {
        const todoLists = this.props.todoLists;
        return (
            <div className="todo-lists section">
                {todoLists && todoLists.sort(this.compareByLastModified).map(todoList => (
                    <Link to={'/todoList/' + todoList.id} key={todoList.id} onClick={this.handleUpdateLastModified.bind(this, todoList.id)}>
                        <TodoListCard todoList={todoList} />
                    </Link>
                ))}
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        todoLists: state.firestore.ordered.todoLists,
        auth: state.firebase.auth,
    };
};

export default compose(connect(mapStateToProps))(TodoListLinks);