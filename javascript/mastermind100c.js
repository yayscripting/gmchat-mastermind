// MasterMind.js v1.00b
// Versie informatie:
//     MasterMind.js v1.00b:
//         Nieuwe kleur: oranje
//         REFRESH BENODIGD VOOR VOLLEDIGE FUNCTIONALITEIT
//     MasterMind.js v1.00c:
//         Bug gefixt (2x op bolletje klikken voor rood)

cycleColor = function(e){
	e.stop();
	tween = new Fx.Tween(this, {duration: 250});
	if(this.title == '0'){
		tween.start('color', '#ff9900');
		this.title = '1';
	}
	else if(this.title == '1'){
		tween.start('color', '#ffff00');
		this.title = '2';
	}
	else if(this.title == '2'){
		tween.start('color', '#00ff00');
		this.title = '3';
	}
	else if(this.title == '3'){
		tween.start('color', '#0000ff');
		this.title = '4';
	}
	else if(this.title == '4'){
		tween.start('color', '#ff00ff');
		this.title = '5';
	}
	else if(this.title == '5'){
		tween.start('color', '#000000');
		this.title = '6';
	}
	else if(this.title == '6'){
		tween.start('color', '#ff0000');
		this.title = '0';
	}
}


setupGuessField = function(){
	gf = $('guessfield');
	gf.empty();
	for(i=0; i<10; i++){
		tempe = new Element('div', {id: 'guess'+i,
			styles: {
				'background-color': ((i%2==0)?'#eeeeee':'#dddddd'),
				width: '26px',
				float: 'left'
			}
		}).inject(gf);
		
		for(e=0; e<4; e++){
			new Element('div', {id: 'guess'+i+'-'+e,
				styles: {
					color: '#000000',
					height: '30px',
					'font-size': '24pt',
					'text-align': 'center',
					overflow: 'hidden',
					cursor: 'default'
				},
				title: '6'
			}).inject(tempe).set('html', '&#149;');
		}
	}
}

setupSetField = function(){
	sf = $('setfield').setStyles({float: 'left', cursor: 'pointer'}).addClass('bg4');
	sf.empty();
	for(i=0; i<4; i++){
		new Element('div', {id: 'set'+i,
			styles: {
				color: '#000000',
				height: '30px',
				'font-size': '24pt',
				'text-align': 'center',
				overflow: 'hidden'
			},
			title: '6'
		}).inject(sf).set('html', '&#149;').addEvent('click', cycleColor);
	}
	new Element('div', {
		styles: {
			color: '#111111',
			'font-size': 'small',
			height: '0px',
			'text-align': 'center',
			'vertical-align': 'bottom',
			overflow: 'hidden'
		}
	}).inject(sf).set('text', 'Start').tween('height', '20px').addEvent('click', sendCode);
	
	sf.morph({'width': '46px'});
}
				
setActiveGuess = function(i){
	
	activeGuess = i;
	
	guess = $('guess'+i);
	
	guess.morph({'background-color': bgDc.setHue(hue).rgbToHex(),
		width: '46px'});
		
	guess.addClass('bg4');
	
	if(!iam){
		guess.getChildren().each(function(el){	
			el.addEvent('click', cycleColor);
			el.setStyle('cursor', 'pointer');
		});
		
		new Element('div', {
			styles: {
				color: '#111111',
				'font-size': 'small',
				height: '0px',
				'text-align': 'center',
				'vertical-align': 'bottom',
				overflow: 'hidden',
				cursor: 'pointer'
			}
		}).inject(guess).set('text', 'Ok').tween('height', '20px').addEvent('click', sendGuess);
	}
}

sendCode = function(e){
	e.stop();
	sf = $('setfield').setStyle('cursor', 'default');
	code = '';
	sf.getChildren().each(function(el){
		if(el.getStyle('color').toLowerCase()=='#111111'){
			el.tween('height', '0px');
		}
		else{
			code+=el.get('title');
		}
		el.removeEvent('click', cycleColor);
	});
	codeInt = code;
	var sended = new Request({url: 'set_code.php?session='+session+'&playerid='+playerid}).send('code='+code);
	sf.morph({'background-color': '#cccccc',
		width: '26px'});
	sf.removeClass('bg4');
	setActiveGuess(0);
}

sendGuess = function(e){
	e.stop();
	
	gf = $('guess'+activeGuess);
	
	code = '';
	gf.getChildren().each(function(el){
		if(el.getStyle('color').toLowerCase()=='#111111'){
			OK=el.set('text', '').removeEvent('click', sendGuess);
		}
		else{
			code+=el.get('title');
		}
		el.removeEvent('click', cycleColor).setStyle('cursor', 'default');
	});

	var sended = new Request.JSON({url: 'guess.php?session='+session+'&playerid='+playerid, onComplete: processGuess}).send('code='+code);

	gf.morph({'background-color': (activeGuess%2==0)?'#eeeeee':'#dddddd',
		width: '26px'});
	gf.removeClass('bg4');
}

