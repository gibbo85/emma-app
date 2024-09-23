import React, { useEffect, useState } from 'react';
import contentfulClient from '../contentfulClient';
//import './pattern.css';

export default function Pattern() {
  const [patterns, setPatterns] = useState([]);

  useEffect(() => {
    const fetchPatterns = async () => {
      try {
        const response = await contentfulClient.getEntries({
          content_type: 'pattern',
          include: 2, // Fetch linked entries up to two levels deep
        });

        // Create a lookup table for all included entries
        const referencedEntries = response.includes?.Entry.reduce((acc, item) => {
          acc[item.sys.id] = item;
          return acc;
        }, {}) || {};

        // Map patterns with their instructions (which are references to Round)
        const mappedPatterns = response.items.map((item) => {
          const instructionsRefs = item.fields.instructions; // Array of references to Round
          const instructions = instructionsRefs?.map((ref) => referencedEntries[ref.sys.id]) || [];

          return {
            ...item,
            instructions,
          };
        });

        setPatterns(mappedPatterns);
      } catch (error) {
        console.error('Error fetching patterns:', error);
      }
    };

    fetchPatterns();
  }, []);

  return (
    <div className="pattern-container">
      <h1>Patterns</h1>
      {patterns.map((pattern) => (
        <div key={pattern.sys.id} className="pattern-item">
          <h2>{pattern.fields.displayName}</h2>
          <p>{pattern.fields.url}</p>
          {pattern.instructions.length > 0 && (
            <div className="instructions">
              <h3>Instructions</h3>
              {pattern.instructions.map((round) => (
                <div key={round.sys.id} className="round-item">
                  <h4>{round.fields.roundName}</h4>
                  <p>{round.fields.roundDescription}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}