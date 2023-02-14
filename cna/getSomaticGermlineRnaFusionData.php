<?php
require_once('connection.php');

function createTemporaryTable($pdo)
{
    $sqlStatment = "CREATE TEMPORARY TABLE tmp_transcript_alignment_tbl(index(gene)) as select gene, chrom, tx_start, tx_end FROM vonc_common_data.transcript_alignment_table_20191206 GROUP BY gene;";
    try {
        $stmt = $pdo->prepare($sqlStatment);
        $stmt->execute();
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
        // use join
        $sqlStatment = "
        select TSG_OG, pathogenicity_nm, somatic.reported, somatic.chrom, pos, `Genomic coordinates`, somatic.Gene, Transcript,
            Cdot, Pdot, Effect, Exon, CAV, CAV_link, AF, ts.tx_start as segL, ts.tx_end as segR
        from (
            select tumor_allele_freq_pct as AF, og_tsg_gene_type_nm as TSG_OG, chrom_nm as chrom, 
            position_num as pos, genomic_description_tx as `Genomic coordinates`, gene_nm as Gene,
            transcript_nm as Transcript, cdot_nm as Cdot, pdot_1letter_nm as Pdot, 
            effect_nm as Effect, exon_affected_nm as Exon, vista_approved_pathogenicity_nm as pathogenicity_nm, 
            cav_matching_desc_tx as CAV, cav_narrative_url_tx as CAV_link,
            is_report_candidate_in as reported
            from v_somatic_ui 
            where patient_id='$patientID' and case_id='$caseId' and is_selected_in=1
        ) somatic
        join tmp_transcript_alignment_tbl ts
            on somatic.Gene = ts.gene;";

        $stmt = $pdo->prepare($sqlStatment);
        $stmt->execute();
        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
		return $result; 		
	}
	 catch(Exception $e) {
        //  echo json_encode($e->getMessage());
        //An exception has occured, which means that one of our database queries failed.
       return [];
    }	
}

function getGermlineDataFromDB($pdo){
	try {
		$patientID = $_GET['patient_id'] ?:'';
		$caseId = $_GET['case_id'] ?: '';

        $sqlStatment = "
        select TSG_OG, pathogenicity_nm, germline.reported, germline.chrom, pos, `Genomic coordinates`, germline.Gene, Transcript,
            Cdot, Pdot, Effect, Exon, `VISta classification`, `Curation status`, AF, ts.tx_start as segL, ts.tx_end as segR
        from (
            select tumor_allele_freq_pct as AF, og_tsg_gene_type_nm as TSG_OG, chrom_nm as chrom,
            position_num as pos, genomic_description_tx as `Genomic coordinates`, gene_nm as Gene,
            transcript_nm as Transcript, cdot_nm as Cdot, pdot_1letter_nm as Pdot, 
            effect_nm as Effect, exon_affected_nm as Exon, vista_approved_pathogenicity_nm as pathogenicity_nm,
            vista_approved_pathogenicity_nm as `VISta classification`, vista_curation_status_tx as `Curation status`,
            is_report_candidate_in as reported
            from v_germline_ui
            where patient_id='$patientID' and case_id='$caseId' and is_selected_in=1) germline
        join tmp_transcript_alignment_tbl ts
            on germline.Gene = ts.gene;";

        $stmt = $pdo->prepare($sqlStatment);
        $stmt->execute();
        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
		return $result;  		
	}
	 catch(Exception $e) {
        //An exception has occured, which means that one of our database queries failed.
       return [];
    }	
}


function getRnaDataFromDB($pdo){
	try {
		$patientID = $_GET['patient_id'] ?:'';
		$caseId = $_GET['case_id'] ?: '';
        $sqlStatment = "
        select ts.chrom as chrom, TPM, FoldChange, rna.Gene, NumReads, RankWithinSample, ZScore, AM,
            ts.tx_start as segL, ts.tx_end as segR,  Filter
        from (
            select ngs_pipeline_qc_filter_nm as Filter, fold_change_am as FoldChange, gene_nm as Gene,
            reads_ct as NumReads, rank_in_samples_num as RankWithinSample, percentile_in_ref_samples_am as AM, z_score_am as ZScore,
            est_abundance_transcripts_per_million_am as TPM
            from v_rna_ui
            where patient_id='$patientID' and case_id='$caseId' and is_selected_in=1) rna
        join tmp_transcript_alignment_tbl ts
            on rna.gene = ts.gene;";
        $stmt = $pdo->prepare($sqlStatment);
        $stmt->execute();
        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
		return $result; 	
	}
	 catch(Exception $e) {
        //An exception has occured, which means that one of our database queries failed.
       return [];
    }	
}

