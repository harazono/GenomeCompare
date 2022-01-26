#! /usr/bin/env python3

#from optparse import OptionParser
import sys
import pprint
pp = pprint.PrettyPrinter(indent=4)
import argparse
import subprocess
import gzip
import copy
import json
import numpy as np
import gc

class gff3_record:
	def __init__(self, seqid, source, _type, start, end, score, strand, phase, attribute):
		self.seqid           = seqid
		self.source          = source
		self.type            = _type
		self.start, self.end = start, end
		self.score           = score
		self.strand          = strand
		self.phase           = phase
		self.attribute       = {}
		for each_item in attribute.split(";"):
			self.attribute[each_item.split("=")[0]] = each_item.split("=")[1]
		if self.attribute.get("ID") is not None:
			self.category = self.attribute["ID"].split(":")[0]
		else:
			self.category = None
	def __str__(self):
		return ("\t").join([self.seqid + self.source + self.type, self.start, self.end])

class gene():
	def __init__(self, seqid, start, end, ID, Name, Alias, Parent, biotype):
		self.seqid      = seqid
		self.start      = int(start)
		self.end        = int(end)
		self.ID         = ID
		self.Name       = Name
		self.Alias      = Alias
		self.Parent     = Parent
		self.transcript = []
		self.biotype    = biotype
	def __str__(self):
		return f"ID: {self.ID}\tName: {self.Name}\tstart: {self.start}\tend: {self.end}"
	def formatted_str(self):
		retstr = str(self)
		for each_transcript in self.transcript:
			retstr += "\n" + each_transcript.formatted_str()
		return retstr

	def is_same(self, other):
		pass


class transcript():
	def __init__(self, seqid, start, end, ID, Name, Alias, Parent, pstart, biotype):
		self.seqid   = seqid
		self.start   = int(start)
		self.end     = int(end)
		self.ID      = ID
		self.Name    = Name
		self.Alias   = Alias
		self.Parent  = Parent
		self.pstart  = int(pstart)
		self.exon    = []
		self.biotype = biotype
	def __str__(self):
		return f"ID: {self.ID}\tName: {self.Name}start: {self.start}\tend: {self.end}"
	def formatted_str(self):
		retstr  = "  " + str(self)
		for each_exon in self.exon:
			retstr += "\n" + each_exon.formatted_str()
		return retstr

	def is_same_locus(self, other, mergin):
		is_same_exon_locus = True
		if self.is_same_exon_number == True:
			for i in range(len(self.exon)):
				if abs(self.exon[i].start - other.exon[i].start) <= mergin and abs(self.exon[i].end - other.exon[i].end) <= mergin:
					pass
				else:
					is_same_exon_locus = False
		else:
			is_same_exon_locus = False
		return is_same_exon_locus

	def is_same_exon_number(self, other):
		return len(self.exon) == len(other.exon)

	def is_same_structure(self, other, mergin):
		is_same_exon_structure = True
		if self.is_same_exon_number(other):
			for i in range(len(self.exon)):
				if abs((self.exon[i].start - self.pstart) - (other.exon[i].start - other.pstart)) <= mergin and abs((self.exon[i].end - self.pstart) - (other.exon[i].end - other.pstart)) <= mergin:
					pass
				else:
					is_same_exon_locus = False
		else:
			is_same_exon_locus = False
		return is_same_exon_locus




class exon():
	def __init__(self, seqid, start, end, Parent, pstart):
		self.seqid = seqid
		self.start = int(start)
		self.end = int(end)
		self.Parent = Parent
		self.pstart = int(pstart)
	def __str__(self):
		return f"Parent: {self.Parent}\tstart: {self.start}\tend: {self.end}"
	def formatted_str(self):
		return "    " + str(self)


def gff3_parser(filename):
	return_array = []
	try:
		with gzip.open(filename, "rt") as f:
			for each_line in f:
				if each_line.startswith("#"):
					continue
				seqid, source, _type, start, end, score, strand, phase, attribute = each_line.split("\t")
				if not _type in ["biological_region", "chromosome", "supercontig", "scaffold"]:
					return_array.append(gff3_record(seqid, source, _type, start, end, score, strand, phase, attribute))
		return return_array

	except gzip.BadGzipFile:
		with open(filename, "r") as f:
			for each_line in f:
				if each_line.startswith("#"):
					continue
				seqid, source, _type, start, end, score, strand, phase, attribute = each_line.split("\t")
				if not _type in ["biological_region", "chromosome", "supercontig", "scaffold"]:
					return_array.append(gff3_record(seqid, source, _type, start, end, score, strand, phase, attribute))
		return return_array

def build_transcript_feature(gff3):
	retarray = []
	idxcnt = 0
	current_gene = None
	current_transcript = None
	current_exon = None
	try:
		for each_record in gff3:
			if each_record.category == "gene":
				if current_gene is not None:
					retarray.append(copy.deepcopy(current_gene))
				seqid        = each_record.seqid
				start        = each_record.start
				end          = each_record.end
				ID           = each_record.attribute["gene_id"]
				Name         = each_record.attribute.get("Name")
				Alias        = each_record.attribute.get("Alias")
				Parent       = None
				biotype      = each_record.attribute.get("biotype")
				current_gene = gene(seqid, start, end, ID, Name, Alias, Parent, biotype)
			elif each_record.category == "transcript":
				if current_transcript is not None:
					current_gene.transcript.append(copy.deepcopy(current_transcript))
				seqid   = each_record.seqid
				start   = each_record.start
				end     = each_record.end
				ID      = each_record.attribute["transcript_id"]
				Name    = each_record.attribute.get("Name")
				Alias   = each_record.attribute.get("Alias")
				Parent  = each_record.attribute["Parent"]
				Biotype = each_record.attribute.get("Biotype")
				current_transcript = transcript(seqid, start, end, ID, Name, Alias, Parent, current_gene.start, Biotype)
			else:
				seqid = each_record.seqid
				start = each_record.start
				end = each_record.end
				Parent = each_record.attribute["Parent"]
				current_transcript.exon.append(exon(seqid, start, end, Parent, current_gene.start))
	except Exception as E:
		print(E)
		print(f"each_record: {each_record}")
	return retarray


