<?php
// Open de sessie
ini_set('session.use_cookies', false);
session_id($_GET['session']);
session_start();
ob_start();

if(strlen(preg_replace("/[^0-9]/",'',$_POST['code']))==4 && $_SESSION['code_set']==false){
	$_SESSION['code']=$_POST['code'];
	$_SESSION['code_set']=true;
	$_SESSION['action']='guess';
	$_SESSION['guesses']++;
	echo "true";
}else{
	echo "false";

	//include('writeban.php');
	//writeFastBan();
	//$_SESSION['action']=array('cheat',$_GET['playerid']);
}