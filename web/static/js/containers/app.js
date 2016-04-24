import React, { Component } from 'react';
import { Link } from 'react-router';
import debounce from 'lodash/fp/debounce';
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
    this.state = {todos: [], allChecked: false};
    this._toggleAll = debounce(150, this._toggleAll);
  }

  componentWillMount() {
    todoStore.onChange(todos => this.setState({todos}));
    todoStore.load();
  }

  _handleToggleAll() {
    const checked = !this.state.allChecked;
    this.setState({allChecked: checked});
    this._toggleAll(checked);
  }

  _toggleAll(checked) {
    let toUpdate = this.state.todos
      .filter(todo => todo.completed !== checked)
      .map(todo => {
        return {...todo, completed: checked}
      });
    todoStore.updateAll(toUpdate);
  }

  _clearCompleted() {
    let allCompleted = FILTERS.completed(this.state.todos);
    return todoStore.removeAll(allCompleted)
      .then(() => this.setState({allChecked: false}));
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
    const todosCompleted = filter === FILTERS.completed ? todos : FILTERS.completed(this.state.todos);
    const itensLeft = this.state.todos.length - todosCompleted.length;
    return (
      <section className="todoapp">
        <header className="header">
          <h1>todos</h1>
          <TodoInput clearAfterSave autoFocus className="new-todo" onSave={todoStore.create}/>
        </header>
        <section className="main">
          {this.state.todos.length ?
            <label htmlFor="toggle-all">Mark all as complete</label> : null
          }
          {this.state.todos.length ?
            <input
              className="toggle-all"
              type="checkbox"
              checked={this.state.allChecked}
              onChange={::this._handleToggleAll}
            /> : null
          }
          <TodoList
            todos={todos}
            onDelete={todoStore.remove}
            onUpdate={todoStore.update}
          />
        </section>
        {this.state.todos.length ?
          <footer className="footer">
            <span className="todo-count">
              <strong>{itensLeft}</strong> item{itensLeft === 1 ? '' : 's'} left
            </span>
            <ul className="filters">
              {this._renderFilter('All')}
              {this._renderFilter('Active')}
              {this._renderFilter('Completed')}
            </ul>
            {todosCompleted.length ? <button className="clear-completed" onClick={::this._clearCompleted}>Clear completed</button> : null}
          </footer> : null
        }
      </section>
    )
  }
}
