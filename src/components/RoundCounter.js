import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext2'; // Adjust the path as needed
import { useParams} from 'react-router-dom';
import { supabase } from '../supabaseClient'; // Adjust the path as needed

import '../css/RoundCounter.css'; // Make sure this file has styles for your component

// Import Font Awesome Icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons'; // Close icon

const RoundCounter = ({ isCounterOpen, toggleCounter }) => {
   
    const [roundCount, setRoundCount] = useState(0); // State to store the current round count
    const { user } = useAuth(); // Assuming you have user authentication
    const { patternName } = useParams();
    const [loading, setLoading] = useState(true); // State to track loading
    const [error, setError] = useState(null);

    // Fetch the initial round count from the database
  useEffect(() => {
    if (user && patternName) { // Ensure user and patternName are available
      const fetchRoundCount = async () => {
        try {
          const { data, error } = await supabase
            .from('user_pattern_progress')
            .select('round_count')
            .eq('user_id', user.id)
            .eq('pattern_id', patternName) // Use patternName to identify the pattern
            .single(); // Get the user's round count for the specific pattern

          if (error) throw error;
          setRoundCount(data?.round_count || 0); // Set the round count state
          setLoading(false);
        } catch (error) {
          setError('Error fetching round count');
          console.error('Error fetching round count:', error);
        }
      };

      fetchRoundCount();
    }
  }, [user, patternName]);

// Function to update round count in the database
const updateRoundCount = async (newCount) => {
    try {
      const { error } = await supabase
        .from('user_pattern_progress')
        .upsert(
          { 
            user_id: user.id, 
            pattern_id: patternName, // Use patternName as the identifier
            round_count: newCount,
          }, 
          { 
            onConflict: ['user_id', 'pattern_id'] // Ensure it updates instead of inserting a new row
          }
        );

      if (error) throw error;
    } catch (error) {
      setError('Error updating round count');
      console.error('Error updating round count:', error);
    }
  };


 // Increment the round count
 const handleIncrement = () => {
    const newCount = roundCount + 1;
    setRoundCount(newCount);
    updateRoundCount(newCount);
  };

  // Decrement the round count
  const handleDecrement = () => {
    if (roundCount > 0) { // Prevent negative count
      const newCount = roundCount - 1;
      setRoundCount(newCount);
     updateRoundCount(newCount);
    }
  };
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
    
  return (
    <div> 
    <nav className={`counter ${isCounterOpen ? 'open' : ''}`}>
      <div className="counter-header">
        <h2>Round Counter</h2>
    
        <button className="close-button" onClick={toggleCounter}>
          <FontAwesomeIcon icon={faTimes} />
        </button>

      </div>
      <div className="counter-content">
      <div className="counter-display">
          <button onClick={handleDecrement} className="counter-button2">-</button>
          <span className="counter-value">{roundCount}</span>
          <button onClick={handleIncrement} className="counter-button2">+</button>
        </div>
      </div>
    </nav>
    </div>
  );
};

export default RoundCounter;