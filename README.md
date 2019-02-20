# Weather 
## Description
Single page application showing weather information from cities where
Falcon has offices. (Copenhagen, New York, Berlin, Budapest, Sofia, Melbourne).

## Features
Responsive design with weather graphics correspond to its current weather. App uses 3rd party css weather icons built by Fabrizio Bianchi (https://codepen.io/_fbrz/pen/iqtlk).
Users can add and remove their own cities. The list of non-Falcon cities is persistently saved in local storage.
Total code size is roughly 25kb. This can be further cut down by minifying html, css and js. 
The app is tested in Chrome, Firefox and Safari. Safari doesn’t allow local storage access outside of http so saving cities won’t work if code is run without a http server.
