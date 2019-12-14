import React, { Component } from 'react';
import { Rnd } from "react-rnd";

class EditScreenControl extends Component {

    state = {
        key: this.props.control.key,
    }

    getStyle = (control) => {
        const style = {
            fontSize: control["font-size"] ? control["font-size"] : 12,
            backgroundColor: control["background-color"] ? control["background-color"] : 'transparent',
            borderColor: control["border-color"] ? control["border-color"] : 'black',
            borderWidth: control["border-width"] ? control["border-width"] : 0,
            borderRadius: control["border-radius"] ? control["border-radius"] : 0
        }
        return style;
    }

    getResizeableAxes = () => {
        var enable = {}
        if (!this.props.focus) {
            enable = {
                top: false, 
                right: false, 
                bottom: false, 
                left: false, 
                topRight: false, 
                bottomRight: false, 
                bottomLeft: false, 
                topLeft: false
            }
        } 
        else {
            enable = {
                top: true, 
                right: true, 
                bottom: true, 
                left: true, 
                topRight: true, 
                bottomRight: true, 
                bottomLeft: true, 
                topLeft: true
            }
        }
        return enable;
    }

    getXY = (control) => {
        const XY = {
            x: control["left"],
            y: control["top"]
        }
        return XY;
    }

    getWH = (control) => {
        const WH = {
            width: control["width"] ? control["width"] : 'auto',
            height: control["height"] ? control["height"] : 'auto'
        }
        return WH;
    }

    handleReposition =  (e, direction) => {
        e.preventDefault();
        e.stopPropagation();
        const {x, y} = direction;
        this.props.handleShiftFocus(this.state.key, e);
        this.props.handleChangeControl(this.state.key, "left", x, e);
        this.props.handleChangeControl(this.state.key, "top", y, e);
      };

    handleResize = (e, direction, ref, delta, position) => {
        e.stopPropagation();
        e.preventDefault();
        const {x, y} = position;
        this.props.handleShiftFocus(this.state.key, e);
        this.props.handleChangeControl(this.state.key, "width", ref.style.width, e);
        this.props.handleChangeControl(this.state.key, "height", ref.style.height, e);
        this.props.handleChangeControl(this.state.key, "left", x, e);
        this.props.handleChangeControl(this.state.key, "top", y, e);
    }

    render() {
        const control = this.props.control;
        const size = this.getWH(control);
        const position = this.getXY(control);
        const style = this.getStyle(control);
        const handleClasses = {
            bottom: 'resize_edge_tb',
            bottomLeft: 'resize_corner',
            bottomRight: 'resize_corner',
            left: 'resize_edge_lr',
            right: 'resize_edge_lr',
            top: 'resize_edge_tb',
            topLeft: 'resize_corner',
            topRight: 'resize_corner'
        }
        return (
            <Rnd className="diagram_control" 
                size={size} 
                style={style} 
                position={position} 
                resizeHandleClasses={handleClasses} 
                enableResizing={this.getResizeableAxes()} 
                bounds="parent" 
                onResizeStop={this.handleResize} 
                onDragStop={this.handleReposition}>
                    <div className="diagram_control_text">{control["value"]}</div>
            </Rnd>
        )
    }
}

export default EditScreenControl;