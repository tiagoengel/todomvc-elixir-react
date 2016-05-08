import fetch from 'isomorphic-fetch';

const defaultHeaders = {
  Accept: 'application/json',
  'Content-Type': 'application/json'
};

function buildHeaders() {
  return { ...defaultHeaders};
}

export function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  } else {
    var error = new Error(response.statusText);
    error.response = response;
    throw error;
  }
}

export function parseJSON(response) {
  if (response.status !== 204){
    return response.json();
  }
  return {};
}

export function httpGet(url) {
  return fetch(url, {
    headers: buildHeaders()
  })
  .then(checkStatus)
  .then(parseJSON);
}

export function httpPut(url, data) {
  const body = JSON.stringify(data);

  return fetch(url, {
    method: 'put',
    headers: buildHeaders(),
    body: body
  })
  .then(checkStatus)
  .then(parseJSON);
}

export function httpPost(url, data) {
  const body = JSON.stringify(data);

  return fetch(url, {
    method: 'post',
    headers: buildHeaders(),
    body: body
  })
  .then(checkStatus)
  .then(parseJSON);
}

export function httpDelete(url, data) {
  const body = data ? JSON.stringify(data) : undefined;
  return fetch(url, {
    method: 'delete',
    headers: buildHeaders(),
    body: body
  })
  .then(checkStatus)
  .then(parseJSON);
}
