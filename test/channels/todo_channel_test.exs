defmodule Todomvc.TodoChannelTest do
  use Todomvc.ChannelCase
  alias Todomvc.TodoChannel

  setup do
    client_id = 1
    {:ok, _, socket} =
      socket("client_id", %{some: :assign})
      |> subscribe_and_join(TodoChannel, "todos")

    {:ok, socket: socket, client_id: client_id}
  end

  # TODO: Improve tests

  test "broadcasts changes", %{socket: socket, client_id: client_id} do
    payload = %{
      "completed" => true,
      "description" => "Phoenix is awesome",
      "client_id" => client_id
    }
    broadcast_from! socket, "changed", payload
    assert_push "changed", %{"completed" => true, "description" => "Phoenix is awesome"}
  end

  test "broadcasts aditions", %{socket: socket, client_id: client_id} do
    payload = %{
      "completed" => true,
      "description" => "Phoenix is awesome",
      "client_id" => client_id
    }
    broadcast_from! socket, "added", payload
    assert_push "added", %{"completed" => true, "description" => "Phoenix is awesome"}
  end
  
  test "broadcasts deletions", %{socket: socket, client_id: client_id} do
    payload = %{
      "completed" => true,
      "description" => "Phoenix is awesome",
      "client_id" => client_id
    }
    broadcast_from! socket, "removed", payload
    assert_push "removed", %{"completed" => true, "description" => "Phoenix is awesome"}
  end
end
