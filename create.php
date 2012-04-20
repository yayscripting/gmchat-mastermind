<?php
// Cookies kunnen uitstaan en er is geen reden is om je spel van cookies afhankelijk te maken
ini_set('session.use_cookies', false);

// Begin de sessie
session_start();

// Zet rest
$_SESSION['code_set']   = false;
$_SESSION['beurt']      = rand(1,2);
$_SESSION['action']     = 'setup';
$_SESSION['guesses']    = -1;
$_SESSION['code']       = 0000;
$_SESSION['lastcode']   = 0000;
$_SESSION['lastoutput'] = 0000;
$_SESSION['colors']     = Array('rood','geel','groen','blauw','roze','zwart');
$_SESSION['score']      = Array(1=>0,2=>0);

// Geef de redirect
header('Location: http://gmchat.blijbol.nl/gc.php?i='.session_id());
?>