<?php

function setHighscorePoint($who,$mode){
	$known=false;
	$highscore=json_decode(file_get_contents("highscore29184.txt"),true);

	echo var_dump($highscore);


	for($i=0;$i<count($highscore);$i++){
		if($who==$highscore[$i]["name"]){
			if($mode==1){
				$highscore[$i]['points']++;
			}

			$highscore[$i]['games']++;
			$known=true;
		}
	}

	if($known==false){
		$c = count($highscore);
		$highscore[$c]['name']=$who;
		$highscore[$c]['points']=(($mode==1)?1:0);
		$highscore[$c]['games']=1;
	}

	$handle=fopen("highscore29184.txt","w+");
	fwrite($handle,json_encode($highscore));
	fclose($handle);
}
