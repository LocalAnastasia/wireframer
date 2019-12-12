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

    handleDefocus = (e) => {
        e.stopPropagation();
        e.preventDefault();
        this.setState({controlInFocus: null});
    }

    handleChangeControl = (key, property, value, e) => {
        e.stopPropagation();
        e.preventDefault();
        var controls = JSON.parse(JSON.stringify(this.state.controls));
        var control = JSON.parse(JSON.stringify(this.state.controls[key]));
        control[property] = value;
        controls[key] = control;
        this.setState({
            controls: controls,
            controlInFocus: controls[key]});
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
                        <div className="material-icons toolbar_button">zoom_in</div>
                        <div className="material-icons toolbar_button">zoom_out</div>
                        <div className="toolbar_button">Save</div>
                        <div className="toolbar_button">Close</div>
                    </div>
                    <div className="edit_selection_bar">
                        <div className="waves-effect waves-light btn selection_bar_button">
                            <div>
                                <i className="material-icons large">crop_landscape</i>
                                <p>Container</p>
                            </div>
                        </div>
                        <div className="waves-effect waves-light btn selection_bar_button">
                            <div>
                                <i className="material-icons large">crop_landscape</i>
                                <p>Label</p>
                            </div>
                        </div>
                        <div className="waves-effect waves-light btn selection_bar_button">
                            <div>
                                <i className="material-icons large">crop_landscape</i>
                                <p>Button</p>
                            </div>
                        </div>
                        <a className="waves-effect waves-light btn selection_bar_button">
                            <div>
                                <i className="material-icons large">text_fields</i>
                                <p>Textfield</p>
                            </div>
                        </a>
                    </div>
                </div>
                <div className="edit_container_center">
                    {controls && controls.map((control) => 
                        <EditScreenControl control={control} handleChangeControl={this.handleChangeControl} handleShiftFocus={this.handleShiftFocus}/>
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