<?php
require_once('connection.php');
ini_set('serialize_precision', -1);

define('gDecimals', 5);

function assignLocation($value,&$row){
	[$chrom, $start, $end] = explode("_", $value);
	$row["chrom"] = $chrom;
	$row["start"] = (int)$start;
	// $row["end"] = (int)$end;
	$row['d'] = (int)$end - (int)$start;
}

function baf2mbaf($value)
{
	return abs($value - 0.5) + 0.5;
}

/*
data format:

ISM556060-2_CR	1	861072	861643	571	0.079384
ISM556060-2_BAF	11	4944853	4944953	100	0.5117
ISM556588-2_BAF	11	4944853	4944953	100	0.5123
or
ISM603458-2_CR	14	94722547	94723191	644	-0.107215
Artificial_Normal_BAF	1	1361636	1361736	100	0.4958
ISM603458-2_BAF	1	1390812	1390912	100	0.0
*/
function constructProbeJson($responseArr, $sampleLotIds, &$copyNumber, &$BAF){

	$tumorCrIsm = (isset($sampleLotIds['TUMOR-DNA']) ? $sampleLotIds['TUMOR-DNA'] : 'undefinded') .'_CR';
	$tumorBafIsm = (isset($sampleLotIds['TUMOR-DNA']) ? $sampleLotIds['TUMOR-DNA'] : 'undefinded') .'_BAF';
	$normalBafIsm = (isset($sampleLotIds['NORMAL-DNA']) ? $sampleLotIds['NORMAL-DNA'] : 'Artificial_Normal') .'_BAF';
	
	$copyNumberArr = array();
	$normalBAFArr  = array();
	$tumorBAFArr   = array();
	for ( $i = 0;$i < count($responseArr);$i++){
		$element = $responseArr[$i];
		$elementArr = explode("\t", $element);
		if (count($elementArr) != 6) {
			continue;
		}
		$key = $elementArr[1] . "_" . $elementArr[2]. "_" . $elementArr[3];
		//"ISM556060-2_CR    1    877904    878535    631    0.244556",
		// 1_877904_878535 = 0.244556
		switch ($elementArr[0]) {
			case $tumorCrIsm:
				$copyNumberArr[$key] = $elementArr[5];
				break;
			case $normalBafIsm:
				$normalBAFArr[$key] = $elementArr[5]; 
				break;
			case $tumorBafIsm:
				$tumorBAFArr[$key] = $elementArr[5]; 
				break;
			default:
				echo 'invalid ism '.$element[0];
				exit();
				break;
		}
	}

	foreach ($copyNumberArr as $key => $value) {
		$row = array();
		assignLocation($key,$row);
		$row["tumorNumCopies"] = 2*pow(2, $value);
		array_push($copyNumber, $row);
    }
	foreach ($tumorBAFArr as $key => $value) {		
		$row = array();		
		assignLocation($key,$row);
		// ["tumor.mBAF", pos, wholepos, 'normal.BAF']				
		$normalBafVal = $normalBAFArr[$key] == 0 ? 1 : $normalBAFArr[$key];
		$row["tumor.BAF"] = $value;
		$row["normal.BAF"] = $normalBafVal;
		// $row["tumor.mBAF"] = baf2mbaf($value);
		// $row["normal.mBAF"] = baf2mbaf($normalBafVal);
		// $row["alleleRatio"] = round((float)$row["tumor.mBAF"] / (float)$row["normal.mBAF"], 5);
		array_push($BAF, $row);       
    }
}

