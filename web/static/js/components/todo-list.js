import React, { Component } from 'react';
import className from 'classnames';
import TodoInput from './todo-input';


export default class TodoList extends Component {
  constructor(props) {
    super(props);
    this.state = {editing: -1}
  }
  _toggleCompleted(todo) {
    return this.props.onUpdate({...todo, completed: !todo.completed});
  }

  _save(todo, description) {
    return this.props.onUpdate({...todo, description})
    .then(::this._stopEditing);
  }

  _delete(todo) {
    return this.props.onDelete(todo)
    .then(::this._stopEditing);
  }

  _isEditing(idx) {
    return this.state.editing === idx;
  }

  _stopEditing() {
    this.setState({editing: -1});
  }

  _startEditing(idx) {
    this.setState({editing: idx}, () => {
      this.refs[`todoInput${idx}`].focus();
    });
  }

  _renderCompletedCheckbox(todo) {
    return (
      <input
        className="toggle"
        type="checkbox"
        checked={todo.completed}
        onChange={() => this._toggleCompleted(todo)}
      />
    )
  }

  _renderTodos(todos) {
    return todos.map((todo, idx) => {
      const liClassName = className(
        {completed: todo.completed},
        {editing: this._isEditing(idx)}
      );
      return (
        <li key={idx} className={liClassName}>
          <div className="view">
            {this._renderCompletedCheckbox(todo)}
            <label id={`todoLabel${idx}`} onDoubleClick={() => this._startEditing(idx)}>{todo.description}</label>
            <button className="destroy" onClick={() => this._delete(todo)}></button>
          </div>
          <TodoInput
            ref={`todoInput${idx}`}
            className="edit"
            initialValue={todo.description}
            onSave={description => this._save(todo, description)}
            onCancel={::this._stopEditing}
            onDelete={() => this._delete(todo)}
          />
        </li>
      )
    });
  }
  render() {
    return (
      <ul className="todo-list">
        {this._renderTodos(this.props.todos)}
      </ul>
    )
  }
}
