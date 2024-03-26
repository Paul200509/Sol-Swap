<?php

// Paramètres de connexion à la base de données
$host = 'localhost';
$port = '5432';
$dbname = 'dbname';
$user = 'dbuser';
$password = 'dbpwd';

// Connexion à la base de données
try {
    $dsn = "pgsql:host=$host;port=$port;dbname=$dbname;user=$user;password=$password";
    $pdo = new PDO($dsn);
    echo "Connexion à la base de données réussie.";
} catch (PDOException $e) {
    echo "Erreur de connexion : " . $e->getMessage();
}
?>
