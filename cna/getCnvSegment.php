<?php
require_once('connection.php');

function findBamDataSourceForPatientCaseAndMutationType($pdo, $patient_id, $case_id, $bam_mut_type_nm) {
  try {
    $sql = "select * from meta_data_source where patient_id='$patient_id' and case_id='$case_id' and source_file_type_nm='.bam' and mut_type_nm='GMCNV' limit 1;";
    $stmt = $pdo->prepare($sql);
    $stmt->execute();
    $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
    return $result;
  } catch (Exception $e) {
    print_r($e);
  }
}

function findCuratorDefinedMultiGeneCnvSelectVariant($pdo, $patient_id, $case_id) {
  $sql = "select * from v_gatk_mg_cnv_ui where patient_id='$patient_id' and case_id='$case_id'
          and mut_type_nm='GMCNV' and source_row_num > 0 and is_selected_in = 1 and is_report_candidate_in = 0
          order by seg_chrom_nm asc, seg_start_pos_num asc, seg_end_pos_num asc;";
  try {    
    $stmt = $pdo->prepare($sql);
    $stmt->execute();
    $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
    return $result;
  } catch (Exception $e) {
    print_r($e);
  }            
}


function findCuratorDefinedMultiGeneCnvSelectVariantHistory($pdo, $patient_id, $case_id, $history) {
    // $sql = "select * from v_gatk_mg_cnv_ui where patient_id='$patient_id' and case_id='$case_id'
    //         and mut_type_nm='GMCNV' and source_row_num > 0 and is_selected_in = 1 and is_report_candidate_in = 0
    //         order by seg_chrom_nm asc, seg_start_pos_num asc, seg_end_pos_num asc;";

    $sql = "select *
   from (
    select *
      from `vonc_wes_v13`.`v_gatk_mg_cnv_ui_test_history` `gmcnv`
      where `gmcnv`.`patient_id` ='$patient_id' and `gmcnv`.`case_id` = '$case_id' 
      and  `gmcnv`.`transaction_start_tm` < '$history' and `gmcnv`.`transaction_until_tm` >= '$history'
  ) t1
  INNER JOIN
    (select 
      `gmcnv`.`patient_id` as t2_pid, `gmcnv`.`case_id` as t2_cid, `gmcnv`.`mut_type_nm` as t2_mtp, `gmcnv`.`source_row_num` as t2_srn,
        max(transaction_until_tm) t2_transaction_until_tm
    from 
      `vonc_wes_v13`.`v_gatk_mg_cnv_ui_test_history` `gmcnv`
      where 
        `gmcnv`.`patient_id` ='$patient_id' and `gmcnv`.`case_id` = '$case_id' 
        and  `gmcnv`.`transaction_start_tm` < '$history' and `gmcnv`.`transaction_until_tm` >= '$history'
        group by `gmcnv`.`patient_id`, `gmcnv`.`case_id`, `gmcnv`.`mut_type_nm`, `gmcnv`.`source_row_num`) t2
    on t1.patient_id  = t2_pid and t1.case_id = t2_cid and t1.mut_type_nm = t2_mtp and t1.source_row_num = t2_srn
      and t1.transaction_until_tm = t2_transaction_until_tm;";

    try {    
      $stmt = $pdo->prepare($sql);
      $stmt->execute();
      $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
      return $result;
    } catch (Exception $e) {
      print_r($e);
    }            
  }


function constructCurationCommentToVariantCurationInfoHistoryLink($row) {
  // add decode comments_tx 
  $decode_variant_curation_comment_tx = '';
  $history_link = $row["variant_curation_comment_tx"];

  if ($row["variant_curation_comment_tx"] && $row["variant_curation_comment_tx"] !== '') {
      
      $decode_variant_curation_comment_tx = urldecode($row["variant_curation_comment_tx"]);

      $url = '/variantCurationInfoHistory?patient_id='      . $row["patient_id"] . 
                                              '&case_id='         . $row["case_id"] .
                                              '&mut_type_nm='     . $row["mut_type_nm"]  . 
                                              '&source_row_num='  . $row["source_row_num"]  . 
                                              '&gene='            . $row["gene_nm"];
      $anchor_start_tag = '<a style="color:blue" href=' .  $url . ' target="_blank">';  
      $anchor_end_tag  = '</a>';   
      $history_link =   $anchor_start_tag . $decode_variant_curation_comment_tx . $anchor_end_tag;
  } 
  return $history_link;
}

