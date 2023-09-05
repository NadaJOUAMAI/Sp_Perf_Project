import React, { useState, useEffect, useCallback } from 'react';
import './sp_matrice.css';
import BackButton from '../components/BackButton';

const SpMatrice = () => {
  const [donnees, setDonnees] = useState([]);
  const [projets, setProjets] = useState([]);
  const [projetSelectionne, setProjetSelectionne] = useState('');
  const [originalDonnees, setOriginalDonnees] = useState([]);
  const [searchColumns, setSearchColumns] = useState({
    nomEmploye: '',
    nomProcessus: '',
    POLYVALENCE: '',
  });

  const fetchProjets = async () => {
    try {
      const response = await fetch('http://localhost:3300/getProjet');
      const data = await response.json();
      setProjets(data);
    } catch (error) {
      console.error('Erreur lors de la récupération des projets :', error);
    }
  };

  const fetchDonnees = useCallback(async () => {
    try {
      const response = await fetch(`http://localhost:3300/donneesMat?projet=${projetSelectionne}`);
      const data = await response.json();
      setDonnees(data);
      if (originalDonnees.length === 0) {
        setOriginalDonnees(data);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des données :', error);
    }
  }, [projetSelectionne, originalDonnees.length]);

  useEffect(() => {
    fetchProjets();
    fetchDonnees();
  }, [fetchDonnees]);

  const handleProjetChange = (event) => {
    setProjetSelectionne(event.target.value);
  };

  const handleSearch = (event, columnName) => {
    const { value } = event.target;
    setSearchColumns((prevState) => ({
      ...prevState,
      [columnName]: value.toLowerCase(),
    }));
  };

  useEffect(() => {
    let filteredData = originalDonnees;

    if (searchColumns.nomEmploye) {
      filteredData = filteredData.filter((item) =>
        item.nomEmploye.toLowerCase().includes(searchColumns.nomEmploye)
      );
    }
    if (searchColumns.nomProcessus) {
      filteredData = filteredData.filter((item) =>
        item.nomProcessus.toLowerCase().includes(searchColumns.nomProcessus)
      );
    }
    if (searchColumns.POLYVALENCE) {
      filteredData = filteredData.filter((item) =>
        item.POLYVALENCE.toString() === searchColumns.POLYVALENCE
      );
    }

    setDonnees(filteredData);
  }, [searchColumns, originalDonnees]);

  return (
    <div className="containerM">
      <div className="back-button-container">
        <BackButton />
      </div>
      <div className="table-wrapper">
        <select id="projetSelect" value={projetSelectionne} onChange={handleProjetChange}>
          <option value="">Tous les projets</option>
          {projets.map((projet) => (
            <option key={projet.ID} value={projet.NOM}>
              {projet.NOM}
            </option>
          ))}
        </select>
      </div>
      <table className="table">
        <thead>
          <tr>
            <th>
              <div className="search-input-wrapper">
                <br />
                <span>Nom de l'employé</span>
                <br />
                <input
                  type="text"
                  placeholder='Rechercher'
                  onChange={(e) => handleSearch(e, 'nomEmploye')}
                />
              </div>
            </th>
            <th>
              <div className="search-input-wrapper">
                <br />
                <span>Nom du processus</span>
                <br />
                <input
                  type="text"
                  placeholder='Rechercher'
                  onChange={(e) => handleSearch(e, 'nomProcessus')}
                />
              </div>
            </th>
            <th>
              <div className="search-input-wrapper">
                <br />
                <span>Polyvalence</span>
                <br />
                <input
                  type="number"
                  placeholder='Rechercher'
                  onChange={(e) => handleSearch(e, 'POLYVALENCE')}
                />
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          {donnees.map((item, index) => (
            <tr key={index}>
              <td>{item.nomEmploye}</td>
              <td>{item.nomProcessus}</td>
              <td>{item.POLYVALENCE}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SpMatrice;
