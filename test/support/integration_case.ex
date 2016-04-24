defmodule Todomvc.IntegrationCase do
  use ExUnit.CaseTemplate, async: false
  use Hound.Helpers

  using do
    quote do
      use Hound.Helpers

      alias Todomvc.Repo
      import Ecto
      import Ecto.Changeset
      import Ecto.Query, only: [from: 1, from: 2]

      import Todomvc.Router.Helpers
      import Todomvc.IntegrationCase

      # The default endpoint for testing
      @endpoint Todomvc.Endpoint

      hound_session

      setup tags do
        maximize_window current_window_handle
        :ok
      end
    end
  end

  setup tags do
    unless tags[:async] do
      Ecto.Adapters.SQL.restart_test_transaction(Todomvc.Repo, [])
    end
    :ok
  end

  def db_click(elem) do
    script = """
    var event = new MouseEvent('dblclick', {
      'view': window,
      'bubbles': true,
      'cancelable': true
    });
    document.getElementById(arguments[0]).dispatchEvent(event);
    """
    execute_script(script, [attribute_value(elem, "id")])
  end

end
