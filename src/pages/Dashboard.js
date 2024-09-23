import React, { useEffect, useState } from 'react';
import '../App.css';
import PatternList from '../components/PatternList';
import Breadcrumbs from '../components/Breadcrumbs';

export default function Dashboard() {

    const [patterns] = useState([]);

    const breadcrumbs = [
        { name: 'Home', link: '/dashboard' }
      ];

    return (
        <div className="layout2">

            <div className='breadcrumbs-container'>
            <Breadcrumbs breadcrumbs={breadcrumbs} />
            </div>

            <h1>My Projects</h1>
            <PatternList patterns={patterns} />
        </div>
    );
};