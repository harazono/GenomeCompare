CREATE TABLE repeat(
	assembly text,
	chr text,
	start int,
	end int,
	name text,
	score int,
	strand text
);

CREATE TABLE transcript(
	assembly text,
	chr text,
	start int,
	end int,
	gene_name text,
	transcript_name text,
	gene_id text,
	transcript_id text,
	gene_biotype text,
	transcript_biotype text,
	exons text,
	vis_index int
);

CREATE TABLE chain(
	source_assembly text,
	source_chromosome text,
	source_start int,
	source_end int,
	target_assembly text,
	target_chromosome text,
	target_start int,
	target_end int,
	length int
);

CREATE TABLE snp(
	assembly text,
	chr text,
	position int,
	id text,
	ref text,
	alt text,
	qual int,
	filter text,
	info text
);

.separator ,
.import ../csv/GRCh37ToGRCh38_chain.csv chain
.import ../csv/GRCh37_repeat.csv repeat
.import ../csv/GRCh38_repeat.csv repeat
.import ../csv/GRCh37_transcript.csv transcript
.import ../csv/GRCh38_transcript.csv transcript
.import ../csv/GRCh37_clinver.csv snp
.import ../csv/GRCh38_clinver.csv snp
