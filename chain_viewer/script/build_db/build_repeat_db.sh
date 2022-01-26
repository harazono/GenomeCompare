filename=../db/repeat.db
touch $filename
rm $filename
sqlite3 $filename "CREATE TABLE IF NOT EXISTS repeat( \
	assembly text, \
	chr text, \
	start int, \
	end int, \
	name text, \
	score int, \
	strand text, \
	vis_index int \
	);"

sqlite3 -separator , $filename ".import ../csv/GRCh37_repeat_2.csv repeat"
sqlite3 -separator , $filename ".import ../csv/GRCh38_repeat_2.csv repeat"
