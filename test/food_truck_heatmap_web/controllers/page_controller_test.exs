defmodule FoodTruckHeatmapWeb.PageControllerTest do
  use FoodTruckHeatmapWeb.ConnCase

  test "GET /", %{conn: conn} do
    conn = get(conn, "/")
    assert html_response(conn, 200) =~ "Search for food trucks!"
  end
end
