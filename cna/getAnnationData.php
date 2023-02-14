<?php
require_once('connection.php');

function unzip($zipData) {
    // save content into temp file
    $tempFile = tempnam(sys_get_temp_dir(), 'feed');
    file_put_contents($tempFile, $zipData);        
    // unzip content of first file from archive
    $zip = new ZipArchive();
    $data = NULL;
    if ($zip->open($tempFile) == TRUE) {
        for ($i = 0; $i < $zip->numFiles; $i++) {            
            if(strpos($zip->getNameIndex($i), 'gatk4.cnvSomatic.tsv') != false) {
                $data = $zip->getFromIndex($i);
                break;
            }
        }
    }
    // cleanup temp file
    $zip->close();
    unlink($tempFile);
    return $data;
}

/**
 * http://ec2-3-219-5-245.compute-1.amazonaws.com:3000/downloadS3?s3Bucket=s3://s4-vonc-pipeline-prod/executions/2eb34d9a-76fb-494c-9983-348aa7559bfc
 * http://3.219.5.245:3000/downloadS3?s3Bucket=s3://s4-vonc-pipeline-prod/executions/2eb34d9a-76fb-494c-9983-348aa7559bfc
 */
function convertS3UrlToIpUrl($s3Url) {
    $firstSlash = strpos($s3Url, '/');
    $beginPos = strpos($s3Url, '-', $firstSlash);
    $endPos = strpos($s3Url, '.', $beginPos);
    $portPos = strpos($s3Url, ':', $endPos);
    $ip = substr($s3Url, $beginPos + 1, $endPos - $beginPos - 1);
    $ip = str_replace('-', '.', $ip);
    $publicUrl = str_replace(substr($s3Url, $firstSlash + 2, $portPos - $firstSlash - 2), $ip, $s3Url);
    return $publicUrl;
}

function getDataFromS3($pdo){	
    try {
		$patientId = isset($_GET['patient_id']) ? $_GET['patient_id'] :'LP1999';
		$caseId = isset($_GET['case_id']) ? $_GET['case_id'] : '411526';
		$sqlStatment = "select aws_s3_bucket_path_nm 
            from patient_case_aws_variant_processing_log 
            where patient_id='$patientId' and case_id='$caseId' and mut_type_nm='GCNV';";
        $stmt = $pdo->prepare($sqlStatment);
        $stmt->execute();
        $result = $stmt->fetchAll();
		if (empty($result)) {
			return array();
        }
        return array();
        echo $sqlStatment;
		$host = $result[0]['aws_s3_bucket_path_nm'];
        if (!str_contains($host, 'https://')) {
            $host = urldecode($host);
        }
        $host = convertS3UrlToIpUrl($host);
         echo($host);
         return array();
        // $host = "http://3.219.5.245:3000/downloadS3?s3Bucket=s3://s4-vonc-pipeline-prod/executions/2eb34d9a-76fb-494c-9983-348aa7559bfc";
        $ch = curl_init();
		curl_setopt($ch, CURLOPT_URL, $host);
		curl_setopt($ch, CURLOPT_VERBOSE, 1);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
		curl_setopt($ch, CURLOPT_AUTOREFERER, false);
		curl_setopt($ch, CURLOPT_REFERER, "http://www.xcontest.org");
		curl_setopt($ch, CURLOPT_HTTP_VERSION, CURL_HTTP_VERSION_1_1);
		curl_setopt($ch, CURLOPT_HEADER, 0);
        // curl_setopt($ch, CURLOPT_ENCODING, '');
        // $t1 = microtime(true);
		$responseString = curl_exec($ch); // ~1.9s
        // echo json_encode(microtime(true) - $t1);                
        $fileData = unzip($responseString);
        $responseArray = explode("\n", $fileData);
		curl_close($ch);
		return $responseArray;
	}
	 catch(Exception $e) {
        //An exception has occured, which means that one of our database queries failed.
       print_r($e);
    }    	
}


function constructAnnationData($responseArr) {
    $result = array();
    $header = array();
    $annationArray = array();
    $colsCnt = 21;
    for ( $i = 0;$i < count($responseArr); $i++){
		$element = $responseArr[$i];
		$elementArr = explode("\t", $element);
		if (count($elementArr) != $colsCnt) {
			continue;
		}
        if ($elementArr[0] == 'geneId' || $elementArr[1] == 'geneL' ) {
            $header = $elementArr;
            continue;
        }
        array_push($annationArray, $elementArr);
    }

    foreach ($annationArray as $item) {
        $row = array();
        for ($i = 0; $i < $colsCnt; $i++ ) {
            $row[$header[$i]] = $item[$i];
        }
        array_push($result, $row);        
    }
    
    return $result;
}

function getAnnationData($pdo)
{
    $responseArray = getDataFromS3($pdo);
    $result = constructAnnationData($responseArray);
    echo json_encode($result);    
}

//databse instance
$pdo = Db::getInstance();
getAnnationData($pdo);
?>
