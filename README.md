# Movies in San Francisco
**Movies in San Francisco** (SF Movies) is a website that you can get to know where a movie is filmed in San Francisco, or you can draw a heat map about the location of movies made by different production company or release year. Just visit the website: [Movies in San Francisco](http://ec2-54-169-212-184.ap-southeast-1.compute.amazonaws.com/website/)


----------
## Brief Introduction
**Problem description:** We got a big table of movies in San Francisco from [DataSF](https://data.sfgov.org/Culture-and-Recreation/Film-Locations-in-San-Francisco/yitu-d5am) which contains general location and other information. We want to visualise these data on a map and provide service for easy search.

**Solution:** Firstly, We built a website with [Google Map](https://developers.google.com/maps/web) to show the location. Then, we transform the general location into geographic location(latitude and longitude) using [Google Maps Geocoding API](https://developers.google.com/maps/web-services/) and save all data into database. With these data, we can easily search the movie and show the actual location on our map. 


----------
## Technical details
Here, I would like to show the technical details from three aspects: front-end, back-end and database. 

1.Database

**Task:** Get and parse the original data, transform the general location into geographic location and store all the data to the database.

Step 1. Download the raw data in XML format. Here are many choices, we can access the dataset via API, or download it in CSV, JSON, XML format. I choose XML becasue it's easy to parse XML and insert data to MySQL using Python(which I am familiar with). 

Step 2. Parse the data using Python xml.dom method.
`DOMTree = xml.dom.minidom.parse("film_in_SF.xml")`
Then, we will get all the information of each movie, like location, release year, production company or something else.

Step 3. Send Geocoding request using Python request method. Because of the map element on the webpage only receive geographic locations, we need to transform the general location into geographic location.
`response = requests.get(url=url, params={'address':address, 'key':key})`

Step 4. Filter the geocoding response. Sometimes, the location from raw data might have the same name with other locations. Thus, I built a fiter to drop the response data without key word "San Francisco".

Step 5. Insert the data into MySQL using python-mysqldb.

2.Front-end

**Task:** Receive the input from user(movie title, release year and production company) and send the input to application server. Server will return XML file with geographic locations, parse the XML file and pass data to map container, which will show the data using marker or heat map.

Step 1. Establish three key elements in HTML. One inputbox`<input>`, two select menu`<select>`and map`<div id="map">`. 

Step 2. Create an initial map calling Google Maps JavaScript API.

Step 3. Get data from inputbox or select menu in JS`var film=document.getElementByID("autocomplete").value`Send this data to the server runing php scripts using XMLHttpRequest.

Step 4. Parse the XML file from the application sever, extract the geographic location and show on the map.

3.Back-end

**Task:**Receive the data from the website, select the responding data from MySQL database and then build a XML file to organise the data. Send the XML file back to front-end.

Step 1. Connect to the MySQL using `mysqli_connect()`function.

Step 2. Get the input from website`$film=$_POST['film']`.

Step 3. Select the data from MySQL with specific condition(movie title, company or year).

Step 4. Build a XML file`$dom=new DOMDocument('1.0','utf-8')` to store the select result and export it.

To explain more specifically, I draw a flow chart to describe how the data transmitted in SF Movies.
![flowchart](http://img.blog.csdn.net/20170515222152932?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvcXFfMzI4NzY4NjM=/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)


----------
## Bugs and TODOs
Here are some bugs and problems I found and need to be fixed latter as well as some TODOs.
1. The raw data provides 1586 movie items but only 1427 items were import to the database due to incorrect geocoding result. Maybe I can find other API that I can also input some constraint parameters like city.
2. As shown above, I transform all the general location into geographic location at a time. It has one potential problem that Google only provide 2500 free geocoding, if the dataset is big, it's unwise to do that. Another choice is transform it while the website send a request, then store the result into the database.
3. When PHP try to save a special character like "Café" to XML, it cause some unexpected error and return a empty XML file to the front-end. I have tried some methods but didn't work, this bug should be fixed as soon as possible.
4. When click on the marker, it will show the title and address of the movie. I can add more information here, such as actor, director, fun facts and even the movie poster from Internet.
5. Heat map function only support production company and specific release year. It should be better if user can input actor's name or director's name, select a range of year or something like that.


----------
## Summary
Due to the time limitation and my technical experience(I haven't develop website before but I have experience on Android app development), the SF Movie still has some bugs and the UI is very simple. But it has already achieved the requested function: showing the location on the map, providing autocompletion search and drawing heat map as additional. 

If you have any questions on my code or this README, please feel free to contact me any time!  

