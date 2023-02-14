<?php
require_once('connection.php');

function getConfig()
{
    $pdo = Db::getInstance();
    $patientId = $_GET['patient_id'] ?:'';
    $caseId = $_GET['case_id'] ?: '';
    try {
        $sql = "select purity_ct as purity, ploidy_ct as ploidy, model_chr_number as modalchr,
                    cnv_adjustment_am as cnvAdjustment, loss_threshold_num as lossThreshold,
                    gain_threshold_num as gainThreshold,
                    amplification_threshold_num as amplificationThreshold
                    from explorer_cnv_correction
                    where patient_id = '$patientId' and case_id = '$caseId' and transactoin_start_tm <= now() and transaction_until_tm > now()";
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

function getConfigHistory($history)
{
    $pdo = Db::getInstance();
    $patientId = isset($_GET['patient_id']) ? $_GET['patient_id'] : '';
    $caseId = isset($_GET['case_id']) ? $_GET['case_id'] : '';    
    $sql = "select purity_ct as purity, ploidy_ct as ploidy, model_chr_number as modalchr,
    cnv_adjustment_am as cnvAdjustment, loss_threshold_num as lossThreshold,
    gain_threshold_num as gainThreshold,
    amplification_threshold_num as amplificationThreshold
    from explorer_cnv_correction 
    where patient_id = '$patientId' and case_id = '$caseId'
        and `transactoin_start_tm` < '$history' and `transaction_until_tm` >= '$history'
    order by transaction_until_tm desc limit 1;";
    try {
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
    $history = isset($_GET['history']) ? $_GET['history'] : '';
    if ($history == '' || $history == 'null') {
        getConfig();
    } else {
        getConfigHistory($history);
    }
}

?>
