import React, { Component } from 'react';
import { Link } from 'react-router';
import TodoInput from '../components/todo-input';
import TodoList from '../components/todo-list';
import * as todoStore from '../todo-store';

const FILTERS = {
  all: todos => todos,
  active: todos => todos.filter(todo => !todo.completed),
  completed: todos => todos.filter(todo => todo.completed)
}

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {todos: []};
  }

  componentWillMount() {
    todoStore.onChange(todos => this.setState({todos}));
    todoStore.load();
  }

  _clearCompleted() {
    let allCompleted = FILTERS.completed(this.state.todos);
    return todoStore.removeAll(allCompleted);
  }

  _renderFilter(filter) {
    return (
      <li>
        <Link to={`/${filter.toLowerCase()}`} activeClassName="selected">{filter}</Link>
      </li>
    )
  }

  render() {
    const filter = FILTERS[this.props.params.filter] || FILTERS.all;
    const todos = filter(this.state.todos);
    return (
      <section className="todoapp">
        <header className="header">
          <h1>todos</h1>
          <TodoInput clearAfterSave className="new-todo" onSave={todoStore.create}/>
        </header>
        <section className="main">
          <label>Mark all as complete</label>
          <input className="toggle-all" type="checkbox"/>
          <TodoList
            todos={todos}
            onDelete={todoStore.remove}
            onUpdate={todoStore.update}
          />
        </section>
        <footer className="footer">
          <span className="todo-count">
            <strong>{this.state.todos.length}</strong> item left
          </span>
          <ul className="filters">
            {this._renderFilter('All')}
            {this._renderFilter('Active')}
            {this._renderFilter('Completed')}
          </ul>
          <button className="clear-completed" onClick={::this._clearCompleted}>Clear completed</button>
        </footer>
      </section>
    )
  }
}
