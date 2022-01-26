#! /usr/bin/env python3
import sqlite3
import pprint
import json
import http.server as s
import socketserver
import urllib.parse
from Bio import SeqIO
import argparse

pp = pprint.PrettyPrinter(indent=2)

from http.server import HTTPServer, SimpleHTTPRequestHandler

connection = sqlite3.connect('../db/database_of_repeat_transcript_chain.db')
cur = connection.cursor()

sequence = {}


chain_connection = sqlite3.connect("../db/chain.db")
chain_cursor     = chain_connection.cursor()

repeat_connection = sqlite3.connect("../db/repeat.db")
repeat_cursor     = repeat_connection.cursor()

snp_connection = sqlite3.connect("../db/snp.db")
snp_cursor     = snp_connection.cursor()

transcript_connection = sqlite3.connect("../db/transcript.db")
transcript_cursor     = transcript_connection.cursor()



class SQLite3Handler(s.SimpleHTTPRequestHandler):
	def do_GET(self):
		result = None
		qs = urllib.parse.urlparse(self.path).query
		qs_d = urllib.parse.parse_qs(qs)
		print(f"SQLite3Handler: receive {qs_d}")
		#URLのチェックを入れる
		table = qs_d.get("table")[0]
		if table in ("transcript", "repeat", "sequence", "snp"):
			assembly = qs_d["assembly"][0]
			chr = qs_d["chr"][0]
			start = qs_d["start"][0]
			end = qs_d["end"][0]
			paramdict = {
				"assembly":assembly,
				"chr": chr,
				"start": start,
				"end": end
			}
			if table in ("transcript"):
				transcript_cursor.execute(f"SELECT * FROM {table} WHERE assembly=:assembly and chr=:chr and start<:end and end>:start", paramdict)
				result = transcript_cursor.fetchall()

			if table in ("repeat"):
				repeat_cursor.execute(f"SELECT * FROM {table} WHERE assembly=:assembly and chr=:chr and start<:end and end>:start", paramdict)
				result = repeat_cursor.fetchall()


			elif table in ("sequence"):
				chr_len = sequence[assembly][chr]["length"]
				seq = sequence[assembly][chr]["sequence"][int(start):int(end)]
				result = (chr_len, seq)

			elif table in ("snp"):
				snp_cursor.execute(f"SELECT * FROM {table} WHERE assembly=:assembly and chr=:chr and position>=:start and position<=:end", paramdict)
				result = snp_cursor.fetchall()


		elif table == "chain":
			print(qs_d)
			source_assembly   = None
			source_chromosome = None
			source_start      = None
			source_end        = None
			target_assembly   = None
			target_chromosome = None
			target_start      = None
			target_end        = None
			try:
				source_assembly   = qs_d.get("source-assembly")[0]
			except:
				pass
			try:
				source_chromosome = qs_d.get("source-chromosome")[0]
			except:
				pass
			try:
				source_start      = qs_d.get("source-start")[0]
			except:
				pass
			try:
				source_end        = qs_d.get("source-end")[0]
			except:
				pass
			try:
				target_assembly   = qs_d.get("target-assembly")[0]
			except:
				pass
			try:
				target_chromosome = qs_d.get("target-chromosome")[0]
			except:
				pass
			try:
				target_start      = qs_d.get("target-start")[0]
			except:
				pass
			try:
				target_end        = qs_d.get("target-end")[0]
			except:
				pass
				
			print(target_assembly, target_chromosome, target_start, target_end)
			query_text = f"SELECT * FROM {table} WHERE "
			query_parameter = []
			if source_assembly:
				query_parameter.append(f"source_assembly='{source_assembly}'")
			if source_chromosome:
				query_parameter.append(f"source_chromosome='{source_chromosome}'")
			if source_start:
				query_parameter.append(f"source_start<{source_end}")
			if source_end:
				query_parameter.append(f"source_end>{source_start}")
			if target_assembly:
				query_parameter.append(f"target_assembly='{target_assembly}'")
			if target_chromosome:
				query_parameter.append(f"target_chromosome='{target_chromosome}'")
			if target_start:
				query_parameter.append(f"target_start<{target_end}")
			if target_end:
				query_parameter.append(f"target_end>{target_start}")
			query_text = query_text + " and ".join(query_parameter)
			print(query_text)
			"""
			http://localhost:8000/?table=chain&source-assembly=GRCh38&source-chromosome=chr1&source-start=0&source-end=24000000
			"""
			chain_cursor.execute(query_text)
			result = chain_cursor.fetchall()


		result_text = json.dumps(result)

		self.send_response(200)
		self.send_header('Access-Control-Allow-Origin', '*')
		self.send_header('Content-type', 'text/html; charset=utf-8')
		self.send_header('Content-length', len(result_text.encode()))
		#self.send_header('Access-Control-Allow-Origin', 'true')
		self.end_headers()
		self.wfile.write(result_text.encode())



def main():
	parser = argparse.ArgumentParser(description = "genomic data server")
	parser.add_argument("GenomeAssemblyFileName1", metavar = "Genome_assembly_file_name_1", type = str, help = "Genome assembly file name (1) like 'GRCh38_primary.fa' or 'hg19.fasta'")
	parser.add_argument("GenomeAssemblyName1",     metavar = "Genome_assembly_name_1",      type = str, help = "Genome assembly name (1) like 'GRCh38' or 'hg19'")
	parser.add_argument("GenomeAssemblyFileName2", metavar = "Genome_assembly_file_name_2", type = str, help = "Genome assembly file name (2) like 'GRCh38_primary.fa' or 'hg19.fasta'")
	parser.add_argument("GenomeAssemblyName2",     metavar = "Genome_assembly_name_2",      type = str, help = "Genome assembly name (2) like 'GRCh38' or 'hg19'")
	args = parser.parse_args()
	genome1f = args.GenomeAssemblyFileName1
	genome2f = args.GenomeAssemblyFileName2
	genome1n = args.GenomeAssemblyName1
	genome2n = args.GenomeAssemblyName2

	sequences_genome1 = SeqIO.parse(genome1f, 'fasta')
	sequences_genome2 = SeqIO.parse(genome2f, 'fasta')

	sequence[genome1n] = {}
	sequence[genome2n] = {}

	for each_sequence in sequences_genome1:
		sequence[genome1n][each_sequence.id] = {"length": len(each_sequence.seq), "sequence": str(each_sequence.seq)}
	for each_sequence in sequences_genome2:
		sequence[genome2n][each_sequence.id] = {"length": len(each_sequence.seq), "sequence": str(each_sequence.seq)}

	

	host = 'localhost'
	port = 8000
	httpd = s.HTTPServer((host, port), SQLite3Handler)
	print('serving at port', port)
	httpd.serve_forever()

	connection.close()


if __name__ == '__main__':
	main()