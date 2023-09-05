import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './sp_perf_polyvalence.css';
import BackButton from '../components/BackButton';
import { Link } from 'react-router-dom';

const SpPerfPolyvalence = () => {
  const [employes, setEmployes] = useState([]);
  const [processus, setProcessus] = useState([]);
  const [projets, setProjets] = useState([]);
  const [selectedEmploye, setSelectedEmploye] = useState('');
  const [selectedProcessus, setSelectedProcessus] = useState('');
  const [selectedProjet, setSelectedProjet] = useState('');
  const [polyvalence, setPolyvalence] = useState('');
  const [processusForSelectedProjet, setProcessusForSelectedProjet] = useState([]);
  const [alertMessage, setAlertMessage] = useState('');

  useEffect(() => {
    axios.get('http://localhost:3300/getEmploye')
      .then((response) => {
        setEmployes(response.data);
      })
      .catch((error) => {
        console.error(error);
      });

    axios.get('http://localhost:3300/getProcessus')
      .then((response) => {
        setProcessus(response.data);
      })
      .catch((error) => {
        console.error(error);
      });

    axios.get('http://localhost:3300/getProjet')
      .then((response) => {
        setProjets(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const handleEmployeChange = (event) => {
    setSelectedEmploye(event.target.value);
  };

  const handleProcessusChange = (event) => {
    setSelectedProcessus(event.target.value);
  };

  const handleProjetChange = (event) => {
    setSelectedProjet(event.target.value);

    const filteredProcessus = processus.filter((proc) => proc.PROJET_ID === parseInt(event.target.value));
    setProcessusForSelectedProjet(filteredProcessus);
  };

  const handlePolyvalenceChange = (event) => {
    setPolyvalence(event.target.value);
  };

  const showAlert = (message, type) => {
    setAlertMessage({ message, type });
    setTimeout(() => {
      setAlertMessage('');
    }, 3000); // Hide the alert after 3 seconds
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!selectedEmploye || !selectedProcessus || !selectedProjet || polyvalence === '') {
      showAlert('Veuillez remplir tous les champs obligatoires', 'error');
      return;
    }

    axios.post('http://localhost:3300/polyvalence', {
      employeId: selectedEmploye,
      processusId: selectedProcessus,
      projetId: selectedProjet,
      polyvalence: polyvalence
    })
      .then((response) => {
        console.log(response.data.message);
        setSelectedEmploye('');
        setSelectedProcessus('');
        setSelectedProjet('');
        setPolyvalence('');

        showAlert('Polyvalence enregistrée avec succès !', 'success');
      })
      .catch((error) => {
        console.error(error);
        showAlert('Une erreur s\'est produite lors de l\'enregistrement de la polyvalence.', 'error');
      });
  };

  return (
    <div className="containerpo">
      <div className="back-button-container">
        <BackButton />
      </div>
      <h2 className="header">Gestion de la polyvalence des employés</h2>
      <br />
      <form onSubmit={handleSubmit} className="form">
        <div className="input-group">
          <label className="label">Employé :</label>
          <select className="select" value={selectedEmploye} onChange={handleEmployeChange}>
            <option value="">Sélectionnez un employé</option>
            {employes.map((employe) => (
              <option key={employe.ID} value={employe.ID}>{employe.NOM}</option>
            ))}
          </select>
        </div>
        <div className="input-group">
          <label className="label">Projet :</label>
          <select className="select" value={selectedProjet} onChange={handleProjetChange}>
            <option value="">Sélectionnez un projet</option>
            {projets.map((projet) => (
              <option key={projet.ID} value={projet.ID}>{projet.NOM}</option>
            ))}
          </select>
        </div>
        <div className="input-group">
          <label className="label">Processus :</label>
          <select className="select" value={selectedProcessus} onChange={handleProcessusChange}>
            <option value="">Sélectionnez un processus</option>
            {processusForSelectedProjet.map((proc) => (
              <option key={proc.ID} value={proc.ID}>{proc.NOM}</option>
            ))}
          </select>
        </div>
        <div className="input-group">
          <label className="label">Degré de polyvalence :</label>
          <input className="input-number" type="number" placeholder='0, 1 ou 2' min={0} max={2}  value={polyvalence} onChange={handlePolyvalenceChange} />
        </div>
        <button type="submit" className="submit-button">Enregistrer</button>
      </form>
      <br />
      {alertMessage && (
        <div className={`alert ${alertMessage.type === 'success' ? 'alert-success' : 'alert-error'}`}>
          {alertMessage.message}
        </div>
      )}
      <Link to="/matrice" className="link-to-matrice">
        Voir toute la matrice
      </Link>
    </div>
  );
};

export default SpPerfPolyvalence;
