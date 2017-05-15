<?php
  /* This PHP script connect the web page and database. It receive the request from the website's inputbox（movie title), then
  collect the responding data from database and return the result back to the page in XML */
  $username = "root";
  $password = "sfm123";
  $database = "SF_MOVIE";

  $film = $_POST['film'];

  // Opens a connection to a MySQL server
  $connection=mysqli_connect('localhost', $username, $password, $database);
  if (!$connection) {
      die('Not connected');
  }

  // Select all the rows of eligible item in the film_info table 
  $query = "SELECT * FROM film_info WHERE title = '".$film."'";
  $result = mysqli_query($connection, $query);
  if (!$result) {
    die('Invalid query');
  }

  // Using DOM object to export XML file
  header('Content-Type: text/xml; charset=utf-8');
  // Create a new XML file
  $dom = new DOMDocument('1.0', 'UTF-8');
  //  Create <markers> element
  $markers = $dom->createElement('markers');
  $parnode = $dom->appendChild($markers);
  while ($row = mysqli_fetch_array($result)){
    // Add to XML document node, save title, location, latitude and longitude
    $node = $dom->createElement("marker");
    $newnode = $parnode->appendChild($node);
    $newnode->setAttribute("title",$row['title']);
    $newnode->setAttribute("locations",$row['locations']);
    $newnode->setAttribute("latitude",$row['latitude']);
    $newnode->setAttribute("longitude",$row['longitude']);
  }
  //  Save XML in a string
  $xmlString = $dom->saveXML();
  //  Export the XML string
  echo $xmlString;
?>