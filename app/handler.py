import csv

def PivotTable(req_args):

    # check args
    try:
        filter1 = int(req_args['filter1'])
        if filter1!=-1:
            filter2 = int(req_args['filter2'])
            filter3 = req_args['filter3']
        row1 = int(req_args['row'])
        col1 = int(req_args['col'])
        val1 = int(req_args['val1'])
        val2 = int(req_args['val2'])
    except:
        return {'code': -1, 'message': 'Wrong parameters'}

    if row==col:
        return {'code': -1, 'message': 'Row and column can\'t be same'}

    dataset = LoadDataset()


    print [col[0] for col in dataset]

    return req_args

def LoadDataset():
    csvfile = open("./static/dataset.csv")
    reader = csv.reader(csvfile)

    dataset = []
    for row in reader:
        dataset.append(row)

    csvfile.close()

    return dataset
