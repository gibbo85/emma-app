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
            <div className='dashboard-container'>
            <h1>Welcome Emma!</h1>
            <PatternList patterns={patterns} />
            </div>

        </div>
    );
};