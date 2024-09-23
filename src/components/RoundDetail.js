import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import contentfulClient from '../contentfulClient';
import { saveProgress } from '../api/progressApi'; // Import saveProgress function
import '../css/RoundDetail.css'; // Ensure this CSS file is created
import { supabase } from '../supabaseClient'; // Import supabase client
import ProgressBar from './ProgressBar'; 
import Breadcrumbs from './Breadcrumbs';
import RoundCounter from './RoundCounter';

const RoundDetail = ({ isCounterOpen, toggleCounter }) => {
    const { patternName, step } = useParams();
    const navigate = useNavigate();
    const [rounds, setRounds] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(null);
    const [userId, setUserId] = useState(null);
    const [patternDisplayName, setPatternDisplayName] = useState('');

    useEffect(() => {
        const fetchUser = async () => {
            const { data: { user }, error } = await supabase.auth.getUser();
            if (error) {
                console.error('Error fetching user:', error);
            } else if (user) {
                setUserId(user.id); // Set the user ID
            }
        };

        fetchUser();
    }, []);

    useEffect(() => {
        const fetchPatternAndRounds = async () => {
            try {
                // Fetch pattern to get associated rounds
                const patternResponse = await contentfulClient.getEntries({
                    content_type: 'pattern',
                    'fields.url': patternName,
                });

                if (patternResponse.items.length > 0) {
                    const pattern = patternResponse.items[0];
                    setPatternDisplayName(pattern.fields.displayName);
                    const roundReferences = pattern.fields.instructions;

                    // Fetch rounds using the round references
                    const roundPromises = roundReferences.map(async (ref) => {
                        const roundResponse = await contentfulClient.getEntry(ref.sys.id);
                        return roundResponse;
                    });

                    const roundResponses = await Promise.all(roundPromises);
                    setRounds(roundResponses);

                    // Find current index
                    const index = roundResponses.findIndex(round => round.fields.step === parseInt(step, 10));
                    setCurrentIndex(index);
                }
            } catch (error) {
                console.error('Error fetching pattern and rounds:', error);
            }
        };

        fetchPatternAndRounds();
    }, [patternName, step]);

    const handleNext = async () => {
        if (currentIndex !== null && currentIndex < rounds.length - 1) {
            const nextIndex = currentIndex + 1;
            const nextStep = rounds[nextIndex].fields.step;

            // Save progress
            console.log(userId, patternName, nextStep)
            await saveProgress(userId, patternName, nextStep);

            // Navigate to next step
            navigate(`/${patternName}/${nextStep}`);
        } else if (currentIndex !== null && currentIndex === rounds.length - 1) {
            await saveProgress(userId, patternName, step);

            // Navigate to a completion screen after the last round
            navigate(`/${patternName}/complete`, { state: { patternDisplayName } });
        }
    };

    const handleBack = async () => {
        if (currentIndex !== null && currentIndex > 0) {
            const prevIndex = currentIndex - 1;
            const prevStep = rounds[prevIndex].fields.step;

            // Save progress
            await saveProgress(userId, patternName, prevStep);

            // Navigate to previous step
            navigate(`/${patternName}/${prevStep}`);
        }
    };

    if (rounds.length === 0 || currentIndex === null) {
        return <div>Loading...</div>;
    }

    const round = rounds[currentIndex];

    const totalSteps = rounds.length;

    const roundName = round.fields.roundName

    //const imageUrl = round.fields.image
   // ? `https:${round.fields.image.fields.file.url}` // Get full image URL
   // : 'https://via.placeholder.com/200';

   
    const breadcrumbs = [
      { name: 'Home', link: '/dashboard' },
      { name: patternDisplayName, link: `/${patternName}` },
      { name: roundName } // No link for the current page
    ];


    return (
        
            <div className="round-detail-container"> 

            <div className='breadcrumbs-container'>
            <Breadcrumbs breadcrumbs={breadcrumbs} />
            </div>

                {/*<img 
                className='round-detail-image'
                src={imageUrl}
                alt={round.fields.roundName || 'Round Image'}
                />*/}

                <div className='round-detail-content'>
                <h1 className='form_title'>{round.fields.roundName}</h1>
                <p>{round.fields.roundDescription}</p>
                </div>
            <div className='progress-container'>
            <ProgressBar currentStep={step} totalSteps={totalSteps} /> 
            </div>

            <div className="navigation-buttons">
                
                <button onClick={handleBack} className="back-button" disabled={currentIndex <= 0}> Back </button>
                <button onClick={handleNext} className="next-button">
                    {currentIndex === rounds.length - 1 ? 'Finish' : 'Next'}
                </button>
            </div>

        
        <RoundCounter  
          toggleCounter={toggleCounter} isCounterOpen={isCounterOpen}
        />
      



            </div>
        
    );
};

export default RoundDetail;