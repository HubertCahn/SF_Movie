#!/usr/bin/env python
# -*- coding: UTF-8 -*-

import mydb

mydb = mydb.MyDataBase()

SEL_QUERY = 'SELECT DISTINCT(release_year) AS year FROM film_info ORDER BY year'
mydb.cursor.execute(SEL_QUERY)

with open('./yearOption.html', 'w') as f:
    f.write('<!DOCTYPE html>\n<html>\n<head>\n</head>\n<body>\n<select id=\'year\'>\n')
    while (1):
        db_return = mydb.cursor.fetchone()
        if db_return is None:
            break
        else:
            year = db_return['year']
            f.write('<option value=\'%s\'>%s</option>\n' % (year,year))
    f.write('<option value=\'unlimited\'>unlimited</option>\n</select>\n</body>\n</html>')

mydb.db.close();