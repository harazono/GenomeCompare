#! /usr/bin/env python3
import argparse
import pprint
pp = pprint.PrettyPrinter(indent=2)
import numpy as np
import gc

def main():
	parser = argparse.ArgumentParser(description = "Parsing repeat file (bed format)")
	parser.add_argument("assembly", metavar = "assembly", type = str, help = "assembly name like 'GRCh38' or 'hg19'")
	parser.add_argument("bed", metavar = "bed", type = str, help = "bed file name")
	args = parser.parse_args()
	assembly = args.assembly
	bed_filename = args.bed
	repeats = {}
	with open(bed_filename, 'r') as f:
		for each_line in f.readlines():
			tmp = [assembly]
			tmp.extend(each_line.strip().split("\t"))
			#print(",".join(tmp))
			if tmp[1] in repeats:
				repeats[tmp[1]].append(tmp)
			else:
				repeats[tmp[1]] = [tmp]

	for each_chr in repeats:
		#print(each_chr)
		size = max(int(x[3]) for x in repeats[each_chr]) + 1
		canvas = np.zeros((size, 10))
		canvas = np.full_like(canvas, False, dtype=np.bool)
		for each_repeat in repeats[each_chr]:
			current_height = 0
			start  = int(each_repeat[2])
			end    = int(each_repeat[3])
			sub_canvas = canvas[start:end, current_height]
			
			while np.sum(sub_canvas) != 0:
				current_height = current_height + 1
				sub_canvas = canvas[start:end, current_height]
			sub_canvas = True
			del sub_canvas
			cnt = str(current_height + 1)
			print(",".join([each_repeat[0], each_repeat[1], each_repeat[2], each_repeat[3], each_repeat[4], each_repeat[5], each_repeat[6], cnt]))
		del canvas

		gc.collect()





if __name__ == '__main__':
	main()