processGuess = function(object){
	for(i=0; i<4; i++){
		if(object.right){
			setColor = '#00ff00';
			object.right--;
		}
		else if(object.wrongplace){
			setColor =  '#ff0000';
			object.wrongplace--;
		}
		else{
			setColor = '#000000';
		}		
		new Element('span', {
			styles: {
				color: setColor,
				'font-size': '18pt',
				position: 'relative',
				top: (i>1)?'2px':'-8px',
				left: (i>1)?'-11px':'5px'
			}
		}).inject(OK).set('html', '&#149;');
	}
	code = object.code;
}

getVars = function(){
	var sended = new Request.JSON({url: 'variables.php?session='+session+'&playerid='+playerid, onComplete: processVars}).send();
}

processVars = function(object){
	if(!iam){
		if(object.action == 'guess' && activeGuess!=object.guesses){
			setActiveGuess(object.guesses);
			$('sessionText').set('text', '');
		}
		if($type(object.action)=='array' && object.action[0] == 'win' && object.action[1] == playerid){
			changeScrollerContent('<center><b>GEFELICITEERD!</b><br />Je hebt de code van je tegenstander geraden!<br />'+createHTMLCode(code)+'</center>');
			addHighScore(true);
			showScroller();
			$('close').set('text', 'Een moment a.u.b.').removeEvent('click', hideScroller);
		}
		if($type(object.action)=='array' && object.action[0] == 'win' && object.action[1] != playerid){
			changeScrollerContent('<center><b>HELAAS!</b><br />Je hebt de code van je tegenstander niet kunnen raden!<br />'+createHTMLCode(code)+'</center>');
			addHighScore(false);
			showScroller();
			$('close').set('text', 'Een moment a.u.b.').removeEvent('click', hideScroller);
		}
	}else{
		if(object.action == 'guess' && activeGuess!=object.guesses){
			
			var colors=object.lastcode.split('');

			gf = $('guess'+activeGuess).setStyle('cursor', 'default');
			colors.each(function(col, num){
				if(col=='0'){
					var setColor='#ff0000';
				}
				else if(col=='1'){
					var setColor='#ff9900';
				}
				else if(col=='2'){
					var setColor='#ffff00';
				}
				else if(col=='3'){
					var setColor='#00ff00';
				}
				else if(col=='4'){
					var setColor='#0000ff';
				}
				else if(col=='5'){
					var setColor='#ff00ff';
				}
				else if(col=='6'){
					var setColor='#000000';
				}
		
				$('guess'+activeGuess+'-'+num).tween('color', setColor);
			});
			
			OK = new Element('div', {
				styles: {
					color: '#111111',
					'font-size': 'small',
					height: '0px',
					'text-align': 'center',
					'vertical-align': 'bottom',
					overflow: 'hidden',
					cursor: 'pointer'
				}
			}).inject($('guess'+activeGuess)).tween('height', '20px');
			
			processGuess(object.lastoutput);

			gf.morph({'background-color': (activeGuess%2==0)?'#eeeeee':'#dddddd',width: '26px'});
			gf.removeClass('bg4');
			setActiveGuess(object.guesses);
		}
		if($type(object.action)=='array' && object.action[0] == 'win' && object.action[1] != playerid){
			changeScrollerContent('<center><b>HELAAS!</b><br />Je tegenstander heeft jouw code geraden!<br />'+createHTMLCode()+'</center>');
			addHighScore(false);
			showScroller();
			$('close').set('text', 'Een moment a.u.b.').removeEvent('click', hideScroller);
		}
		if($type(object.action)=='array' && object.action[0] == 'win' && object.action[1] == playerid){
			changeScrollerContent('<center><b>GEFELICITEERD!</b><br />Je tegenstander heeft jouw code niet kunnen raden!<br />'+createHTMLCode()+'</center>');
			addHighScore(true);
			showScroller();
			$('close').set('text', 'Een moment a.u.b.').removeEvent('click', hideScroller);
		}

	}
	$('p1_score').set('text', object.score.one);
	$('p2_score').set('text', object.score.two);
	if(object.action == 'setup' && localAction != 'setup'){
		reset();
	}
	localAction = object.action;

	if($type(object.action)=='array' && object.action[0] == 'cheat' && object.action[1] == playerid){
		window.location="ban.html";
	}else
	if($type(object.action)=='array' && object.action[0] == 'cheat' && object.action[1] != playerid){
		changeScrollerContent('<b>Je tegenstander cheat dit spel</b><br/>Sorry maar je tegenstandig heeft het spel laten stoppen door het proberen te cheaten/hacken.');
		$('close').tween('display','none').removeEvent('click', hideScroller);
		showScroller();
	}
}