def main():
	parser = argparse.ArgumentParser(description = "parsing GFF3 format gene annotation data")
	parser.add_argument("assembly", metavar = "assembly", type = str, help = "assembly name like 'GRCh38' or 'hg19'")
	parser.add_argument("GFF3", metavar = "gff3", type = str, help = "gege_annotation.gff3.gz file sorted by chromosome and begining point.")
	args = parser.parse_args()
	gff3_filename = args.GFF3
	assembly = args.assembly

	chrm_length = {}
	try:
		with gzip.open(gff3_filename, "rt") as f:
			for line in f:
				if line.startswith("##sequence-region"):
					this_line = [x.strip() for x in line.split()]
					chrm  = this_line[1]
					start = int(this_line[2])
					end   = int(this_line[3])
					try:
						chrm = "chr" + str(int(chrm))
					except Exception as E:
						pass
					chrm_length[chrm] = (start, end)
				if not line.startswith("#"):
					break
	except:
		with open(gff3_filename, "r") as f:
			for line in f:
				if line.startswith("##sequence-region"):
					this_line = [x.strip() for x in line.split()]
					chrm  = this_line[1]
					start = int(this_line[2])
					end   = int(this_line[3])
					try:
						chrm = "chr" + str(int(chrm))
					except Exception as E:
						pass
					chrm_length[chrm] = (start, end)
				if not line.startswith("#"):
					break


	gff_reader = gff3_parser(gff3_filename)
	genes_from_gff = build_transcript_feature(gff_reader)


	genes_in_each_chrm = {}
	for each_gene in genes_from_gff:
		gene_name = each_gene.Name
		gene_id = each_gene.ID
		gene_biotype = each_gene.biotype
		for each_transcript in each_gene.transcript:
			chr = each_transcript.seqid
			try:
				chr = "chr" + str(int(chr))
			except Exception as E:
				pass
			start = each_transcript.start
			end = each_transcript.end
			transcript_id = each_transcript.ID
			transcript_name = each_transcript.Name
			transcript_biotype = each_transcript.biotype
			if transcript_biotype == None:
				transcript_biotype = "None"
			exon_list = each_transcript.exon

			tmplist = []
			for i in range(len(exon_list)):
				current_exon = exon_list[i]
				x1 = str(current_exon.start)
				x2 = str(current_exon.end)
				tmplist.append(f"{x1}-{x2}")
			exons = ":".join(tmplist)

			tmp = [
				int(start),
				int(end),
				gene_name,
				transcript_name,
				gene_id,
				transcript_id,
				gene_biotype,
				transcript_biotype,
				exons,
				len(each_gene.transcript),
				1
			]
			tmp = [x if x is not None else "None" for x in tmp]
			if chr not in genes_in_each_chrm.keys():
				genes_in_each_chrm[chr] = {}
			if gene_id not in genes_in_each_chrm[chr]:
				genes_in_each_chrm[chr][gene_id] = []
			genes_in_each_chrm[chr][gene_id].append(tmp)


	# for each_chrm in chrm_length:
	# 	chrm_len = chrm_length[each_chrm]
	# 	canvas = np.zeros((chrm_len[1], 200))
	# 	canvas = np.full_like(canvas, False, dtype=np.bool)
	# 	print(each_chrm, "{:,}".format(sys.getsizeof(canvas)))
	# return None

	for each_chrm in genes_in_each_chrm:
		chrm_len = chrm_length[each_chrm]
		#canvas = np.zeros((chrm_len[1], 600))
		canvas = np.zeros((chrm_len[1], 600))
		canvas = np.full_like(canvas, False, dtype=np.bool)
		for each_gene in genes_in_each_chrm[each_chrm]:
			print(each_chrm, " ", each_gene, file=sys.stderr)
			transcripts = genes_in_each_chrm[each_chrm][each_gene]
			current_height = 0
			start  = min([x[0] for x in transcripts])
			end    = max([x[1] for x in transcripts])
			height = len(transcripts)
			sub_canvas = canvas[start:end, current_height + height]
			
			while np.sum(sub_canvas) != 0:
				current_height = current_height + 1
				sub_canvas = canvas[start:end, current_height + height]
			sub_canvas = True
			del sub_canvas
			cnt = current_height + 1
			for each_transcript in transcripts:
				each_transcript[-1] = cnt
				cnt = cnt + 1


				start              = str(each_transcript[0])
				end                = str(each_transcript[1])
				gene_name          = each_transcript[2]
				transcript_name    = each_transcript[3]
				gene_id            = each_transcript[4]
				transcript_id      = each_transcript[5]
				gene_biotype       = each_transcript[6]
				transcript_biotype = each_transcript[7]
				exons              = each_transcript[8]
				index              = str(each_transcript[10])
				print(",".join([assembly, each_chrm, start, end, gene_name, transcript_name, gene_id, transcript_id, gene_biotype, transcript_biotype, exons, index]))
			
		del canvas

		gc.collect()
		#np.set_printoptions(np.inf)
		#print(f"chr: {each_chrm}, max: {canvas.max()}")
		#print([i for i, x in enumerate(canvas) if x == 0])
	#pp.pprint(genes_in_each_chrm)

if __name__ == "__main__":
	main()