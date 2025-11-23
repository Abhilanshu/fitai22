const calculateBMR = (age, gender, height, weight) => {
    // Mifflin-St Jeor Equation
    if (gender === 'male') {
        return 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
        return 10 * weight + 6.25 * height - 5 * age - 161;
    }
};

const getActivityMultiplier = (activityLevel) => {
    const multipliers = {
        sedentary: 1.2,
        lightly_active: 1.375,
        moderately_active: 1.55,
        very_active: 1.725,
        extra_active: 1.9,
    };
    return multipliers[activityLevel] || 1.2;
};

const predictPlan = (age, gender, height, weight, fitnessGoal, activityLevel) => {
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
    let weeklyPlan = [];

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
            type: 'Indian Weight Loss (Calorie Deficit)',
            meals: [
                { name: 'Breakfast', calories: 350, protein: '15g', items: ['2 Moong Dal Chillas', 'Mint Chutney', '1 Boiled Egg / Tofu'] },
                { name: 'Lunch', calories: 450, protein: '20g', items: ['1 Multigrain Roti', '1 Bowl Dal Tadka (Less Oil)', 'Green Salad', 'Curd'] },
                { name: 'Snack', calories: 150, protein: '5g', items: ['Green Tea', 'Roasted Makhana / Chana'] },
                { name: 'Dinner', calories: 350, protein: '20g', items: ['Grilled Paneer / Chicken Salad', 'Vegetable Soup'] }
            ],
            description: 'A low-calorie, high-fiber Indian diet focused on fat loss while maintaining muscle.',
            estimated_cost: '₹3,000 - ₹4,500 / month'
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
            type: 'Indian Muscle Gain (High Protein)',
            meals: [
                { name: 'Breakfast', calories: 600, protein: '30g', items: ['4 Egg Whites + 2 Whole Eggs / Paneer Bhurji', '2 Toast', 'Banana Shake'] },
                { name: 'Lunch', calories: 800, protein: '35g', items: ['2 Rotis / Rice', 'Rajma / Chicken Curry', 'Sabzi', 'Curd'] },
                { name: 'Pre-Workout', calories: 300, protein: '5g', items: ['Banana', 'Black Coffee', 'Peanut Butter Toast'] },
                { name: 'Post-Workout', calories: 400, protein: '25g', items: ['Whey Protein / 6 Egg Whites', 'Fruit'] },
                { name: 'Dinner', calories: 600, protein: '30g', items: ['Soya Chunks / Chicken Breast', 'Rice / Roti', 'Salad'] }
            ],
            description: 'High calorie and protein-rich Indian diet to fuel muscle growth and recovery.',
            estimated_cost: '₹5,000 - ₹7,000 / month'
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
            type: 'Balanced Indian Maintenance',
            meals: [
                { name: 'Breakfast', calories: 400, protein: '15g', items: ['Poha / Upma with Peanuts', 'Milk / Tea'] },
                { name: 'Lunch', calories: 600, protein: '20g', items: ['Roti', 'Seasonal Vegetable', 'Dal', 'Salad'] },
                { name: 'Snack', calories: 200, protein: '5g', items: ['Fruit', 'Nuts'] },
                { name: 'Dinner', calories: 500, protein: '20g', items: ['Khichdi / Dalia', 'Curd'] }
            ],
            description: 'Balanced Indian meals to maintain current weight and energy levels.',
            estimated_cost: '₹3,000 - ₹4,000 / month'
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

module.exports = { predictPlan };
