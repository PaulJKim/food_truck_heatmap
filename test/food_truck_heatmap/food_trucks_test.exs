defmodule FoodTrucksTest do
  use ExUnit.Case

  describe "get_food_trucks/1" do
    test "gets all food trucks" do
      food_trucks = FoodTruckHeatmap.FoodTrucks.get_food_trucks(%{}) |> IO.inspect()
      assert Enum.count(food_trucks) == 6
    end

    test "filter by food type" do
      food_trucks = FoodTruckHeatmap.FoodTrucks.get_food_trucks(%{"food_type" => "burrito"})
      assert Enum.each(food_trucks, fn food_truck -> String.contains?(food_truck.food_items, "burrito") end)
    end

    test "filter by permit status" do
      food_trucks = FoodTruckHeatmap.FoodTrucks.get_food_trucks(%{"permit_status" => "approved"})
      assert Enum.count(food_trucks) == 2
    end

    test "filter by food type and permit status" do
      food_trucks = FoodTruckHeatmap.FoodTrucks.get_food_trucks(%{"permit_status" => "approved", "food_type" => "ice cream"})
      assert Enum.count(food_trucks) == 1
    end
  end


end
