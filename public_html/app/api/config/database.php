<?php
class Database{
 
    // specify your own database credentials
    private $host = "shareddb-o.hosting.stackcp.net";
    private $db_name = "PHPLearning-313039bb0c";
    private $username = "PHPLearning-313039bb0c";
    private $password = "WebProgramming@";
    public $conn;
 
    // get the database connection
    public function getConnection(){
 
        $this->conn = null;
 
        try{
            $this->conn = new PDO("mysql:host=" . $this->host . ";dbname=" . $this->db_name, $this->username, $this->password);
            $this->conn->exec("set names utf8");
        }catch(PDOException $exception){
            echo "Connection error: " . $exception->getMessage();
        }
 
        return $this->conn;
    }
}
?>