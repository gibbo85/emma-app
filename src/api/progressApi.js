import { supabase } from '../supabaseClient';

export const saveProgress = async (userId, patternName, currentStep, resetCompleted = false) => {
    try {
        // Check if a record exists for the given user and pattern
        const { data: existingRecord, error: fetchError } = await supabase
            .from('user_pattern_progress')
            .select('*')
            .eq('user_id', userId)
            .eq('pattern_id', patternName)
            .single();  // Expecting a single record

        if (fetchError && fetchError.code !== 'PGRST116') {
            // Handle errors other than "No rows found"
            throw fetchError;
        }

        if (existingRecord) {
            // Update existing record
            const { data, error } = await supabase
                .from('user_pattern_progress')
                .update({ 
                    current_step: currentStep, 
                    updated_at: new Date().toISOString(),
                    completed: resetCompleted ? false : existingRecord.completed // Reset completed if true
                })
                .eq('user_id', userId)
                .eq('pattern_id', patternName)
                
            if (error) throw error;
            return data;
        } else {
            // Insert new record
            const { data, error } = await supabase
                .from('user_pattern_progress')
                .insert({ 
                    user_id: userId, 
                    pattern_id: patternName, 
                    current_step: currentStep, 
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                    completed: false // Default to not completed on new insert
                });

            console.log('Insert data sent:', { 
                user_id: userId, 
                pattern_id: patternName, 
                current_step: currentStep, 
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                completed: false // Default to not completed on new insert
            });
            console.log('Insert response:', data);

            if (error) throw error;
            return data;
        }
    } catch (error) {
        console.error('Error saving progress:', error);
        return null;
    }
};


//api/progressApi.js
export const getProgress = async (userId, patternName) => {
    try {
        const { data, error, status } = await supabase
            .from('user_pattern_progress')
            .select('*')
            .eq('user_id', userId)
            .eq('pattern_id', patternName)
            .single();  // Expecting a single record
            //console.log(data)
        if (error) {
            if (status === 406) {  // 406 status is returned when no rows are found
                console.log('No progress record found for user and pattern');
                return null;
            } else {
                // Handle other errors
                throw error;
            }
        }

        return data;  // Return the progress data if found
        
    } catch (error) {
        console.error('Error fetching progress:', error);
        return null;  // Return null on error
    }
};