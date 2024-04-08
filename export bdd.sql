CREATE TABLE Categorie (
    id_categorie INT PRIMARY KEY,
    des_categorie VARCHAR(255)
);

CREATE TABLE Article (
    id_article INT PRIMARY KEY,
    nom VARCHAR(255) NOT NULL,
    description TEXT,
    utilisation TEXT,
    id_categorie INT,
    FOREIGN KEY (id_categorie) REFERENCES Categorie(id_categorie)
);

CREATE TABLE Proposer (
    id_article INT,
    taille VARCHAR(50),
    RESERVER BOOLEAN DEFAULT false,
    dateReservation DATE,
    id_client INT,
    Etat_reservation VARCHAR(50),
    FOREIGN KEY (id_article) REFERENCES Article(id_article),
    FOREIGN KEY (id_client) REFERENCES Client(id_client)
);

CREATE TABLE AdresseLivraison (
    id_adresse INT PRIMARY KEY,
    numero INT,
    rue VARCHAR(255),
    code_postal VARCHAR(10),
    ville VARCHAR(255),
    pays VARCHAR(255),
    id_client INT,
    FOREIGN KEY (id_client) REFERENCES Client(id_client)
);

CREATE TABLE Client (
    id_client INT PRIMARY KEY,
    prenom VARCHAR(255) NOT NULL,
    nom VARCHAR(255) NOT NULL,
    mail VARCHAR(255) NOT NULL,
    identifiant VARCHAR(50) NOT NULL,
    mdp_client VARCHAR(255) NOT NULL,
    date_inscription DATE NOT NULL
);

CREATE TABLE Image (
    id_photo INT PRIMARY KEY,
    id_article INT,
    chemin_image TEXT,
    FOREIGN KEY (id_article) REFERENCES Article(id_article)
);