<?php
ob_start();
function writeFastBan(){
	$bans=json_decode(file_get_contents("bans545.txt"));
	$count=count($bans);
	$bans[$count]=$_SERVER['REMOTE_ADDR'];

	$handle=fopen("bans545.txt","w+");
	fwrite($handle,json_encode($bans));
	fclose($handle);


	$sub="Mastermind - ban";
	$mess="Beste,<br/><br/>het ip adres <b>".$_SERVER['REMOTE_ADDR']."</b> (Onder de alias <b>".$_SESSION['p'.$_GET['playerid'].'name']."</b>) heeft zich zelf een ban aangesmeerd.<br/><br/>Doedels!";
	//mail("degger@live.nl",$sub,$mess,"Content-type: text/html\nFrom: mastermind@jessed.nl");
	//mail("arthurvanaarssen@gmail.com",$sub,$mess,"Content-type: text/html\nFrom: mastermind@jessed.nl");
}