// can use delta compress
function constructProbeJsonV2($responseArr, $sampleLotIds, &$responseResult)
{
	$tumorCrIsm = (isset($sampleLotIds['TUMOR-DNA']) ? $sampleLotIds['TUMOR-DNA'] : 'undefinded') .'_CR';
	$tumorBafIsm = (isset($sampleLotIds['TUMOR-DNA']) ? $sampleLotIds['TUMOR-DNA'] : 'undefinded') .'_BAF';
	$normalBafIsm = (isset($sampleLotIds['NORMAL-DNA']) ? $sampleLotIds['NORMAL-DNA'] : 'Artificial_Normal') .'_BAF';

	$copyNumberArr = array();	
	$normalBAFArr  = array();
	$tumorBAFArr   = array();

	$cnC = array();
	$cnS = array();
	$cnD = array();
	$cnV = array();
	
	$bafC = array();
	$bafS = array();
	$bafD = array();
	$bafT = array();
	$bafN = array();
		
	for ( $i = 0;$i < count($responseArr);$i++){
		$element = $responseArr[$i];
		$elementArr = explode("\t", $element);
		if (count($elementArr) != 6) {
			continue;
		}
		$key = $elementArr[1] . "_" . $elementArr[2]. "_" . $elementArr[3];
		//"ISM556060-2_CR    1    877904    878535    631    0.244556",
		// 1_877904_878535 = 0.244556
		switch ($elementArr[0]) {
			case $tumorCrIsm:
				$copyNumberArr[$key] = $elementArr[5];
				break;
			case $normalBafIsm:
				$normalBAFArr[$key] = $elementArr[5]; 
				break;
			case $tumorBafIsm:
				$tumorBAFArr[$key] = $elementArr[5]; 
				break;
			default:
				echo 'invalid ism '.$element[0];
				exit();
				break;
		}
	}

	foreach ($copyNumberArr as $key => $value) {
		$row = array();
		[$chrom, $start, $end]= explode("_", $key);
		if ($chrom != 'X' && $chrom != 'Y') {
			array_push($cnC, (int)$chrom);
		} else {
			array_push($cnC, $chrom == 'X' ? 23 : 24);
		}
		array_push($cnS, (int)$start);
		array_push($cnD, (int)$end - (int)$start);
		array_push($cnV, (float)$value);
    }
	foreach ($tumorBAFArr as $key => $value) {		
		[$chrom, $start, $end]= explode("_", $key);
		if ($chrom != 'X' && $chrom != 'Y') {
			array_push($bafC, (int)$chrom);
		} else {
			array_push($bafC, $chrom == 'X' ? 23 : 24);
		}
		array_push($bafS, (int)$start);
		array_push($bafD, (int)$end - (int)$start);
		array_push($bafT, (float)$value);
		array_push($bafN, (float)$normalBAFArr[$key]);      
    }

	$responseResult['cnC'] = $cnC; //~=0%
	$responseResult['cnS'] = $cnS;	//0.7M/1.7M=41%
	$responseResult['cnD'] = $cnD; // 0.3M/1.7M=17%
	$responseResult['cnV'] = $cnV;	//0.7M/1.7M=41%

	// 0.1M/1.7M = 5%
	$responseResult['bafC'] = $bafC;
	$responseResult['bafS'] = $bafS;
	$responseResult['bafD'] = $bafD;
	$responseResult['bafT'] = $bafT;
	$responseResult['bafN'] = $bafN;	
}

function constructProbeJsonLoc($responseArr, $sampleLotIds, &$responseResult)
{
	$tumorCrIsm = (isset($sampleLotIds['TUMOR-DNA']) ? $sampleLotIds['TUMOR-DNA'] : 'undefinded') .'_CR';
	$tumorBafIsm = (isset($sampleLotIds['TUMOR-DNA']) ? $sampleLotIds['TUMOR-DNA'] : 'undefinded') .'_BAF';
	$normalBafIsm = (isset($sampleLotIds['NORMAL-DNA']) ? $sampleLotIds['NORMAL-DNA'] : 'Artificial_Normal') .'_BAF';

	$copyNumberArr = array();	
	$normalBAFArr  = array();
	$tumorBAFArr   = array();

	$cnC = array();
	$cnS = array();
	$cnD = array();
	
	$bafC = array();
	$bafS = array();
	$bafD = array();
	$bafT = array();
	$bafN = array();

	for ( $i = 0;$i < count($responseArr);$i++){
		$element = $responseArr[$i];
		$elementArr = explode("\t", $element);
		if (count($elementArr) != 6) {
			continue;
		}    
		$key = $elementArr[1] . "_" . $elementArr[2]. "_" . $elementArr[3];
		//"ISM556060-2_CR    1    877904    878535    631    0.244556",
		// 1_877904_878535 = 0.244556
		switch ($elementArr[0]) {
			case $tumorCrIsm:
				$copyNumberArr[$key] = $elementArr[5];
				break;
			case $normalBafIsm:
				$normalBAFArr[$key] = $elementArr[5]; 
				break;
			case $tumorBafIsm:
				$tumorBAFArr[$key] = $elementArr[5]; 
				break;
			default:
				echo 'invalid ism '.$element[0];
				exit();
				break;
		}
	}
  $cnInterval = intval(ceil(count($copyNumberArr) / $GLOBALS['cnSampleCount']));  
  $i = 0;
	foreach ($copyNumberArr as $key => $value) {
    $i++;
    if ($i % $cnInterval != 0) {
      continue;
    }
		[$chrom, $start, $end]= explode("_", $key);
		if ($chrom != 'X' && $chrom != 'Y') {
			array_push($cnC, (int)$chrom);
		} else {
			array_push($cnC, $chrom == 'X' ? 23 : 24);
		}
		array_push($cnS, (int)$start);
		array_push($cnD, (int)$end - (int)$start);
  }
  $bafInterval = intval(ceil(count($tumorBAFArr) / $GLOBALS['bafSampleCount']));  
  $i = 0;
	foreach ($tumorBAFArr as $key => $value) {		
    $i++;
    if ($i % $bafInterval != 0) {
      continue;
    }    
		[$chrom, $start, $end]= explode("_", $key);
		if ($chrom != 'X' && $chrom != 'Y') {
			array_push($bafC, (int)$chrom);
		} else {
			array_push($bafC, $chrom == 'X' ? 23 : 24);
		}
		array_push($bafS, (int)$start);
		array_push($bafD, (int)$end - (int)$start);
		array_push($bafT, (float)$value);
		array_push($bafN, (float)$normalBAFArr[$key]);      
    }

	$responseResult['cnC'] = $cnC; //~=0%
	$responseResult['cnS'] = $cnS;	//0.7M/1.7M=41%
	$responseResult['cnD'] = $cnD; // 0.3M/1.7M=17%

	// 0.1M/1.7M = 5%
	$responseResult['bafC'] = $bafC;
	$responseResult['bafS'] = $bafS;
	$responseResult['bafD'] = $bafD;
	$responseResult['bafT'] = $bafT;
	$responseResult['bafN'] = $bafN;	
}


