<?php
require_once('connection.php');

function getFusionDataFromDB_var_loading_fusion($pdo){
	try {
		$patientID = $_GET['patient_id'] ?:'';
		$caseId = $_GET['case_id'] ?: '';
		//411526  LP1999
        //$sqlStatment = "select aws_s3_bucket_path_nm from patient_case_aws_variant_processing_log where patient_id='P1226047' and case_id='411526' and variant_processing_job_id='probeData'; ";segData
		$sqlStatment = "select * from var_loading_fusion where patient_id='LP1999' and case_id='411526';"; //pass by get method_exists
        $sqlStatment = "select count(*) from var_loading_fusion;"; //pass by get method_exists
        $sqlStatment = "select patient_id, case_id, predicted_DNA_Seq as form, line_number, 
                        gene_5p, HGNC_ID_5p, gene_5p_driver, chrom_5p, pos_5p, transcript_5p, 
                        is_preferred_transcript_5p, exon_5p, POC_5p, gene_3p, HGNC_ID_3p, 
                        gene_3p_driver, chrom_3p, pos_3p, transcript_3p, is_preferred_transcript_3p, 
                        exon_3p, POC_3p, num_reads, filter, red_flags, is_inframe, predicted_DNA_Seq,
                        CAV_match, CAV_URL, all_uniq_PMID, num_uniq_PMID, O_match, O_PMIDs, Ci_match,
                        Ci_PMIDs, J_match, J_PMIDs, P_match, P_PMIDs, Ca_match, Ca_PMIDs, My_match,
                        My_PMIDs, Md_match, Md_PMIDs, COSMIC_link, IMPACT_var, IMPACT_gene, FM_var, 
                        FM_gene, TCGA_var, TCGA_gene, Broad_var, Broad_gene, recurrence_link, 
                        is_selected_in
                        from var_loading_fusion
                        where patient_id=$patientID and case_id=$caseId;";
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

function getFusionDataFromDB($pdo){
	try {
		$patientID = $_GET['patient_id'] ?:'';
		$caseId = $_GET['case_id'] ?: '';
        $sqlStatment = "select source_row_num as line_number, chromsome_3p_nm as chrom_3p, chromsome_5p_nm as chrom_5p, affected_exon_3p_nm as exon_3p,
        affected_exon_5p_nm as exon_5p, gene_3p_nm as gene_3p, gene_5p_nm as gene_5p, is_3p_preferred_transcript_in as is_preferred_transcript_3p,
        is_5p_preferred_transcript_in as is_preferred_transcript_5p, position_3p_num as pos_3p, position_5p_num as pos_5p,
        transcript_3p_nm as transcript_3p, transcript_5p_nm as transcript_5p
                        from v_fusion_ui
                        where patient_id='$patientID' and case_id='$caseId' and is_selected_in=1 and (is_3p_preferred_transcript_in='1' or  is_5p_preferred_transcript_in =1) and (is_fusion_driver_gene_5p_in=1 or is_fusion_driver_gene_3p_in=1);";
                        
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

//databse instance
$pdo = Db::getInstance();
getFusionDataFromDB($pdo);

?>