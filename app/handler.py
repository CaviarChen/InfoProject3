import sqlite3
import struct

DBITEM = {0:"BID",
          1:"PID",
          2:"BPID",
          3:"BName",
          4:"SName",
          5:"Area",
          6:"CYear",
          7:"RYear",
          8:"Floors",
          9:"Use",
          10:"AType",
          12:"ARating",
          13:"Bicycle",
          14:"Showers"}

FILTER_OP = {0:"WHERE {0}=?",
             1:"WHERE {0}>?",
             2:"WHERE {0}>=?",
             3:"WHERE {0}<?",
             4:"WHERE {0}<=?",
             5:"WHERE {0}<>?",
             6:"WHERE instr({0},?) > 0"}

    #-------------------------------------------------

def PivotTable(req_args, db):
    # check args
    global DBITEM
    global FILTER_OP

    try:
        filter_n = int(req_args['filter1'])
        if filter_n!=-1:
            sql_where = FILTER_OP[int(req_args['filter2'])].format(DBITEM[filter_n])
            sql_par = req_args['filter3']  #this variable is unsafe
        else:
            sql_where = 'WHERE 0=?'
            sql_par = 0

        row1 = DBITEM[int(req_args['row'])]
        col1 = DBITEM[int(req_args['col'])]
        val1 = int(req_args['val1'])
        val2 = DBITEM[int(req_args['val2'])]
    except:
        return {'code': -1, 'message': 'Wrong parameters'}

    if row1==col1:
        return {'code': -1, 'message': 'Row and column can\'t be same'}

    #-------------------------------------------------

    cur = db.cursor()
    rows = set()
    cols = set()

    # Parameter markers can't be used for colum names
    # But it is safe because row1 col1 can't be else than DBITEM
    for line in cur.execute("SELECT "+row1+" FROM dataset "+sql_where,(sql_par,)):
        rows.add(line[0])
    for line in cur.execute("SELECT "+col1+" FROM dataset "+sql_where,(sql_par,)):
        cols.add(line[0])

    rows = list(rows)
    cols = list(cols)
    rows.sort()
    cols.sort()
    rows.append('Total')
    cols.append('Total')

    print len(cols)
    print len(rows)

    table = [0 for item in range(len(cols)*len(rows))]

    table_max = -float('inf')
    table_min = float('inf')

    for i in range(len(cols)):
        for j in range(len(rows)):

            if (i==len(cols)-1):        #Total
                if (j==len(rows)-1):
                    break;
                sql_where_v = sql_where + " AND {0}=?".format(row1)
                sql_par_v = (sql_par, rows[j])
            else:
                if (j==len(rows)-1):  #Total
                    sql_where_v = sql_where + " AND {0}=?".format(col1)
                    sql_par_v = (sql_par,cols[i])
                else:                       #Normal
                    sql_where_v = sql_where + " AND {0}=? AND {1}=?".format(row1, col1)
                    sql_par_v = (sql_par, rows[j], cols[i])

            table[i*len(rows)+j] = CalculateTable(cur, val1, val2, sql_where_v, sql_par_v)

            if table[i*len(rows)+j]!='N/A':
                if table_min>table[i*len(rows)+j]:
                    table_min = table[i*len(rows)+j]
                if table_max<table[i*len(rows)+j]:
                    table_max = table[i*len(rows)+j]

    if table_max==table_min:
        table_max = table_min + 1

    table_color = ['#F0F0F0' for item in range(len(cols)*len(rows))]

    for i in range(len(cols)*len(rows)):
        if table[i]!='N/A':
            table_color[i] = HTMLColor(float((table[i]-table_min))/(table_max-table_min))
            if table[i]==0:
                table[i] = '0'
            else:
                table[i] = str(round(table[i],2)).rstrip('.0')

    return {"code":1,"data":{"rows":rows,"cols":cols,"table":table,"color":table_color}}

        #-------------------------------------------------
def CalculateTable(cur, val1, val2, sql_where, sql_par):
    values = []
    for line in cur.execute("SELECT "+val2+" FROM dataset "+sql_where, sql_par):
        if line[0]!='': #skip empty data
            values.append(line[0])
    if len(values)==0:
        return 'N/A'
    if val1==0:
        return sum(values)
    if val1==1:
        return float(sum(values))/len(values)
    if val1==2:
        return max(values)
    if val1==3:
        return min(values)

    return 0

def HTMLColor(percentage):
    percentage = max([percentage,0])
    percentage = min([percentage,1])

    (low_r, low_g, low_b) = (255, 255, 255)
    (high_r, high_g, high_b) = (252, 248, 227)

    r = int(low_r + (high_r-low_r) * percentage)
    g = int(low_g + (high_g-low_g) * percentage)
    b = int(low_b + (high_b-low_b) * percentage)

    print percentage

    return '#'+struct.pack('BBB',*(r,g,b)).encode('hex')
