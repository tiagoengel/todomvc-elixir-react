defmodule Todomvc.TodoView do
  use Todomvc.Web, :view

  def render("index.json", %{todos: todos}) do
    %{data: render_many(todos, Todomvc.TodoView, "todo.json")}
  end

  def render("show.json", %{todo: todo}) do
    %{data: render_one(todo, Todomvc.TodoView, "todo.json")}
  end

  def render("todo.json", %{todo: todo}) do
    %{id: todo.id,
      description: todo.description,
      completed: todo.completed}
  end
end
