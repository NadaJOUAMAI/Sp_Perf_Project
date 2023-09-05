import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './sp_perf_processus.css';
import { Link } from 'react-router-dom';
import BackButton from '../components/BackButton';

function SpPerfProcessus() {
  const [projets, setProjets] = useState([]);
  const [selectedProject, setSelectedProject] = useState('');
  const [newProcessName, setNewProcessName] = useState('');
  const [newMatriculeNumber, setNewMatriculeNumber] = useState(0); // Set initial value to 0
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    fetchProjets();
  }, []);

  const fetchProjets = async () => {
    try {
      const response = await axios.get('http://localhost:3300/getProjet');
      setProjets(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddProcess = async () => {
    try {
      const response = await axios.post(`http://localhost:3300/addProcessus/${selectedProject}`, {
        name: newProcessName,
        mat: newMatriculeNumber, // Pass the matricule number
      });
      console.log('Nouveau processus ajouté:', response.data);

      setNewProcessName('');
      setNewMatriculeNumber(0); // Reset matricule number after adding the processus
    } catch (error) {
      console.log(error);
    }
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = () => {
    if (selectedFile && selectedProject) {
      const formData = new FormData();
      formData.append('excelFile', selectedFile);

      axios
        .post(`http://localhost:3300/importDataProcessus?projet=${selectedProject}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        .then((response) => {
          console.log(response.data);
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      console.log('Veuillez sélectionner un fichier et un projet');
    }
  };

  const exportData = async () => {
    try {
      const response = await axios.get('http://localhost:3300/exportDataProcessus', {
        responseType: 'blob', // Tell axios to expect a binary (blob) response
      });

      // Create a URL for the Blob response
      const url = window.URL.createObjectURL(new Blob([response.data]));
      // Create a temporary anchor element to trigger the download
      const a = document.createElement('a');
      a.href = url;
      a.download = 'processus.xlsx'; // Set the filename for the downloaded file
      document.body.appendChild(a);
      a.click(); // Trigger the click event on the anchor element
      document.body.removeChild(a); // Clean up after download
    } catch (error) {
      console.log(error);
    }
  };


  return (
    <div className="page-container">
      <div className="back-button-container">
        <BackButton />
      </div>
      <div className="container-processus">
        <h2 className="titre">La liste des projets</h2>
        <select value={selectedProject} onChange={(e) => setSelectedProject(e.target.value)}>
          <option value="">Sélectionner un projet</option>
          {projets.map((projet) => (
            <option key={projet.ID} value={projet.ID}>
              {projet.NOM}
            </option>
          ))}
        </select>
        {selectedProject && (
          <div className="addProcessContainer">
            <h2 className="titre">Le processus à ajouter</h2>
            <input
              type="number"
              value={newMatriculeNumber}
              onChange={(e) => setNewMatriculeNumber(Number(e.target.value))} // Parse the value to a number
              placeholder="Nombre de matricule"
            />
            <input
              type="text"
              value={newProcessName}
              onChange={(e) => setNewProcessName(e.target.value)}
              placeholder="Nom du processus"
            />
            <button onClick={handleAddProcess}>Ajouter</button>
          </div>
        )}

        {selectedProject && (
          <div className="file-import-section">
            <h2 className="titre">Les processus à ajouter</h2>
            <input
              id="file-upload-p"
              type="file"
              accept=".xlsx, .xls"
              onChange={handleFileChange}
              style={{ marginRight: '12px' }}
            />
            <button className="import-button" onClick={handleUpload} style={{ marginRight: '12px' }}>
              Importer un Excel
            </button>
            <button className="export-button" onClick={exportData}>Exporter en Excel</button>
          </div>
        )}

        <br />
        <Link to="/tous-processus" className="link-to-tous-processus">
          Voir tous les processus
        </Link>
      </div>
    </div>
  );
}

export default SpPerfProcessus;
