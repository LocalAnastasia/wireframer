import React, { Component } from 'react';
import { getFirestore } from 'redux-firestore';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Redirect, Link } from 'react-router-dom';
import { firestoreConnect } from 'react-redux-firebase';
import EditScreenControl from './EditScreenControl.js'
import EditScreenProperties from './EditScreenProperties.js';
import M from 'materialize-css';

class EditScreen extends Component {
    constructor(props){
        super(props);
        this.keydownFunction = this.keydownFunction.bind(this);
        this.keyupFunction = this.keyupFunction.bind(this);
        this.ctrl = false;
        this.d = false;
        this.del = false;
        this.state = {
            controlInFocus: null,
            diagram: this.props.diagram,
            controls: this.props.diagram.controls,
            newDiagramHeight: parseInt(this.props.diagram.height),
            newDiagramWidth: parseInt(this.props.diagram.width),
            edited: false
        }
    }

    keydownFunction(e) {
        switch(e.keyCode) {
            case 17:
                this.ctrl = true;
                break;
            
            case 8:
                this.del = true;
                break;
            
            case 68:
                this.d = true;
                break;
            
            default:
                break;
        }
        
        if (this.ctrl && this.d) { //DUPLICATE 
            this.handleDuplicateControl();
        }
        else if (this.del) { //DELETE
            this.handleDeleteControl();
        }
    }

    keyupFunction(e) {
        switch(e.keyCode) {
            case 17:
                this.ctrl = false;
                break;
            
            case 8:
                this.del = false;
                break;
            
            case 68:
                this.d = false;
                break;

            default:
                break;
        }   
    }

    componentDidMount(){
        document.addEventListener("keydown", this.keydownFunction, false);
        document.addEventListener("keyup", this.keyupFunction, false);
    }
    componentWillUnmount(){
        document.removeEventListener("keydown", this.keydownFunction, false);
        document.removeEventListener("keyup", this.keyupFunction, false);
    }

    getDiagramDimensionsUpdateStyle = () => {
        var height = this.state.newDiagramHeight;
        var width = this.state.newDiagramWidth;
        var newDimensions = this.state.newDiagramDimensions;
        var heightValid = false;
        var widthValid = false;
        if (height >= 1 && height <= 5000) {
            heightValid = true;
        }
        if (width >= 1 && width <= 5000) {
            widthValid = true;
        }
        if (newDimensions && heightValid && widthValid) {
            return {
                visibility: 'visible',
                pointerEvents: 'auto'
            };
        }

        return {
            visibility: 'hidden',
            pointerEvents: 'none'
            };
    }

    handlePreventBubbling = (e) => {
        e.nativeEvent.stopImmediatePropagation();
    }

    getDiagramStyle = () => {
        const style = {
            height: parseInt(this.state.diagram.height),
            width: parseInt(this.state.diagram.width)
        }
        return style
    }

    updateIndices = (controls) => {
        var controls = JSON.parse(JSON.stringify(controls));
        controls.map((control, ind) => control.key = ind);

        return controls;
    }
    
    handleDuplicateControl = () => {
        if (this.state.controlInFocus){
            var controls = JSON.parse(JSON.stringify(this.state.controls));
            var control = JSON.parse(JSON.stringify(controls[this.state.controlInFocus.key]));
            control.top += 10;
            control.left += 10;
            controls.push(control);
            controls = this.updateIndices(controls);
            this.setState({controls: controls});
            this.handleShiftFocus(controls.length - 1);
        }
    }

    handleDeleteControl = () => {
        if (this.state.controlInFocus){
            var controls = JSON.parse(JSON.stringify(this.state.controls));
            controls.splice(this.state.controlInFocus.key, 1);
            controls = this.updateIndices(controls);
            this.handleDefocus();
            this.setState({controls: controls});
        }
    }

    handleShiftFocus = (key, e) => {
        this.setState({controlInFocus: this.state.controls[key]});
    }

    handleDefocus = (e) => { 
        if (e) {
            e.stopPropagation();
            e.preventDefault();
        }
        this.setState({controlInFocus: null});
    }

    handleChangeControl = (key, property, value, e) => {
        var controls = JSON.parse(JSON.stringify(this.state.controls));
        var control = JSON.parse(JSON.stringify(this.state.controls[key]));
        control[property] = value;
        controls[key] = control;
        this.setState({
            controls: controls,
            controlInFocus: controls[key],
            edited: true});
    }

