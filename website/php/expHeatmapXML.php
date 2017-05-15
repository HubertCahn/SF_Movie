<?php
  /*  This PHP script connect the web page and database. It receive the request from the website's sizer(production company and release year),
  then collect the responding data from database and return the result back to the page in XML */
  $username = "root";
  $password = "sfm123";
  $database = "SF_MOVIE";

  $proCompany = $_POST['proCompany'];
  $year = $_POST['year'];

  // Opens a connection to a MySQL server
  $connection=mysqli_connect('localhost', $username, $password, $database);
  if (!$connection) {
      die('Not connected');
  }

  // Select all the rows of eligible item in the film_info table 
  $query = "SELECT * FROM film_info";
  if($proCompany != 'unlimited'){
    $query =  $query." WHERE production_company = '".$proCompany."'";
    if($year != 'unlimited'){
      $query =  $query." AND release_year = '".$year."'";
    }
  }elseif ($year != 'unlimited') {
    $query =  $query." WHERE release_year = '".$year."'";
  }
  $result = mysqli_query($connection, $query);
  if (!$result) {
    die('Invalid query');
  }

  // Using DOM object to export XML file
  header('Content-Type: text/xml;');
  // Create a new XML file
  $dom = new DOMDocument('1.0', 'utf-8');
  //  Create <heats> element
  $heats = $dom->createElement('heats');
  $parnode = $dom->appendChild($heats);
  while ($row = mysqli_fetch_array($result)){
    // Add to XML document node, save latitude and longitude
    $node = $dom->createElement("heat");
    $newnode = $parnode->appendChild($node);
    $newnode->setAttribute("latitude",$row['latitude']);
    $newnode->setAttribute("longitude",$row['longitude']);
  }
  //  Save XML in a string
  $xmlString = $dom->saveXML();
  //  Export the XML string
  echo $xmlString;
?>