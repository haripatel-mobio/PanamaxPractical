# PanamaxPractical
Practical Test

## ScreenShots
![]()

## Screens
1. Splash Screen
- 3 second wait to launch first screen.

2. Restaurants List
- Display all data from API (Not use pagination).
- Rating values not getting from API data, so set default 5 star rating.

3. Restaurants Details
- View pager is integrated but only one image get into restaurants object. So that reason display only one image.
- Again rating value not getting from API data.
- No value for description into restaurant object, So instead of description display location value.

4. Map View
- When we call google geocoding to process of converting addresses into coordinates, get below response.
```
{
  "error_message": "This API project is not authorized to use this API.",
  "results": [],
  "status": "REQUEST_DENIED"
}
```
- For testing i will use my google api key and it is working.
- Need to enable Directions API & Geocoding API for AIzaSyAFBmCNOPrVgEmKK_5fWqPeEcsS3x8uWpE this API key https://console.cloud.google.com/apis/library/.