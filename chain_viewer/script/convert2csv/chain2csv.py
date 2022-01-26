#! /usr/bin/env python3

import sys
import argparse
import pprint
pp = pprint.PrettyPrinter(indent=2)

class paf_data():
	def __init__(self, source_chrom, source_start, source_end, target_chrom, target_start, target_end, cigar, rev, dsc = None, color = None):
		self.source_chrom = source_chrom
		self.source_start = source_start
		self.source_end = source_end
		self.target_chrom = target_chrom
		self.target_start = target_start
		self.target_end = target_end
		self.cigar = cigar
		self.rev = rev
		self.dsc = dsc

	def __str__(self):
		return f"source_chrom: {self.source_chrom}, source_start: {self.source_start}, source_end: {self.source_end}, target_chrom: {self.target_chrom}, target_start: {self.target_start}, target_end: {self.target_end}, cigar: {self.cigar}, rev: {self.rev}, dsc: {self.dsc}"


def chain_parser(filename):
	ret_array = []
	score = 0
	tName = ""
	tSize = 0
	tStart = 0
	tEnd = 0
	qName = ""
	qSize = 0
	qStrand = ""
	qStart = 0
	qEnd = 0
	id_ = 0
	source_current_pos = 0
	target_current_pos = 0
	with open(filename) as f:
		for line in f:
			if line.startswith("chain"):
				chain, score, tName, tSize, tStrand, tStart, tEnd, qName, qSize, qStrand, qStart, qEnd, id_ = line.strip().split()
				source_current_pos = int(tStart)
				target_current_pos = int(qStart)
			elif line != "\n":
				block = line.strip().split()
				source_start = source_current_pos
				target_start = target_current_pos
				source_end = source_start + int(block[0])
				target_end = target_start + int(block[0])
				paf_alignment_data = paf_data(
					target_chrom = tName,
					target_start = target_start,
					target_end = target_end,
					source_chrom = qName,
					source_start = source_start,
					source_end = source_end,
					cigar = target_end - target_start,
					rev = qStrand,
					dsc = filename
				)
				assert(target_end - target_start == source_end - source_start), "chain file reports different length between reference and target"
				ret_array.append(paf_alignment_data)
				if len(block) == 3:
					source_current_pos = source_end + int(block[1])
					target_current_pos = target_end + int(block[2])
	return ret_array


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
		source_chromosome = each_chain.source_chrom
		source_start = each_chain.source_start
		source_end = each_chain.source_end
		target_chromosome = each_chain.target_chrom
		target_start = each_chain.target_start
		target_end = each_chain.target_end
		length = each_chain.cigar
		tmp = [source_assembly, source_chromosome, source_start, source_end, target_assembly, target_chromosome, target_start, target_end, length]
		tmp = [str(x) for x in tmp]
		print(",".join(tmp))



if __name__ == "__main__":
	main()