function constructClinicalSignificanceToVariantCurationInfoHistoryLink($row) {
  $history_link = $row["variant_clinical_significance_nm"];

  if ($row["variant_clinical_significance_nm"] && $row["variant_clinical_significance_nm"] !== '') {      
      $url = '/variantCurationInfoHistory?patient_id='      . $row["patient_id"] . 
                                              '&case_id='         . $row["case_id"] .
                                              '&mut_type_nm='     . $row["mut_type_nm"]  . 
                                              '&source_row_num='  . $row["source_row_num"]  . 
                                              '&gene='            . $row["gene_nm"];
      $anchor_start_tag = '<a style="color:blue" href=' .  $url . ' target="_blank">';
      $anchor_end_tag  = '</a>';   
      $history_link =   $anchor_start_tag . $row["variant_clinical_significance_nm"] . $anchor_end_tag;
  } 
  return $history_link;
}



function constructActorNameToVariantCurationHistoryLink($row) {  
  $history_link = '';
  return $history_link;

  $actor_nm = $row["actor_nm"];

  if ($actor_nm 
      && 
      $actor_nm !== '' 
      && 
      !(str_contains($actor_nm, 'system'))) {

      $url = '/variantCurationHistory?patient_id='      . $row["patient_id"] . 
                                              '&case_id='         . $row["case_id"] .
                                              '&mut_type_nm='     . $row["mut_type_nm"]  . 
                                              '&source_row_num='  . $row["source_row_num"]  . 
                                              '&gene='            . $row["gene_nm"];
      $anchor_start_tag = '<a style="color:blue" href=' .  $url . ' target="_blank">';   
      $anchor_end_tag  = '</a>' ;  
      $history_link = $anchor_start_tag . $actor_nm  . $anchor_end_tag;
  } 
  return $history_link;
}


function constructCommentsToVariantCurationHistoryLink($row) {
  // add decode comments_tx 
  $decode_comments_tx = '';
  $history_link = $row["comments_tx"];

  if ($row["comments_tx"] && $row["comments_tx"] !== '') {
      
      $decode_comments_tx = urldecode($row["comments_tx"]);

      $url = '/variantCurationHistory?patient_id='      . $row["patient_id"] . 
                                              '&case_id='         . $row["case_id"] .
                                              '&mut_type_nm='     . $row["mut_type_nm"]  . 
                                              '&source_row_num='  . $row["source_row_num"]  . 
                                              '&gene='            . $row["gene_nm"];
      $anchor_start_tag = '<a style="color:blue" href=' .  $url . ' target="_blank">';
      $anchor_end_tag  = '</a>'   ;
      $history_link =   $anchor_start_tag . $decode_comments_tx . $anchor_end_tag;
      //history_link =   $anchor_start_tag . $row["comments_tx"] . $anchor_end_tag
  } 
  return $history_link;
}

function addLineBreakToGeneTx($gene_tx) {
  $gene_array                  = [];
  $gene_array_with_line_break  = [];
  $line_break                  = '<br>';
  $per_line_gene_count         = 4;
  $line_number                 = 1;
  $gene_tx_with_line_break     = '';

  if ($gene_tx) {
      $gene_array = explode(',', $gene_tx);
      for ($i=0; $i < count($gene_array); $i++) {
        array_push($gene_array_with_line_break, $gene_array[$i]);
          $line_break_index = ($per_line_gene_count * $line_number) - 1;
          if ($i == $line_break_index) {
              array_push($gene_array_with_line_break, $line_break);
              $line_number++;
          }
      }
      $gene_tx_with_line_break = implode(' ', $gene_array_with_line_break);
  }
  return $gene_tx_with_line_break;
}


function addLineBreakToGeneTxWithTruncation($gene_tx) {
  $gene_array                  = [];
  $gene_array_with_line_break  = [];
  $line_break                  = '<br>';
  $per_line_gene_count         = 4;
  $line_number                 = 1;
  $gene_tx_with_line_break     = '';
  // for gene list truncation
  $max_gene_ct                 = 8;
  $trucateSignal               = '';

  if ($gene_tx) {
      $gene_array  = explode(',', $gene_tx);
      $gene_ct     = count($gene_array);

      if ($gene_ct > $max_gene_ct) {
          $limit_gene_ct   = $max_gene_ct;
          $trucateSignal   = ' +++';
      }
      else {
          $limit_gene_ct = $gene_ct;
      }

      for ($i=0; $i < $limit_gene_ct; $i++) {
        array_push($gene_array_with_line_break, $gene_array[$i]);
          $line_break_index = ($per_line_gene_count * $line_number) - 1;
          if ($i == $line_break_index) {
              array_push($gene_array_with_line_break, $line_break);
              $line_number++;
          }
      }
      $gene_tx_with_line_break = implode(' ', $gene_array_with_line_break) . $trucateSignal;
  }
  return $gene_tx_with_line_break;
}

