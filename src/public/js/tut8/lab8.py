import csv


def read_csv():
    ''' () -> (list, list)

    Given a csv file_name, open and read the file.
    Return header and database:
     - The header is the list of the columns' names
     - The database is a list of lists that contains all the records.

    REQ: file_name has to be a valid .csv file with a header
    '''
    # Open the file given so we can read what's inside
    with open(FILE_NAME) as reader_file:
        # Read the file
        reader = csv.reader(reader_file)
        # Make it a list type, so it's easier for us to manage the data
        data = list(reader)
    # The first row of the data has the header
    # The rest of the data are records and will be stored in the database
    return (data[0], data[1:])


def write_to_csv(data):
    ''' (list) -> NoneType

    Write the data to the csv file.

    REQ: data must be a list of lists with consistent number of columns (in each row)
    '''
    # To make our database more organized, we will sort our csv file
    data.sort(key=lambda k: k[0])
    header = read_csv()[0]
    # Open the file given so we can write on it
    with open(FILE_NAME, 'w', newline="") as writer_file:
        writer = csv.writer(writer_file)
        # When we write the updated database back on the file, we need to
        # remember to add the header back in as well.
        writer.writerows([header] + data)


def get_item_price(item, colour):
    ''' (str, str) -> int

    Given an item and its colour, return the item's price.

    REQ: item and colour should be valid (the record should exist
    in the database)
    '''
    # Loop through every item in the database list (every row in the database)
    database = read_csv()[1]
    for item_record in database:
        # Every row in the database is a list itself, and we need to check
        # we find the right item and its colour
        if item_record[1] == item and item_record[2] == colour:
            # If you find the item, get the price and return it.
            # Make sure it's the right type!
            return int(item_record[3])


def get_item_quantity(item, colour):
    ''' (str, str) -> int

    Given an item and its colour, return how many of them are in stock.

    REQ: item and colour should be valid (the record should exist
    in the database)
    '''
    # Loop through every item in the database list (every row in the database)
    database = read_csv()[1]
    for item_record in database:
        # Every row in the database is a list itself, and we need to check
        # we find the right item and its colour
        if item_record[1] == item and item_record[2] == colour:
            # If you find the item, get the quantity and return it.
            # Make sure it's the right type!
            return int(item_record[4])


def add_item(category, name, colour, price, quantity):
    ''' (str, str, str, int, int) -> NoneType

    Given details for a new item, update the csv file.

    REQ: all input should be valid (the record should not already exist
    in the database)
    '''
    # Create a new record
    database = read_csv()[1]
    item_record = [category, name, colour, price, quantity]
    # Add the item record at the end of the database
    database += [item_record]
    # Write the new database to the file
    write_to_csv(database)
    print("Item added successfully!")


def remove_item(item, colour):
    ''' (str, str) -> NoneType

    Given an item and its colour, remove that item from the database
    and update the csv file.

    REQ: item and colour should be valid (the record should exist
    in the database)
    '''
    # Loop through every item in the database list a.k.a every row in the
    # database.
    database = read_csv()[1]
    for item_record in database:
        # Every row in the database is a list itself, and we need to check
        # we find the right item and its colour
        if item_record[1] == item and item_record[2] == colour:
            # If you find the record, remove it from the database
            database.remove(item_record)
            # As soon as you find it, you want to quit the loop
            print("Item removed successfully!")
            break
    # Write the new database to the file
    write_to_csv(database)


def update_price(item, colour, new_price):
    ''' (str, str, int) -> NoneType

    Given an item and its colour, update its record with the new_price.
    Once you make the update, don't forget to write it in the file.

    REQ: item and colour should be valid (the record should exist
    in the database) and the new_price has to be a number greater than 0.

    Example:
    >>> get_item_price("pants", "grey")
    60
    >>> update_price("pants", "grey", 70)
    Item price was successfully updated!
    >>> get_item_price("pants", "grey")
    70

    Now, if we do:
    >>> update_price("notebook", "pink", 6)
    Item price was successfully updated!
    >>> update_price("notebook", "pink", 4)
    Item price was successfully updated!
    >>> get_item_price("notebook", "pink")
    ?????  <- What should this be?

    '''
    print("TODO!")


def purchase_items(item, colour, items_bought):
    ''' (str, str, int) -> NoneType

    Given an item, its colour and the amount of items purchased, update its
    record with the new updated inventory quantity left. The input items_bought
    is the amount of items the costumer has bought, so now we need to update it
    in our database. Once you make the update, don't forget to write it in
    the file.

    REQ: item and colour should be valid (the record should exist
    in the database) and items_bought has to be a number greater than 0 and
    less than the current quantity.

    Example:
    >>> get_item_quantity("pants", "grey")
    80
    >>> purchase_items("pants", "grey", 3)
    Item quantity was successfully updated!
    >>> get_item_quantity("pants", "grey")
    77

    Now, if we do:
    >>> purchase_items("pants", "grey", 5)
    Item quantity was successfully updated!
    >>> purchase_items("pants", "grey", 6)
    Item quantity was successfully updated!
    >>> update_price("pants", "grey", 75)
    Item price was successfully updated!
    >>> purchase_items("pants", "grey", 3)
    Item quantity was successfully updated!
    >>> get_item_quantity("pants", "grey")
    ?????  <- What should this be?

    '''
    print("TODO!")


#########################################################################
#########################################################################
############################# START HERE ################################
#########################################################################
#########################################################################
# Find the global code below:

# Make sure this file is in the same folder as the .py file
FILE_NAME = "store_items.csv"

# Read the data just so we can see it
csv_header, csv_data = read_csv()
# Let's print the header of our csv file, which we are keeping separate from
# our database, as it not a record.
print(csv_header)
# Now, let's print the database to see how it is set up:
# The database is a list inside a list, which means that every item of
# the database list represent a row
# Every row is also represented by a list, where the order of the elements
# is the same as the order of the database headers
print(csv_data)
