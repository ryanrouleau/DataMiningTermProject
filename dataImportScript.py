#
#	Requires 2 command line arguments; source file name, destination file name.
#	Will take in chicago crime dataset and produce scrubbed csv output for our analysis.
#

#input csv fields:
# ID,Case Number,Date,Block,IUCR,Primary Type,Description,Location Description,Arrest,Domestic,Beat,District,Ward,Community Area,FBI Code,X Coordinate,Y Coordinate,Year,Updated On,Latitude,Longitude,Location
#Output fields:
# YEAR++MONTH, PRIMARY TYPE, DESCRIPTION, LOCATION

import csv, sys, re

def main():
	if len(sys.argv) == 3:
		fIn = open(sys.argv[1],'r', newline='')	#object file f, input csv for read. need to iterate manually to manage memory usage. (textfile, byte-oriented datastream)
		fOut = open(sys.argv[2], 'w')
		firstRowFlag = True
		for row in csv.reader(iter(fIn.readline, '')):
			if not firstRowFlag:
				#hardcoded column elements. Sry. See list above for indexing/ labels.
				newRow = row[2][8:10] + row[2][0:2] + ',' + row[5] + ',' + row[6] + ',' + row[21]
				print(newRow, file=fOut)
			else:
				firstRowFlag = False	
	else:
		print("please give args <filename> <inFile name> <outFile name>")

if __name__ == "__main__":
	main();