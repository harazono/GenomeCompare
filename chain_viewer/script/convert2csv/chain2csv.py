#! /usr/bin/env python3

import sys
import argparse
import pprint
from chain_parser import chain_parser, chain_data
pp = pprint.PrettyPrinter(indent=2)



"""
The file names reflect the assembly conversion data contained within
in the format <db1>To<Db2>.over.chain.gz. For example, a file named
hg15ToHg16.over.chain.gz file contains the liftOver data needed to
convert hg15 (Human Build 33) coordinates to hg16 (Human Build 34).
If no file is available for the assembly in which you're interested,
please send a request to the genome mailing list
"""

"""
sourceがquery側
targetがreference側
"""

"""
		self.tName   = tName
		self.tSize   = tSize
		self.tStrand = tStrand
		self.tStart  = tStart
		self.tEnd    = tEnd
		self.qName   = qName
		self.qSize   = qSize
		self.qStrand = qStrand
		self.qStart  = qStart
		self.qEnd    = qEnd
		self.id      = id

"""


def main():
	parser = argparse.ArgumentParser(description = "parsing chain file. <Source>To<Target>.")
	parser.add_argument("source", metavar = "source", type = str, help = "source assembly name")
	parser.add_argument("target", metavar = "target", type = str, help = "target assembly name")
	parser.add_argument("chain", metavar = "chain", type = str, help = "chain file name")
	args = parser.parse_args()
	chainfilename = args.chain
	source_assembly = args.source
	target_assembly = args.target

	chain = chain_parser(chainfilename)
	for each_chain in chain:
		source_chromosome = each_chain.tName
		source_start      = each_chain.tStart
		source_end        = each_chain.tEnd
		target_chromosome = each_chain.qName
		target_start      = each_chain.qStart
		target_end        = each_chain.qEnd
		length            = each_chain.tEnd - each_chain.tStart
		strand            = each_chain.qStrand
		tmp = [source_assembly, source_chromosome, source_start, source_end, target_assembly, target_chromosome, target_start, target_end, length, strand]
		tmp = [str(x) for x in tmp]
		print(",".join(tmp))
		#print(each_chain, file = sys.stderr)



if __name__ == "__main__":
	main()