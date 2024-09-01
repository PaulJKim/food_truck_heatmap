defmodule FoodTruckHeatmap.FoodTrucks do
  use GenServer
  alias NimbleCSV.RFC4180, as: CSV

  @csv_url "https://data.sfgov.org/api/views/rqzj-sfat/rows.csv"

  def start_link([]) do
    GenServer.start_link(__MODULE__, [], name: __MODULE__)
  end

  def init(_) do
    schedule_loop(self())
    state = %{food_trucks: get_food_trucks()}

    {:ok, state}
  end

  def get_food_trucks(filters) do
    GenServer.call(__MODULE__, {:get_food_trucks, filters})
  end

  # This runs on a 30 second loop in order to keep the food truck data up-to-date
  def handle_info(:update, _state) do
    {:noreply, %{food_trucks: get_food_trucks()}}
  end

  # Handle case where no search filters are used
  def handle_call({:get_food_trucks, filters}, _from, state) when map_size(filters) == 0 do
    {:reply, state.food_trucks, state}
  end

  # Apply search filters to food truck data
  # High level logic is generalized to make it simple to add additional filters below
  def handle_call({:get_food_trucks, filters}, _from, state) do
    filtered_food_trucks =
      Enum.reduce(filters, state.food_trucks, fn filter, acc ->
        Enum.filter(acc, &apply_filter(filter, &1))
      end)

    {:reply, filtered_food_trucks, state}
  end

  # Filter for food type search string
  defp apply_filter({"food_type", food_type}, food_truck) do
    String.contains?(food_truck.food_items |> String.downcase(), food_type |> String.downcase())
  end

  # Filter for permit status
  defp apply_filter({"permit_status", permit_status}, food_truck) do
    food_truck.permit_status == permit_status
  end

  # Fetch the from the API and parse the CSV
  defp get_food_trucks() do
    case fetch_and_parse_csv() do
      {:ok, food_trucks} ->
        food_trucks

      {:error, reason} ->
        IO.puts("Error fetching and parsing CSV #{inspect(reason)}")
        []
    end
  end

  defp fetch_and_parse_csv do
    with {:ok, %HTTPoison.Response{status_code: 200, body: body}} <- HTTPoison.get(@csv_url) do
      {:ok, parse_csv(body)}
    else
      error ->
        IO.puts("Failed to fetch CSV: #{inspect(error)}")
        {:error, error}
    end
  end

  defp parse_csv(body) do
    body
    |> CSV.parse_string(skip_headers: true)
    # Some entries have bad coordinates which isn't very useful to us, so filter those out
    |> Enum.reject(fn row -> Enum.at(row, 14) == "0" end)
    |> Enum.map(fn row ->
      %{
        name: Enum.at(row, 1),
        permit_status: Enum.at(row, 10) |> String.downcase(),
        food_items: Enum.at(row, 11),
        latitude: String.to_float(Enum.at(row, 14)),
        longitude: String.to_float(Enum.at(row, 15)),
        address: Enum.at(row, 5)
      }
    end)
  end

  defp schedule_loop(pid) do
    Process.send_after(pid, :update, 30_000)
  end
end
