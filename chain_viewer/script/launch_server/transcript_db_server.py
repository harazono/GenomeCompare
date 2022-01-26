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


transcript_connection = sqlite3.connect("../../db/transcript.db")
transcript_cursor     = transcript_connection.cursor()

class SQLite3Handler(s.SimpleHTTPRequestHandler):
	def do_GET(self):
		result = None
		qs = urllib.parse.urlparse(self.path).query
		qs_d = urllib.parse.parse_qs(qs)
		print(f"SQLite3Handler: receive {qs_d}")
		#URLのチェックを入れる
		table = qs_d.get("table")[0]
		if table == "transcript":
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
			transcript_cursor.execute(f"SELECT * FROM {table} WHERE assembly=:assembly and chr=:chr and start<:end and end>:start", paramdict)
			result = transcript_cursor.fetchall()

		result_text = json.dumps(result)
		self.send_response(200)
		self.send_header('Content-type', 'text/html; charset=utf-8')
		self.send_header('Content-length', len(result_text.encode()))
		#self.send_header('Access-Control-Allow-Origin', 'true')
		self.end_headers()
		self.wfile.write(result_text.encode())

def main():
	parser = argparse.ArgumentParser(description = "transcript data server (8004)")
	host = 'localhost'
	port = 8004
	httpd = s.HTTPServer((host, port), SQLite3Handler)
	print('serving at port', port)
	httpd.serve_forever()
	connection.close()

if __name__ == '__main__':
	main()