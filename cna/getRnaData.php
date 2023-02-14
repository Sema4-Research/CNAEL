<?php
require_once('connection.php');
/*
var_gatk_multi_cnv_data ; var_loading_fusion;var_loading_germline;var_loading_somatic;var_loading_rna


ISM556060-2_CR
ISM556060-2_BAF	11	4944853	4944953	100	0.5117
ISM556588-2_BAF	11	4944853	4944953	100	0.5123
*/
function getRnaDataFromDB_var_loading_rna($pdo){
	try {
		$patientID = $_GET['patient_id'] ?:'';
		$caseId = $_GET['case_id'] ?: '';
        $sqlStatment = "select line_number as line_counter, gene, numReads, TPM,
                rankWithinSample, percentileInRefSamples, filter, zScore, fold_change as foldChange, 
                num_uniq_PMID, O_match, Ci_match, J_match, P_match, Ca_match, My_match, Md_match                 
                from var_loading_rna
                where patient_id='$patientID' and case_id='$caseId';";
        $stmt = $pdo->prepare($sqlStatment);
        $stmt->execute();
        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
		echo json_encode($result); 		
	}
	 catch(Exception $e) {
        //An exception has occured, which means that one of our database queries failed.
       print_r($e);
    }	
}

function getRnaDataFromDB($pdo){
	try {
		$patientID = $_GET['patient_id'] ?:'';
		$caseId = $_GET['case_id'] ?: '';
        $sqlStatment = "select ngs_pipeline_qc_filter_nm as filter, fold_change_am as foldChange, gene_nm as gene,
        reads_ct as numReads, rank_in_samples_num as rankWithinSample, z_score_am as zScore
                from v_rna_ui
                where patient_id='$patientID' and case_id='$caseId' and is_selected_in=1;";
        $stmt = $pdo->prepare($sqlStatment);
        $stmt->execute();
        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
		echo json_encode($result); 		
	}
	 catch(Exception $e) {
        //An exception has occured, which means that one of our database queries failed.
       print_r($e);
    }	
}

// select ngs_pipeline_qc_filter_nm as filter, fold_change_am as foldChange, gene_nm as gene,
//         reads_ct as numReads, rank_in_samples_num as rankWithinSample, z_score_am as zScore
//                 from v_rna_ui
//                 where patient_id='LP158851' and case_id='411531' and is_selected_in=1;

//databse instance
$pdo = Db::getInstance();
getRnaDataFromDB($pdo);

?>

