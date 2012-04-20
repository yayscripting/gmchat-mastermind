<?php
// check IP
$securFile = 'gamesecur/'.$_GET['i'].'_'.$_GET['s'].'.json';
if(file_exists($securFile)){
   $json = json_decode(file_get_contents($securFile), true);

   if($json['ip'] != $_SERVER['REMOTE_ADDR']){
       exit("Can't join server via IP-adress <i>".$_SERVER['REMOTE_ADDR']."</i>");
   }
}else{
   $handle = fopen($securFile, 'w');
   $toWrite = array('ip' => $_SERVER['REMOTE_ADDR']);
   fwrite($handle, json_encode($toWrite));
   fclose($handle);    
}

//check ban
if(empty($_GET['s']) || empty($_GET['i']) || empty($_GET['n1']) || empty($_GET['n2'])){
	exit();
}

require("check_ban.php");

// Open de sessie
ini_set('session.use_cookies', false);
session_id($_GET['i']);
session_start();
$_SESSION['p1name'] = $_GET['n1'];
$_SESSION['p2name'] = $_GET['n2'];
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html>
<head>
<title>GMChat-MasterMind 1</title>
	<script type="text/javascript" src="javascript/mootools.js"></script>
	<script type="text/javascript">
	var session = '<?php echo $_GET['i']; ?>';
	var iam = <?php echo ($_GET['s'] == 1) ? 'true' : 'false'; ?>;
	var playerid = <?php echo $_GET['s']; ?>;
	var playerOne = "<?php echo $_GET['n1']; ?>";
	var playerTwo = "<?php echo $_GET['n2']; ?>";
	</script>
	<script type="text/javascript" src="javascript/mastermind100c.js"></script>
	<script type="text/javascript" src="javascript/scroller.js"></script>
	<style type="text/css">
		body
		{
			background-color: #DDFFDD;
			font-size: small;
			margin: 0px 0px 0px 0px;
			padding: 5px; overflow: hidden;
		}
		
		#guessfield
		{
			margin-left: 10px;
		}
		
		.playernames
		{
			background-color: #CCFFCC;
			height: 24px;
			overflow: hidden;
		}
		
		div.scroller
		{
			border: 1px solid #DDDDDD;
			width: 340px;
			height: 150px;
			position: absolute;
			left: 10px;
			top: 20px;
			background: #EEFFEE;
			text-align: center;
		}
		
		div.content
		{
			float: left;
			width: 330px;
			height: 150px;
		}
		
		#innerContent
		{
			padding: 5px;
			text-align: left;
		}
		
		div.scrollarea
		{
			border-left: 1px solid #DDDDDD;
			width: 9px;
			height: 150px;
			float: right;
			cursor: pointer;
		}
		
		div.scrollBack, div.scrollForward
		{
			margin: 1px;
			width: 5px;
			height: 5px;
			border: 1px solid #DDDDDD;
			background: #EEEEEE;
		}
		
		div.scrollHandle
		{
			margin: 1px;
			width: 5px;
			border: 1px solid #DDDDDD;
			background: #EEEEEE;
		}
		
		div.scrollBarContainer
		{
			height: 132px;
		}
		
		#overlay
		{
			background: #000000;
			height: 100%;
			width: 100%;
			position: absolute;
			top: 0px;
			left: 0px;
		}

		.p1 { font-size: 12pt; padding-top: 2px; padding-left: 2px;}
		.p2 { font-size: 12pt; padding-top: 2px; padding-right: 2px;}
		.pc { font-size: 12pt; padding-top: 2px; }

		.mainfield { margin-left: 10px; margin-top: 5px; }
	
		#sessionText {
			position: absolute;
			/*top: 160px;*/
			left: 24px;
			width: 100%;
			bottom: 1px;
		}
		.help {
			cursor: pointer;
			position: absolute;
			height: 16px;
			left: 4px;
			top:34px;
			width: 16px;
		}

		.scores {
			cursor: pointer;
			position: absolute;
			height: 16px;
			left: 4px;
			top:51px;
			width: 16px;
		}


		.halloff {
			cursor: pointer;
			position: absolute;
			height: 16px;
			left: 4px;
			top:68px;
			width: 16px;
		}

		.sheme {
			cursor: pointer;
			position: absolute;
			height: 16px;
			left: 4px;
			top:85px;
			width: 16px;
		}

		.bug {
			cursor: pointer;
			position: absolute;
			height: 16px;
			left: 4px;
			top:102px;
			width: 16px;
		}


		#close
		{
			text-align: center;
			cursor: pointer;
			background: #EEEEEE;
			border: 1px solid #CCCCCC;
			padding: 2px;
		}
		
		.highscore
		{
			width: 100%;
			text-align: center;
			font-size: small;
		}
		
		.hsnr
		{
			width: 20px;
		}
		
		.hsgm
		{
			width: 45px;
		}
		.hspt
		{
			width: 45px;
		}
		.hsrt
		{
			width: 45px;
		}
		
		.slider
		{
			height: 16px;
			width: 300px;
			background: #eee;
		}
		
		.slider .knob
		{
			width: 16px;
			height: 16px;
			background: #ddd;
		}
	</style>
</head>
<body scroll="no" class="bg2">
	<div id="playfield">
		<div>
			<div class="playernames bg3">
			    <table style="width:100%;">
			      <tr>
				<td class="p1" align="left"><?php echo $_GET['n'.$_GET['s']]; ?></td>
				<td class="pc"align="center"><span id="p<?php echo $_GET['s']; ?>_score">0</span> - <span id="p<?php echo (($_GET['s']==1)?2:1); ?>_score">0</span></td>
				<td class="p1" align="right"><?php echo $_GET['n'.(($_GET['s']==1)?2:1)]; ?></td>
			      </tr>
			    </table>
			</div>
			
			<div class="mainfield">	
				<div id="guessfield">
					Laden...
				</div>
				<div id="setfield" class="bg4">
				</div>
			</div>

			<div id="sessionText"></div>
			<img class="sheme" src="images/sheme.png" onclick="openColorScheme();" alt="C" title="Kleur aanpassen" />
			<a href="./bug_report.php" target="_blank"><img border="0" class="bug" src="images/bug.png" alt="A" title="Bug Report" /></a>
			<img class="halloff" src="images/halloff.png" onclick="openHalloff();" alt="A" title="Hall Of Fame" />
			<img class="scores" src="images/highscore.png" onclick="openHighScore();" alt="H" title="Highscores" />
			<img class="help" src="images/help.png" onclick="openHelp();" alt="?" title="Help!" />
		</div>
	</div>
	<div id="overlay">
	</div>
	<div class="scroller bg1" id="scrollerMain">
		<div id="content" class="content">
			<div id="innerContent">
				Welkom,<br/>indien dit scherm blijft staan kun je concluderen dat het spel niet geladen is. Gelieve deze bug te posten in <a href="http://mastermind.jessed.nl/bug_report.php" target="_blank">de bug report</a> met eventuele errors.<br/><br/>Alvast bedankt!
			</div>
		</div>
		<div class="scrollarea">
			<div class="scrollBack"></div>
			<div class="scrollBarContainer">
				<div id="scrollhandle" class="scrollHandle"></div>
			</div>
			<div class="scrollForward"></div>
		</div>
		<span id="close">Sluiten</span>
	</div>
</body>
</html>