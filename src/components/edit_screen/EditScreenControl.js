import React, { Component } from 'react';
import Draggable from 'react-draggable';

class EditScreenControl extends Component {

    state = {
        key: this.props.control.key,
        position : {
            x: this.props.control["left"],
            y: this.props.control["top"]
        }
    }
    
    updateXY =  (e, position) => {
        e.preventDefault();
        e.stopPropagation();
        const {x, y} = position;
        this.setState({position: {x, y}});
      };

    render() {
        const control = this.props.control;
        const defaultXY = {
            x: control["left"],
            y: control["top"]
        }
        const style = {
            height: control["height"] ? control["height"] : 'auto',
            width: control["width"] ? control["width"] : 'auto',
            fontSize: control["font-size"] ? control["font-size"] : 'auto',
            backgroundColor: control["background-color"] ? control["background-color"] : 'auto',
            borderColor: control["border-color"] ? control["border-color"] : 'auto',
            borderWidth: control["border-width"] ? control["border-width"] : 'auto',
            borderRadius: control["border-radius"] ? control["border-radius"] : 'auto'
        }

        switch(control.type){
            case "container":
                return (
                    <Draggable position={this.state.position} onDrag={this.updateXY} bounds="parent">
                        <div className="diagram_control" style={style}></div>
                    </Draggable>
                );
            case "label":
                return (
                    <Draggable position={this.state.position} onDrag={this.updateXY} bounds="parent">
                        <div className="diagram_control" style={style}>{control["value"]}</div>
                    </Draggable>
                );
            case "button":
                return (
                    <Draggable position={this.state.position} onDrag={this.updateXY} bounds="parent">
                        <button className="diagram_control" style={style}>{control["value"]}</button>
                    </Draggable>
                );
            case "textfield":
                return (
                    <Draggable position={this.state.position} onDrag={this.updateXY} bounds="parent">
                        <textfield className="diagram_control" style={style}>{control["value"]}</textfield>
                    </Draggable>
                );
            default:
                return null;
        }
    }
}

export default EditScreenControl;