// select source_row_num as line_number, chromsome_3p_nm as chrom_3p, chromsome_5p_nm as chrom_5p, affected_exon_3p_nm as exon_3p,
// affected_exon_5p_nm as exon_5p, gene_3p_nm as gene_3p, gene_5p_nm as gene_5p,
// is_3p_preferred_transcript_in as is_preferred_transcript_3p,
// is_5p_preferred_transcript_in as is_preferred_transcript_5p,
// is_fusion_driver_gene_3p_in,
// position_3p_num as pos_3p, position_5p_num as pos_5p,
// transcript_3p_nm as transcript_3p, transcript_5p_nm as transcript_5p,
// ts_3p.chrom as 3p_chrom, ts_3p.tx_start as seg3pL, ts_3p.tx_end as seg3pR, ts_3p.exon_starts as 3p_exon_starts, ts_3p.exon_ends as 3p_exon_ends,
// ts_5p.chrom as 5p_chrom, ts_5p.tx_start as segL, ts_5p.tx_end as segR, ts_5p.exon_starts as 5p_exon_starts, ts_5p.exon_ends as 5p_exon_ends
// from v_fusion_ui fusion
// left join vonc_common_data.transcript_alignment_table_20191206 ts_3p
// on fusion.transcript_3p_nm = ts_3p.transcript 
// left join vonc_common_data.transcript_alignment_table_20191206 ts_5p
// on fusion.transcript_5p_nm = ts_5p.transcript
// where patient_id='LP158842' and case_id='411408' and is_selected_in=1 and (is_3p_preferred_transcript_in='1' or  is_5p_preferred_transcript_in =1) and (is_fusion_driver_gene_5p_in=1 or is_fusion_driver_gene_3p_in=1);


function getFusionDataFromDB($pdo){
	try {
		$patientID = $_GET['patient_id'] ?:'';
		$caseId = $_GET['case_id'] ?: '';
        $sqlStatment = "select source_row_num as line_number, chromsome_3p_nm as chrom_3p, chromsome_5p_nm as chrom_5p, affected_exon_3p_nm as exon_3p,
                        affected_exon_5p_nm as exon_5p, gene_3p_nm as gene_3p, gene_5p_nm as gene_5p,
                        is_3p_preferred_transcript_in as is_preferred_transcript_3p,
                        is_5p_preferred_transcript_in as is_preferred_transcript_5p,
                        is_fusion_driver_gene_3p_in,
                        position_3p_num as pos_3p, position_5p_num as pos_5p,
                        transcript_3p_nm as transcript_3p, transcript_5p_nm as transcript_5p,
                        ts_3p.chrom as 3p_chrom, ts_3p.tx_start as seg3pL, ts_3p.tx_end as seg3pR, ts_3p.exon_starts as 3p_exon_starts, ts_3p.exon_ends as 3p_exon_ends,
                        ts_5p.chrom as 5p_chrom, ts_5p.tx_start as segL, ts_5p.tx_end as segR, ts_5p.exon_starts as 5p_exon_starts, ts_5p.exon_ends as 5p_exon_ends
                        from v_fusion_ui fusion
                        left join vonc_common_data.transcript_alignment_table_20191206 ts_3p
                        on fusion.transcript_3p_nm = ts_3p.transcript 
                        left join vonc_common_data.transcript_alignment_table_20191206 ts_5p
                        on fusion.transcript_5p_nm = ts_5p.transcript
                        where patient_id='$patientID' and case_id='$caseId' and is_selected_in=1 and (is_3p_preferred_transcript_in='1' or  is_5p_preferred_transcript_in =1) and (is_fusion_driver_gene_5p_in=1 or is_fusion_driver_gene_3p_in=1);";                                        
        $stmt = $pdo->prepare($sqlStatment);
        $stmt->execute();
        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
		return $result; 		
	}
	 catch(Exception $e) {
        //An exception has occured, which means that one of our database queries failed.
        return []; 
    }	
}

// ob_start("ob_gzhandler");
// $t1 = microtime(true);
$pdo = Db::getInstance();
createTemporaryTable($pdo);

// $t2 = microtime(true);
// echo ($t2 - $t1);
// echo "<br>";

$responseResult = Array();
$responseResult['somatic'] = getSomaticDataFromDB($pdo);
// $t3 = microtime(true);
// echo $t3 - $t2;
// echo '<br>';

$responseResult['germline'] = getGermlineDataFromDB($pdo);
// $t4 = microtime(true);
// echo $t4 - $t3;
// echo '<br>';

$responseResult['rna'] = getRnaDataFromDB($pdo);
// $t5 = microtime(true);
// echo $t5 - $t4;
// echo '<br>';

$responseResult['fusion'] = getFusionDataFromDB($pdo);
// $t6 = microtime(true);
// echo $t6 - $t5;
// echo '<br>';

ob_start("ob_gzhandler");
echo json_encode($responseResult);

// echo '<br>';
// $t7 = microtime(true);
// echo $t7 - $t6;
// echo '<br>';

?>