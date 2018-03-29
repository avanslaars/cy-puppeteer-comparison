const throwForError = res => {
  if (res.ok) {
    return res
  }
  throw Error(res.statusText)
}

export const saveTodo = todo =>
  fetch('http://localhost:3030/api/todos', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(todo)
  })
    .then(throwForError)
    .then(res => res.json())
    .then(data => ({ data }))

export const loadTodos = () =>
  fetch('http://localhost:3030/api/todos')
    .then(throwForError)
    .then(res => res.json())
    .then(data => ({
      data
    }))

export const destroyTodo = id =>
  fetch(`http://localhost:3030/api/todos/${id}`, {
    method: 'DELETE',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }
  })
    .then(throwForError)
    .then(res => res.json())
    .then(data => ({ data }))

export const updateTodo = todo =>
  fetch(`http://localhost:3030/api/todos/${todo.id}`, {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(todo)
  })
    .then(throwForError)
    .then(res => res.json())
    .then(data => ({ data }))
