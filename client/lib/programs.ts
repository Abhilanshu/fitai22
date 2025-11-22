export interface Exercise {
    name: string;
    sets: string;
    video: string;
}

export interface DietItem {
    meal: string;
    food: string;
    calories: number;
}

export interface Program {
    id: string;
    title: string;
    description: string;
    videoId: string;
    color: string;
    isPremium: boolean;
    workoutPlan: {
        frequency: string;
        duration: string;
        exercises: Exercise[];
    };
    dietPlan: DietItem[];
}

export const programs: Program[] = [
    {
        id: 'weight-loss-hiit',
        title: 'Weight Loss & HIIT',
        description: 'Burn calories fast with high-intensity interval training designed to melt fat and boost endurance.',
        videoId: 'ml6cT4AZdqI',
        color: 'from-orange-500 to-red-600',
        isPremium: false,
        workoutPlan: {
            frequency: '5 days/week',
            duration: '30-45 mins',
            exercises: [
                { name: 'Burpees', sets: '3x15', video: 'https://www.youtube.com/results?search_query=how+to+do+burpees' },
                { name: 'Mountain Climbers', sets: '3x45s', video: 'https://www.youtube.com/results?search_query=mountain+climbers+exercise' },
                { name: 'Jump Rope', sets: '10 mins', video: 'https://www.youtube.com/results?search_query=jump+rope+workout' },
                { name: 'High Knees', sets: '3x30s', video: 'https://www.youtube.com/results?search_query=high+knees+exercise' },
            ]
        },
        dietPlan: [
            { meal: 'Breakfast', food: 'Oatmeal with berries and protein powder', calories: 350 },
            { meal: 'Lunch', food: 'Grilled chicken salad with vinaigrette', calories: 450 },
            { meal: 'Snack', food: 'Apple and almonds', calories: 200 },
            { meal: 'Dinner', food: 'Baked salmon with steamed broccoli', calories: 500 },
        ]
    },
    {
        id: 'muscle-building',
        title: 'Muscle Building',
        description: 'Build strength and definition with targeted resistance training for all major muscle groups.',
        videoId: 'UItWltVZZmE',
        color: 'from-blue-500 to-indigo-600',
        isPremium: false,
        workoutPlan: {
            frequency: '4 days/week',
            duration: '60 mins',
            exercises: [
                { name: 'Bench Press', sets: '4x8-10', video: 'https://www.youtube.com/results?search_query=bench+press+form' },
                { name: 'Squats', sets: '4x8-10', video: 'https://www.youtube.com/results?search_query=squat+form' },
                { name: 'Deadlifts', sets: '3x5', video: 'https://www.youtube.com/results?search_query=deadlift+form' },
                { name: 'Pull-ups', sets: '3xMax', video: 'https://www.youtube.com/results?search_query=pull+ups+form' },
            ]
        },
        dietPlan: [
            { meal: 'Breakfast', food: 'Scrambled eggs with toast and avocado', calories: 500 },
            { meal: 'Lunch', food: 'Turkey burger with sweet potato fries', calories: 600 },
            { meal: 'Snack', food: 'Greek yogurt with granola', calories: 300 },
            { meal: 'Dinner', food: 'Steak with roasted potatoes and asparagus', calories: 700 },
        ]
    },
    {
        id: 'yoga-flexibility',
        title: 'Yoga & Flexibility',
        description: 'Improve mobility, reduce stress, and enhance recovery with guided yoga flows.',
        videoId: 'sTANio_2E0Q',
        color: 'from-green-500 to-emerald-600',
        isPremium: false,
        workoutPlan: {
            frequency: 'Daily',
            duration: '20-30 mins',
            exercises: [
                { name: 'Sun Salutations', sets: '5 rounds', video: 'https://www.youtube.com/results?search_query=sun+salutation+yoga' },
                { name: 'Warrior Poses', sets: 'Hold 30s each', video: 'https://www.youtube.com/results?search_query=warrior+pose+yoga' },
                { name: 'Downward Dog', sets: 'Hold 1 min', video: 'https://www.youtube.com/results?search_query=downward+dog+yoga' },
            ]
        },
        dietPlan: [
            { meal: 'Breakfast', food: 'Green smoothie bowl', calories: 400 },
            { meal: 'Lunch', food: 'Quinoa salad with chickpeas', calories: 450 },
            { meal: 'Snack', food: 'Hummus and carrot sticks', calories: 200 },
            { meal: 'Dinner', food: 'Stir-fried tofu with vegetables', calories: 500 },
        ]
    },
    {
        id: 'advanced-shred',
        title: 'Advanced Shred (Premium)',
        description: 'Extreme fat loss protocol for experienced athletes. Includes advanced carb cycling diet.',
        videoId: 'jyVy8rD_C7Q',
        color: 'from-purple-600 to-pink-600',
        isPremium: true,
        workoutPlan: {
            frequency: '6 days/week',
            duration: '60-75 mins',
            exercises: [
                { name: 'Sprints', sets: '10x100m', video: 'https://www.youtube.com/results?search_query=sprinting+technique' },
                { name: 'Box Jumps', sets: '4x12', video: 'https://www.youtube.com/results?search_query=box+jumps' },
                { name: 'Kettlebell Swings', sets: '4x20', video: 'https://www.youtube.com/results?search_query=kettlebell+swings' },
            ]
        },
        dietPlan: [
            { meal: 'Breakfast', food: 'Egg whites and spinach', calories: 300 },
            { meal: 'Lunch', food: 'White fish and asparagus', calories: 400 },
            { meal: 'Snack', food: 'Protein shake', calories: 150 },
            { meal: 'Dinner', food: 'Chicken breast and green beans', calories: 400 },
        ]
    }
];