function constructGatkMultiGeneCnvChangeHistoryLink($row) {
  $curator_nm = '';
  $changeHistoryLink = $curator_nm    ;
  if (! str_contains($row["curator_first_nm"], 'system')) {
      $curator_nm = $row["curator_first_nm"] . ' ' . $row["curator_last_nm"];

      $url = '/viewGatkMultiGeneCnvChangeHistory?DT_RowId='  . $row["DT_RowId"];                                                                                               
      $anchor_start_tag = '<a style="color:blue" href=' .  $url . ' target="_blank">'   ;
      $anchor_end_tag  = '</a>'   ;
      $changeHistoryLink =   $anchor_start_tag . $curator_nm . $anchor_end_tag;
  }
  return $changeHistoryLink;
}

function constructReviewerName($row) {
  $reviewer_nm = '';
  if (! str_contains($row["reviewer_first_nm"], 'system')) {
      $reviewer_nm = $row["reviewer_first_nm"] . ' ' . $row["reviewer_last_nm"];
  }
  return $reviewer_nm;
}

function constructReviewerNameToVariantCurationHistoryLink($row) {

  $history_link = '';

  $reviewer_nm = constructReviewerName($row);

  if ($reviewer_nm 
      && 
      $reviewer_nm !== '' 
      && 
      !(str_contains($reviewer_nm, 'system'))) {

      $url = '/variantCurationHistory?patient_id='      . $row["patient_id"] . 
                                              '&case_id='         . $row["case_id"] .
                                              '&mut_type_nm='     . $row["mut_type_nm"]  . 
                                              '&source_row_num='  . $row["source_row_num"]  . 
                                              '&gene='            . $row["gene_nm"];
      $anchor_start_tag = '<a style="color:blue" href=' .  $url . ' target="_blank">'   ;
      $anchor_end_tag  = '</a>'   ;
      $history_link = $anchor_start_tag . $reviewer_nm  . $anchor_end_tag;
  } 
  return $history_link;
}


function constructSegmentGenomicPositionTx($row) {
  return $row["seg_chrom_nm"] . ':' . 
                           $row["seg_start_pos_num"] .  '-' .
                           $row["seg_end_pos_num"];
}

//CNV 
function constructCNVSegmentGenomicPositionTxIgvLink($row, $bam) {
  $seg_genomic_pos_tx = constructSegmentGenomicPositionTx($row);
  $igv_bat_url_prefix      = 'http://localhost:60151/load?file=';
  $igv_link = $seg_genomic_pos_tx;

  if ($seg_genomic_pos_tx) {
              $url = $igv_bat_url_prefix . $bam . $seg_genomic_pos_tx;
              //console.log("igv_link $url = " . url)
              //anchor_start_tag = '<a style="color:blue" href=' .  $url . ' target="_blank">'   
              $anchor_start_tag = '<a style="color:blue" href=' .  $url . ' >'   ;
              $anchor_end_tag  = '</a>'   ;
              $igv_link =   $anchor_start_tag . $seg_genomic_pos_tx . $anchor_end_tag;
  }
  return $igv_link;
}


function formatDateTime($input_date) { 
  return $input_date;

  // date_time_string = ''
  // //console.log("input_date =")
  // //console.log(input_date)

  // if (input_date === null)                return date_time_string
  // if (typeof input_date === "undefined")  return date_time_string        
  // if (input_date) {
  //     //console.log('in formatDateTime')
  //     //console.log(input_date)
  //     ISO_string = input_date.toISOString()
  //     //console.log('ISO_string = ' . ISO_string)
   

  //     date_part       = ISO_string.split('T')[0]
  //     time_zone_part  = ISO_string.split('T')[1]
  //     time_part       = time_zone_part.split('.')[0]

  //     //console.log('date_part = ' . date_part)
  //     //console.log('time_part = ' . time_part)    
  //     date_time_string = date_part . ' ' . time_part
  //     if (date_time_string.includes('9999')) {
  //         date_time_string = ''
  //     }        
  // }
  // return date_time_string
}


