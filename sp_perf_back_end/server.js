import express from "express";
import mysql from "mysql";
import multer from 'multer';
import cors from "cors";
import XLSX from 'xlsx';

const app = express();
app.use(cors());
app.use(express.json())

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "sp_perf",
  });

const uploadE = multer({ dest: 'uploadE/' });
function importDataEmploye(filePath) {
  const workbook = XLSX.readFile(filePath, { type: 'binary' });
  const sheetName = workbook.SheetNames[0];
  workbook.SheetNames.forEach(function (sheetName) {
    var XL_row_object = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
    var json_object = JSON.stringify(XL_row_object);
    var obj = JSON.parse(json_object);
    for (let i = 0; i < obj.length; i++) {
      const matricule = obj[i]['MAT'];
      const nomEtPrenom = obj[i]['NOM ET PRENOM'];
      const dateValue = obj[i]['DATE D ENTREE'];
      const jsDate = new Date((dateValue - 25568) * 86400 * 1000);

      if (!isNaN(jsDate) && jsDate !== 'Invalid Date') {
        const formattedDate = jsDate.toISOString().slice(0, 10);
        const query = "INSERT INTO t_employe (`MAT`, `NOM`, `DATE_ENTREE`) VALUES (?, ?, ?)";
        db.query(query, [matricule, nomEtPrenom, formattedDate], (err, results) => {
          if (err) {
            console.error('Erreur lors de l\'insertion dans la base de données:', err);
          } else {
            console.log('Données insérées avec succès dans la base de données');
          }
        });
      } 
    }
  });
}


app.post('/importDataEmploye', uploadE.single('excelFile'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  const filePath = req.file.path;
  try {
    importDataEmploye(filePath);
    res.json({ message: 'Excel data imported and processed successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error importing and processing Excel data' });
  }
});
  
app.get('/exportDataEmploye', (req, res) => {
    const q = "SELECT * FROM t_employe";
    db.query(q, function (err, rows) {
      if (err) {
        return res.status(500).json({ error: 'Error querying the database' });
      }
      const sheet = XLSX.utils.json_to_sheet(rows);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, sheet, "t_employe");
      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });
      res.setHeader('Content-Disposition', 'attachment; filename=employes.xlsx');
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.send(excelBuffer);
    });
  });

app.get("/getEmploye", (_request,_response) => {
    const q = "SELECT * FROM t_employe";
    db.query(q, (err, data) => {
      if (err) return _response.json(err);
      return _response.json(data)
      })
});

app.post("/addEmploye", (_request,_response) => {
    const q = "INSERT INTO t_employe(`MAT`,`NOM`,`DATE_ENTREE`) VALUES (?)";
    const values = [
        _request.body.MAT,
        _request.body.NOM,
        _request.body.DATE_ENTREE,
      ];
    db.query(q, [values],(err, data) => {
        if (err) return _response.json(err);
        return _response.json("Employe est ajouté(e) avec succès !");
    });
});

app.delete("/deleteEmploye/:id", (_request, _response) => {
    const employeId = _request.params.id;
    const q = " DELETE FROM t_employe WHERE ID = ? ";
  
    db.query(q, [employeId], (err, data) => {
      if (err) return _response.json (err); 
      return _response.json("Employe est supprimé(e) avec succès !");
    });
});

app.put("/updateEmploye/:id", (_request, _response) => {
  const employeId = _request.params.id;
  const q = "UPDATE t_employe SET `MAT`=?,`NOM`=?,`DATE_ENTREE`=?   WHERE ID = ?";
  const values = [
    _request.body.MAT,
    _request.body.NOM,
    new Date(_request.body.DATE_ENTREE),
  ];
  db.query(q, [...values,employeId], (err, data) => {
    if (err) {
      return _response.json(err);
    }
    return _response.json("Employe est mis à jour avec succès !");
  });
});


const uploadP = multer({ dest: 'uploadP/' });
function importDataProjet(filePath) {
  const workbook = XLSX.readFile(filePath, { type: 'binary' });
  const sheetName = workbook.SheetNames[0];
  workbook.SheetNames.forEach(function (sheetName) {
    var XL_row_object = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
    var json_object = JSON.stringify(XL_row_object);
    var obj = JSON.parse(json_object);
    for (let i = 0; i < obj.length; i++) {
      const nomDeProjet = obj[i]['NOM'];
        const query = "INSERT INTO t_projet (`NOM`) VALUES (?)";
        db.query(query, [nomDeProjet], (err, results) => {
          if (err) {
            console.error('Erreur lors de l\'insertion dans la base de données:', err);
          } else {
            console.log('Données insérées avec succès dans la base de données');
          }
        });
    }
  });
}

app.post('/importDataProjet', uploadP.single('excelFile'), async (req, res) => {
    if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  const filePath = req.file.path;
  try {
    importDataProjet(filePath);
    res.json({ message: 'Excel data imported and processed successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error importing and processing Excel data' });
  }
});

