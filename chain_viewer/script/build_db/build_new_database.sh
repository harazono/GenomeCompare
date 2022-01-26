filename=../db/database_of_repeat_transcript_chain.db
touch $filename
rm $filename
sqlite3 $filename < build_new_database.sql
