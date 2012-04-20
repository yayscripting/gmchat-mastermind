<?php
$hs=json_decode(file_get_contents("highscore29184.txt"),true);
$highscore = array();

if(!empty($hs)){
	foreach($hs as $score){
		if($score['games']>=5){
			if($score['name']==urldecode($_GET['win'])){
				$score['points'] += 1;
				$score['games']+= 1;
			}
			if($score['name']==urldecode($_GET['lose'])){
				$score['games']+= 1;
			}
			$highscore[$score['name']] = $score['games']*($score['points']/$score['games'])*($score['points']/$score['games']);
			$highratio[$score['name']] = $score['points']/$score['games'];
			$highpoints[$score['name']] = $score['points'];
			$highgames[$score['name']] = $score['games'];
		}
	}
}

arsort($highscore);

$chs = count($highscore);

$k = array_keys($highscore);

$a = 0;

$x = ((isset($_GET['p']))?array_search(urldecode($_GET['p']), $k):0);

if(isset($_GET['p'])&&isset($_GET['win'])&&isset($_GET['lose'])){
	$x = array_search(urldecode($_GET['p']), $k);
	if($x == 0){
		$at = $x;
		$chst = $x+3;
	}
	elseif($x+1 == $chs){
		$at = $x-2;
	}
	else{
		$at = $x-1;
		$chst = $x+2;
	}
	if($chs>3){
		$a = $at;
		$chs = $chst;
	}
	else{
		$a = 0;
		$chs = 2;
	}
}

echo '<center><b>Highscore</b><br/><table class="highscore"><tr style="background-color: #cccccc;"><td>Nr.</td><td>Naam</td><td>Wins</td><td>Games</td><td>Ratio</td><td>Sort</td></tr>';

for($i = $a; $i<$chs; $i++){

	if(($i+1)==1){ $range='<img src="images/r1.png" alt="1" title="#1 - Gouden medaille"/>'; }else
	if(($i+1)==2){ $range='<img src="images/r2.png" alt="2" title="#2 - Zilveren medaille"/>'; }else
	if(($i+1)==3){ $range='<img src="images/r3.png" alt="3" title="#3 - Bronzen medaille"/>'; }else{$range=$i+1;}


	if($x == $i && isset($_GET['p'])){
		echo '<tr class="bg4"><td class="hsnr">'.$range.'</td>';
		echo '<td class="hsus">'.$k[$i].'</td>';
		echo '<td class="hspt">'.$highpoints[$k[$i]].'</td>';
		echo '<td class="hsgm">'.$highgames[$k[$i]].'</td>';
		echo '<td class="hsrt">'.round($highratio[$k[$i]]*100).'%</td>';
		echo '<td>'.round($highscore[$k[$i]],1).'</td>';
	}
	else{
		echo '<tr style="background-color: '.(($i%2)?'#eeeeee':'#dddddd').';"><td class="hsnr">'.$range.'</td>';
		echo '<td class="hsus">'.$k[$i].'</td>';
		echo '<td class="hspt">'.$highpoints[$k[$i]].'</td>';
		echo '<td class="hsgm">'.$highgames[$k[$i]].'</td>';
		echo '<td class="hsrt">'.round($highratio[$k[$i]]*100).'%</td>';
		echo '<td>'.round($highscore[$k[$i]],1).'</td>';
	}
	echo '</tr>';
}

if($chs==0){
	echo '<tr style="background-color: #eeeeee;">';
	echo '<td colspan="6"><i>Nog geen scores bekend</i></td>';
	echo '</tr>';
}

echo '</table>';
echo '<font size="2pt"><i>Je komt pas in deze scores vanaf 5 gespeelde games</i></font></center>';