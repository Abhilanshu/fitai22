export const calculateBMR = (age: number, gender: string, height: number, weight: number) => {
    // Mifflin-St Jeor Equation
    if (gender === 'male') {
        return 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
        return 10 * weight + 6.25 * height - 5 * age - 161;
    }
};

export const getActivityMultiplier = (activityLevel: string) => {
    const multipliers: { [key: string]: number } = {
        sedentary: 1.2,
        lightly_active: 1.375,
        moderately_active: 1.55,
        very_active: 1.725,
        extra_active: 1.9,
    };
    return multipliers[activityLevel] || 1.2;
};

export const predictPlan = (age: number, gender: string, height: number, weight: number, fitnessGoal: string, activityLevel: string) => {
    const bmr = calculateBMR(age, gender, height, weight);
    const multiplier = getActivityMultiplier(activityLevel);
    const tdee = bmr * multiplier;

    let dailyCalories = tdee;

    if (fitnessGoal === 'weight_loss') {
        dailyCalories -= 500;
    } else if (fitnessGoal === 'muscle_gain') {
        dailyCalories += 500;
    }

    let workoutPlan = {};
    let dietPlan = {};
    let weeklyPlan: any[] = [];

    if (fitnessGoal === 'weight_loss') {
        workoutPlan = {
            type: 'High Intensity Fat Burn',
            frequency: '5 days/week',
            duration: '45-60 mins',
            exercises: [
                { name: 'Jumping Jacks', sets: '3x50', video: 'https://www.youtube.com/watch?v=iSSAk4XCsRA' },
                { name: 'Burpees', sets: '3x15', video: 'https://www.youtube.com/watch?v=auBLP4yGery' },
                { name: 'Mountain Climbers', sets: '3x45s', video: 'https://www.youtube.com/watch?v=nmwgirgXJQM' },
                { name: 'High Knees', sets: '3x30s', video: 'https://www.youtube.com/watch?v=Z11_8x_19mw' },
                { name: 'Jump Squats', sets: '3x15', video: 'https://www.youtube.com/watch?v=Azl5tkCzDcc' },
                { name: 'Plank', sets: '3x60s', video: 'https://www.youtube.com/watch?v=ASdvN_XEl_c' },
                { name: 'Russian Twists', sets: '3x20', video: 'https://www.youtube.com/watch?v=wkD8rjkodUI' },
                { name: 'Push-ups', sets: '3x12', video: 'https://www.youtube.com/watch?v=IODxDxX7oi4' },
            ],
        };
        dietPlan = {
            type: 'Calorie Deficit & High Protein (Indian)',
            estimated_cost: '₹2000 - ₹2500 / week',
            meals: [
                { name: 'Breakfast', items: ['Moong Dal Chilla', 'Mint Chutney', '1 Boiled Egg'], calories: 350, protein: '18g' },
                { name: 'Lunch', items: ['2 Multigrain Roti', 'Palak Paneer (Low Oil)', 'Cucumber Salad'], calories: 550, protein: '25g' },
                { name: 'Snack', items: ['Roasted Chana', 'Buttermilk (Chaas)'], calories: 150, protein: '8g' },
                { name: 'Dinner', items: ['Grilled Chicken/Tofu Tikka', 'Dal Tadka', 'Brown Rice'], calories: 450, protein: '30g' }
            ],
            description: 'Focus on home-cooked Indian meals with less oil. High protein to preserve muscle.',
        };
        weeklyPlan = [
            { day: 'Monday', focus: 'Full Body HIIT', description: 'High intensity interval training to spike heart rate.' },
            { day: 'Tuesday', focus: 'Lower Body Strength', description: 'Squats, lunges, and leg focused movements.' },
            { day: 'Wednesday', focus: 'Active Recovery', description: 'Light yoga or a 30-minute brisk walk.' },
            { day: 'Thursday', focus: 'Upper Body & Core', description: 'Push-ups, planks, and arm exercises.' },
            { day: 'Friday', focus: 'Cardio Endurance', description: 'Longer duration steady-state cardio (run/cycle).' },
            { day: 'Saturday', focus: 'Full Body Circuit', description: 'Mix of strength and cardio exercises.' },
            { day: 'Sunday', focus: 'Rest Day', description: 'Complete rest to allow body to recover.' },
        ];
    } else if (fitnessGoal === 'muscle_gain') {
        workoutPlan = {
            type: 'Hypertrophy Strength Training',
            frequency: '5-6 days/week',
            duration: '60-90 mins',
            exercises: [
                { name: 'Barbell Squats', sets: '4x8-12', video: 'https://www.youtube.com/watch?v=SW_C1A-rejs' },
                { name: 'Bench Press', sets: '4x8-12', video: 'https://www.youtube.com/watch?v=rT7DgCr-3pg' },
                { name: 'Deadlifts', sets: '3x5-8', video: 'https://www.youtube.com/watch?v=op9kVnSso6Q' },
                { name: 'Overhead Press', sets: '3x8-12', video: 'https://www.youtube.com/watch?v=2yjwXTZQDDI' },
                { name: 'Pull-ups', sets: '3xAMRAP', video: 'https://www.youtube.com/watch?v=eGo4IYlbE5g' },
                { name: 'Dumbbell Rows', sets: '3x10-12', video: 'https://www.youtube.com/watch?v=roCP6wCXPqo' },
                { name: 'Lunges', sets: '3x12/leg', video: 'https://www.youtube.com/watch?v=QOVaHwm-Q6U' },
                { name: 'Bicep Curls', sets: '3x12-15', video: 'https://www.youtube.com/watch?v=ykJmrZ5v0Oo' },
            ],
        };
        dietPlan = {
            type: 'Calorie Surplus & High Protein (Indian)',
            estimated_cost: '₹3000 - ₹4000 / week',
            meals: [
                { name: 'Breakfast', items: ['Paneer Paratha (Less Oil)', 'Curd', 'Almonds'], calories: 600, protein: '25g' },
                { name: 'Snack', items: ['Banana Shake with Whey/Sattu'], calories: 300, protein: '25g' },
                { name: 'Lunch', items: ['Rajma Masala', 'Jeera Rice', 'Chicken/Soya Chunks Stir Fry'], calories: 800, protein: '45g' },
                { name: 'Snack', items: ['Peanut Butter Toast', 'Boiled Eggs'], calories: 300, protein: '15g' },
                { name: 'Dinner', items: ['Fish Curry / Paneer Bhurji', '3 Chapati', 'Green Salad'], calories: 700, protein: '40g' }
            ],
            description: 'Eat big to get big. Prioritize protein-rich Indian curries and complex carbs.',
        };
        weeklyPlan = [
            { day: 'Monday', focus: 'Chest & Triceps', description: 'Heavy pushing movements.' },
            { day: 'Tuesday', focus: 'Back & Biceps', description: 'Pulling movements and vertical pulls.' },
            { day: 'Wednesday', focus: 'Legs & Shoulders', description: 'Squats and overhead pressing.' },
            { day: 'Thursday', focus: 'Rest', description: 'Eat well and sleep.' },
            { day: 'Friday', focus: 'Upper Body Hypertrophy', description: 'Higher reps for upper body muscles.' },
            { day: 'Saturday', focus: 'Lower Body Hypertrophy', description: 'Higher reps for legs and calves.' },
            { day: 'Sunday', focus: 'Rest', description: 'Complete recovery.' },
        ];
    } else {
        workoutPlan = {
            type: 'General Fitness & Toning',
            frequency: '3-4 days/week',
            duration: '45 mins',
            exercises: [
                { name: 'Push-ups', sets: '3x12', video: 'https://www.youtube.com/watch?v=IODxDxX7oi4' },
                { name: 'Bodyweight Squats', sets: '3x20', video: 'https://www.youtube.com/watch?v=m0GcZ24DK6k' },
                { name: 'Lunges', sets: '3x12/leg', video: 'https://www.youtube.com/watch?v=QOVaHwm-Q6U' },
                { name: 'Plank', sets: '3x60s', video: 'https://www.youtube.com/watch?v=ASdvN_XEl_c' },
                { name: 'Glute Bridges', sets: '3x15', video: 'https://www.youtube.com/watch?v=wPM8icPu6H8' },
                { name: 'Dumbbell Shoulder Press', sets: '3x12', video: 'https://www.youtube.com/watch?v=qEwK657kfLI' },
                { name: 'Lat Pulldowns', sets: '3x12', video: 'https://www.youtube.com/watch?v=CAwf7n6Luuc' },
            ],
        };
        dietPlan = {
            type: 'Balanced Indian Diet',
            estimated_cost: '₹1500 - ₹2000 / week',
            meals: [
                { name: 'Breakfast', items: ['Idli Sambar', 'Coconut Chutney'], calories: 350, protein: '10g' },
                { name: 'Lunch', items: ['Roti', 'Seasonal Sabzi', 'Dal', 'Curd'], calories: 500, protein: '20g' },
                { name: 'Dinner', items: ['Khichdi with Ghee', 'Roasted Papad'], calories: 450, protein: '12g' }
            ],
            description: 'Traditional home-cooked meals. Focus on portion control and consistency.',
        };
        weeklyPlan = [
            { day: 'Monday', focus: 'Full Body Strength', description: 'Compound movements for all muscle groups.' },
            { day: 'Tuesday', focus: 'Rest or Light Cardio', description: 'Walking or cycling.' },
            { day: 'Wednesday', focus: 'Core & Conditioning', description: 'Ab workouts and stamina building.' },
            { day: 'Thursday', focus: 'Rest', description: 'Recovery.' },
            { day: 'Friday', focus: 'Full Body Endurance', description: 'Higher reps, lower weight.' },
            { day: 'Saturday', focus: 'Active Fun', description: 'Hiking, sports, or swimming.' },
            { day: 'Sunday', focus: 'Rest', description: 'Relaxation.' },
        ];
    }

    return {
        daily_calories: Math.round(dailyCalories),
        workout_plan: workoutPlan,
        diet_plan: dietPlan,
        weekly_plan: weeklyPlan,
    };
};
