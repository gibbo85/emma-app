import React from 'react';
import { Link } from 'react-router-dom';
import '../css/Breadcrumbs.css'; // Add CSS file for styling

const Breadcrumbs = ({ breadcrumbs }) => {
  return (
    <nav className="breadcrumbs">
      {breadcrumbs.map((breadcrumb, index) => (
        <span key={index} className="breadcrumb-item">
          {breadcrumb.link ? (
            <Link to={breadcrumb.link}>{breadcrumb.name}</Link>
          ) : (
            <span>{breadcrumb.name}</span>
          )}
          {index < breadcrumbs.length - 1 && <span className="breadcrumb-separator">/</span>}
        </span>
      ))}
    </nav>
  );
};

export default Breadcrumbs;