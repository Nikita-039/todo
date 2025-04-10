'use client';
import React, { useEffect, useState } from 'react';
import {
  fetchTodos,
  fetchTodoById,
  createTodo,
  updateTodo,
  deleteTodo,
} from '../lib/api';

export default function HomePage() {
  const [allTodos, setAllTodos] = useState([]);
  const [filteredTodos, setFilteredTodos] = useState([]);
  const [selectedTodo, setSelectedTodo] = useState(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');

  const TODOS_PER_PAGE = 10;

  useEffect(() => {
    loadTodos();
  }, []);

  useEffect(() => {
    applySearch();
  }, [search, allTodos]);

  const loadTodos = async () => {
    const data = await fetchTodos();
    setAllTodos(data.todos.reverse());
  };

  const applySearch = () => {
    let filtered = allTodos;
    if (search.trim()) {
      filtered = allTodos.filter((todo) =>
        todo.title.toLowerCase().includes(search.toLowerCase())
      );
    }
    setFilteredTodos(filtered);

   
    if (filtered.length > 0 && !filtered.some(t => t._id === selectedTodo?._id)) {
      setSelectedTodo(filtered[0]);
    }
  };

  const handleCreate = async () => {
    const newTodo = await createTodo();
    setAllTodos((prev) => [newTodo, ...prev]);
    setSelectedTodo(newTodo);
    setPage(1);
    setSearch('');
  };

  const handleSelect = async (id) => {
    const data = await fetchTodoById(id);
    setSelectedTodo(data);
  };

  const handleUpdate = async (field, value) => {
    const updated = { ...selectedTodo, [field]: value };
    setSelectedTodo(updated);
    await updateTodo(selectedTodo._id, { [field]: value });

  
    setAllTodos((prev) =>
      prev.map((todo) =>
        todo._id === selectedTodo._id ? { ...todo, [field]: value } : todo
      )
    );
  };

  const handleDelete = async () => {
    if (selectedTodo) {
      await deleteTodo(selectedTodo._id);
      const updatedTodos = allTodos.filter((t) => t._id !== selectedTodo._id);
      setAllTodos(updatedTodos);
      setSelectedTodo(updatedTodos[0] || null);
    }
  };

  const paginatedTodos = filteredTodos.slice(
    (page - 1) * TODOS_PER_PAGE,
    page * TODOS_PER_PAGE
  );

  return (
    <div className="d-flex">
      {/* Sidebar */}
      <div
        className="border-end p-3 d-flex flex-column justify-content-between"
        style={{ width: '300px', height: '100vh', overflowY: 'auto' }}
      >
        <div>
          <h4>TODO</h4>
          <div className="d-flex align-items-center gap-2 my-2">
            <button className="btn btn-dark btn-sm" onClick={handleCreate}>
              +TODO
            </button>
            <input
              type="text"
              className="form-control form-control-sm"
              placeholder="Search..."
              value={search}
              onChange={(e) => {
                setPage(1);
                setSearch(e.target.value);
              }}
            />
          </div>

          {paginatedTodos.map((todo) => (
            <div
              key={todo._id}
              className={`p-2 mb-2 border rounded ${
                selectedTodo?._id === todo._id ? 'border-dark' : ''
              }`}
              style={{ cursor: 'pointer' }}
              onClick={() => handleSelect(todo._id)}
            >
              <strong>{todo.title}</strong>
              <p className="mb-0">{todo.description}</p>
              <small>{new Date(todo.createdAt).toLocaleDateString()}</small>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="d-flex justify-content-between mt-3">
          <button
            className="btn btn-outline-secondary btn-sm"
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            Prev
          </button>
          <button
            className="btn btn-outline-secondary btn-sm"
            disabled={page * TODOS_PER_PAGE >= filteredTodos.length}
            onClick={() => setPage(page + 1)}
          >
            Next
          </button>
        </div>
      </div>

      {/* Right Panel */}
      <div className="p-4 flex-grow-1">
        {selectedTodo ? (
          <>
            <input
              className="form-control fs-4 fw-bold mb-2 border-0"
              value={selectedTodo.title}
              onChange={(e) => handleUpdate('title', e.target.value)}
            />
            <textarea
              className="form-control mb-2"
              rows={10}
              value={selectedTodo.description}
              onChange={(e) => handleUpdate('description', e.target.value)}
            />
            <button
              className="btn btn-outline-danger btn-sm"
              onClick={handleDelete}
            >
              Delete Todo
            </button>
          </>
        ) : (
          <p>No todo selected</p>
        )}
      </div>
    </div>
  );
}









