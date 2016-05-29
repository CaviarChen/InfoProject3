import sqlite3
import struct
import math

    #-----------------------CONSTANT----------------------
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

FILTER1_RANGE = (-1,0,1,2,3,4,5,6,7,8,9,10,12,13,14)
FILTER2_RANGE = range(0,6+1)
ROW_COL_RANGE = (0,3,4,5,6,7,8,9,10,12,13,14)
VALUE1_RANGE = range(0,3+1)
VALUE2_RANGE = (6,7,8,12,13,14)

    #-------------------------------------------------
#  Data Exporler API
def Data(req_args, db):

    ITEMS_ON_EACH_PAGE = 120

    cur = db.cursor()
    cur.execute('SELECT COUNT(*) FROM dataset')
    total_pages = int(math.ceil(float(cur.fetchone()[0])/ITEMS_ON_EACH_PAGE))

    try:
        page = int(req_args['page'])
    except:
        page = -1

    if not((page>=0)and(page<=total_pages)):
        return {'code': -1, 'message': 'Wrong page', 'total_pages': total_pages}

    fields = []
    for line in cur.execute("SELECT name FROM dataset_fields ORDER BY id ASC"):
        fields.append(line[0])

    table = []
    limit_base = str((page-1)*ITEMS_ON_EACH_PAGE)
    for line in cur.execute("SELECT * FROM dataset ORDER BY BID ASC LIMIT {0},100".\
                            format(limit_base, str(ITEMS_ON_EACH_PAGE))):
        table.append(line)

    return {'code': 1,'total_pages': total_pages, 'data':{'fields':fields, 'table':table}}

    #-------------------------------------------------
#  PivotTable API
def PivotTable(req_args, db):
    # check args
    res = ArgsCheck(req_args)
    if res==-1:
        return {'code': -1, 'message': 'Wrong parameters'}
    if res==-2:
        return {'code': -1, 'message': 'Row and column can\'t be same'}
    (sql_where, sql_par, row1, col1, val1, val2) = res

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

    if not((len(cols) in range(1,180+1))and(len(rows) in range(1,180+1))):
        return {'code': -3, 'message': 'Data range is too large or too small,\
         please change the parameter. '+"(row:{0} colum:{1})".format(len(rows),len(cols)) }

    rows.sort()
    cols.sort()
    rows.append('Total')
    cols.append('Total')

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
                    table_max = table[i*len(rows)+j]   # Get Min & Max value

    if table_max==table_min:
        table_max = table_min + 1

    table_color = ['#F0F0F0' for item in range(len(cols)*len(rows))]

    for i in range(len(cols)*len(rows)):
        if table[i]!='N/A':
            table_color[i] = HTMLColor(float((table[i]-table_min))/(table_max-table_min))
            table[i] = str(round(table[i],2))
            if table[i][-2:] == '.0' :  # remove .0
                table[i] = table[i][:-2]

    table[len(table)-1] = ''  # between total

    return {"code":1,"data":{"rows":rows,"cols":cols,"table":table,"color":table_color}}

        #-------------------------------------------------
#  check parameters for Pivottable API
def ArgsCheck(args):
    global DBITEM, FILTER_OP, FILTER1_RANGE, FILTER2_RANGE, ROW_COL_RANGE, VALUE1_RANGE, VALUE2_RANGE

    try:
        filter_n = int(args['filter1'])
        if not(filter_n in FILTER1_RANGE):
            return -1

        if filter_n!=-1:
            if not(int(args['filter2']) in FILTER2_RANGE):
                return -1
            sql_where = FILTER_OP[int(args['filter2'])].format(DBITEM[filter_n])
            sql_par = args['filter3']  #this variable is unsafe
        else:
            sql_where = 'WHERE 0=?'
            sql_par = 0

        if not((int(args['row']) in ROW_COL_RANGE) or \
        (int(args['col']) in ROW_COL_RANGE)):
            return -1

        if not((int(args['val1']) in VALUE1_RANGE) or \
        (int(args['val2']) in VALUE2_RANGE)):
            return -1

        row1 = DBITEM[int(args['row'])]
        col1 = DBITEM[int(args['col'])]
        val1 = int(args['val1'])
        val2 = DBITEM[int(args['val2'])]

    except:
        return -1

    if row1==col1:
        return -2

    return (sql_where, sql_par, row1, col1, val1, val2)


#   Calculate value of each cell
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

#   Calculate background color of each cell
def HTMLColor(percentage):
    percentage = max([percentage,0])
    percentage = min([percentage,1])

    (low_r, low_g, low_b) = (255, 255, 255)     # For lower value
    (high_r, high_g, high_b) = (252, 248, 227)  # For higher value

    r = int(low_r + (high_r-low_r) * percentage)
    g = int(low_g + (high_g-low_g) * percentage)
    b = int(low_b + (high_b-low_b) * percentage)

    return '#'+struct.pack('BBB',*(r,g,b)).encode('hex')
