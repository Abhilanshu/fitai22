export type MuscleGroup =
    | 'chest'
    | 'back'
    | 'shoulders'
    | 'biceps'
    | 'triceps'
    | 'abs'
    | 'quads'
    | 'hamstrings'
    | 'calves'
    | 'glutes'
    | 'cardio';

export const exerciseToMuscles: Record<string, MuscleGroup[]> = {
    // Basic
    'Squat': ['quads', 'glutes', 'hamstrings'],
    'Pushup': ['chest', 'triceps', 'shoulders', 'abs'],
    'Plank': ['abs', 'shoulders'],
    'Lunge': ['quads', 'glutes', 'hamstrings'],
    'Jumping Jacks': ['cardio', 'calves', 'shoulders'],
    'Glute Bridge': ['glutes', 'hamstrings'],
    'High Knees': ['cardio', 'abs', 'quads'],
    'Overhead Press': ['shoulders', 'triceps', 'abs'],

    // Gym / Weights
    'Bench Press': ['chest', 'triceps', 'shoulders'],
    'Deadlift': ['back', 'glutes', 'hamstrings'],
    'Pull-ups': ['back', 'biceps'],
    'Dumbbell Rows': ['back', 'biceps'],
    'Bicep Curls': ['biceps'],
    'Tricep Dips': ['triceps', 'shoulders'],
    'Leg Press': ['quads', 'glutes'],
    'Calf Raises': ['calves'],
    'Sit-ups': ['abs'],
    'Russian Twists': ['abs'],
    'Burpees': ['cardio', 'chest', 'legs', 'abs'] as any, // 'legs' maps to quads/hams usually
    'Mountain Climbers': ['cardio', 'abs', 'shoulders'],
    'Jump Rope': ['cardio', 'calves', 'shoulders'],
    'Sprints': ['cardio', 'quads', 'hamstrings'],
    'Box Jumps': ['cardio', 'quads', 'glutes', 'calves'],
    'Kettlebell Swings': ['glutes', 'hamstrings', 'shoulders', 'back']
};

export const muscleColors: Record<MuscleGroup, string> = {
    chest: '#f87171', // red-400
    back: '#fb923c', // orange-400
    shoulders: '#60a5fa', // blue-400
    biceps: '#a78bfa', // purple-400
    triceps: '#e879f9', // fuchsia-400
    abs: '#4ade80', // green-400
    quads: '#facc15', // yellow-400
    hamstrings: '#a3e635', // lime-400
    calves: '#2dd4bf', // teal-400
    glutes: '#f472b6', // pink-400
    cardio: '#94a3b8' // slate-400
};
