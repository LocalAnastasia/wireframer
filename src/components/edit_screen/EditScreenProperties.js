import React, { Component } from 'react';
import { SketchPicker, GithubPicker, TwitterPicker } from 'react-color';

class EditScreenProperties extends Component {
    constructor(props){
        super(props);
    }

    state = {
        showBackgroundColorPicker: false,
        showBorderColorPicker: false
    }

    getStyle = (control) => {
        const style = {
            fontSize: 12,
            backgroundColor: control["background-color"] ? control["background-color"] : 'inherit',
            borderColor: control["border-color"] ? control["border-color"] : 'inherit',
            borderWidth: control["border-width"] ? 2 : 0,
            borderRadius: control["border-radius"] ? control["border-radius"] : 0
        }
        return style;
    }

    handlePreventBubbling = (e) => {
        e.nativeEvent.stopImmediatePropagation();
    }

    handleEditControlText = (e) => {
        const control = this.props.control;
        this.props.handleChangeControl(control.key, "value", e.target.value, e);
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
                <SketchPicker 
                    className="color_picker"
                    color={this.getCurrentBackgroundColorStyle(control)["backgroundColor"]} 
                    onChange={this.handleChangeBackgroundColor}
                    presetColors={['TRANSPARENT','#D0021B', '#F5A623', '#F8E71C', '#8B572A', 
                                    '#7ED321', '#417505', '#BD10E0', '#9013FE', '#4A90E2', 
                                    '#50E3C2', '#B8E986', '#000000', '#4A4A4A', '#9B9B9B', '#FFFFFF']}/>
                    
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
                <SketchPicker 
                    color={this.getCurrentBorderColorStyle(control)["borderColor"]}
                    className="color_picker" 
                    onChange={this.handleChangeBorderColor}
                    presetColors={['TRANSPARENT','#D0021B', '#F5A623', '#F8E71C', '#8B572A', 
                                    '#7ED321', '#417505', '#BD10E0', '#9013FE', '#4A90E2', 
                                    '#50E3C2', '#B8E986', '#000000', '#4A4A4A', '#9B9B9B', '#FFFFFF']}/>
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
            <input
                        type="text"
                        value={control["value"]}
                        className="properties_control"
                        style={style}
                        onChange={this.handleEditControlText}
                        onKeyDown={this.handlePreventBubbling}>
            </input>
        ); 
    }

    getFontSize = (control) => {
        switch(control.type){
            case "label":
            case "button":
            case "textfield":
                return(
                    <div className="property_container row">
                        <div className="input-field col s6">
                            <input value={control["font-size"]} id="control_font_size" type="number" onChange={this.handleChangeFontSize} onKeyDown={this.handlePreventBubbling} className="validate"></input>
                            <label className="active" htmlFor="control_font_size">Font Size</label>
                        </div>
                    </div>
                )
            default:
                return null;
        }
    }

    getMaxBorderWidth = () => {
        const control = this.props.control;
        return Math.round(0.125 * Math.min(control.height, control.width));
    }

    render() {
        const control = this.props.control;
        if (control){
            return (
                <div>
                    <h5>Properties</h5>
                    <div className="property_container properties_control_container row">{this.getControl(control)}</div>
                    {this.getFontSize(control)}
                    <div className="property_container row">
                        <div>Background: </div>
                        <div>
                            <div className="color_picker" onClick={this.toggleBackgroundColorPicker} style={this.getCurrentBackgroundColorStyle(control)}>{this.getCurrentBackgroundColorStyle(control)["backgroundColor"]}</div>
                            {this.getBackgroundColorPicker(control)}
                        </div>
                    </div>
                    <div className="property_container row">
                        <div>Border Color: </div>
                        <div>
                            <div className="color_picker" onClick={this.toggleBorderColorPicker} style={this.getCurrentBorderColorStyle(control)}>{this.getCurrentBorderColorStyle(control)["backgroundColor"]}</div>
                            {this.getBorderColorPicker(control)}
                        </div>
                    </div>
                    <div className="property_container row">
                        <div>Border Thickness: </div>
                        <input type="range" value={control["border-width"]} onChange={this.handleChangeBorderThickness} min={0} max={this.getMaxBorderWidth()} />
                    </div>
                    <div className="property_container row">
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
