<?php
// Open de sessie
ini_set('session.use_cookies', false);
session_id($_GET['session']);
session_start();

$perfect=0;
$wrongplace=0;
$addecho=array();

if(!empty($_POST['code'])){
	$post_colors=str_split($_POST['code']);
	$code_colors=str_split($_SESSION['code']);
	
	for($i=0;$i<4;$i++){
		if($post_colors[$i]==$code_colors[$i]){
			$perfect++;
			$code_colors[$i]='7';
			$post_colors[$i]='8';
		}
		
	}
	for($i=0;$i<4;$i++){
		if(in_array($post_colors[$i],$code_colors)){
			$wrongplace++;
			$code_colors[array_search($post_colors[$i],$code_colors)]='7';
		}
	}

	$_SESSION['lastcode']=$_POST['code'];
	$_SESSION['lastoutput']=array('right'=>$perfect,'wrongplace'=>$wrongplace);

	if($perfect==4){
		$_SESSION['action']=array('win',$_GET['playerid']);
		$_SESSION['score'][$_GET['playerid']]++;
		$addecho=array('code'=>$_SESSION['code']);
	}else{
		if($_SESSION['guesses']==9){
			$winPlayer=(($_GET['playerid']==1)?2:1);

			$_SESSION['action']=array('win',$winPlayer);
			$_SESSION['score'][$winPlayer]++;

			$addecho=array('code'=>$_SESSION['code']);
		}else{
			$_SESSION['guesses']++;
		}
	}	

	echo json_encode(array_merge($_SESSION['lastoutput'],$addecho));
}else{
	//echo 'false';

	//include('writeban.php');
	//writeFastBan();
	//$_SESSION['action']=array('cheat',$_GET['playerid']);
}