import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import contentfulClient from '../contentfulClient';
import { supabase } from '../supabaseClient';
import '../css/PatternList.css';

export default function PatternList() {
    const [patterns, setPatterns] = useState([]);
    const [userId, setUserId] = useState(null);
    const [completionStatus, setCompletionStatus] = useState({});
    const navigate = useNavigate();

    // Fetch User ID
    useEffect(() => {
        const fetchUserId = async () => {
            try {
                const { data: { user }, error } = await supabase.auth.getUser();
                if (error) {
                    console.error('Error fetching user:', error);
                } else if (user) {
                    setUserId(user.id);
                }
            } catch (error) {
                console.error('Error fetching user ID:', error);
            }
        };

        fetchUserId();
    }, []);

    // Fetch Patterns from Contentful and Completion Status from Supabase
    useEffect(() => {
        const fetchPatterns = async () => {
            try {
                const response = await contentfulClient.getEntries({
                    content_type: 'pattern',
                });
                setPatterns(response.items);

                if (userId) {
                    const patternsWithCompletionStatus = {};

                    for (const pattern of response.items) {
                        const { data: progressData, error } = await supabase
                            .from('user_pattern_progress')
                            .select('completed')
                            .eq('user_id', userId)
                            .eq('pattern_id', pattern.fields.url)
                            .single();

                        if (error && error.code !== 'PGRST116') {
                            console.error(`Error fetching progress for pattern ${pattern.fields.url}:`, error);
                        }

                        // Default to false if no data is found
                        patternsWithCompletionStatus[pattern.fields.url] = progressData?.completed || false;
                    }

                    setCompletionStatus(patternsWithCompletionStatus);
                }
            } catch (error) {
                console.error('Error fetching patterns:', error);
            }
        };

        fetchPatterns();
    }, [userId]);

    const handlePatternClick = async (pattern) => {navigate(`/${pattern.fields.url}`);}

    return (
        <div className="grid">
            {patterns.map((pattern) => {
                // Fetch the URL of the image (if it exists)
                const imageUrl = pattern.fields.thumbnail
                    ? `https:${pattern.fields.thumbnail.fields.file.url}` // Get full image URL
                    : 'https://via.placeholder.com/200'; // Fallback image if thumbnail doesn't exist

                return (
                    <div key={pattern.sys.id} className="pattern-item">
                        <button 
                            onClick={() => handlePatternClick(pattern)}
                            className={completionStatus[pattern.fields.url] ? 'completed' : ''}
                        >
                            <img 
                                src={imageUrl}
                                alt={pattern.fields.displayName || 'Pattern Image'}
                                className="pattern-image"
                            />
                            <h2 className="pattern-name">{pattern.fields.displayName}</h2>
                            {completionStatus[pattern.fields.url] && <span className="completed-label">Completed</span>}
                        </button>
                    </div>
                );
            })}
        </div>
    );
}