app.get('/exportDataProjet', (req, res) => {
  const q = "SELECT * FROM t_projet";
  db.query(q, function (err, rows) {
    if (err) {
      return res.status(500).json({ error: 'Error querying the database' });
    }
    const sheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, sheet, "t_projet");
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });
    res.setHeader('Content-Disposition', 'attachment; filename=projets.xlsx');
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.send(excelBuffer);
  });
});

app.get("/getProjet", (_request,_response) => {
  const q = "SELECT * FROM t_projet";
  db.query(q, (err, data) => {
    if (err) return _response.json(err);
    return _response.json(data)
    })
});

app.post("/addProjet", (_request,_response) => {
  const q = "INSERT INTO t_projet(`NOM`) VALUES (?)";
  const values = [
      _request.body.NOM,
    ];
  db.query(q, [values],(err, data) => {
      if (err) return _response.json(err);
      return _response.json("Projet est ajouté avec succès !");
  });
});

app.delete("/deleteProjet/:id", (_request, _response) => {
  const projetId = _request.params.id;

  const deleteProcessusProjetQuery = "DELETE FROM t_processus_projet WHERE PROJET_ID = ?";

  const deleteEmployeProcessusQuery = "DELETE FROM t_employe_processus WHERE PROCESSUS_ID IN (SELECT ID FROM t_processus WHERE PROJET_ID = ?)";

  const deleteProcessusQuery = "DELETE FROM t_processus WHERE PROJET_ID = ?";

  const deleteProjetQuery = "DELETE FROM t_projet WHERE ID = ?";
  db.query(deleteProcessusProjetQuery, [projetId], (err, processusProjetData) => {
    if (err) {
      return _response.json(err);
    }

    db.query(deleteEmployeProcessusQuery, [projetId], (err, employeProcessusData) => {
      if (err) {
        return _response.json(err);
      }

      db.query(deleteProcessusQuery, [projetId], (err, processusData) => {
        if (err) {
          return _response.json(err);
        }

        db.query(deleteProjetQuery, [projetId], (err, projetData) => {
          if (err) {
            return _response.json(err);
          }
          return _response.json("Projet et liaisons dans les tables liées supprimés avec succès !");
        });
      });
    });
  });
});


app.put("/updateProjet/:id", (_request, _response) => {
  const projetId = _request.params.id;
  const q = "UPDATE t_projet SET `NOM`=? WHERE ID = ?";

  const values = [
    _request.body.NOM,
  ];
  db.query(q, [...values,projetId], (err, data) => {
    if (err) return _response.json(err);
    return _response.json("Projet est mis à jour avec succès !");
  });
});

app.get('/exportDataProcessus', (req, res) => {
  const q = "SELECT * FROM t_processus";
  db.query(q, function (err, rows) {
    if (err) {
      return res.status(500).json({ error: 'Error querying the database' });
    }
    const sheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, sheet, "t_processus");
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });
    res.setHeader('Content-Disposition', 'attachment; filename=processus.xlsx');
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.send(excelBuffer);
  });
});

app.get("/getProcessus", (_request, _response) => {
  const q = "SELECT p.*, pr.NOM AS PROJET_NOM FROM t_processus p LEFT JOIN t_projet pr ON p.PROJET_ID = pr.ID";
  db.query(q, (err, data) => {
    if (err) return _response.json(err);
    return _response.json(data);
  });
});


app.post('/addProcessus/:projectId/', (req, res) => {
  const projectId = req.params.projectId;
  const { name } = req.body;
  const { mat } = req.body;
  const qInsertProcessus = 'INSERT INTO t_processus (`MAT`,`NOM`, `PROJET_ID`) VALUES (?, ?, ?)';
  db.query(qInsertProcessus, [mat,name, projectId], (err, result) => {
    if (err) {
      console.error('Erreur lors de l\'ajout du processus :', err);
      return res.status(500).json(err);
    }
    const newProcessId = result.insertId;
    const qInsertProcessusProjet = 'INSERT INTO t_processus_projet (`PROCESSUS_ID`, `PROJET_ID`) VALUES (?, ?)';
    db.query(qInsertProcessusProjet, [newProcessId, projectId], (err, result) => {
      if (err) {
        console.error('Erreur lors de l\'ajout de la relation processus-projet :', err);
        return res.status(500).json(err);
      }
      res.json({ message: 'Le processus a été ajouté avec succès.', projectId, name, mat });
    });
  });
});

app.delete("/deleteProcessus/:id", (_request, _response) => {
  const processusId = _request.params.id;

  const deleteEmployeProcessusQuery = "DELETE FROM t_employe_processus WHERE PROCESSUS_ID = ?";

  const deleteProcessusProjetQuery = "DELETE FROM t_processus_projet WHERE PROCESSUS_ID = ?";

  const deleteProcessusQuery = "DELETE FROM t_processus WHERE ID = ?";

  db.query(deleteEmployeProcessusQuery, [processusId], (err, employeProcessusData) => {
    if (err) {
      return _response.json(err);
    }

    db.query(deleteProcessusProjetQuery, [processusId], (err, processusProjetData) => {
      if (err) {
        return _response.json(err);
      }

      db.query(deleteProcessusQuery, [processusId], (err, processusData) => {
        if (err) {
          return _response.json(err);
        }
        return _response.json("Processus et liaisons dans les tables liées supprimés avec succès !");
      });
    });
  });
});

