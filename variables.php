<?php
// Open de sessie
ini_set('session.use_cookies', false);
session_id($_GET['session']);
session_start();

include("setHighscorePoint.php");

if($_SESSION['action'][0] == 'win'){
	$_SESSION['playerreset'][$_GET['playerid']-1] += 1;


}

if($_SESSION['playerreset'][0]>1 && $_SESSION['playerreset'][1]>1){
	setHighscorePoint($_SESSION['p'.$_SESSION['action'][1].'name'],1);
	setHighscorePoint($_SESSION['p'.(($_SESSION['action'][1]==1)?2:1).'name'],0);

	$_SESSION['action']='setup';
	$_SESSION['guesses']=-1;
	$_SESSION['lastcode']=0000;
	$_SESSION['lastoutput']=0000;
	$_SESSION['playerreset']=array(0,0);
	$_SESSION['code_set']=false;
}

$sess=array(); 
$sess['beurt']      =$_SESSION['beurt'];
$sess['action']     =$_SESSION['action'];
$sess['guesses']    =$_SESSION['guesses'];
$sess['lastcode']   =$_SESSION['lastcode'];
$sess['lastoutput'] =$_SESSION['lastoutput'];
$sess['score']	    =array("one"=>$_SESSION['score'][1],"two"=>$_SESSION['score'][2]);

echo json_encode($sess);