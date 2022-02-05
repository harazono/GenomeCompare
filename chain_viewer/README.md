//This repository is under developping and documentation is not enough.

# Chain Viewer
The genome browser which can visualize chaining between two genome assemblies.

# Usage
1. clone this repositry and go to `chain_viewer`
```
$ git pull git@github.com:harazono/GenomeCompare.git && cd chain_viewer
```
2. make `db/` and `csv/`
```
$ mkdir db csv
```

```
.
├── README.md
├── csv
├── db
├── script
└── vis
```
3. convert your genome annotation data
```
$ python3 ./script/convert2csv/chain2csv.py GRCh38 GRCh37 GRCh38ToGRCh37.chain > ./csv/GRCh38ToGRCh37_chain.csv
```
Please refer help message for more information about each script.
```
$ python3 ./script/convert2csv/chain2csv.py -h
```

Here are examples of csv
```
csv
├── GRCh37ToGRCh38_chain.csv
├── GRCh37_clinver.csv
├── GRCh37_repeat.csv
├── GRCh37_transcript.csv
├── GRCh38ToGRCh37_chain.csv
├── GRCh38_clinver.csv
├── GRCh38_repeat.csv
├── GRCh38_transcript.csv
├── hg19Tohg38_chain.csv
├── hg19_repeat.csv
└── hg38_repeat.csv

0 directories, 19 files
```

4. build sqlite3 database
move to `script/`
```
$ cd script
```
import csv file to the DB by using `/script/convert2csv/`

5. launch local server
```
script$ ./sqlite3_server.py ../GRCh38.fasta GRCh38 ../GRCh37.fasta GRCh37
```