# PanamaxPractical
Practical Test

## Screens
>`Splash Screen`
>- 3 second wait to launch first screen.

>`Restaurants List`
>- Display all data from API.
>- Rating values not getting from API data, so set default 5 star rating.

>`Restaurants Details`
>- View pager is integrated but only one image get into restaurants object. So that reason display only one image.
>- Again rating value not getting from API data.
>- No value for description into restaurant object, So instead of description display location value.

>`Map View`
>- When call google geocoding api to process of converting addresses into coordinates, get below response.
>```
>{
>  "error_message": "This API project is not authorized to use this API.",
>  "results": [],
>  "status": "REQUEST_DENIED"
>}
>```
>- Need to enable Directions API & Geocoding API for AIzaSyAFBmCNOPrVgEmKK_5fWqPeEcsS3x8uWpE this API key https://console.cloud.google.com/apis/library/.
>- For testing i will use my google api key and it is working.

## ScreenShots
![](https://github.com/haripatel-mobio/PanamaxPractical/blob/development/screenshots/resraurant_list.png) | ![](https://github.com/haripatel-mobio/PanamaxPractical/blob/development/screenshots/restaurant_details.png) | ![](https://github.com/haripatel-mobio/PanamaxPractical/blob/development/screenshots/map_view.png)