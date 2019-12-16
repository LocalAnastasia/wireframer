import React, { Component } from 'react';
import { Rnd } from "react-rnd";

class EditScreenControl extends Component {

    state = {
        key: this.props.control.key,
    }

    getStyle = () => {
        const control = this.props.control;
        const style = {
            fontSize: control["font-size"] ? parseInt(control["font-size"]) : 12,
            backgroundColor: control["background-color"] ? control["background-color"] : 'transparent',
            borderColor: control["border-color"] ? control["border-color"] : 'black',
            borderWidth: control["border-width"] ? parseInt(control["border-width"]) : 0,
            borderRadius: control["border-radius"] ? parseInt(control["border-radius"]) : 0

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

    getXY = () => {
        const control = this.props.control;
        const XY = {
            x: parseInt(control["left"]),
            y: parseInt(control["top"])
        }
        return XY;
    }

    getWH = () => {
        const control = this.props.control;
        const WH = {
            width: control["width"] ? parseInt(control["width"]) : 'auto',
            height: control["height"] ? parseInt(control["height"]) : 'auto'
        }
        return WH;
    }

    handleReposition =  (e, direction) => {
        const {x, y} = direction;
        this.props.handleShiftFocus(this.state.key, e);
        this.props.handleChangeControl(this.state.key, "left", x, e);
        this.props.handleChangeControl(this.state.key, "top", y, e);
      };

    handleResize = (e, direction, ref, delta, position) => {
        const {x, y} = position;
        this.props.handleShiftFocus(this.state.key, e);
        this.props.handleChangeControl(this.state.key, "width", ref.style.width, e);
        this.props.handleChangeControl(this.state.key, "height", ref.style.height, e);
        this.props.handleChangeControl(this.state.key, "left", x, e);
        this.props.handleChangeControl(this.state.key, "top", y, e);
    }

    handlePreventBubbling = (e) => {
        e.stopPropagation();
    }

    render() {
        const control = this.props.control;
        const size = this.getWH();
        const position = this.getXY();
        const style = this.getStyle();
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
        const gridScaler = 1 / this.props.zoomMultiplier;
        return (
            <Rnd className="diagram_control" 
                size={size} 
                style={style} 
                position={position} 
                resizeHandleClasses={handleClasses} 
                enableResizing={this.getResizeableAxes()} 
                bounds="parent" 
                resizeGrid={[gridScaler, gridScaler]}
                dragGrid={[gridScaler, gridScaler]}
                onResizeStop={this.handleResize} 
                onDragStop={this.handleReposition}
                onClick={this.handlePreventBubbling}>
                    <div className="diagram_control_text">{control["value"]}</div>
            </Rnd>
        )
    }
}

export default EditScreenControl;