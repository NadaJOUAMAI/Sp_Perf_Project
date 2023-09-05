import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BsFillTrashFill, BsFillPencilFill } from 'react-icons/bs';
import Modal from 'react-modal';
import './sp_perf_projet.css';
import BackButton from '../components/BackButton';

const SpPerfProjet = () => {
  const [projet, setProjet] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false); 
  const [selectedProjet, setSelectedProjet] = useState(null);
  const [newProjetName, setNewProjetName] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);



  useEffect(() => {
    fetchData();
  }, [projet]);

  const fetchData = async () => {
    try {
      const result = await axios.get('http://localhost:3300/getProjet');
      setProjet(result.data);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteProjet = async (id) => {
    try {
      await axios.delete(`http://localhost:3300/deleteProjet/${id}`);
      setProjet(projet.filter((projett) => projett.ID !== id));
    } catch (error) {
      console.log(error);
    }
  };

  const openModal = (projett) => {
    setSelectedProjet(projett);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const updateProjet = async () => {
    try {
      await axios.put(`http://localhost:3300/updateProjet/${selectedProjet.ID}`, selectedProjet);
      setProjet((prevProjetts) =>
        prevProjetts.map((projett) =>
          projett.ID === selectedProjet.ID ? selectedProjet : projett
        )
      );
      closeModal();
    } catch (error) {
      console.log(error);
    }
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = () => {
    if (selectedFile) {
      const formData = new FormData();
      formData.append('excelFile', selectedFile);

      axios
        .post('http://localhost:3300/importDataProjet', formData, {
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
    }
  };

  const filteredProjets = projet.filter((projett) => {
    const projetName = projett.NOM.toLowerCase();
    return projetName.includes(searchTerm.toLowerCase());
  });

  const exportData = async () => {
    try {
      const response = await axios.get('http://localhost:3300/exportDataProjet', {
        responseType: 'blob', // Tell axios to expect a binary (blob) response
      });

      // Create a URL for the Blob response
      const url = window.URL.createObjectURL(new Blob([response.data]));
      // Create a temporary anchor element to trigger the download
      const a = document.createElement('a');
      a.href = url;
      a.download = 'projets.xlsx'; // Set the filename for the downloaded file
      document.body.appendChild(a);
      a.click(); // Trigger the click event on the anchor element
      document.body.removeChild(a); // Clean up after download
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddModalOpen = () => {
    setIsAddModalOpen(true);
  };

  const handleAddModalClose = () => {
    setIsAddModalOpen(false);
    setNewProjetName(''); // Reset the newProjetName state when the modal is closed
  };

  const addProjet = async () => {
    try {
      const response = await axios.post('http://localhost:3300/addProjet', {
        NOM: newProjetName,
        // Any other properties you want to add to the new project
      });

      // If the server responds with the newly created project data, you can handle it here
      console.log('Newly added project:', response.data);

      handleAddModalClose(); // Close the modal after successfully adding the project
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="container">
      <div className="back-button-container">
        <BackButton />
      </div>
      <div className="search-bar">
        <div className="file-import">
        <input id="file-upload" type="file" accept=".xlsx, .xls" onChange={handleFileChange} name="excelFile" style={{ marginRight: '12px' }}/>
          <button className="import-button" onClick={handleUpload} style={{ marginRight: '12px' }}>Importer un Excel</button>
          <button className="export-button" onClick={exportData}>
            Exporter en Excel
          </button>
        </div>
        <br />
        <div className="search-input">
          <input
            type="text"
            placeholder="Rechercher par nom de projet"
            value={searchTerm}
            onChange={handleSearch}
          />
          <button className="add-button" onClick={handleAddModalOpen} style={{ marginTop: '9px', marginRight: '23px' }}>
            Ajouter un projet
          </button>
        </div>
      </div>
      <div className="table-wrapper">
        <table className="table">
          <thead>
            <tr>
              <th>Nom du projet</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProjets.map((projett) => (
              <tr key={projett.ID}>
                <td>{projett.NOM}</td>
                <td>
                  <BsFillTrashFill className="action-icon" onClick={() => deleteProjet(projett.ID)} />
                  <BsFillPencilFill className="action-icon" onClick={() => openModal(projett)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Modifier Projet"
        className="modal"
      >
        <h2>Modifier Projet</h2>
        {selectedProjet && (
          <div>
            <label>Nom du projet</label>
            <input
              type="text"
              value={selectedProjet.NOM}
              onChange={(e) =>
                setSelectedProjet((prevProjett) => ({ ...prevProjett, NOM: e.target.value }))
              }
            />
            <br />
            <button onClick={closeModal}>Fermer</button>
            <button onClick={updateProjet}>Enregistrer</button>
          </div>
        )}
      </Modal>

      {/* Modal for adding a new project */}
      <Modal
        isOpen={isAddModalOpen}
        onRequestClose={handleAddModalClose}
        contentLabel="Ajouter Projet"
        className="modal"
      >
        <h2>Ajouter Projet</h2>
        <div>
          <label>Nom du projet</label>
          <input
            type="text"
            value={newProjetName}
            onChange={(e) => setNewProjetName(e.target.value)}
          />
          <br />
          <button onClick={handleAddModalClose}>Fermer</button>
          <button onClick={addProjet}>Enregistrer</button>
        </div>
      </Modal>
    </div>
  );
};

export default SpPerfProjet;
