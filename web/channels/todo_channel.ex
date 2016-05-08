defmodule Todomvc.TodoChannel do
  use Todomvc.Web, :channel
  alias Todomvc.{TodoChannel, TodoView}

  intercept ["changed", "added", "removed"]

  def join("todos", payload, socket) do
    {:ok, socket}
  end

  def handle_out(event, payload, socket) do
    unless same_client?(payload, socket) do
      push socket, event, payload
    end
    {:noreply, socket}
  end

  def broadcast_change(client_id, todo),
  do: broadcast_event("changed", client_id, todo)

  def broadcast_add(client_id, todo),
  do: broadcast_event("added", client_id, todo)

  def broadcast_remove(client_id, todo),
  do: broadcast_event("removed", client_id, todo)

  defp broadcast_event(event, client_id, todo) do
    payload = Phoenix.View.render_one(todo, TodoView, "todo.json")
      |> Map.put(:client_id, client_id)
    Todomvc.Endpoint.broadcast("todos", event, payload)
  end

  defp same_client?(%{client_id: payload_id}, %{assigns: %{client_id: socket_id}})
  when payload_id == socket_id, do: true
  defp same_client?(_payload, _socket), do: false
end
