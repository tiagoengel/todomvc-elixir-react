Application.ensure_all_started(:hound)
ExUnit.configure(exclude: :integration)
ExUnit.start

Mix.Task.run "ecto.create", ~w(-r Todomvc.Repo --quiet)
Mix.Task.run "ecto.migrate", ~w(-r Todomvc.Repo --quiet)
Ecto.Adapters.SQL.begin_test_transaction(Todomvc.Repo)
