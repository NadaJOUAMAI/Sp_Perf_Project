CREATE DATABASE sp_perf;
CREATE TABLE t_employe (
    ID SMALLINT UNSIGNED NOT NULL  AUTO_INCREMENT,
    NOM VARCHAR(50) NOT NULL,
    DATE_ENTREE DATE,
    DATE_CREATION TIMESTAMP NOT NULL  DEFAULT CURRENT_TIMESTAMP(),
    DATE_MAJ TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
    PRIMARY KEY(ID)
);
CREATE TABLE t_processus (
    ID SMALLINT UNSIGNED NOT NULL  AUTO_INCREMENT,
    NOM VARCHAR(50) NOT NULL,
    DATE_CREATION TIMESTAMP NOT NULL  DEFAULT CURRENT_TIMESTAMP(),
    DATE_MAJ TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
    PRIMARY KEY(ID),
    PROJET_ID SMALLINT UNSIGNED,
    CONSTRAINT FK_PROJET_ID FOREIGN KEY (PROJET_ID) REFERENCES t_projet(ID)
);
CREATE TABLE t_projet (
    ID SMALLINT UNSIGNED NOT NULL  AUTO_INCREMENT,
    NOM VARCHAR(50) NOT NULL,
    DATE_CREATION TIMESTAMP NOT NULL     DEFAULT CURRENT_TIMESTAMP(),
    DATE_MAJ TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
    PRIMARY KEY(ID)
);
CREATE TABLE t_employe_processus (
    POLYVALENCE TINYINT,
    EMPLOYE_ID SMALLINT UNSIGNED,
    PROCESSUS_ID SMALLINT UNSIGNED,
    CONSTRAINT FK_EMPLOYE_ID FOREIGN KEY (EMPLOYE_ID) REFERENCES t_employe(ID),
    CONSTRAINT FK_PROCESSUS_ID  FOREIGN KEY (PROCESSUS_ID) REFERENCES t_processus(ID)
);
CREATE TABLE t_processus_projet (
    PROCESSUS_ID SMALLINT UNSIGNED,
    PROJET_ID SMALLINT UNSIGNED,
    CONSTRAINT FK_PROCESSUS_ID_  FOREIGN KEY (PROCESSUS_ID) REFERENCES t_processus(ID),
    CONSTRAINT FK_PROJET_ID_ FOREIGN KEY (PROJET_ID) REFERENCES t_projet(ID)
);