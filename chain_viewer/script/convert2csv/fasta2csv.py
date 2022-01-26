#! /usr/bin/env python3
import pprint
from Bio import SeqIO
import argparse
pp = pprint.PrettyPrinter(indent=2)


def main():
	parser = argparse.ArgumentParser(description = "parsing FASTA format reference sequence data")
	parser.add_argument("name", metavar = "name", type = str, help = "Genome assembly name like GRCh38 or GRCh37")
	parser.add_argument("file", metavar = "file", type = str, help = "File name like GRCh38.fasta or GRCh37.fa")
	args = parser.parse_args()
	name = args.name
	file = args.file

	sequences_genome = SeqIO.parse(file, 'fasta')
	for seq in sequences_genome:
		pp.pprint(seq)

if __name__ == '__main__':
	main()