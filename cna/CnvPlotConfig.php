<?php
require_once('connection.php');

function getConfig()
{
    $pdo = Db::getInstance();
    $user = $_GET["user"];
    $id = 4;    
    try {
        $sql = "select plot_nm as name, plot_order_seq as porder, height_ct as height,
            show_visibility_option as visible, interval_num as grids, coordinate_num as ticks,
            show_gap_option as seg_gap, show_chrom_split_option as chrom_split 
            from explore_cnv_plot_config where actor_user = $id and transcation_start_tm <= now() and transaction_until_tm > now()";
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

function saveConfig()
{
    $pdo = Db::getInstance();
    $user = $_GET["user"];
    $cnvCfgs = $_POST["data"];
    $rsp = [];
    if (count($cnvCfgs) == 0) {
        $rsp["status"] = "success";
        echo json_encode($rsp);
        return;
    }
    $id = 4;   
    // echo json_encode($cnvCfgs);
    // [{"name":"tumorcn_container","porder":"2","height":"140","visible":"true","seg_gap":"true","chrom_split":"true","ticks":"5","grids":"10"},{"name":"alleleratio_container","porder":"3","height":"140","visible":"true","seg_gap":"true","chrom_split":"true","ticks":"5","grids":"5"},{"name":"tumbaf_container","porder":"4","height":"140","visible":"true","seg_gap":"true","chrom_split":"true","ticks":"5","grids":"5"},{"name":"norbaf_container","porder":"5","height":"140","visible":"true","seg_gap":"true","chrom_split":"true","ticks":"5","grids":"5"},{"name":"refseq_container","porder":"6","height":"1","visible":"true","seg_gap":"false","chrom_split":"false","ticks":"0","grids":"0"},{"name":"gistic_container","porder":"7","height":"70","visible":"true","seg_gap":"false","chrom_split":"true","ticks":"0","grids":"0"},{"name":"somatic_container","porder":"8","height":"40","visible":"true","seg_gap":"false","chrom_split":"false","ticks":"3","grids":"2"},{"name":"germline_container","porder":"9","height":"40","visible":"true","seg_gap":"false","chrom_split":"false","ticks":"3","grids":"2"},{"name":"fusion_container","porder":"10","height":"60","visible":"true","seg_gap":"false","chrom_split":"false","ticks":"0","grids":"0"},{"name":"rna_container","porder":"11","height":"40","visible":"true","seg_gap":"false","chrom_split":"false","ticks":"3","grids":"2"}]
    try {
        $pdo->beginTransaction();
        $current_timestamp = '';
        $getCurrentTimeSql =  "select now() as 'current_timestamp' from dual;";
        $stmt = $pdo->prepare($getCurrentTimeSql);
        $stmt->execute();
        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
        if (count($result) > 0) {
            $current_timestamp = $result[0]['current_timestamp'];    
        } else {
            throw new Exception("Get time error");
        }
    
        foreach ($cnvCfgs as $cfg) {
            $action = "update";
            $name = $cfg["name"];
            $plot_order_seq = $cfg["porder"];
            $height_ct = $cfg["height"];
            $show_visibility_option = $cfg["visible"]; 
            $interval_num = $cfg["grids"];
            $coordinate_num = $cfg["ticks"];
            $show_gap_option = $cfg["seg_gap"];
            $show_chrom_split_option = $cfg["chrom_split"];
            
            $sql = "select * from explore_cnv_plot_config where actor_user = $id and plot_nm = '$name' and  transcation_start_tm <= '$current_timestamp' and transaction_until_tm > '$current_timestamp'";
            $stmt = $pdo->prepare($sql);
            $stmt->execute();
            $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
            if (count($result) == 0) {
                $action = "insert";
            }

            if ($action == "update") {
                $sql = "update explore_cnv_plot_config set transaction_until_tm='$current_timestamp' where actor_user = $id and plot_nm = '$name' and  transcation_start_tm <= '$current_timestamp' and transaction_until_tm > '$current_timestamp'";
                $stmt = $pdo->prepare($sql);
                $stmt->execute();
            }
            $sql = "insert into explore_cnv_plot_config (
                plot_nm, plot_order_seq, height_ct, show_visibility_option, interval_num,
                coordinate_num, show_gap_option, show_chrom_split_option, actor_user,
                transcation_start_tm) values (
                    '$name', '$plot_order_seq', '$height_ct', '$show_visibility_option', '$interval_num',
                    '$coordinate_num', '$show_gap_option', '$show_chrom_split_option', $id,
                    '$current_timestamp');";
            $stmt = $pdo->prepare($sql);
            $stmt->execute();	
        }  
        $pdo->commit();
        $rsp["status"] = 'success';
    } catch (Exception $e) {
        $pdo->rollback();  
        $rsp["status"] = "fail";
        $rsp["msg"] = $e->getMessage();
    }

    echo json_encode($rsp);
    return;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    saveConfig();
} else if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    getConfig();
}

?>
