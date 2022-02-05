#! /usr/bin/env python3
import argparse
import gzip

def main():
	parser = argparse.ArgumentParser(description = "Parsing VCF4.2 file")
	parser.add_argument("assembly", metavar = "assembly", type = str, help = "assembly name like 'GRCh38' or 'GRCh37'")
	parser.add_argument("vcf", metavar = "vcf", type = str, help = "vcf file name")
	args = parser.parse_args()
	assembly = args.assembly
	vcf_filename = args.vcf
	with gzip.open(vcf_filename, 'r') as f:
		for each_line in f.readlines():
			tmp = [assembly]
			line = each_line.decode()
			if not line.startswith("#"):
				chr = line.strip().split("\t")[0]
				try:
					chr = "chr" + str(int(chr))
				except Exception as E:
					chr = line[0]
				if chr in ["X", "Y", "M"]:
					chr = "chr" + chr
				line_replaced = [x.replace(",", "/") for x in line.strip().split("\t")]
				line_replaced[1] = str(int(line_replaced[1]) - 1) #Since VCF4.2 adopts 1-origin coordinate system
				tmp.extend(line_replaced)
				tmp[1] = chr
				print(",".join(tmp))

if __name__ == '__main__':
	main()
