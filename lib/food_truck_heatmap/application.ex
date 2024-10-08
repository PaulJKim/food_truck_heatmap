defmodule FoodTruckHeatmap.Application do
  # See https://hexdocs.pm/elixir/Application.html
  # for more information on OTP Applications
  @moduledoc false
  alias FoodTruckHeatmap.FoodTrucks

  use Application

  @impl true
  def start(_type, _args) do
    children = [
      # Start the Telemetry supervisor
      FoodTruckHeatmapWeb.Telemetry,
      # Start the PubSub system
      {Phoenix.PubSub, name: FoodTruckHeatmap.PubSub},
      # Start the Endpoint (http/https)
      FoodTruckHeatmapWeb.Endpoint,
      # Start a worker by calling: FoodTruckHeatmap.Worker.start_link(arg)
      # {FoodTruckHeatmap.Worker, arg}
      FoodTrucks
    ]

    # See https://hexdocs.pm/elixir/Supervisor.html
    # for other strategies and supported options
    opts = [strategy: :one_for_one, name: FoodTruckHeatmap.Supervisor]
    Supervisor.start_link(children, opts)
  end

  # Tell Phoenix to update the endpoint configuration
  # whenever the application is updated.
  @impl true
  def config_change(changed, _new, removed) do
    FoodTruckHeatmapWeb.Endpoint.config_change(changed, removed)
    :ok
  end
end