function applyFontColorToTumorCopyNumber($row) {
  // Fusion data
  $amplificationFontcolor        = 'green';
  $lossFontcolor                 = 'red';
  $defaultFontcolor              = 'black';

  $fontcolor = $defaultFontcolor;
  
  if ($row["cnv_call_type_nm"]
      && 
      ($row["cnv_call_type_nm"] == 'Amplification' 
      || 
      $row["cnv_call_type_nm"] == 'Gain')) {
      
      $fontcolor = $amplificationFontcolor;
  }
  else if ($row["cnv_call_type_nm"] 
           && 
          $row["cnv_call_type_nm"] == 'Loss') {
      $fontcolor = $lossFontcolor;
  }
  else {
      $fontcolor = $defaultFontcolor;
  }

  $tumor_copy_number_am_html = '<font color=' . $fontcolor . '>' . $row["tumor_copy_number_am"] . '</font>';

  return $tumor_copy_number_am_html;
}


function transformChromosomeToNumber($chromosome) {  
  $chromosome_tx = $chromosome;
  if (str_contains($chromosome_tx, 'chr')) {
      $chromosome_tx = substr($chromosome_tx, 3);
  }
  if (str_contains($chromosome_tx, 'Chr')) {
      $chromosome_tx = substr($chromosome_tx, 3);
  }    
  if ($chromosome_tx == 'X') {
      $chromosome_tx = 23;
  }
  if ($chromosome_tx == 'x') {
      $chromosome_tx = 23;
  } 
  if ($chromosome_tx == 'Y') {
      $chromosome_tx = 24;
  }
  if ($chromosome_tx == 'y') {
      $chromosome_tx = 24;
  }   
  if ($chromosome_tx == 'NA') {
      $chromosome_tx = 0;
  }   
  if ($chromosome_tx == 'na') {
      $chromosome_tx = 0;
  }        
  return $chromosome_tx  ; 
}


function constructSegmentCnvPlotLink($row) {
  // default to no link, unless there are some text in the CAV field
  $cnv_call_type_nm = $row["cnv_call_type_nm"];
  $url = '/segmentCnvPng?patient_id='  . $row["patient_id"] . 
              '&case_id='                 . $row["case_id"] . 
              '&chromosome_nm='           . $row["seg_chrom_nm"] .
              '&segment_start_pos_num='   . $row["seg_start_pos_num"] . 
              '&segment_end_pos_num='     . $row["seg_end_pos_num"];
  
  $anchor_start_tag = '<a style="color:blue" href=' . '"' . $url  . '"' . ' target=' . "_blank" . '>' ;
  $anchor_end_tag  = '</a>'   ;
  $cnv_plot_link =   $anchor_start_tag . $cnv_call_type_nm . $anchor_end_tag       ;
  return $cnv_plot_link;
}


function constructSegmentLengthInKb($seg_length_am) {
  return $seg_length_am;
  // seg_length_in_kb_am = 0

  // if (seg_length_am) {
  //     seg_length_in_kb_am = kbFormatter(seg_length_am)
  // }
  // return seg_length_in_kb_am
}


function constructCytobandGatkMultiGeneCnvDetailLink($row, $display_class) {
  $url = '/viewGatkMultiGeneCnvDetail?DT_RowId='  . $row["DT_RowId"] . '&display_class=' . $display_class; 
  $anchor_start_tag = '<a style="color:blue" href=' .  $url . ' target="_blank">'   ;
  $anchor_end_tag  = '</a>'   ;
  $seg_cytoband_nm_tx = '<b>' . $row["seg_cytoband_nm"] . '</b>';
  //gatkMultiGeneCnvDetailLink =   $anchor_start_tag . $row["seg_cytoband_nm . $anchor_end_tag
  $gatkMultiGeneCnvDetailLink =   $anchor_start_tag . $seg_cytoband_nm_tx . $anchor_end_tag;
  return $gatkMultiGeneCnvDetailLink;
}

