#!/usr/bin/env python
# -*- coding: UTF-8 -*-

import mydb

mydb = mydb.MyDataBase()

SEL_QUERY = 'SELECT DISTINCT(title) AS title FROM film_info'
mydb.cursor.execute(SEL_QUERY)

with open('./option.html', 'w') as f:
    f.write('$(function(){\nvar currencies = [\n')
    while (1):
        db_return = mydb.cursor.fetchone()
        if db_return is None:
            break
        else:
            title = db_return['title']
            title = title.replace('\'', '\\\'')
            f.write('{ value: \'%s\'},\n' % title)
    f.write('];\n$(\'#autocomplete\').autocomplete({\nlookup: currencies\n});\n});\n')

mydb.db.close();