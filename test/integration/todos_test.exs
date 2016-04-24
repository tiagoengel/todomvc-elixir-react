defmodule Todomvc.TodosTest do
  use Todomvc.IntegrationCase

  @moduletag :integration
  @default_todos ["Add todos", "Edit todo", "Remove todo", "Check todo", "Filter todos"]

  test "todos" do
    navigate_to("/")
    test_add_todos()
    check_todo("Add todos")
    check_todo("Check todo")
    test_check_todos()

    test_edit_todo()
    check_todo("Edited todo")

    test_remove_todo()

    test_filter_todos()
    check_todo("Filter todos")
  end

  def test_add_todos() do
    add_todo = fn description ->
      new_todo = find_element(:css, ".new-todo")
      fill_field(new_todo, description)
      send_keys(:enter)
    end

    Enum.each(@default_todos, add_todo)

    todos = get_todos
    assert length(todos) == 5
    assert todos == Enum.map(@default_todos, &({&1, false})) |> Enum.reverse
  end

  def test_check_todos() do
    todos = get_todos
    assert length(todos) == 5

    assert todos == [
      {"Filter todos", false}, {"Check todo", true}, {"Remove todo", false},
      {"Edit todo", false}, {"Add todos", true}
    ]
  end

  def test_edit_todo() do
    todo_label = find_todo_element("Edit todo")
    |> find_within_element(:tag, "label")

    db_click(todo_label)

    todo = find_todo_element("Edit todo")

    assert has_class?(todo, "editing")
    todo
    |> find_within_element(:css, ".edit")
    |> fill_field("Edited todo")

    send_keys(:enter)

    assert {"Edited todo", false} == parse_todo_element(todo)
  end

  def test_remove_todo() do
    todo = find_todo_element("Remove todo")
    click(todo)

    click(find_within_element(todo, :css, ".destroy"))
    todos = get_todos
    assert length(todos) == 4
    assert is_nil(find_todo_element("Remove todo"))
  end

  def test_filter_todos() do
    filters = find_element(:css, ".filters")
      |> find_all_within_element(:tag, "a")

    #Active
    Enum.fetch!(filters, 1) |> click
    assert length(get_todos) == 1

    #Completed
    Enum.fetch!(filters, 2) |> click
    assert length(get_todos) == 3

    #All
    Enum.fetch!(filters, 0) |> click
    assert length(get_todos) == 4

  end

  def get_todos() do
    find_element(:css, ".todo-list")
    |> find_all_within_element(:tag, "li")
    |> Enum.map(&parse_todo_element/1)
  end

  def check_todo(description) do
    find_element(:css, ".todo-list")
    |> find_all_within_element(:tag, "li")
    |> Enum.each(fn todo_element ->
      {todo_description, _} = parse_todo_element(todo_element)
      if todo_description == description do
        find_within_element(todo_element, :css, ".toggle")
        |> click()
      end
    end)
  end

  def find_todo_element(description) do
    find_element(:css, ".todo-list")
    |> find_all_within_element(:tag, "li")
    |> Enum.find(fn todo_element ->
      {todo_description, _} = parse_todo_element(todo_element)
      todo_description == description
    end)
  end

  def parse_todo_element(todo) do
    description = find_within_element(todo, :tag, "label") |> visible_text
    if (has_class?(todo, "editing")) do
      description = find_within_element(todo, :css, ".edit") |> attribute_value("value")
    end

    completed = has_class?(todo, "completed")
    {description, completed}
  end

end
