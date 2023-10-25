<?php

session_start();
date_default_timezone_set('Europe/Moscow');
function validateX($x) {
    $X_MIN = -3;
    $X_MAX = 5;

    if (!isset($x))
        return false;

    $numX = str_replace(',', '.', $x);
    return is_numeric($numX) && $numX > $X_MIN && $numX < $X_MAX;
}

function validateY($y) {
    $Y_MIN = -3;
    $Y_MAX = 3;

    if (!isset($y))
        return false;

    $numY = str_replace(',', '.', $y);
    return is_numeric($numY) && $numY > $Y_MIN && $numY < $Y_MAX;
}

function validateR($r) {
    return isset($r);
}

function validateForm($x, $y, $r) {
    return validateX($x) && validateY($y) && validateR($r);
}

function checkCircle($x, $y, $r) {
	return ($x <= 0) && ($y <= 0) && (sqrt($x * $x + $y * $y) <= $r) && ($x >= -$r) && ($y >= -$r);
}

function checkRectangle($x, $y, $r) {
	return ($x >= 0) && ($y <= 0) && ($x <= $r / 2) && ($y >= -$r);
}

function checkTriangle($x, $y, $r) {
	return ($x >= 0) && ($y >= 0) && ($x <= $r / 2) && ($y <= $r - 2 * $x);
}

function checkHit($x, $y, $r): bool {
	return checkTriangle($x, $y, $r) || checkRectangle($x, $y, $r) || checkCircle($x, $y, $r);
}

function error($error) {
    echo json_encode(["error" => $error]);
    exit(1);
}

$x = $_POST["x"];
$y = $_POST["y"];
$r = $_POST["r"];

if(!validateForm($x, $y, $r)) {
    error("Arguments aren't valid");
}

$time = new DateTime('now');
$hit_fact = checkHit($x, $y, $r) ? "Hit" : "Miss";
$current_time = $time -> format("Y-m-d H:i:s");
$execution_time = round((microtime(true) - $_SERVER["REQUEST_TIME_FLOAT"]), 7);

$answer = [
    "x" => $x,
    "y" => $y,
    "r" => $r,
    "hit" => $hit_fact,
    "curtime" => $current_time,
    "exectime" => $execution_time
];

$_SESSION['table'][] = $answer;
echo json_encode($answer, JSON_UNESCAPED_UNICODE);

?>