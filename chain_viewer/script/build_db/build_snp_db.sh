filename=../db/snp.db
touch $filename
rm $filename
sqlite3 $filename "CREATE TABLE IF NOT EXISTS snp( \
	assembly text, \
	chr text, \
	position int, \
	id text, \
	ref text, \
	alt text, \
	qual int, \
	filter text, \
	info text \
);"

sqlite3 -separator , $filename ".import ../csv/GRCh37_clinver_2.csv snp"
sqlite3 -separator , $filename ".import ../csv/GRCh38_clinver_2.csv snp"