    handleAddControl = (type, e) => {
        e.stopPropagation();
        e.preventDefault();
        var controls = JSON.parse(JSON.stringify(this.state.controls));
        var control = {
            key: controls.length,
            type: type,
            "value": type,
            "left": 0,
            "top": 0,
            "height": 50,
            "width" : 100,
            "font-size": 18,
            "background-color": "ffffff",
            "border-color": "#000000",
            "border-width": 2,
            "border-radius": 7
        }
        controls.push(control);
        this.setState({
            controls: controls,
            controlInFocus: controls[control.key],
            edited: true
        });  
    }

    handleChangeDiagram = (property, value, e) => {
        var diagram = JSON.parse(JSON.stringify(this.state.diagram));
        diagram[property] = value;
        this.setState({
            diagram: diagram,
            edited: true});
    }

    handleDiagramWidthChanges = (e) => {
        var val = parseInt(e.target.value);
        this.setState({
            newDiagramWidth: val,
            newDiagramDimensions: this.state.newDiagramDimensions? true : val !== this.state.diagram.width
        })
    }

    handleDiagramHeightChanges = (e) => {
        var val = parseInt(e.target.value);
        this.setState({
            newDiagramHeight: val,
            newDiagramDimensions: this.state.newDiagramDimensions? true : val !== this.state.diagram.height
        })
    }

    handleUpdateDiagramWidthHeight = (e) => {
        e.stopPropagation();
        e.preventDefault();
        var controls = JSON.parse(JSON.stringify(this.state.controls));
        var diagram = JSON.parse(JSON.stringify(this.state.diagram));
        //X-axis (width) ratio
        var newX = parseInt(this.state.newDiagramWidth);
        var oldX = this.state.diagram["width"];
        var ratioX = newX / oldX;
        //Y-axis (height) ratio
        var newY = parseInt(this.state.newDiagramHeight);
        var oldY = this.state.diagram["height"];
        var ratioY = newY / oldY;
        controls.forEach((ele, ind, arr) => {
            if(arr[ind].height > newY) { //Clip height
                arr[ind].height = newY;
            }
            if(arr[ind].width > newX) { //Clip width
                arr[ind].width = newX;
            }
            arr[ind].left *= ratioX
            arr[ind].top *= ratioY
        })
        diagram["width"] = newX;
        diagram["height"] = newY;
        this.setState({
            diagram: diagram,
            controls: controls,
            newDiagramDimensions: false,
            edited: true
        });
    }

    handleChangeDiagramName = (e) => {
        e.stopPropagation();
        e.preventDefault();
        const val = e.target.value;
        this.handleChangeDiagram('name', val, e);
    }

    handleShowCloseModal = (e) => {
        const elem = document.getElementById('diagram_close_modal');
        const instance = M.Modal.init(elem, {dismissible: false});
        instance.open();
    }

    handleHideCloseModal = (e) => {
        const elem = document.getElementById('diagram_close_modal');
        const instance = M.Modal.init(elem, {dismissible: false});
        instance.destroy();
    }

    handleShowSaveModal = (e) => {
        const elem = document.getElementById('diagram_save_modal');
        const instance = M.Modal.init(elem, {dismissible: false});
        instance.open();
    }

    handleHideSaveModal = (e) => {
        const elem = document.getElementById('diagram_save_modal');
        const instance = M.Modal.init(elem, {dismissible: false});
        instance.destroy();
    }

    handleCloseDiagram = e => {
        if (this.state.edited) {
            this.handleShowCloseModal(e);
        }
        else{
            this.props.history.push('/');
        }
    }

    handleSaveDiagram = e => {
        const fireStore = getFirestore();
        var newDiagram = JSON.parse(JSON.stringify(this.state.diagram));
        var newControls = JSON.parse(JSON.stringify(this.state.controls));
        fireStore.collection('diagrams').doc(newDiagram.id).set({
            lastModified: fireStore.Timestamp.now().seconds,
            owner: this.props.auth.uid,
            name: newDiagram.name,
            height: newDiagram.height,
            width: newDiagram.width,
            controls: newControls
        }).then(
            this.setState({
                edited: false
            })
        ).catch(error => console.log('Failed to save diagram', error));
    }

