filename=../db/transcript.db
touch $filename
rm $filename
sqlite3 $filename "CREATE TABLE IF NOT EXISTS transcript( \
	assembly text, \
	chr text, \
	start int, \
	end int, \
	gene_name text, \
	transcript_name text, \
	gene_id text, \
	transcript_id text, \
	gene_biotype text, \
	transcript_biotype text, \
	exons text, \
	vis_index int \
);"

sqlite3 -separator , $filename ".import ../csv/GRCh37_transcript_2.csv transcript"
sqlite3 -separator , $filename ".import ../csv/GRCh38_transcript_2.csv transcript"
