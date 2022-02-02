filename=../db/chain.db
touch $filename
rm $filename
sqlite3 $filename "CREATE TABLE IF NOT EXISTS chain( \
	source_assembly text, \
	source_chromosome text, \
	source_start int, \
	source_end int, \
	target_assembly text, \
	target_chromosome text, \
	target_start int, \
	target_end int, \
	length int \
);"

sqlite3 -separator , $filename ".import ../csv/GRCh37ToGRCh38_chain.csv chain"
sqlite3 -separator , $filename ".import ../csv/GRCh38ToGRCh37_chain.csv chain"