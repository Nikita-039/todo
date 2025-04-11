const BASE_URL =  'http://localhost:5000/api/todos';
export const fetchTodos = async (page = 1, limit = 10, search = '') => {
  const res = await fetch(`${BASE_URL}?page=${page}&limit=${limit}&search=${search}`);
  return await res.json();
};

export const fetchTodoById = async (id) => {
  const res = await fetch(`${BASE_URL}/${id}`);
  return await res.json();
};

export const createTodo = async () => {
  const res = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title: 'New Todo', description: '' }),
  });
  return await res.json();
};

export const updateTodo = async (id, updates) => {
  await fetch(`${BASE_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  });
};

export const deleteTodo = async (id) => {
  await fetch(`${BASE_URL}/${id}`, {
    method: 'DELETE',
  });
};



