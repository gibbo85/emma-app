import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../supabaseClient'; 
import { useAuth } from '../AuthContext2'; 
import '../css/PatternComplete.css';
import Breadcrumbs from './Breadcrumbs';

const PatternComplete = () => {
    const navigate = useNavigate();
    const { patternName } = useParams(); // Assuming patternName is passed in the URL
    const { user } = useAuth(); // Get the current user from AuthContext
    const { state } = useLocation();
    const patternDisplayName = state?.patternDisplayName || '';
    

    useEffect(() => {
        const markPatternComplete = async () => {
            if (user) {
                try {
                    // Update the progress record to indicate completion
                    const { data, error } = await supabase
                        .from('user_pattern_progress')
                        .update({ 
                            completed: true, 
                            updated_at: new Date().toISOString() 
                        }) // Assuming 'completed' is a boolean column
                        .eq('user_id', user.id)
                        .eq('pattern_id', patternName);

                    if (error) throw error;

                    console.log('Pattern completion marked successfully:', data);

                } catch (error) {
                    console.error('Error updating pattern completion:', error);
                }
            } else {
                // Redirect to login if the user is not authenticated
                navigate('/login');
            }
        };

        markPatternComplete();
    }, [user, patternName, navigate]);

    const handleRestart = async () => {
        if (user) {
            try {
                // Delete the progress record from the database
                const { data, error } = await supabase
                    .from('user_pattern_progress')
                    .delete()
                    .eq('user_id', user.id)
                    .eq('pattern_id', patternName);

                if (error) throw error;

                console.log('Progress record deleted successfully:', data);

                // Navigate to the pattern detail page
                navigate(`/${patternName}`);
            } catch (error) {
                console.error('Error deleting pattern progress:', error);
            }
        } else {
            // Redirect to login if the user is not authenticated
            navigate('/login');
        }
    };
    
    const breadcrumbs = [
        { name: 'Home', link: '/dashboard' },
        { name: patternDisplayName, link: `/${patternName}` },
        { name: 'Complete' } // No link for the current page
      ];

    return (
        <div className='complete-container'>

            <div className='breadcrumbs-container'>
            <Breadcrumbs breadcrumbs={breadcrumbs} />
            </div>

        <div>
            <h1 className='form_title'>Congratulations!</h1>
            <p>You have completed {patternDisplayName}</p>
            <div className='complete-buttons'>
                <button className='complete-primary-button' onClick={() => navigate('/dashboard')}>Go to Dashboard</button>
                <button className='complete-secondary-button'onClick={handleRestart}>Restart Pattern</button>
            </div>
        </div>
        </div>
    );
};

export default PatternComplete;