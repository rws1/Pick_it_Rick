<?php
/* Database credentials. Assuming you are running MySQL
server with default setting (user 'root' with no password) */
define('DB_SERVER', 'shareddb-s.hosting.stackcp.net');
define('DB_USERNAME', 'kudaMugara');
define('DB_PASSWORD', '1234567@');
define('DB_NAME', 'registration-3132352ff9');
 
/* Attempt to connect to MySQL database */
$link = mysqli_connect(DB_SERVER, DB_USERNAME, DB_PASSWORD, DB_NAME);
 
// Check connection
if($link === false){
    die("ERROR: Could not connect. " . mysqli_connect_error());
}
?>