    render() {
        const controls = this.state.controls;
        const diagramStyle = this.getDiagramStyle();
        if (!this.props.auth.uid) {
            return <Redirect to="/login" />;
        }
        return (
            <div className="dashboard container edit_container">
                <div className="edit_container_left">
                    <div className="edit_toolbar">
                        <div className="material-icons toolbar_button">zoom_in</div>
                        <div className="material-icons toolbar_button">zoom_out</div>
                        <div className="toolbar_button" onClick={(e) => {this.handleSaveDiagram(e); this.handleShowSaveModal(e)}}>Save</div>
                        <div className="toolbar_button" onClick={this.handleCloseDiagram}>Close</div>
                    </div>
                    <div className="edit_selection_bar">
                        <div className="waves-effect waves-light btn selection_bar_button" onClick={this.handleAddControl.bind(this, "container")}>
                            <div>
                                <i className="material-icons large">crop_landscape</i>
                                <p>Container</p>
                            </div>
                        </div>
                        <div className="waves-effect waves-light btn selection_bar_button" onClick={this.handleAddControl.bind(this, "label")}>
                            <div>
                                <i className="material-icons large">crop_landscape</i>
                                <p>Label</p>
                            </div>
                        </div>
                        <div className="waves-effect waves-light btn selection_bar_button" onClick={this.handleAddControl.bind(this, "button")}>
                            <div>
                                <i className="material-icons large">crop_landscape</i>
                                <p>Button</p>
                            </div>
                        </div>
                        <a className="waves-effect waves-light btn selection_bar_button" onClick={this.handleAddControl.bind(this, "textfield")}>
                            <div>
                                <i className="material-icons large">text_fields</i>
                                <p>Textfield</p>
                            </div>
                        </a>
                    </div>
                </div>
                <div className="edit_container_center" onClick={this.handleDefocus}>
                    <span></span>
                    <div className="edit_controls_container" style={diagramStyle}>
                        {controls && controls.map((control) => 
                            <EditScreenControl 
                                focus={this.state.controlInFocus && control.key === this.state.controlInFocus.key ? true : false} 
                                control={control} 
                                handleChangeControl={this.handleChangeControl} 
                                handleShiftFocus={this.handleShiftFocus}/>)}  
                    </div>
                </div>
                <div className="edit_container_right">
                    <div className="row">
                        <h4>Diagram</h4>
                    </div>
                    <div className="edit_diagram_name row">
                        <div className="input-field">
                            <input value={this.state.diagram.name} id="diagram_name" type="text" className="validate" onChange={this.handleChangeDiagramName} onKeyDown={this.handlePreventBubbling}></input>
                            <label className="active" htmlFor="diagram_name">Name</label>
                        </div>
                    </div>
                    <div className="edit_diagram_dimensions row">
                        <div className="input-field">
                            <input value={this.state.newDiagramHeight} id="diagram_height" type="number" className="validate" min="1" max="5000" onChange={this.handleDiagramHeightChanges} onKeyDown={this.handlePreventBubbling}></input>
                            <label className="active" htmlFor="diagram_height">H</label>
                            <span className="helper-text" data-error="Must be between 1 and 5000"></span>
                        </div>
                        <div className="input-field">
                            <input value={this.state.newDiagramWidth} id="diagram_width" type="number" className="validate" min="1" max="5000" onChange={this.handleDiagramWidthChanges} onKeyDown={this.handlePreventBubbling}></input>
                            <label className="active" htmlFor="diagram_width">W</label>
                            <span className="helper-text" data-error="Must be between 1 and 5000"></span>
                        </div>
                        <div className="btn-mini" style={this.getDiagramDimensionsUpdateStyle()} onClick={this.handleUpdateDiagramWidthHeight}>*Update</div>
                    </div>
                    <div className="edit_properties_bar">
                        <EditScreenProperties control={this.state.controlInFocus} handleChangeControl={this.handleChangeControl}/>
                    </div>
                </div>
                <div id="diagram_save_modal" className="modal">
                    <div className="modal-content">
                        <h4>Save Diagram</h4>
                        <h6>Diagram successfully saved to database.</h6>
                    </div>
                    <div className="modal-footer">
                        <div className="btn-flat diagram_modal_button" onClick={this.handleHideSaveModal}>Close</div>
                    </div>
                </div>
                <div id="diagram_close_modal" className="modal">
                    <div className="modal-content">
                        <h4>Close Diagram</h4>
                        <h6>You have unsaved changes. Do you want to save the changes?</h6>
                    </div>
                    <div className="modal-footer">
                        <Link to="/" className="btn-flat diagram_modal_button" onClick={this.handleSaveDiagram}>Save and exit</Link>
                        <Link to="/" className="btn-flat diagram_modal_button" onClick={this.handleHideCloseModal}>No</Link>
                        <div className="btn-flat diagram_modal_button" onClick={this.handleHideCloseModal}>Cancel</div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    const { id } = ownProps.match.params;
    const auth = state.firebase.auth;
    if (state.firestore.ordered.diagrams){
        var diagram = state.firestore.ordered.diagrams.find(diagram => {
            return diagram.id === id;
        });
    }
    return {
        auth: auth,
        diagram: diagram
    };
};

export default compose(
    connect(mapStateToProps),
    firestoreConnect((props) => {
        if (!props.auth.uid) return []
        return [
            {collection: 'diagrams',
            where: [
               ['owner', '==', props.auth.uid]
            ]
        }
        ]
    }))(EditScreen);