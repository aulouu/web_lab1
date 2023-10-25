<?php

if(!isset($_SESSION['table'])) {
    $_SESSION['table'] = [];
}
echo json_encode($_SESSION['table'], JSON_UNESCAPED_UNICODE);

?>