#! /usr/bin/env python3
import sqlite3
import pprint
import json
import http.server as s
import socketserver
import urllib.parse
from Bio import SeqIO
import argparse
from http.server import HTTPServer, SimpleHTTPRequestHandler
pp = pprint.PrettyPrinter(indent=2)


snp_connection = sqlite3.connect("../../db/snp.db")
snp_cursor     = snp_connection.cursor()



class SQLite3Handler(s.SimpleHTTPRequestHandler):
	def do_GET(self):
		result = None
		qs = urllib.parse.urlparse(self.path).query
		qs_d = urllib.parse.parse_qs(qs)
		print(f"SQLite3Handler: receive {qs_d}")
		#URLのチェックを入れる
		table = qs_d.get("table")[0]
		if table == "snp":
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
			snp_cursor.execute(f"SELECT * FROM {table} WHERE assembly=:assembly and chr=:chr and position>=:start and position<=:end", paramdict)
			result = snp_cursor.fetchall()

		result_text = json.dumps(result)

		self.send_response(200)
		self.send_header('Content-type', 'text/html; charset=utf-8')
		self.send_header('Content-length', len(result_text.encode()))
		#self.send_header('Access-Control-Allow-Origin', 'true')
		self.end_headers()
		self.wfile.write(result_text.encode())



def main():
	parser = argparse.ArgumentParser(description = "snp data server (8003)")
	host = 'localhost'
	port = 8003
	httpd = s.HTTPServer((host, port), SQLite3Handler)
	print('serving at port', port)
	httpd.serve_forever()

	connection.close()


if __name__ == '__main__':
	main()