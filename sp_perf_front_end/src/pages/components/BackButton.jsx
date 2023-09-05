import React from 'react';
import { useNavigate } from 'react-router-dom';

const BackButton = () => {
    const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };
  

  return (
    <button className="back-button" onClick={handleGoBack}>
      ← Retour
    </button>
  );
};

export default BackButton;
