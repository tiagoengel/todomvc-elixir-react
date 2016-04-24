use Mix.Config

# In this file, we keep production configuration that
# you likely want to automate and keep it away from
# your version control system.
config :todomvc, Todomvc.Endpoint,
  secret_key_base: "4yn3mMb5ZDwzNAxlNY7sFfdzozEDvgEZMfAq1YSv1kM/5dZDd80uxnDTZy4KIq9J"

# Configure your database
config :todomvc, Todomvc.Repo,
  adapter: Ecto.Adapters.Postgres,
  username: "postgres",
  password: "postgres",
  database: "todomvc_prod",
  pool_size: 20
