import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Redirect } from 'react-router-dom';
import { firestoreConnect } from 'react-redux-firebase';
import EditScreenControl from './EditScreenControl.js'
import EditScreenProperties from './EditScreenProperties.js';

class EditScreen extends Component {

    state = {
        controlInFocus: null,
        diagram: this.props.diagram,
        controls: this.props.diagram.controls
    }

    handleShiftFocus = (key, e) => {
        e.stopPropagation();
        e.preventDefault();
        this.setState({controlInFocus: this.state.controls[key]});
    }

    handleChangeControl = (key, property, value, e) => {
        e.stopPropagation();
        e.preventDefault();
        var controls = JSON.parse(JSON.stringify(this.state.controls));
        var control = JSON.parse(JSON.stringify(this.state.controls[key]));
        control[property] = value;
        controls[key] = control;
        this.setState({controls: controls});
    }

    render() {
        const diagram = this.state.diagram;
        const controls = this.state.controls;
        if (!this.props.auth.uid) {
            return <Redirect to="/login" />;
        }
        return (
            <div className="dashboard container edit_container">
                <div className="edit_container_left">
                    <div className="edit_toolbar">
                        <div className="material-icons">zoom_in</div>
                        <div className="material-icons">zoom_out</div>
                        <div>Save</div>
                        <div>Close</div>
                    </div>
                    <div className="edit_selection_bar">
                        <div>
                            <div className="material-icons large">crop_landscape</div>
                            <div>Container</div>
                        </div>
                        <div>
                            <div className="material-icons large">crop_landscape</div>
                            <div>Label</div>
                        </div>
                        <div>
                            <div className="material-icons large">crop_landscape</div>
                            <div>Button</div>
                        </div>
                        <div>
                            <div className="material-icons large">crop_landscape</div>
                            <div>Textfield</div>
                        </div>
                    </div>
                </div>
                <div className="edit_container_center">
                    {controls && controls.map((control) => 
                        <EditScreenControl control={control} handleChangeControl={this.handleChangeControl} onClick={this.handleShiftFocus.bind(this, control.key)}/>
                    )}
                </div>
                <div className="edit_container_right">
                    <div className="edit_properties_bar">
                        <EditScreenProperties control={this.state.controlInFocus} handleChangeControl={this.handleChangeControl}/>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    const { id } = ownProps.match.params;
    const auth = state.firebase.auth;
    var diagram = {};
    if (state.firestore.ordered.users){
        var user = state.firestore.ordered.users.find(user => {
            return user.id === auth.uid;
        });
        if (user) {
            diagram = user.diagrams[id];
        }
    }
    return {
        auth: auth,
        diagram: diagram
    };
};

export default compose(
    connect(mapStateToProps),
    firestoreConnect([
      { collection: 'users' },
    ]),
)(EditScreen);