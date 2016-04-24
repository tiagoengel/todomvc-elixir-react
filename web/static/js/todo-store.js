import {httpPost, httpGet, httpDelete, httpPut} from './utils';
import lodashRemove from 'lodash/fp/remove';

const todoTemplate = {description: '', completed: false};
let observers = [];
let todos = [];

const removeTodo = (id, data) => lodashRemove(todo => todo.id == id, data);
const updateTodo = (newTodo, data) => data.map(todo => todo.id === newTodo.id ? newTodo : todo);

function changed(newTodos) {
  todos = newTodos;
  observers.forEach(cb => cb(newTodos));
}

export function onChange(cb) {
  observers = [...observers, cb];
}

export function load() {
  return httpGet('/api/todos')
    .then(response => changed(response.data));
}

export function create(description) {
  let todo = {...todoTemplate, description};
  return httpPost('/api/todos', {todo})
    .then(newTodo => changed([newTodo.data, ...todos]));
}

export function update(todo) {
  return httpPut(`api/todos/${todo.id}`, {todo})
    .then(response => changed(updateTodo(response.data, todos)));
}

export function remove({id}) {
  return httpDelete(`api/todos/${id}`)
    .then(() => changed(removeTodo(id, todos)));
}

export function removeAll(toRemove) {
  return Promise.all(toRemove.map(({id}) => {
    return httpDelete(`api/todos/${id}`).then(() => id);
  })).then(allRemoved => {
    changed(
      allRemoved.reduce((newTodos, removedId) => {
        return removeTodo(removedId, newTodos);
      }, todos)
    );
  });
}
