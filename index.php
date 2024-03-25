<?php

// Paramètres de connexion à la base de données
$host = 'localhost';
$port = '5432';
$dbname = 'example_db';
$user = 'example_user';
$password = 'example_password';

// Connexion à la base de données
try {
    $dsn = "pgsql:host=$host;port=$port;dbname=$dbname;user=$user;password=$password";
    $pdo = new PDO($dsn);
    echo "Connexion à la base de données réussie.";
} catch (PDOException $e) {
    echo "Erreur de connexion : " . $e->getMessage();
}
?>
