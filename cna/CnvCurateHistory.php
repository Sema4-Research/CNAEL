<?php
require_once('connection.php');

function getHistoryTbl()
{
    $pdo = Db::getInstance();
    $patientId = $_GET['patient_id'] ?:'';
    $caseId = $_GET['case_id'] ?: '';

    try {
        $sql = "select distinct transaction_until_tm
                    from `vonc_wes_v13`.`var_gatk_multi_cnv_data` `gmcnv`
                    where `gmcnv`.`patient_id` ='$patientId' and `gmcnv`.`case_id` = '$caseId' 
                    and mut_type_nm='GMCNV' and source_row_num > 0 and is_selected_in = 1
                    order by transaction_until_tm asc;";
        $stmt = $pdo->prepare($sql);                                            
        $stmt->execute();
        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
		echo json_encode($result); 		
	}
	 catch(Exception $e) {
        //An exception has occured, which means that one of our database queries failed.
       print_r($e);
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    getHistoryTbl();
}

?>
