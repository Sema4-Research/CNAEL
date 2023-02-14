<?php

$filename = "./data/hg19.fasta.fai";
$handle = fopen($filename, "r");
$contents = fread($handle, filesize($filename));
echo $contents;
fclose($handle);