import React from 'react';

class DiagramCard extends React.Component {

    render() {
        const { diagram } = this.props;
        return (
            <div className="card z-depth-0 todo-list-link">
                <div className="card-content grey-text text-darken-3">
                    <span className="card-title">{diagram.name}</span>
                </div>
            </div>
        );
    }
}
export default DiagramCard;