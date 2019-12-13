import React, { Component } from 'react';
import { SketchPicker } from 'react-color';

class EditScreenProperties extends Component {

    state = {
        showBackgroundColorPicker: false,
        showBorderColorPicker: false
    }

    getStyle = (control) => {
        const style = {
            fontSize: control["font-size"] ? control["font-size"] : 'auto',
            backgroundColor: control["background-color"] ? control["background-color"] : 'none',
            borderColor: control["border-color"] ? control["border-color"] : 'none',
            borderWidth: control["border-width"] ? control["border-width"] : 'none',
            borderRadius: control["border-radius"] ? control["border-radius"] : 'auto'
        }
        return style;
    }

    handleChangeBorderThickness = e => {
        e.stopPropagation();
        e.preventDefault(); 
        const control = this.props.control;
        this.props.handleChangeControl(control.key, 'border-width', parseInt(e.target.value), e);     
    }

    handleChangeBorderRadius = e => {
        e.stopPropagation();
        e.preventDefault(); 
        const control = this.props.control;
        this.props.handleChangeControl(control.key, 'border-radius', parseInt(e.target.value), e);     
    }

    handleChangeFontSize = e => {
        e.stopPropagation();
        e.preventDefault(); 
        const control = this.props.control;
        this.props.handleChangeControl(control.key, 'font-size', parseInt(e.target.value), e); 
    }

    handleCloseColorPickers = e => {
        e.stopPropagation();
        e.preventDefault();
        this.setState({
            showBackgroundColorPicker: false,
            showBorderColorPicker: false
        });
    }

    toggleBackgroundColorPicker = e => {
        e.stopPropagation();
        e.preventDefault();
        this.setState({showBackgroundColorPicker: !this.state.showBackgroundColorPicker});
    }

    getCurrentBackgroundColorStyle = (control) => {
        const style =  {
            backgroundColor: control["background-color"] ? control["background-color"] : 'auto'
        }
        return style;
    }

    getBackgroundColorPicker = (control) => {
        if (this.state.showBackgroundColorPicker)
        {   
            const control = this.props.control;
            return(
                <SketchPicker color={this.getCurrentBackgroundColorStyle(control)["backgroundColor"]} onChange={this.handleChangeBackgroundColor}/>
            )
        }

        return (<div></div>)
    }

    handleChangeBackgroundColor = (color, e) => {
        e.stopPropagation();
        e.preventDefault();
        const control = this.props.control;
        this.props.handleChangeControl(control.key, 'background-color', color.hex, e);
    }

    toggleBorderColorPicker = e => {
        e.stopPropagation();
        e.preventDefault();
        this.setState({showBorderColorPicker: !this.state.showBorderColorPicker});
    }

    getCurrentBorderColorStyle = (control) => {
        const style =  {
            backgroundColor: control["border-color"] ? control["border-color"] : 'auto'
        }
        return style;
    }

    getBorderColorPicker = (control) => {
        if (this.state.showBorderColorPicker)
        {   
            const control = this.props.control;
            return(
                <SketchPicker color={this.getCurrentBorderColorStyle(control)["borderColor"]} onChange={this.handleChangeBorderColor}/>
            )
        }

        return (<div></div>)
    }

    handleChangeBorderColor = (color, e) => {
        e.stopPropagation();
        e.preventDefault();
        const control = this.props.control;
        this.props.handleChangeControl(control.key, 'border-color', color.hex, e);
    }

    getControl = (control) => {
        const style = this.getStyle(control);
        return (
            <div className="properties_control" style={style}>{control["value"] ? control["value"] : control["type"]}</div>
        ); 
    }

    getFontSize = (control) => {
        switch(control.type){
            case "label":
            case "button":
            case "textfield":
                return(
                    <div className="property_container">
                        Font Size: 
                        <div className="input-field inline">
                            <i className="material-icons small prefix">text_fields</i>
                            <input id="icon_prefix" type="number" value={control["font-size"]} onChange={this.handleChangeFontSize}></input>
                        </div>
                    </div>
                )
            default:
                return null;
        }
    }

    render() {
        const control = this.props.control;
        if (control){
            return (
                <div>
                    <h5>Properties</h5>
                    <div className="property_container properties_control_container">{this.getControl(control)}</div>
                    {this.getFontSize(control)}
                    <div className="property_container">
                        <div>Background: </div>
                        <div>
                            <div className="color_picker" onClick={this.toggleBackgroundColorPicker} style={this.getCurrentBackgroundColorStyle(control)}>{this.getCurrentBackgroundColorStyle(control)["backgroundColor"]}</div>
                            {this.getBackgroundColorPicker(control)}
                        </div>
                    </div>
                    <div className="property_container">
                        <div>Border Color: </div>
                        <div>
                            <div className="color_picker" onClick={this.toggleBorderColorPicker} style={this.getCurrentBorderColorStyle(control)}>{this.getCurrentBorderColorStyle(control)["backgroundColor"]}</div>
                            {this.getBorderColorPicker(control)}
                        </div>
                    </div>
                    <div className="property_container">
                        <div>Border Thickness: </div>
                        <input type="range" value={control["border-width"]} onChange={this.handleChangeBorderThickness} min="0" max="100" />
                    </div>
                    <div className="property_container">
                        <div>Border Radius: </div>
                        <input type="range" value={control["border-radius"]} onChange={this.handleChangeBorderRadius} min="0" max="10" />
                    </div>
                </div>
            );
        }

        return (
            <div></div>
        )
    }
}

export default EditScreenProperties;
