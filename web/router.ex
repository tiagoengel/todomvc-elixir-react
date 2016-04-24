defmodule Todomvc.Router do
  use Todomvc.Web, :router

  pipeline :browser do
    plug :accepts, ["html"]
    plug :fetch_session
    plug :fetch_flash
    plug :protect_from_forgery
    plug :put_secure_browser_headers
  end

  pipeline :api do
    plug :accepts, ["json"]
  end

  scope "/api", Todomvc do
    pipe_through :api
    resources "/todos", TodoController, except: [:new, :edit]
  end

  scope "/", Todomvc do
    pipe_through :browser # Use the default browser stack
    get "/*path", PageController, :index
  end

  # Other scopes may use custom stacks.
  # scope "/api", Todomvc do
  #   pipe_through :api
  # end
end
