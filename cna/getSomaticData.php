<?php
require_once('connection.php');
/*
var_gatk_multi_cnv_data ; var_loading_fusion;var_loading_germline;var_loading_somatic;var_loading_rna


ISM556060-2_CR
ISM556060-2_BAF	11	4944853	4944953	100	0.5117
ISM556588-2_BAF	11	4944853	4944953	100	0.5123
*/
function getSomaticDataFromDBV1($pdo){
	try {
		$patientID = $_GET['patient_id'] ?:'';
		$caseId = $_GET['case_id'] ?: '';
        $sqlStatment = "select patient_id, case_id, mut_type_nm as form, line_number, 
                    vkey, gene, HGNC_ID, TSG_OG, POC, effect, chrom, pos, ref, alt, transcript, 
                    exon_affected, cdot, pdot, AD_ref, AD_alt, DP, AF, filter, call_type, 
                    red_flags, qual, hotspot, CAV_match, CAV_URL, all_uniq_PMID, num_uniq_PMID, 
                    O_match, O_PMIDs, Ci_match, Ci_PMIDs, J_match, J_PMIDs, P_match, P_PMIDs, 
                    Ca_match, Ca_PMIDs, My_match, My_PMIDs, Md_match, Md_PMIDs, COSMIC_ID as COSMIC_link,
                    COSMIC_count, IMPACT_var, IMPACT_gene, FM_var, FM_gene, TCGA_var, TCGA_gene,
                     Broad_var, Broad_gene, recurrence_link, total_MAF as gnomAD_total_MAF, 
                     highest_subpop_MAF as gnomAD_highest_subpop_MAF, 
                     gnomAD_link, VISta_curation_status, VISta_conclusion, 
                     VISta_assigned_codes, VISta_LOF, VISta_link, MVL_conclusion, 
                     MVL_date, HGMD_conclusion, HGMD_ids, ClinVar_conclusion, ClinVar_variation_id,
                     VarSleuth_num_unique_PMIDs, VarSleuth_link, AON, HC_gene, REVEL_score, 
                     REVEL_rankscore, somatic_score, pos_stop, spliceAI_suggests_altered_splicing, 
                     is_selected_in
                    from var_loading_somatic
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

function getSomaticDataFromDB_noleftjoin($pdo){
	try {
		$patientID = $_GET['patient_id'] ?:'';
		$caseId = $_GET['case_id'] ?: '';
        // $sqlStatment = "select gene_nm as Gene, og_tsg_gene_type_nm as TSG_OG, poc_gene_nm as POC, effect_nm as effect, chrom_nm as chrom, position_num as pos,
        // reference_allele_nm as ref, alternative_allele_nm as alt, cdot_nm as cdot, pdot_1letter_nm as pdot, ngs_pipeline_filter_nm as filter
        //             from v_somatic_ui
        //             where patient_id='$patientID' and case_id='$caseId' and is_selected_in=1;"; 
        // select og_tsg_gene_type_nm as TSG_OG, chrom_nm as chrom, genomic_description_tx as 'Genomic coordinates', gene_nm as Gene, transcript_nm as Transcript,
        // cdot_nm as Cdot, pdot_1letter_nm as Pdot, effect_nm as Effect, exon_affected_nm as Exon
        // from v_somatic_ui
        // where patient_id='LP1999' and case_id='411526' and is_selected_in=1;

        $sqlStatment = "select og_tsg_gene_type_nm as TSG_OG, chrom_nm as chrom, position_num as pos, genomic_description_tx as 'Genomic coordinates', gene_nm as Gene, transcript_nm as Transcript,
                    cdot_nm as Cdot, pdot_1letter_nm as Pdot, effect_nm as Effect, exon_affected_nm as Exon
                    from v_somatic_ui
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


function getSomaticDataFromDB($pdo){
	try {
		$patientID = $_GET['patient_id'] ?:'';
		$caseId = $_GET['case_id'] ?: '';
        // $sqlStatment = "select gene_nm as Gene, og_tsg_gene_type_nm as TSG_OG, poc_gene_nm as POC, effect_nm as effect, chrom_nm as chrom, position_num as pos,
        // reference_allele_nm as ref, alternative_allele_nm as alt, cdot_nm as cdot, pdot_1letter_nm as pdot, ngs_pipeline_filter_nm as filter
        //             from v_somatic_ui
        //             where patient_id='$patientID' and case_id='$caseId' and is_selected_in=1;"; 
        // select og_tsg_gene_type_nm as TSG_OG, chrom_nm as chrom, genomic_description_tx as 'Genomic coordinates', gene_nm as Gene, transcript_nm as Transcript,
        // cdot_nm as Cdot, pdot_1letter_nm as Pdot, effect_nm as Effect, exon_affected_nm as Exon
        // from v_somatic_ui
        // where patient_id='LP1999' and case_id='411526' and is_selected_in=1;

        $sqlStatment = "select og_tsg_gene_type_nm as TSG_OG, chrom_nm as chrom, position_num as pos, genomic_description_tx as 'Genomic coordinates', gene_nm as Gene, transcript_nm as Transcript,
                    cdot_nm as Cdot, pdot_1letter_nm as Pdot, effect_nm as Effect, exon_affected_nm as Exon,
                    ts.tx_start as segL, ts.tx_end as segR
                    from v_somatic_ui somatic
                    left join vonc_common_data.transcript_alignment_table_20191206 ts
                    on somatic.transcript_nm = ts.transcript                    
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



// $t1 = microtime(true);
// echo($t1);
// echo "<br>";
//databse instance
$pdo = Db::getInstance();
getSomaticDataFromDB($pdo);
// echo "<br>";
// echo (microtime(true) - $t1);

?>