app.put("/updateProcessus/:id", (_request, _response) => {
  const processusId = _request.params.id;
  const q = "UPDATE t_processus SET `MAT`=?,`NOM`=? WHERE ID = ?";

  const values = [
    _request.body.MAT,
    _request.body.NOM,
  ];
  db.query(q, [...values,processusId], (err, data) => {
    if (err) return _response.json(err);
    return _response.json("Processus est mis à jour avec succès !");
  });
});


const uploadPr = multer({ dest: 'uploadPr/' });

function importDataProcessus(filePath, projetId) {
  const workbook = XLSX.readFile(filePath, { type: 'binary' });
  const sheetName = workbook.SheetNames[0];
  workbook.SheetNames.forEach(function (sheetName) {
    var XL_row_object = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
    var json_object = JSON.stringify(XL_row_object);
    var obj = JSON.parse(json_object);
    for (let i = 0; i < obj.length; i++) {
      const matDeProjet = obj[i]['MAT'];
      const nomDeProjet = obj[i]['NOM'];
      const query = "INSERT INTO t_processus (`MAT`,`NOM`, `PROJET_ID`) VALUES (?, ?, ?)";
      db.query(query, [matDeProjet,nomDeProjet, projetId], (err, results) => {
        if (err) {
          console.error('Erreur lors de l\'insertion dans la base de données:', err);
        } else {
          console.log('Données insérées avec succès dans la base de données');

          // Après l'insertion dans t_processus, insérer également dans t_processus_projet
          const newProcessId = results.insertId;
          const qInsertProcessusProjet = 'INSERT INTO t_processus_projet (PROCESSUS_ID, PROJET_ID) VALUES (?, ?)';
          db.query(qInsertProcessusProjet, [newProcessId, projetId], (err, result) => {
            if (err) {
              console.error('Erreur lors de l\'ajout de la relation processus-projet :', err);
            } else {
              console.log('Relation processus-projet ajoutée avec succès');
            }
          });
        }
      });
    }
  });
}


app.post('/importDataProcessus', uploadPr.single('excelFile'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  const filePath = req.file.path;
  const projetId = req.query.projet; 
  try {
    // Vérifier d'abord si le projet existe dans la table t_projet
    const checkProjetQuery = "SELECT * FROM t_projet WHERE ID = ?";
    db.query(checkProjetQuery, [projetId], (err, results) => {
      if (err || results.length === 0) {
        return res.status(404).json({ error: 'Le projet sélectionné n\'existe pas' });
      }

      // Si le projet existe, importer les données de processus
      importDataProcessus(filePath, projetId); 
      res.json({ message: 'Excel data imported and processed successfully' });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error importing and processing Excel data' });
  }
});


app.post('/polyvalence', (req, res) => {
  const { employeId, processusId, polyvalence } = req.body;
  db.query(
    'INSERT INTO t_employe_processus (POLYVALENCE, EMPLOYE_ID, PROCESSUS_ID) VALUES (?, ?, ?)',
    [polyvalence, employeId, processusId],
    (err, result) => {
      if (err) {
        res.status(500).send({ error: 'Erreur lors de l\'enregistrement de la polyvalence' });
      } else {
        res.status(201).send({ message: 'Polyvalence enregistrée avec succès' });
      }
    }
  );
});

app.get('/processusDuProjet', (req, res) => {
  const projetSelectionne = req.query.projet;

  const query = `
    SELECT p.ID, p.NOM
    FROM t_processus p
    JOIN t_processus_projet pp ON p.ID = pp.PROCESSUS_ID
    JOIN t_projet pr ON pp.PROJET_ID = pr.ID
    WHERE pr.NOM = ?
  `;

  db.query(query, [projetSelectionne], (err, results) => {
    if (err) {
      console.error('Erreur lors de la récupération des processus du projet :', err);
      res.status(500).json({ error: 'Erreur lors de la récupération des processus du projet' });
      return;
    }
    res.json(results); 
  });
});

app.get('/donneesMat', (req, res) => {
  const projetSelectionne = req.query.projet; 

  
  const query = `
    SELECT e.NOM AS nomEmploye, p.NOM AS nomProcessus, ep.POLYVALENCE
    FROM t_employe e
    JOIN t_employe_processus ep ON e.ID = ep.EMPLOYE_ID
    JOIN t_processus p ON ep.PROCESSUS_ID = p.ID
    ${projetSelectionne ? 'JOIN t_processus_projet pp ON p.ID = pp.PROCESSUS_ID' : ''}
    ${projetSelectionne ? 'JOIN t_projet pr ON pp.PROJET_ID = pr.ID' : ''}
    ${projetSelectionne ? `WHERE pr.NOM = '${projetSelectionne}'` : ''}
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Erreur lors de la récupération des données :', err);
      res.status(500).json({ error: 'Erreur lors de la récupération des données' });
      return;
    }
    res.json(results); 
  });
});

app.listen(3300, () => {
    console.log("Connecté au backend");
})
