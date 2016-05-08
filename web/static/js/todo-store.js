/*eslint no-console:0*/

import {httpPost, httpGet, httpDelete, httpPut} from './utils';
import lodashRemove from 'lodash/fp/remove';
import { Socket } from 'phoenix';
import shortid from 'shortid';

const client_id = shortid.generate();

const todoTemplate = {description: '', completed: false};
let observers = [];
let todos = [];

const removeTodo = (id, data) => lodashRemove(todo => todo.id == id, data);
const updateTodo = (newTodo, data) => data.map(todo => todo.id === newTodo.id ? newTodo : todo);

let socket = new Socket('/socket', {
  logger: ((kind, msg, data) => { console.log(`${kind}: ${msg}`, data) })
});

socket.connect({client_id: client_id});
socket.onOpen( ev => console.log('OPEN', ev));
socket.onError( ev => console.log('ERROR', ev));
socket.onClose( e => console.log('CLOSE', e));

let chan = socket.channel('todos', {});
console.log('chan', chan);
chan.join().receive('ignore', () => console.log('auth error'))
           .receive('ok', () => console.log('join ok'))
chan.onError(e => console.log('something went wrong', e))
chan.onClose(e => console.log('channel closed', e))

chan.on('changed', todo => {
  changed(updateTodo(todo, todos));
});
chan.on('added', todo => {
  changed([todo, ...todos]);
});
chan.on('removed', todo => {
  changed(removeTodo(todo.id, todos));
});

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
  return httpPost('/api/todos', {todo, client_id})
    .then(newTodo => changed([newTodo.data, ...todos]));
}

export function update(todo) {
  return httpPut(`api/todos/${todo.id}`, {todo, client_id})
    .then(response => changed(updateTodo(response.data, todos)));
}

export function updateAll(toUpdate) {
  return Promise.all(toUpdate.map((todo) => {
    return httpPut(`api/todos/${todo.id}`, {todo, client_id}).then(response => response.data);
  })).then(allUpdated => {
    changed(
      allUpdated.reduce((newTodos, updatedTodo) => {
        return updateTodo(updatedTodo, newTodos);
      }, todos)
    );
  });
}

export function remove({id}) {
  return httpDelete(`api/todos/${id}`, {client_id})
    .then(() => changed(removeTodo(id, todos)));
}

export function removeAll(toRemove) {
  return Promise.all(toRemove.map(({id}) => {
    return httpDelete(`api/todos/${id}`, {client_id}).then(() => id);
  })).then(allRemoved => {
    changed(
      allRemoved.reduce((newTodos, removedId) => {
        return removeTodo(removedId, newTodos);
      }, todos)
    );
  });
}
