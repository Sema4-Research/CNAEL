<?php

function findUTRs(&$exons, $cdStart, $cdEnd) {
  for ($i = 0; $i < count($exons); $i++) {
    $exon = &$exons[$i];
  // foreach ($exons as $exon) {
    $end = $exon['end'];
    $start = $exon['start'];    
    if ($end < $cdStart || $start > $cdEnd) {
        $exon['utr'] = true;
    } else {
        if ($cdStart >= $start && $cdStart <= $end) {
            $exon['cdStart'] = $cdStart;
        }
        if ($cdEnd >= $start && $cdEnd <= $end) {
            $exon['cdEnd'] = $cdEnd;
        }
    }
    // echo json_encode($exon);
  }
  // echo json_encode($exons);
}

/**
 * Decode a UCSC "genePredExt" record.  refGene files are in this format.
 *
 * @param tokens
 * @param ignore
 * @returns {*}
 */
function decodeGenePredExt() {

  $shift = 1;
  $handle = fopen("./data/ncbiRefSeq.sorted.txt", "r");
  $features = array();
  if ($handle) {
      while (($line = fgets($handle)) !== false) {
        $tokens = explode("\t", $line);
        if (count($tokens) <= (11 + $shift)) {
          continue;
        }      
        $cdStart = (int)($tokens[5 + $shift]);
        $cdEnd = (int)($tokens[6 + $shift]);
        $feature = [];
        $feature['name'] = $tokens[11 + $shift];
        $feature['chr'] = $tokens[1 + $shift];
        $feature['strand'] = $tokens[2 + $shift];
        $feature['start'] = (int)$tokens[3 + $shift];
        $feature['end'] = (int)$tokens[4 + $shift];
        $feature['cdStart'] = $cdStart;
        $feature['cdEnd'] = $cdEnd;
        $feature['id'] = $tokens[0 + $shift];
        $exonCount = (int)$tokens[7 + $shift];
        $exonStarts = explode(',', $tokens[8 + $shift]);
        $exonEnds = explode(',', $tokens[9 + $shift]);
        $exons = [];
        for ($i = 0; $i < $exonCount; $i++) {
          $start = (int)$exonStarts[$i];
          $end = (int)$exonEnds[$i];
          array_push($exons, ['start'=>$start, 'end'=>$end]);
        }
        findUTRs($exons, $cdStart, $cdEnd);
        // echo json_encode($exons);
        // exit();
        $feature['exons'] = $exons;
        array_push($features, $feature);        
        // echo json_encode($feature);
        // exit();
      }      
      ob_start("ob_gzhandler");
      echo json_encode($features);
      fclose($handle);
  } else {
      // error opening the file.
  } 
}

decodeGenePredExt();