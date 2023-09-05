import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BsFillTrashFill, BsFillPencilFill } from 'react-icons/bs';
import Modal from 'react-modal';
import './sp_perf_tous_processus.css';
import BackButton from '../components/BackButton';

const SpPerfTousProcessus = () => {
  const [processes, setProcesses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProcess, setSelectedProcess] = useState(null);

  useEffect(() => {
    fetchProcesses();
  }, []);

  const fetchProcesses = async () => {
    try {
      const result = await axios.get('http://localhost:3300/getProcessus');
      setProcesses(result.data);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteProcess = async (id) => {
    try {
      await axios.delete(`http://localhost:3300/deleteProcessus/${id}`);
      setProcesses(processes.filter((process) => process.ID !== id));
    } catch (error) {
      console.log(error);
    }
  };

  const openModal = (process) => {
    setSelectedProcess(process);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const updateProcess = async () => {
    try {
      await axios.put(`http://localhost:3300/updateProcessus/${selectedProcess.ID}`, selectedProcess);
      setProcesses((prevProcesses) =>
        prevProcesses.map((process) =>
          process.ID === selectedProcess.ID ? selectedProcess : process
        )
      );
      closeModal();
    } catch (error) {
      console.log(error);
    }
  };

  const filteredProcesses = processes.filter((process) => {
    const processName = process.NOM.toLowerCase();
    return processName.includes(searchTerm.toLowerCase());
  });

  return (
    <div className="container">
      <div className="back-button-container">
        <BackButton />
      </div>
      <div className="search-bar">
        <div className="search-input">
          <input
            type="text"
            placeholder="Rechercher par nom de processus"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
      </div>
      <div className="table-wrapper">
        <table className="table">
          <thead>
            <tr>
              <th>Matricule</th>
              <th>Nom du processus</th>
              <th>Nom du projet</th> {/* New column header */}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProcesses.map((process) => (
              <tr key={process.ID}>
                <td>{process.MAT}</td>
                <td>{process.NOM}</td>
                <td>{process.PROJET_NOM}</td> {/* New column for project name */}
                <td>
                  <BsFillTrashFill className="action-icon" onClick={() => deleteProcess(process.ID)} />
                  <BsFillPencilFill className="action-icon" onClick={() => openModal(process)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Modifier Processus"
        className="modal"
      >
        <h2>Modifier Processus</h2>
        {selectedProcess && (
          <div>
            <label>Matricule</label>
            <input
              type="text"
              value={selectedProcess.MAT}
              onChange={(e) =>
                setSelectedProcess((prevProcess) => ({ ...prevProcess, MAT: e.target.value }))
              }
            />
            <br />
            <label>Nom du processus</label>
            <input
              type="text"
              value={selectedProcess.NOM}
              onChange={(e) =>
                setSelectedProcess((prevProcess) => ({ ...prevProcess, NOM: e.target.value }))
              }
            />
            <br />
            <button onClick={closeModal}>Fermer</button>
            <button onClick={updateProcess}>Enregistrer</button>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default SpPerfTousProcessus;
