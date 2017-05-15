#!/usr/bin/env python
# -*- coding: UTF-8 -*-

'''
    This python script import the movie info into the database. It first parse the XML and extract
    some useful information, then insert these information to the table.
'''
import requests
import mydb
from xml.dom.minidom import parse
import xml.dom.minidom

GOOGLE_URL = 'https://maps.googleapis.com/maps/api/geocode/json'
GOOGLE_API_KEY = 'AIzaSyALV9uebe1FoBF144oM1mn9v32XsTIrU4E'
CITY = 'San Francisco'

# Connect to MySQL database
mydb = mydb.MyDataBase()

# Parse the XML file into a list
DOMTree = xml.dom.minidom.parse("film_in_SF.xml")
collection = DOMTree.documentElement
movies = collection.getElementsByTagName("row")

for movie in movies:

    actor_1 = None
    actor_2 = None
    actor_3 = None
    director = None
    distributor = None
    fun_facts = None
    locations = None
    production_company = None
    release_year = None
    title = None
    writer = None

    # It's possible some element is not exist in one node, therefore we need to use
    # try except module to excape IndexError.
    try:
        actor_1 = movie.getElementsByTagName('actor_1')[0].childNodes[0].data
    except IndexError:
        pass
    try:
        actor_2 = movie.getElementsByTagName('actor_2')[0].childNodes[0].data
    except IndexError:
        pass
    try:
        actor_3 = movie.getElementsByTagName('actor_3')[0].childNodes[0].data
    except IndexError:
        pass
    try:
        director = movie.getElementsByTagName('director')[0].childNodes[0].data
    except IndexError:
        pass
    try:
        distributor = movie.getElementsByTagName('distributor')[0].childNodes[0].data
    except IndexError:
        pass
    try:
        fun_facts = movie.getElementsByTagName('fun_facts')[0].childNodes[0].data
    except IndexError:
        pass
    try:
        locations = movie.getElementsByTagName('locations')[0].childNodes[0].data
    except IndexError:
        pass
    try:
        production_company = movie.getElementsByTagName('production_company')[0].childNodes[0].data
    except IndexError:
        pass
    try:
        release_year = movie.getElementsByTagName('release_year')[0].childNodes[0].data
    except IndexError:
        pass
    try:
        title = movie.getElementsByTagName('title')[0].childNodes[0].data
    except IndexError:
        pass
    try:    
        writer = movie.getElementsByTagName('writer')[0].childNodes[0].data
    except IndexError:
        pass

    # Check whether it has locations, if not it's useless for our website
    if locations is not None:
        # Some data contains two address for one location(one in the bracket for standby). Here we just ignore it
        brPos = locations.find('(')
        # Add ", SF" at the end of location for better searching
        if brPos > -1:
            address = locations[0:brPos-1]+',SF'
        else:
            address = locations+',SF'

        # Send http request to google geography api for transform address to geography location
        response = requests.get(url=GOOGLE_URL, params={'address':address, 'key':GOOGLE_API_KEY})
        if response.status_code == 200:
            geo_data = response.json()

            geocode_status = geo_data['status']
            if geocode_status == 'OK':
                address_f = geo_data['results'][0]['formatted_address']
                # If the formatted contains the city name, we assume that it's a correct result
                if address_f.find(CITY) >-1:
                    latitude = geo_data['results'][0]['geometry']['location']['lat'];
                    longitude = geo_data['results'][0]['geometry']['location']['lng'];
                    insert_query = "INSERT INTO film_info (title, locations, production_company, release_year, actor_1, actor_2, actor_3, distributor, director, writer, fun_facts, latitude, longitude) \
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s,%s, %s, %s,%s, %s)"
                    mydb.cursor.execute(insert_query, (title, locations, production_company, release_year, actor_1, actor_2, actor_3, distributor, director, writer, fun_facts, latitude, longitude))
                    mydb.db.commit()

mydb.db.close()