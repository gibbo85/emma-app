// ProgressBar.js
import React from 'react';
import '../css/ProgressBar.css'; // Create a CSS file for styling

const ProgressBar = ({ currentStep, totalSteps }) => {
    const progressPercentage = (currentStep / totalSteps) * 100;

    return (
        <div className="progress-bar-container">
            <div
                className="progress-bar-fill"
                style={{ width: `${progressPercentage}%` }}
            ></div>
        </div>
    );
};

export default ProgressBar;