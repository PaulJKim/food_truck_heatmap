defmodule Fake.HTTPoison do
  def get(url, headers \\ [], options \\ []) do
    mock_response(url)
  end

  @spec mock_response(String.t()) :: {:ok, %HTTPoison.Response{}} | {:error, %HTTPoison.Error{}}
  def mock_response("https://data.sfgov.org/api/views/rqzj-sfat/rows.csv") do
    body = """
    locationid,Applicant,FacilityType,cnn,LocationDescription,Address,blocklot,block,lot,permit,Status,FoodItems,X,Y,Latitude,Longitude,Schedule,dayshours,NOISent,Approved,Received,PriorPermit,ExpirationDate,Location,Fire Prevention Districts,Police Districts,Supervisor Districts,Zip Codes,Neighborhoods (old)
    1575198,Park's Catering,Truck,9563000,NEWHALL ST: MENDELL ST to EVANS AVE (200 - 399),220 NEWHALL ST,5203040,5203,040,21MFF-00115,EXPIRED,Cold Truck: Hamburger: cheeseburgers: hot dogs: hot sandwiches: cold sandwiches: egg muffins: cup of noodles: corn dogs: canned soup: coffee: hot cocoa: hot tea: gatorade: juice: milk: soda: water: fruits: fruit salad: rice pudding: yogurt: candy bars: chips: cookies: donuts: granola bars: muffins,6016819.592,2098496.079,37.743014249631514,-122.38446024493484,http://bsm.sfdpw.org/PermitsTracker/reports/report.aspx?title=schedule&report=rptSchedule&params=permit=21MFF-00115&ExportPDF=1&Filename=21MFF-00115_schedule.pdf,,,12/09/2021 12:00:00 AM,20211119,1,11/15/2022 12:00:00 AM,"(37.743014249631514, -122.38446024493484)",10,3,8,58,1
    1735098,Think is Good Inc.,Truck,10454000,PINE ST: FRONT ST to BATTERY ST (100 - 199),100 PINE ST,0262020,0262,020,23MFF-00033,APPROVED,Lobster rolls: crab rolls: lobster burritos: crab burritos: chicken burritos: fish burritos: chicken burritos: poke bowls: soups: chips & soda.,6012991.558,2116647.189,37.79264071673365,-122.39897033211076,http://bsm.sfdpw.org/PermitsTracker/reports/report.aspx?title=schedule&report=rptSchedule&params=permit=23MFF-00033&ExportPDF=1&Filename=23MFF-00033_schedule.pdf,,,12/01/2023 12:00:00 AM,20231019,0,11/15/2024 12:00:00 AM,"(37.79264071673365, -122.39897033211076)",4,1,10,28860,6
    735315,Ziaurehman Amini,Push Cart,4969000,DRUMM ST: MARKET ST to CALIFORNIA ST (1 - 6),1 CALIFORNIA ST,0264004,0264,004,15MFF-0159,REQUESTED,,6013552.57,2116844.5,37.793213731663414,-122.39704303671823,http://bsm.sfdpw.org/PermitsTracker/reports/report.aspx?title=schedule&report=rptSchedule&params=permit=15MFF-0159&ExportPDF=1&Filename=15MFF-0159_schedule.pdf,,,,20151231,0,03/15/2016 12:00:00 AM,"(37.793213731663414, -122.39704303671823)",4,1,10,28860,6
    1163792,"SOHOMEI, LLC",Truck,12583000,THOMAS MORE WAY: BROTHERHOOD WAY \ CHUMASERO DR to SAN FRANCISCO GOLF CLUB RD (1 - 99),1 THOMAS MORE WAY,7380027,7380,027,18MFF-0028,REQUESTED,COLD TRUCK. Deli: bbq chicken skewer: Chinese spring roll: Chinese fried rice/noodle: fried chicken leg/wing: bbq chicken sandwich: chicken cheese burger: burrito: lumpia. Snack: sunflower seeds: muffins: chips: snickers: kit-kat: 10 types of chocolate. Drinks: Coke: 7-Up: Dr. Pepper: Pepsi: Redbull: Vitamin Water: Rockstar: Coconut Juice: Water. Hot drinks: coffee: tea.,5991430.02662,2086996.77488,37.710003334289446,-122.47141191312888,http://bsm.sfdpw.org/PermitsTracker/reports/report.aspx?title=schedule&report=rptSchedule&params=permit=18MFF-0028&ExportPDF=1&Filename=18MFF-0028_schedule.pdf,Mo-Fr:7AM-8AM/10AM-11AM/12PM-1PM,,,20180521,1,07/15/2019 12:00:00 AM,"(37.710003334289446, -122.47141191312888)",1,8,4,64,14
    1591822,Cochinita,Truck,1329000,24TH ST: UTAH ST to POTRERO AVE (2600 - 2699),2601 24TH ST,4264001,4264,001,22MFF-00020,EXPIRED,Panushos: Salbutes: Salad: Rice: Beans: Cochinita: etc.,6010800.766,2102190.03,37.752822368121485,-122.4055319192157,http://bsm.sfdpw.org/PermitsTracker/reports/report.aspx?title=schedule&report=rptSchedule&params=permit=22MFF-00020&ExportPDF=1&Filename=22MFF-00020_schedule.pdf,,,03/22/2022 12:00:00 AM,20220126,0,11/15/2022 12:00:00 AM,"(37.752822368121485, -122.4055319192157)",10,4,8,28859,19
    1738310,San Francisco's Hometown Creamery,Truck,3528000,CALIFORNIA ST: SANSOME ST to LEIDESDORFF ST (400 - 448),425 CALIFORNIA ST,0260001,0260,001,23MFF-00039,APPROVED,Ice Cream: Waffle Cones,6012304.287,2116717.605,37.79279574157871,-122.40135328093122,http://bsm.sfdpw.org/PermitsTracker/reports/report.aspx?title=schedule&report=rptSchedule&params=permit=23MFF-00039&ExportPDF=1&Filename=23MFF-00039_schedule.pdf,,,11/06/2023 12:00:00 AM,20231106,0,11/15/2024 12:00:00 AM,"(37.79279574157871, -122.40135328093122)",4,1,10,28854
    """

    {:ok,
     %HTTPoison.Response{
       status_code: 200,
       body: body
     }}
  end
end
