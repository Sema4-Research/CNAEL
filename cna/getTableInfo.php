<?php
require_once('connection.php');
/*
var_gatk_multi_cnv_data ; var_loading_fusion;var_loading_germline;var_loading_somatic;var_loading_rna


ISM556060-2_CR
ISM556060-2_BAF	11	4944853	4944953	100	0.5117
ISM556588-2_BAF	11	4944853	4944953	100	0.5123
*/
function describeTable($pdo, $table)
{
    try {
        $stmt = $pdo->prepare("describe $table;");
        $stmt->execute();
        $result = $stmt->fetchAll(PDO::FETCH_COLUMN);
		echo json_encode($result); 		
	}
	 catch(Exception $e) {
        //An exception has occured, which means that one of our database queries failed.
       print_r($e);
    }	    
}


function countTable($pdo, $table)
{
    echo "\n";
    try {
        $stmt = $pdo->prepare("select count(*) from $table;");
        $stmt->execute();
        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
		echo json_encode($result); 		
	}
	 catch(Exception $e) {
        //An exception has occured, which means that one of our database queries failed.
       print_r($e);
    }	    
}

function getRandomData($pdo, $table)
{
    echo "\n";
    try {
        $stmt = $pdo->prepare("select * from $table limit 5;");
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
$table = $_GET['table'];
describeTable($pdo, $table);
countTable($pdo, $table);
getRandomData($pdo, $table);

?>
