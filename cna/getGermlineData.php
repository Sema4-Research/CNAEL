<?php
require_once('connection.php');
/*
var_gatk_multi_cnv_data ; var_loading_fusion;var_loading_germline;var_loading_somatic;var_loading_rna


ISM556060-2_CR
ISM556060-2_BAF	11	4944853	4944953	100	0.5117
ISM556588-2_BAF	11	4944853	4944953	100	0.5123
*/
function getGermlineDataFromDB_cntrl_var_loading_germline($pdo){
	try {
		$patientID = $_GET['patient_id'] ?:'';
		$caseId = $_GET['case_id'] ?: '';
        $sqlStatment = "select patient_id, case_id, mut_type_nm as form, line_number,
                vkey, gene, HGNC_ID, TSG_OG, AON, HC_gene, MVL_conclusion, MVL_date,
                HGMD_conclusion, HGMD_ids, ClinVar_conclusion, ClinVar_variation_id,
                VISta_curation_status, VISta_conclusion, VISta_assigned_codes, VISta_link,
                inheritance_pattern, zygosity, effect, chrom, pos, ref, alt, transcript, 
                exon_affected, cdot, pdot, AD_ref, AD_alt, DP, AF, red_flags, qual, filter, 
                HI_score, CAV_match, CAV_URL, all_uniq_PMID, num_uniq_PMID, O_match, O_PMIDs, 
                Ci_match, Ci_PMIDs, J_match, J_PMIDs, P_match, P_PMIDs, Ca_match, Ca_PMIDs, 
                My_match, My_PMIDs, Md_match, Md_PMIDs, VarSleuth_num_unique_PMIDs, varsleuth_link, 
                total_MAF as gnomAD_total_MAF, highest_subpop_MAF as gnomAD_highest_subpop_MAF, 
                gnomad_link, COSMIC_ID, COSMIC_count, hotspot, IMPACT_var, IMPACT_gene, 
                FM_var, FM_gene, TCGA_var, TCGA_gene, Broad_var, Broad_gene, recurrenct_link as recurrenct_link, 
                spliceAI_suggests_altered_splicing, is_selected_in                    
                from cntrl_var_loading_germline
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

function getGermlineDataFromDB($pdo){
	try {
		$patientID = $_GET['patient_id'] ?:'';
		$caseId = $_GET['case_id'] ?: '';
        $sqlStatment = "select og_tsg_gene_type_nm as TSG_OG, chrom_nm as chrom, position_num as pos, genomic_description_tx as 'Genomic coordinates', gene_nm as Gene, transcript_nm as Transcript,
        cdot_nm as Cdot, pdot_1letter_nm as Pdot, effect_nm as Effect, exon_affected_nm as Exon
        from v_germline_ui
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
$date = new DateTime();
$curTs = $date->getTimestamp();
// echo $curTs;
//databse instance
$pdo = Db::getInstance();
getGermlineDataFromDB($pdo);
// echo $date->getTimestamp() - $curTs;
?>