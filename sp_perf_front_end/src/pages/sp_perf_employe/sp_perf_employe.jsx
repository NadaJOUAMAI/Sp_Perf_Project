import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BsFillTrashFill, BsFillPencilFill } from 'react-icons/bs';
import Modal from 'react-modal';
import './sp_perf_employe.css';
import BackButton from '../components/BackButton'; 


const SpPerfEmploye = () => {
  const [employe, setEmploye] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false); 
  const [selectedEmploye, setSelectedEmploye] = useState(null);
  const [newEmployeMat, setNewEmployeMat] = useState(0);
  const [newEmployeName, setNewEmployeName] = useState('');
  const [newEmployeDateEntree, setNewEmployeDateEntree] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    fetchData();
  }, [employe]);

  const fetchData = async () => {
    try {
      const result = await axios.get('http://localhost:3300/getEmploye');
      setEmploye(result.data);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteEmploye = async (id) => {
    try {
      await axios.delete(`http://localhost:3300/deleteEmploye/${id}`);
      setEmploye(employe.filter((employee) => employee.ID !== id));
    } catch (error) {
      console.log(error);
    }
  };

  const openModal = (employee) => {
    setSelectedEmploye(employee);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const updateEmploye = async () => {
    try {
      await axios.put(`http://localhost:3300/updateEmploye/${selectedEmploye.ID}`, selectedEmploye);
      setEmploye((prevEmployees) =>
        prevEmployees.map((employee) =>
          employee.ID === selectedEmploye.ID ? selectedEmploye : employee
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
        .post('http://localhost:3300/importDataEmploye', formData, {
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

  const filteredEmployees = employe.filter((employee) => {
    const employeeName = employee.NOM.toLowerCase();
    return employeeName.includes(searchTerm.toLowerCase());
  });

  const exportData = async () => {
    try {
      const response = await axios.get('http://localhost:3300/exportDataEmploye', {
        responseType: 'blob', // Tell axios to expect a binary (blob) response
      });

      // Create a URL for the Blob response
      const url = window.URL.createObjectURL(new Blob([response.data]));
      // Create a temporary anchor element to trigger the download
      const a = document.createElement('a');
      a.href = url;
      a.download = 'employes.xlsx'; // Set the filename for the downloaded file
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
    setNewEmployeMat(0);
    setNewEmployeName('');
    setNewEmployeDateEntree('');
  };

  const addEmploye = async () => {
    try {
      const response = await axios.post('http://localhost:3300/addEmploye', {
        MAT:newEmployeMat,
        NOM: newEmployeName,
        DATE_ENTREE: newEmployeDateEntree,
      });
      console.log('Newly added employee:', response.data);

      handleAddModalClose(); 
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
            <input id="file-upload" type="file" accept=".xlsx, .xls" onChange={handleFileChange} style={{ marginRight: '12px' }}/>
            <button className="import-button" onClick={handleUpload} style={{ marginRight: '12px' }}>Importer un Excel</button>
            <button className="export-button" onClick={exportData}>
            Exporter en Excel
           </button>
        </div>
        <br />
        <div className="search-input">
          <input
            type="text"
            placeholder="Rechercher par nom d'employé"
            value={searchTerm}
            onChange={handleSearch}
          />
          <button className="add-button" onClick={handleAddModalOpen} style={{ marginTop: '9px' }}>
            Ajouter un employé
          </button>
        </div>
      </div>
      <div className="table-wrapper">
        <table className="table">
          <thead>
            <tr>
              <th>Matricule</th>
              <th>Nom et prénom</th>
              <th>Date d'entrée</th>  
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.map((employee) => (
              <tr key={employee.ID}>
                <td>{employee.MAT}</td>
                <td>{employee.NOM}</td>
                <td>{employee.DATE_ENTREE.substring(0, 10)}</td>
                <td>
                  <BsFillTrashFill className="action-icon" onClick={() => deleteEmploye(employee.ID)} />
                  <BsFillPencilFill className="action-icon" onClick={() => openModal(employee)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Modifier Employé"
        className="modal"
      >
        <h2>Modifier Employé</h2>
        {selectedEmploye && (
          <div>
            <label>Matricule</label>
            <input
              type="number" max={32767}
              value={selectedEmploye.MAT}
              onChange={(e) =>
                setSelectedEmploye((prevEmployee) => ({ ...prevEmployee, MAT: e.target.value }))
              }
            />
            <br />
            <label>Nom et prénom</label>
            <input
              type="text"
              value={selectedEmploye.NOM}
              onChange={(e) =>
                setSelectedEmploye((prevEmployee) => ({ ...prevEmployee, NOM: e.target.value }))
              }
            />
            <br />
            <label>Date d'entrée</label>
            <input
              type="text"
              value={selectedEmploye.DATE_ENTREE}
              onChange={(e) =>
                setSelectedEmploye((prevEmployee) => ({ ...prevEmployee, DATE_ENTREE: e.target.value }))
              }
            />
            <br />
            <button onClick={closeModal}>Fermer</button>
            <button onClick={updateEmploye}>Enregistrer</button>
          </div>
        )}
      </Modal>

      <Modal
        isOpen={isAddModalOpen}
        onRequestClose={handleAddModalClose}
        contentLabel="Ajouter Employé"
        className="modal"
      >
        <h2>Ajouter Employé</h2>
        <div>
        <label>Matricule</label>
          <input
            type="number" max={32767}
            value={newEmployeMat}
            onChange={(e) => setNewEmployeMat(e.target.value)}
          />
          <br />
          <label>Nom et prénom</label>
          <input
            type="text"
            value={newEmployeName}
            onChange={(e) => setNewEmployeName(e.target.value)}
          />
          <br />
          <label>Date d'entrée</label>
          <input
            type="date"
            value={newEmployeDateEntree}
            onChange={(e) => setNewEmployeDateEntree(e.target.value)}
          />
          <br />
          <button onClick={handleAddModalClose}>Fermer</button>
          <button onClick={addEmploye}>Enregistrer</button>
        </div>
      </Modal>
    </div>
  );
};

export default SpPerfEmploye;