function constructProbeJsonVal($responseArr, $sampleLotIds, &$responseResult)
{
	$tumorCrIsm = (isset($sampleLotIds['TUMOR-DNA']) ? $sampleLotIds['TUMOR-DNA'] : 'undefinded') .'_CR';
	$copyNumberArr = array();		
	$cnV = array();
	for ( $i = 0;$i < count($responseArr);$i++){
		$element = $responseArr[$i];
		$elementArr = explode("\t", $element);
		if (count($elementArr) != 6) {
			continue;
		}
		$key = $elementArr[1] . "_" . $elementArr[2]. "_" . $elementArr[3];
		//"ISM556060-2_CR    1    877904    878535    631    0.244556",
		// 1_877904_878535 = 0.244556
		switch ($elementArr[0]) {
			case $tumorCrIsm:
				$copyNumberArr[$key] = $elementArr[5];
				break;
			default:
				break;
		}
	}
  $cnInterval = intval(ceil(count($copyNumberArr) / $GLOBALS['cnSampleCount']));  
  $i = 0;
	foreach ($copyNumberArr as $key => $value) {
    $i++;
    if ($i % $cnInterval != 0) {
      continue;
    }
		array_push($cnV, (float)$value);
    }
	$responseResult['cnV'] = $cnV;	//0.7M/1.7M=41%
}

