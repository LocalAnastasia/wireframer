import React from 'react';

class DiagramCard extends React.Component {

    render() {
        const diagramName = this.props.diagramName;
        const diagramId = this.props.diagramId;
        return (
            <div className="card z-depth-0">
                <div className="card-content grey-text text-darken-3 diagram_card">
                    <div>
                        <span className="card-title">{diagramName}</span>
                    </div>
                    <div onClick={this.props.handleShowDeleteModal.bind(this, diagramId)}>
                        <i className="material-icons small diagram_delete_button">clear</i>
                    </div>
                </div>
            </div>
        );
    }
}
export default DiagramCard;