createHTMLCode = function(iCode){

	HTMLCode = ''
	
	cood = (iCode)?iCode:codeInt;
	
	var colors=cood.split('');
	colors.each(function(col, num){
		if(col=='0'){
			var setColor='#ff0000';
		}
		else if(col=='1'){
			var setColor='#ff9900';
		}
		else if(col=='2'){
			var setColor='#ffff00';
		}
		else if(col=='3'){
			var setColor='#00ff00';
		}
		else if(col=='4'){
			var setColor='#0000ff';
		}
		else if(col=='5'){
			var setColor='#ff00ff';
		}
		else{
			var setColor='#000000';
		}
		HTMLCode += '<span style="color: '+setColor+'; font-size: 32pt;">&#149;</span>';
	});
	
	return HTMLCode;
}

changeScrollerContent = function(content){
	$('innerContent').set('html', content);
	scroller.updateStyles();
}

hideScroller = function(){
	$('overlay').fade('out');
	$('scrollerMain').fade('out');
}

showScroller = function(){
	$('overlay').fade(0.4);
	$('scrollerMain').fade('in');
}

changeScrollerHTML = function(Tree, El, HTML, JS){
	changeScrollerContent(HTML);
	showScroller();
	updateColor();
}

addScrollerHTML = function(Tree, El, HTML, JS){
	$('innerContent').set('html', $('innerContent').get('html')+HTML);
	scroller.updateStyles();
	showScroller();
	updateColor();
}

openHelp = function(){
	new Request.HTML({url: 'help/help.html', onSuccess: changeScrollerHTML}).send();
	$('close').set('text', 'Sluiten').addEvent('click', hideScroller);
}

openHighScore = function(){
	new Request.HTML({url: 'highscores.php?p='+((playerid==1)?playerOne:playerTwo), onSuccess: changeScrollerHTML}).send();
	$('close').set('text', 'Sluiten').addEvent('click', hideScroller);
}

openHalloff = function(){
	new Request.HTML({url: 'halloffame.php', onSuccess: changeScrollerHTML}).send();
	$('close').set('text', 'Sluiten').addEvent('click', hideScroller);
}

addHighScore = function(win){
	url = ((win)?'&win='+((playerid==1)?playerOne:playerTwo)+'&lose='+((playerid==2)?playerOne:playerTwo):'&win='+((playerid==2)?playerOne:playerTwo)+'&lose='+((playerid==1)?playerOne:playerTwo));
	new Request.HTML({url: 'highscores.php?p='+((playerid==1)?playerOne:playerTwo)+url, onSuccess: addScrollerHTML}).send();
}

reset = function(){
	setupGuessField();
	if(iam){
		$('sessionText').set('text', 'Wacht tot je tegenstander een code heeft gemaakt...');
		activeGuess = -1;
		$('setfield').empty();
		iam = false;
	}
	else{
		setupSetField();
		codeInt = '';
		iam = true;
	}
	$('close').set('text', 'Speel opnieuw!').addEvent('click', hideScroller);
}

setupColorSchemer = function(Tree, El, HTML, JS){
	$('innerContent').set('html', HTML);
	scroller.updateStyles();
	showScroller();
	
	el = $('slider');
	slider = new Slider(el, el.getElement('.knob'), {
			steps: 359,  // Steps from 0 to 255
			wheel: true, // Using the mousewheel is possible too
			onChange: function(){
				// Based on the Slider values set an RGB value in the color array
				hue = this.step;
				// and update the output to the new value
				updateColor();
			}
	}).set(hue);
}

updateColor = function(){
	$$('.bg1').setStyle('background-color', bgAc.setHue(hue));
	$$('.bg2').setStyle('background-color', bgBc.setHue(hue));
	$$('.bg3').setStyle('background-color', bgCc.setHue(hue));
	$$('.bg4').setStyle('background-color', bgDc.setHue(hue));
	Cookie.write('colorscheme', hue, {duration: 365});
}

openColorScheme = function(){
	new Request.HTML({url: 'colorschemer.php', onSuccess: setupColorSchemer}).send();
	$('close').set('text', 'Ok').addEvent('click', hideScroller);
}

window.addEvent('domready', function(){
	hue = (Cookie.read('colorscheme'))?Cookie.read('colorscheme'):120;
	
	bgAc = new Color([hue,22,120], 'hsb');
	bgBc = new Color([hue,22,110], 'hsb');
	bgCc = new Color([hue,22,100], 'hsb');
	bgDc = new Color([hue,22,97], 'hsb');
	
	updateColor();
	
	setupGuessField();
	if(!iam){
		$('sessionText').set('text', 'Wacht tot je tegenstander een code heeft gemaakt...');
		activeGuess = -1;
		codeInt = '';
		code = '';
	}
	else{
		setupSetField();
		codeInt = '';
		code = '';
	}
	
	localAction = 'setup';
	
	mainInterval = setInterval('getVars()', 1000);
	
	scroller = new Scroller('content', 'scrollhandle');
	
	$('overlay').fade('hide');
	$('scrollerMain').fade('hide');
	
	$('close').addEvent('click', hideScroller);
	if(!Cookie.read('nonewb')){
		Cookie.write('nonewb', true, {duration: 365});
		openHelp();
	}
});