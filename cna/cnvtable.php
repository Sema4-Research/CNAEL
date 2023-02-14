<?php
require_once('connection.php');
/*
var_gatk_multi_cnv_data ; var_loading_fusion;var_loading_germline;var_loading_somatic;var_loading_rna


ISM556060-2_CR
ISM556060-2_BAF	11	4944853	4944953	100	0.5117
ISM556588-2_BAF	11	4944853	4944953	100	0.5123
*/
function assignLocation($value,&$row){
	
	[$chrom,$start,$end]= explode("_", $value);
	$row["chrom"] = $chrom;
	$row["start"] = $start;
	$row["end"] = $end;
	
}
function constructProbeJson($responseArr){
	$copyNumberArr = array();
	$normalBAFArr  = array();
	$tumorBAFArr   = array();
	$result = array();
	for ( $i = 0;$i < count($responseArr);$i++){
		$element = $responseArr[$i];
		$elementArr = explode("\t", $element);
		if (count($elementArr) != 6) continue;
		$key = $elementArr[1] . "_" . $elementArr[2]. "_" . $elementArr[3];
		
		if ($elementArr[0] === "ISM556060-2_CR"){//($_GET['normal']."_CR")){
			$copyNumberArr[$key] = $elementArr[5];
		}
		else if ($elementArr[0] === "ISM556060-2_BAF"){// ($_GET['normal']."_CR")){
			$normalBAFArr[$key] = $elementArr[5]; 
		}
		else if ($elementArr[0] === "ISM556588-2_BAF"){ //($_GET['normal']."_CR")){
			$tumorBAFArr[$key] = $elementArr[5]; 
		}
	}
	//
	$copyNumber = array();
	foreach ($copyNumberArr as $key => $value) {
		$row = array();
		assignLocation($key,$row);
		$row["tumorNumCopies"] = 2*pow(2, $value);
		array_push($copyNumber, $row);
    }
	//
	$BAF = array();
	
	foreach ($tumorBAFArr as $key => $value) {
		$row = array();
		assignLocation($key,$row);
		$row["tumorBAF"] = 2*pow(2, $value);
		//normal.BAF	tumor.BAF
		$normalBAFVal = $normalBAFArr[$key];
		$row["normalBAF"] = 2*pow(2, $normalBAFVal);
		if($normalBAFVal  == 0) $normalBAFVal = 1;
		$ratioValue = (float)$value/(float)$normalBAFVal;//((int)$normalBAFVal === 0) ?0:((float)$value/(float)$normalBAFVal);
		$row["ratioValue"] = $ratioValue;
		array_push($BAF, $row);       
    }
	$result["copyNum"] = $copyNumber;
	$result["BAF"] = $BAF;
	return $result;
}
function getDataFromS3($pdo,$source){
	$status = array();
    try {
            
		//411526  LP1999
        //$sqlStatment = "select aws_s3_bucket_path_nm from patient_case_aws_variant_processing_log where patient_id='P1226047' and case_id='411526' and variant_processing_job_id='probeData'; ";segData
		$sqlStatment = "select aws_s3_bucket_path_nm from patient_case_aws_variant_processing_log where variant_processing_job_id='$source';"; 
		$sqlStatment = "select aws_s3_bucket_path_nm from patient_case_aws_variant_processing_log where patient_id='LP1999' and case_id='411526' and variant_processing_job_id='$source';"; 
        $stmt = $pdo->prepare($sqlStatment);
        $stmt->execute();
        $result = $stmt->fetchAll();
		//print_r($result[0]['aws_s3_bucket_path_nm']);
        //echo json_encode($result);
        //return;
		$host = $result[0]['aws_s3_bucket_path_nm'];
        $ch = curl_init();
		curl_setopt($ch, CURLOPT_URL, $host);
		curl_setopt($ch, CURLOPT_VERBOSE, 1);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
		curl_setopt($ch, CURLOPT_AUTOREFERER, false);
		curl_setopt($ch, CURLOPT_REFERER, "http://www.xcontest.org");
		curl_setopt($ch, CURLOPT_HTTP_VERSION, CURL_HTTP_VERSION_1_1);
        curl_setopt($ch, CURLOPT_HEADER, 0);
		$responseString = curl_exec($ch);
        $responseArray = explode("\n", $responseString);
        curl_close($ch);
        echo json_encode($responseArray);
        return;
		return $responseArray;
	}
	 catch(Exception $e) {
        //An exception has occured, which means that one of our database queries failed.
       print_r($e);
    }
    
	
}

/**
 * get gene curation from database
 * @param $pdo database instance
 */
function getVisprobeseg($pdo,$source){
	$responseArray = getDataFromS3($pdo,$source);
    $result = constructProbeJson($responseArray);
	echo json_encode($result);
}
function getCNVSeg($pdo,$source){
	$responseArr = getDataFromS3($pdo,$source);
	$result = constructSegJson($responseArr);
	echo json_encode($result); 
}
function constructSegJson($responseArray){
	$result = array();
	$header = array_shift($responseArray);
	
    $headerArr = explode("\t",$header);	
	
	for($i = 0; $i < count($responseArray); $i++){
		$row = $responseArray[$i];
		$rowArr = explode("\t",$row);
		if (count($rowArr) != count($headerArr)) continue;
		$rowObj = array_combine($headerArr, $rowArr);
		array_push($result,$rowObj);
	}
	return $result;
}
function getDatasetByDB($pdo,$source){
    try {
        $sqlStatment = "show full coloumns from patient_case_aws_variant_processing_log;";
        $stmt = $pdo->prepare($sqlStatment);
        $stmt->execute();
        $result = $stmt->fetchAll();
		return json_encode($result);

		//411526  LP1999
        //$sqlStatment = "select aws_s3_bucket_path_nm from patient_case_aws_variant_processing_log where patient_id='P1226047' and case_id='411526' and variant_processing_job_id='probeData'; ";segData
		$sqlStatment = "select * from $source where patient_id='LP1999' and case_id='411526';"; //pass by get method_exists
        $stmt = $pdo->prepare($sqlStatment);
        $stmt->execute();
        $result = $stmt->fetchAll();
		echo json_encode($result); 
		
	}
	 catch(Exception $e) {
        //An exception has occured, which means that one of our database queries failed.
       print_r($e);
    }
    
	
	
	
}

//databse instance
$pdo = Db::getInstance();
//$patientID = isset($_GET
getVisprobeseg($pdo,"probeData");
//isset($_GET
//getCNVSeg($pdo,"segData");
//getDatasetByDB($pdo,"var_loading_fusion");


?>
