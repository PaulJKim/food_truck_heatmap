defmodule FoodTruckHeatmapWeb.PageController do
  use FoodTruckHeatmapWeb, :controller

  def index(conn, _params) do
    render(conn, "index.html")
  end
end
