defmodule FoodTruckHeatmapWeb.SearchLive do
  use Phoenix.LiveView, layout: {FoodTruckHeatmapWeb.LayoutView, "live.html"}

  def mount(_params, _session, socket) do
    {:ok, assign(socket, selected_permit_status: "", food_type_query: "")}
  end

  def handle_event("dropdown_changed", %{"permit_status" => selected_option}, socket) do
    {:noreply, assign(socket, selected_permit_status: selected_option)}
  end

  def handle_event("validate", %{"food_type" => food_type}, socket) do
    {:noreply, assign(socket, food_type_query: food_type)}
  end

  def handle_event(
        "search",
        params,
        socket
      ) do
    query = get_query(params)
    {:noreply, push_redirect(socket, to: "/map/#{query}")}
  end

  # Helper for creating a query from form fields. Make it general in case more filters
  # are added in the future
  defp get_query(params) do
    Enum.reduce(params, "?", fn {key, value}, acc ->
      if value != "",
        do: acc <> "#{key}=#{value}&",
        else: acc
    end)
    |> String.trim_trailing("&")
  end

  def render(assigns) do
    ~H"""
          <form phx-change="validate" phx-submit="search" id="search-form">
              <label for="food_type">Food type:</label>
              <input type="text" name="food_type" id="food_type" value={@food_type_query} phx-input="update_query" />
              <label for="permit_status">Select food tuck permit status:</label>
              <select phx-change="dropdown_changed" name="permit_status" id="permit_status">
                <option value="">Select an option</option>
                <option value="approved">APPROVED</option>
                <option value="requested">REQUESTED</option>
                <option value="expired">EXPIRED</option>
                <option value="suspend">SUSPENDED</option>
              </select>
              <button type="submit">Search</button>
          </form>
    """
  end
end
