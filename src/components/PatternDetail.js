import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import contentfulClient from '../contentfulClient';
import { saveProgress, getProgress } from '../api/progressApi'; // Import the getProgress function
import { supabase } from '../supabaseClient';
import ProgressBar from './ProgressBar'; 
import Breadcrumbs from './Breadcrumbs';
import '../css/PatternDetail.css';

const PatternDetail = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const [pattern, setPattern] = useState(null);
    const [user, setUser] = useState(null);
    const [currentStep, setCurrentStep] = useState(null);
    const [completed, setCompleted] = useState(false);
    const [patternDisplayName, setPatternDisplayName] = useState('');

    useEffect(() => {
        // Fetch the authenticated user
        const fetchUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
        };

        fetchUser();

        const fetchPattern = async () => {
            try {
                const response = await contentfulClient.getEntries({
                    content_type: 'pattern',
                    'fields.url': slug,
                    include: 2 // Include references to instructions and rounds
                });
                if (response.items.length > 0) {
                    const fetchedPattern = response.items[0]; // Get the pattern from the response
                    setPattern(fetchedPattern);
                    setPatternDisplayName(fetchedPattern.fields.displayName);
                }
            } catch (error) {
                console.error('Error fetching pattern:', error);
            }
        };

        fetchPattern();
    }, [slug]);

    useEffect(() => {
        // Fetch the user's progress if the user and pattern are both available
        const fetchProgress = async () => {
            if (user && pattern) {
                const progress = await getProgress(user.id, pattern.fields.url);
                if (progress) {
                    setCurrentStep(progress.current_step);
                    setCompleted(progress.completed);
                }
            }
        };

        fetchProgress();
    }, [user, pattern]);

    const handleStart = async () => {
        if (pattern && pattern.fields.instructions && pattern.fields.instructions.length > 0) {
            const firstRound = pattern.fields.instructions[0];
            const step = firstRound.fields.step;

            try {
                // Ensure that user data is available before saving progress
                if (user) {
                    await saveProgress(user.id, slug, step, true); // Pass true to reset completed
                    setCompleted(false); // Update state to reflect the reset
                } else {
                    console.error('User is not authenticated');
                    return;
                }

                // Navigate to the first round of the pattern
                navigate(`/${pattern.fields.url}/${step}`);
            } catch (error) {
                console.error('Error saving progress:', error);
            }
        }
    };

    const handleContinue = () => {
        if (pattern && currentStep) {
            navigate(`/${pattern.fields.url}/${currentStep}`);
        }
    };

    if (!pattern) {
        return <div>Loading...</div>;
    }

    const imageUrl = pattern.fields.thumbnail
        ? `https:${pattern.fields.thumbnail.fields.file.url}`
        : 'https://via.placeholder.com/200';

    const totalSteps = pattern.fields.instructions ? pattern.fields.instructions.length : 0;
    //const PatternDisplayName = pattern.fields.displayName

    const breadcrumbs = [
        { name: 'Home', link: '/dashboard' },
        { name: patternDisplayName}
      ];

    return (
        <div className="layout2">
            <div className="pattern-detail-container">
            <div className='breadcrumbs-container'>
            <Breadcrumbs breadcrumbs={breadcrumbs} />
            </div>
                <img 
                    className='pattern-detail-image'
                    src={imageUrl}
                    alt={pattern.fields.displayName || 'Pattern Image'}
                />
                <div className='pattern-detail-content'>
                    <h1>{pattern.fields.displayName}</h1>
                    <p>{pattern.fields.description}</p>

                    {completed ? (
        <div className="completed-message">Pattern Completed</div>
    ) : currentStep > 0 ? (
        <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />
    ) : null}
                    <div className="button-container">
                        {completed ? (
                            <button onClick={handleStart} className="start-button">Restart</button>
                        ) : (
                            currentStep ? (
                                <button onClick={handleContinue} className="start-button">Continue</button>
                            ) : (
                                <button onClick={handleStart} className="start-button">Start</button>
                            )
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PatternDetail;