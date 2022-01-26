#! /usr/bin/env python3
import sqlite3
import pprint
import json
import http.server as s
import socketserver
import urllib.parse
import argparse
from http.server import HTTPServer, SimpleHTTPRequestHandler

pp = pprint.PrettyPrinter(indent=2)

chain_connection = sqlite3.connect("../../db/chain.db")
chain_cursor     = chain_connection.cursor()

class SQLite3Handler(s.SimpleHTTPRequestHandler):
	def do_GET(self):
		result = None
		qs = urllib.parse.urlparse(self.path).query
		qs_d = urllib.parse.parse_qs(qs)
		print(f"SQLite3Handler: receive {qs_d}")
		#URLのチェックを入れる
		table = qs_d.get("table")[0]
		if table == "chain":
			source_assembly = qs_d["source-assembly"][0]
			source_chromosome = qs_d["source-chromosome"][0]
			source_start = qs_d["source-start"][0]
			source_end = qs_d["source-end"][0]
			target_assembly = qs_d["target-assembly"][0]
			target_chromosome = qs_d["target-chromosome"][0]
			target_start = qs_d["target-start"][0]
			target_end = qs_d["target-end"][0]
			paramdict = {
				"source_assembly": source_assembly,
				"source_chromosome": source_chromosome,
				"source_start": source_start,
				"source_end": source_end,
				"target_assembly": target_assembly,
				"target_chromosome": target_chromosome,
				"target_start": target_start,
				"target_end": target_end
			}
			chain_cursor.execute(f"SELECT * FROM {table} WHERE source_assembly=:source_assembly and source_chromosome=:source_chromosome and source_start>:source_start and source_end<:source_end and target_assembly=:target_assembly and target_chromosome=:target_chromosome and target_start>:target_start and target_end<:target_end", paramdict)
			result = chain_cursor.fetchall()

		result_text = json.dumps(result)

		self.send_response(200)
		self.send_header('Content-type', 'text/html; charset=utf-8')
		self.send_header('Content-length', len(result_text.encode()))
		#self.send_header('Access-Control-Allow-Origin', 'true')
		self.end_headers()
		self.wfile.write(result_text.encode())



def main():
	parser = argparse.ArgumentParser(description = "chain data server (8000)")
	host = 'localhost'
	port = 8000
	httpd = s.HTTPServer((host, port), SQLite3Handler)
	print('serving at port', port)
	httpd.serve_forever()
	connection.close()

if __name__ == '__main__':
	main()