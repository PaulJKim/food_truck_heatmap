defmodule FoodTruckHeatmapWeb.MapLive do
  use Phoenix.LiveView, layout: {FoodTruckHeatmapWeb.LayoutView, "live.html"}
  alias FoodTruckHeatmap.FoodTrucks

  def mount(params, _, socket) do
    food_trucks = FoodTrucks.get_food_trucks(params)

    {:ok,
     assign(socket, decoded_food_trucks: food_trucks, food_trucks: Jason.encode!(food_trucks))}
  end

  def render(assigns) do
    ~H"""
        <section style="display: flex; justify-content: left; align-items: center;"><h2>Where food trucks meet your description:</h2> <a href="/search" class="button" style="margin-left: 202px;">Back</a></section>
        <div>
          <div id="mapid" phx-hook="Map" data-food-trucks={@food_trucks} style="height: 600px;"></div>
        </div>
        <div style="margin-top: 20px; max-height: 300px; overflow-y: auto; border: 1px solid #ccc;">
          <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr>
              <th style="border: 1px solid #ccc; padding: 8px; background-color: #f2f2f2;">Name</th>
              <th style="border: 1px solid #ccc; padding: 8px; background-color: #f2f2f2;">Address</th>
            </tr>
          </thead>
          <tbody>
            <%= for food_truck <- @decoded_food_trucks do %>
              <tr>
                <td style="border: 1px solid #ccc; padding: 8px;"><%= food_truck.name %></td>
                <td style="border: 1px solid #ccc; padding: 8px;"><%= food_truck.address %></td>
              </tr>
            <% end %>
          </tbody>
          </table>
        </div>
    """
  end
end
