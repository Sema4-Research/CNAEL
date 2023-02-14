<?php
require_once('connection.php');

function getGenePos($pdo){
	try {
		$gene = $_GET['gene'] ?:'';
        $sqlStatment = "select transcript, chrom, tx_start, tx_end, gene
                    from vonc_common_data.transcript_alignment_table_20191206
                    where gene='$gene';";
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
getGenePos($pdo);

?>