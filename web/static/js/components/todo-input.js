import React, { Component } from 'react';

const ENTER = 13;
const ESC = 27;

export default class TodoInput extends Component {
  constructor(props) {
    super(props);
    this.state = {value: props.initialValue || ''}
    this.lastKey = -1;
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.initialValue !== this.props.initialValue) {
      this.setState({value: nextProps.initialValue});
    }
  }
  _trigger(eventName, ...params) {
    if (this.props[eventName]) {
      return this.props[eventName](...params);
    }
    return Promise.reject().catch(() => {});
  }
  _save() {
    const value = this.state.value && this.state.value.trim();
    if (value) {
      this._trigger('onSave', value)
      .then(() => {
        if (this.props.clearAfterSave) {
          this.setState({value: ''});
        }
      });
    }
  }
  _handleChange(e) {
    this.setState({value: e.target.value});
  }
  _handleKeyUp(e) {
    this.lastKey = e.keyCode;
    if (e.keyCode === ENTER) {
      if (e.target.value === '') {
        this._trigger('onDelete')
      } else {
        this._save();
      }
    } else if (e.keyCode === ESC) {
      this._trigger('onCancel');
      this.setState({value: this.props.initialValue});
    }
  }
  _handleBlur() {
    if (this.lastKey !== ESC) {
      this._save();
    }
  }
  focus() {
    this.refs.input.focus();
  }
  render() {
    return (
      <input ref="input"
        className={this.props.className}
        placeholder="What needs to be done?"
        value={this.state.value}
        onChange={::this._handleChange}
        onKeyUp={::this._handleKeyUp}
        onBlur={::this._handleBlur}
      />
   )
  }
}
