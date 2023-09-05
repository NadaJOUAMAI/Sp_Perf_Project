import React from 'react';
import { Link } from 'react-router-dom';
import './sp_perf_pageAccueil.css';

const Accueil = () => {
  return (
    <div className="app-container">
      <header className="app-header">
        <div className="logo-container">
          <img src="./logoSP.png" alt="Company Logo" className="company-logo" />
        </div>
        <h1 className="app-title">Gestion de la Polyvalence des Employés</h1>
      </header>
      <main className="app-main">
        <p className="app-description">
          Bienvenue dans l'application de gestion de la polyvalence des employés.
          Ici, vous pouvez suivre les compétences et les attributions de vos employés.
        </p>
        <div className="app-features">
          <Link to="/employes" className="feature">
            <h2 className="feature-title">Gestion des employés</h2>
            <p className="feature-description">
              Ajoutez, modifiez et supprimez les employés.
            </p>
          </Link>
          <Link to="/processus" className="feature">
            <h2 className="feature-title">Gestion des processus</h2>
            <p className="feature-description">
              Suivez et gérez les processus de l'entreprise.
            </p>
          </Link>
          <Link to="/projets" className="feature">
            <h2 className="feature-title">Gestion des projets</h2>
            <p className="feature-description">
            Gérez efficacement les multiples projets de l'entreprise.
            </p>
          </Link>
          <Link to="/polyvalence" className="feature"> 
            <h2 className="feature-title">Gestion de la polyvalence</h2>
            <p className="feature-description">
              Suivez et gérez les compétences et la polyvalence des employés.
            </p>
          </Link>
        </div>
      </main>
      <footer className="app-footer">
        <p>Tous droits réservés &copy; 2023</p>
      </footer>
    </div>
  );
};

export default Accueil;
