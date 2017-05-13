<?php

    function parseToXML($htmlStr)
    {
    $xmlStr=str_replace('<','&lt;',$htmlStr);
    $xmlStr=str_replace('>','&gt;',$xmlStr);
    $xmlStr=str_replace('"','&quot;',$xmlStr);
    $xmlStr=str_replace("'",'&#39;',$xmlStr);
    $xmlStr=str_replace("&",'&amp;',$xmlStr);
    return $xmlStr;
    }

    $username = "root";
    $password = "sfm123";
    $database = "SF_MOVIE";

    $film = $_POST['film'];

    // Opens a connection to a MySQL server
    $connection=mysqli_connect('localhost', $username, $password, $database);
    if (!$connection) {
        die('Not connected');
    }

    // Select all the rows in the markers table
    $query = "SELECT * FROM film_info WHERE title = '".$film."'";
    $result = mysqli_query($connection, $query);
    if (!$result) {
      die('Invalid query');
    }

    /*
    用PHP的DOM控件来创建XML输出
    设置输出内容的类型为xml
    */
    header('Content-Type: text/xml;');
    //创建新的xml文件
    $dom = new DOMDocument('1.0', 'utf-8');
    //建立<response>元素
    $markers = $dom->createElement('markers');
    $parnode = $dom->appendChild($markers);
    while ($row = mysqli_fetch_array($result)){
      // Add to XML document node
      $node = $dom->createElement("marker");
      $newnode = $parnode->appendChild($node);
      $newnode->setAttribute("title",$row['title']);
      $newnode->setAttribute("locations",$row['locations']);
      $newnode->setAttribute("production_company",$row['production_company']);
      $newnode->setAttribute("release_year",$row['release_year']);
      $newnode->setAttribute("actor_1",$row['actor_1']);
      $newnode->setAttribute("actor_2",$row['actor_2']);
      $newnode->setAttribute("actor_3",$row['actor_3']);
      $newnode->setAttribute("distributor",$row['distributor']);
      $newnode->setAttribute("director",$row['director']);
      $newnode->setAttribute("writer",$row['writer']);
      $newnode->setAttribute("fun_facts",$row['fun_facts']);
      $newnode->setAttribute("latitude",$row['latitude']);
      $newnode->setAttribute("longitude",$row['longitude']);
    }
    //在一字符串变量中建立XML结构
    $xmlString = $dom->saveXML();
    //输出XML字符串
    echo $xmlString;
?>