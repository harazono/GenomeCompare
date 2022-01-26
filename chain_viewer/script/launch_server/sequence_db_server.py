#! /usr/bin/env python3
import pprint
import json
import http.server as s
import socketserver
import urllib.parse
from Bio import SeqIO
import argparse
from http.server import HTTPServer, SimpleHTTPRequestHandler
pp = pprint.PrettyPrinter(indent=2)

sequence = {}

class SQLite3Handler(s.SimpleHTTPRequestHandler):
	def do_GET(self):
		result = None
		qs = urllib.parse.urlparse(self.path).query
		qs_d = urllib.parse.parse_qs(qs)
		print(f"SQLite3Handler: receive {qs_d}")
		#URLのチェックを入れる
		table = qs_d.get("table")[0]
		if table == "sequence":
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
			chr_len = sequence[assembly][chr]["length"]
			seq = sequence[assembly][chr]["sequence"][int(start):int(end)]
			result = (chr_len, seq)

		result_text = json.dumps(result)

		self.send_response(200)
		self.send_header('Content-type', 'text/html; charset=utf-8')
		self.send_header('Content-length', len(result_text.encode()))
		#self.send_header('Access-Control-Allow-Origin', 'true')
		self.end_headers()
		self.wfile.write(result_text.encode())



def main():
	parser = argparse.ArgumentParser(description = "sequence data server (8002)")
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
	port = 8002
	httpd = s.HTTPServer((host, port), SQLite3Handler)
	print('serving at port', port)
	httpd.serve_forever()

	connection.close()


if __name__ == '__main__':
	main()