// patient_case_aws_variant_processing_log_20210813_v13
// select aws_s3_bucket_path_nm from patient_case_aws_variant_processing_log where patient_id='LP158842' and case_id='411408' and variant_processing_job_id='probeData';
// https://s4-sampleio-20200109094600-test.s3.amazonaws.com:FTWISTWES_v1/FRSM676065:FISM581411-3/FTigris_tumor_normal/F4.0.0-b4/202107231554.565139/FISM581411-3.ISM581421-3.inTumor.cnv.probeData.seg%3FAWSAccessKeyId%3DAKIA5NAEDH6V3HDVOYMN%26Expires%3D1721914559%26Signature%3DSQFxXMHT4I9wNKyrlMWcZGTJ9Cc/53D
// https://s4-sampleio-20200109094600-test.s3.amazonaws.com/TWISTWES_v1/RSM676065/ISM581411-3/Tigris_tumor_normal/4.0.0-b4/202107231554.565139/ISM581411-3.ISM581421-3.inTumor.cnv.probeData.seg%3FAWSAccessKeyId%3DAKIA5NAEDH6V3HDVOYMN%26Expires%3D1721914559%26Signature%3DSQFxXMHT4I9wNKyrlMWcZGTJ9Cc%253D
function getDataFromS3($pdo,$source){	
    try {
		$patientId = isset($_GET['patient_id']) ? $_GET['patient_id'] :'LP1999';
		$caseId = isset($_GET['case_id']) ? $_GET['case_id'] : '411526';
		//411526  LP1999
        //select aws_s3_bucket_path_nm from patient_case_aws_variant_processing_log where patient_id='20127359' and case_id='cid_20210507_4' and variant_processing_job_id='probeData';
        // patient_case_aws_variant_processing_log_20220325_v15
		$sqlStatment = "select aws_s3_bucket_path_nm from patient_case_aws_variant_processing_log 
					where patient_id='$patientId' and case_id='$caseId' 
					and variant_processing_job_id='$source';";
        $stmt = $pdo->prepare($sqlStatment);
        $stmt->execute();
        $result = $stmt->fetchAll();
		if (empty($result)) {
			return array();
		}
		$host = $result[0]['aws_s3_bucket_path_nm'];        
        if (!str_contains($host, 'https://')) {
            $host = urldecode($host);
        }        
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
	// $t1 = microtime(true);
	$responseResult = array();
	$sampleLotIds = getTissueSampleLotKey($pdo);
	$responseArray = getDataFromS3($pdo,$source);
	$responseResult['sampleSlotId'] = $sampleLotIds;	
	constructProbeJsonV2($responseArray, $sampleLotIds, $responseResult);
	// echo json_encode(microtime(true) - $t1);
	ob_start("ob_gzhandler");
	echo json_encode($responseResult);
}


/**
 * get gene curation from database
 * @param $pdo database instance
 */
function getVisprobesegLoc($pdo,$source){
	// $t1 = microtime(true);
	$responseResult = array();
	$sampleLotIds = getTissueSampleLotKey($pdo);
	$responseArray = getDataFromS3($pdo,$source);
	$responseResult['sampleSlotId'] = $sampleLotIds;	
	constructProbeJsonLoc($responseArray, $sampleLotIds, $responseResult);
	// echo json_encode(microtime(true) - $t1);
	ob_start("ob_gzhandler");
	echo json_encode($responseResult);
}


function getVisprobesegCNV($pdo,$source){
	// $t1 = microtime(true);
	$responseResult = array();
	$sampleLotIds = getTissueSampleLotKey($pdo);
	$responseArray = getDataFromS3($pdo,$source);
	constructProbeJsonVal($responseArray, $sampleLotIds, $responseResult);
	// echo json_encode(microtime(true) - $t1);
	ob_start("ob_gzhandler");
	echo json_encode($responseResult);
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

function getTissueSampleLotKey($pdo)
{
	$patientId = isset($_GET['patient_id']) ? $_GET['patient_id'] :'LP1999';
	$caseId = isset($_GET['case_id']) ? $_GET['case_id'] : '411526';
	$sql = "select tissue_sample_lot_id,tissue_sample_type_nm from patient_case_sample where patient_id='$patientId' and case_id='$caseId';";
	$stmt = $pdo->prepare($sql);
	$stmt->execute();
	$records = $stmt->fetchAll(PDO::FETCH_ASSOC);
	$sampleLotIds = array();
	foreach ($records as $record) {
		$sampleLotIds[$record['tissue_sample_type_nm']] = $record['tissue_sample_lot_id'];
	}
	if (isset($sampleLotIds['TUMOR-DNA']) && !isset($sampleLotIds['NORMAL-DNA'])) {
		$sampleLotIds['NORMAL-DNA'] = 'Artificial_Normal';
	}
	return $sampleLotIds;
}

//databse instance
$pdo = Db::getInstance();
$jobType = isset($_GET['job_type']) ? $_GET['job_type'] : "";
if ($jobType === "probeData") {
	getVisprobeseg($pdo, $jobType);
} else if ($jobType === "segData") {
	getCNVSeg($pdo, $jobType);
} else if ($jobType === 'probeDataLoc') {
  $cnSampleCount = isset($_GET['cnSample']) ? $_GET['cnSample'] : 0x7FFFFFFF;
  $bafSampleCount = isset($_GET['bafSample']) ? $_GET['bafSample'] : 0x7FFFFFFF;
	getVisprobesegLoc($pdo, 'probeData');
} else if ($jobType === 'probeDataCN') {
  $cnSampleCount = isset($_GET['cnSample']) ? $_GET['cnSample'] : 0x7FFFFFFF;
  $bafSampleCount = isset($_GET['bafSample']) ? $_GET['bafSample'] : 0x7FFFFFFF;
	getVisprobesegCNV($pdo, 'probeData');
}

// select * from var_gatk_multi_cnv_data where patient_id='LP47790' and case_id='4427';

?>