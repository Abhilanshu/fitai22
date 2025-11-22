import numpy as np

def calculate_bmr(age, gender, height, weight):
    # Mifflin-St Jeor Equation
    if gender == 'male':
        return 10 * weight + 6.25 * height - 5 * age + 5
    else:
        return 10 * weight + 6.25 * height - 5 * age - 161

def get_activity_multiplier(activity_level):
    multipliers = {
        'sedentary': 1.2,
        'lightly_active': 1.375,
        'moderately_active': 1.55,
        'very_active': 1.725,
        'extra_active': 1.9
    }
    return multipliers.get(activity_level, 1.2)

def predict_plan(age, gender, height, weight, fitness_goal, activity_level):
    bmr = calculate_bmr(age, gender, height, weight)
    multiplier = get_activity_multiplier(activity_level)
    tdee = bmr * multiplier
    
    daily_calories = tdee
    
    if fitness_goal == 'weight_loss':
        daily_calories -= 500
    elif fitness_goal == 'muscle_gain':
        daily_calories += 500
        
    # Enhanced plan generation with YouTube links
    
    workout_plan = {}
    diet_plan = {}
    
    if fitness_goal == 'weight_loss':
        workout_plan = {
            'type': 'Cardio + HIIT',
            'frequency': '5 days/week',
            'duration': '45-60 mins',
            'exercises': [
                {'name': 'Burpees', 'sets': '3x15', 'video': 'https://www.youtube.com/results?search_query=how+to+do+burpees'},
                {'name': 'Mountain Climbers', 'sets': '3x45s', 'video': 'https://www.youtube.com/results?search_query=mountain+climbers+exercise'},
                {'name': 'Jump Rope', 'sets': '10 mins', 'video': 'https://www.youtube.com/results?search_query=jump+rope+workout'},
                {'name': 'High Knees', 'sets': '3x30s', 'video': 'https://www.youtube.com/results?search_query=high+knees+exercise'}
            ]
        }
        diet_plan = {
            'type': 'High Protein, Low Carbs',
            'meals': '3 main meals + 2 snacks',
            'description': 'Focus on lean proteins (chicken, fish, tofu) and leafy greens. Minimize sugar and refined carbs.'
        }
    elif fitness_goal == 'muscle_gain':
        workout_plan = {
            'type': 'Strength Training',
            'frequency': '5-6 days/week',
            'duration': '60-90 mins',
            'exercises': [
                {'name': 'Bench Press', 'sets': '4x8-12', 'video': 'https://www.youtube.com/results?search_query=bench+press+form'},
                {'name': 'Squats', 'sets': '4x8-12', 'video': 'https://www.youtube.com/results?search_query=barbell+squat+form'},
                {'name': 'Deadlifts', 'sets': '3x5-8', 'video': 'https://www.youtube.com/results?search_query=deadlift+form'},
                {'name': 'Overhead Press', 'sets': '3x8-12', 'video': 'https://www.youtube.com/results?search_query=overhead+press+form'}
            ]
        }
        diet_plan = {
            'type': 'High Protein, Moderate Carbs',
            'meals': '4-5 meals',
            'description': 'Eat in a surplus. Prioritize protein with every meal. Carbs around workouts.'
        }
    else:
        workout_plan = {
            'type': 'Balanced Mix',
            'frequency': '3-4 days/week',
            'duration': '45 mins',
            'exercises': [
                {'name': 'Push-ups', 'sets': '3x12', 'video': 'https://www.youtube.com/results?search_query=push+ups+form'},
                {'name': 'Lunges', 'sets': '3x12/leg', 'video': 'https://www.youtube.com/results?search_query=lunges+exercise'},
                {'name': 'Plank', 'sets': '3x60s', 'video': 'https://www.youtube.com/results?search_query=plank+exercise'},
                {'name': 'Bodyweight Squats', 'sets': '3x20', 'video': 'https://www.youtube.com/results?search_query=bodyweight+squats'}
            ]
        }
        diet_plan = {
            'type': 'Balanced Diet',
            'meals': '3 main meals',
            'description': 'Eat a variety of foods. Focus on whole grains, fruits, vegetables, and lean proteins.'
        }
        
    return {
        'daily_calories': round(daily_calories),
        'workout_plan': workout_plan,
        'diet_plan': diet_plan,
        'weekly_plan': 'Monday: Upper Body, Tuesday: Lower Body, Wednesday: Rest/Cardio, Thursday: Full Body, Friday: Active Recovery, Sat/Sun: Rest'
    }
