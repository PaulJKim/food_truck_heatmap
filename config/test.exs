import Config

config :food_truck_heatmap, http_client: Fake.HTTPoison

# We don't run a server during test. If one is required,
# you can enable the server option below.
config :food_truck_heatmap, FoodTruckHeatmapWeb.Endpoint,
  http: [ip: {127, 0, 0, 1}, port: 4002],
  secret_key_base: "cOM3mllh2y22cZDOfKmdBCIrUeSnFVyhwau7f3zF/WWCoBJZwkDyam49252cv0qc",
  server: false

# In test we don't send emails.
config :food_truck_heatmap, FoodTruckHeatmap.Mailer, adapter: Swoosh.Adapters.Test

# Print only warnings and errors during test
config :logger, level: :warn

# Initialize plugs at runtime for faster test compilation
config :phoenix, :plug_init_mode, :runtime