function transformGatkMultiGeneCnvAjaxData($bam, &$results, $display_class) {
  $display_full_og_tsg_in = true;
  for ($i = 0; $i < count($results); $i++) {
      $row = &$results[$i];
      $row["gene_nm_search_tx"]           = $row["og_gene_list_tx"] . ' ' . $row["tsg_gene_list_tx"] . ' ' . $row["cav_matching_list_tx"];
      $row["variant_curation_comment_url_tx"]      
                                      = constructCurationCommentToVariantCurationInfoHistoryLink($row);
      $row["variant_clinical_significance_url_tx"] 
                                      = constructClinicalSignificanceToVariantCurationInfoHistoryLink($row);
      $row["actor_nm_curation_history_url_tx"]     
                                      = constructActorNameToVariantCurationHistoryLink($row);
      
      if ($display_full_og_tsg_in) {
          $row["og_gene_list_tx"]             = addLineBreakToGeneTx($row["og_gene_list_tx"]);
          $row["tsg_gene_list_tx"]            = addLineBreakToGeneTx($row["tsg_gene_list_tx"]);  
          $row["cav_matching_list_tx"]        = addLineBreakToGeneTx($row["cav_matching_list_tx"]);
      } else {
          $row["og_gene_list_tx"]             = addLineBreakToGeneTxWithTruncation($row["og_gene_list_tx"]);
          $row["tsg_gene_list_tx"]            = addLineBreakToGeneTxWithTruncation($row["tsg_gene_list_tx"]);  
          $row["cav_matching_list_tx"]        = addLineBreakToGeneTxWithTruncation($row["cav_matching_list_tx"]);
      }

      $row["comments_tx"]                 = constructCommentsToVariantCurationHistoryLink($row);
      $row["actor_nm"]                   = $row["reviewer_first_nm"]. ' ' . $row["reviewer_last_nm"];
      $row["curator_nm"]                 = constructGatkMultiGeneCnvChangeHistoryLink($row);
      $row["reviewer_nm"]                = constructReviewerNameToVariantCurationHistoryLink($row);
      $row["seg_genomic_pos_tx"]          = constructCNVSegmentGenomicPositionTxIgvLink($row, $bam); 
      $row["curation_tm"]                 = formatDateTime($row["transaction_start_tm"]);
      $row["color_tumor_copy_number_am"]  = applyFontColorToTumorCopyNumber($row);
      $row["review_tm"]                   = formatDateTime($row["review_tm"]);
      $row["seg_chrom_sort_order_num"]    = transformChromosomeToNumber($row["seg_chrom_nm"]);
      $row["cnv_call_type_nm_url_tx"]     = constructSegmentCnvPlotLink($row);
      $row["seg_length_in_kb_am"]         = constructSegmentLengthInKb($row["seg_length_am"]);
      $row["case_curation_comment_tx"]    = urldecode($row["case_curation_comment_tx"]);
      $row["variant_curation_comment_tx"] = urldecode($row["variant_curation_comment_tx"]);
      $row["seg_cytoband_nm"]            = constructCytobandGatkMultiGeneCnvDetailLink($row, $display_class);
    }
}


$pdo = Db::getInstance();
$mut_type_nm     = 'GMCNV';    
$bam_mut_type_nm = 'GMCNV';
$patient_id = $_GET['patient_id'] ?:''; 
$case_id = $_GET['case_id'] ?: '';
$history = isset($_GET['history']) ? $_GET['history'] : '';
$bam = '';
$display_class = "define";
$meta_data_source = findBamDataSourceForPatientCaseAndMutationType($pdo, $patient_id, $case_id, $bam_mut_type_nm);
if (count($meta_data_source) == 1 && 
  $meta_data_source[0]["source_file_loc_nm"] !== '' &&
  str_contains($meta_data_source[0]["source_file_loc_nm"], 'http') ) {
    $bam = $meta_data_source[0]["source_file_loc_nm"];
    // echo $bam;
}
if ($history == '' || $history == 'null') {
    $variant = findCuratorDefinedMultiGeneCnvSelectVariant($pdo, $patient_id, $case_id);
} else {
    $variant = findCuratorDefinedMultiGeneCnvSelectVariantHistory($pdo, $patient_id, $case_id, $history);
}
// echo json_encode($variant);
// echo count($variant);
// $transformedResults = transformGatkMultiGeneCnvAjaxData($bam, $variant, $display_class);
transformGatkMultiGeneCnvAjaxData($bam, $variant, $display_class);
$ajaxOutput = [];
$ajaxOutput["data"] = $variant;
$ajaxOutput['bam'] = $bam;
echo json_encode($ajaxOutput);
// echo json_encode($meta_data_source);
// select source_file_loc_nm from meta_data_source where patient_id='LP47806' and case_id='4436' and source_file_type_nm='.bam' and mut_type_nm='GMCNV' limit 1;
?>