#!/usr/bin/env python
# -*- coding: UTF-8 -*-

import mydb

mydb = mydb.MyDataBase()

SEL_QUERY = 'SELECT DISTINCT(production_company) AS company FROM film_info ORDER BY company'
mydb.cursor.execute(SEL_QUERY)

with open('./compOption.html', 'w') as f:
    f.write('<!DOCTYPE html>\n<html>\n<head>\n</head>\n<body>\n<select id=\'company\'>\n')
    while (1):
        db_return = mydb.cursor.fetchone()
        if db_return is None:
            break
        else:
            company = db_return['company']
            company = company.replace('\'', '\\\'')
            f.write('<option value=\'%s\'>%s</option>\n' % (company,company))
    f.write('<option value=\'unlimited\'>unlimited</option>\n</select>\n</body>\n</html>')

mydb.db.close();