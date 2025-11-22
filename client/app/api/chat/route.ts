import { NextResponse } from 'next/server';

// Knowledge Base
const knowledgeBase = [
    {
        keywords: ['hello', 'hi', 'hey', 'greetings'],
        response: "Hello! I'm your FitAI assistant. I can help you with workout plans, nutrition advice, or motivation. What's on your mind?"
    },
    {
        keywords: ['weight loss', 'lose weight', 'fat loss', 'burn fat', 'slimming'],
        response: "For effective weight loss, aim for a calorie deficit of 300-500 calories below your TDEE. Combine this with high-intensity interval training (HIIT) and strength training to preserve muscle. Our 'Weight Loss & HIIT' program is perfect for this!"
    },
    {
        keywords: ['muscle', 'gain', 'build', 'hypertrophy', 'bulk'],
        response: "To build muscle, focus on progressive overload—gradually increasing weights or reps. Ensure you're consuming enough protein (1.6-2.2g per kg of bodyweight) and are in a slight calorie surplus. Compound lifts like squats and deadlifts are essential."
    },
    {
        keywords: ['diet', 'nutrition', 'food', 'eat', 'meal'],
        response: "Nutrition is 80% of the battle. Focus on whole, unprocessed foods. Prioritize lean proteins (chicken, fish, tofu), complex carbs (oats, quinoa, sweet potato), and healthy fats (avocado, nuts). Check your dashboard for a personalized meal plan!"
    },
    {
        keywords: ['squat', 'legs', 'quads'],
        response: "The squat is the king of leg exercises. Keep your chest up, back straight, and drive through your heels. Ensure your knees track over your toes but don't cave inward. Go to at least parallel depth for full activation."
    },
    {
        keywords: ['bench press', 'chest', 'push'],
        response: "For bench press, keep your feet planted, arch your back slightly, and retract your shoulder blades. Lower the bar to your mid-chest and press up explosively. Don't flair your elbows out too much to protect your shoulders."
    },
    {
        keywords: ['deadlift', 'back', 'pull'],
        response: "The deadlift targets your entire posterior chain. Keep the bar close to your shins, engage your lats, and hinge at the hips. Lift with your legs, not just your back. Keep your spine neutral throughout the movement."
    },
    {
        keywords: ['protein', 'macros'],
        response: "Protein is crucial for repair and growth. Good sources include eggs, chicken breast, greek yogurt, lentils, and whey protein. Aim for 20-30g per meal to maximize muscle protein synthesis."
    },
    {
        keywords: ['sleep', 'recovery', 'rest'],
        response: "Recovery is when the growth happens! Aim for 7-9 hours of quality sleep. Active recovery like walking or yoga on rest days can also help reduce soreness and improve blood flow."
    },
    {
        keywords: ['progress', 'track', 'log'],
        response: "You can track your progress directly in the Dashboard. Mark exercises as complete to see your daily progress bar fill up. Consistency is key!"
    },
    {
        keywords: ['motivation', 'tired', 'give up', 'hard'],
        response: "Remember why you started! Progress is rarely linear. Some days will be hard, but showing up on those days matters the most. You've got this! Take a rest day if you need it, but don't quit."
    },
    {
        keywords: ['features', 'app', 'website'],
        response: "This app offers AI-generated workout and diet plans, progress tracking, expert video programs, and this chat assistant! We're also working on community challenges and a recipe generator."
    }
];

export async function POST(req: Request) {
    try {
        const { message } = await req.json();
        const lowerMsg = message.toLowerCase();

        // Scoring System
        let bestMatch = { index: -1, score: 0 };

        knowledgeBase.forEach((entry, idx) => {
            let score = 0;
            entry.keywords.forEach(keyword => {
                if (lowerMsg.includes(keyword)) {
                    score += 1;
                }
            });
            if (score > bestMatch.score) {
                bestMatch = { index: idx, score: score };
            }
        });

        let reply = "I'm not sure about that specific topic yet. Try asking about workouts, specific exercises (like squats), nutrition, or weight loss tips!";

        if (bestMatch.score > 0) {
            reply = knowledgeBase[bestMatch.index].response;
        }

        return NextResponse.json({ reply });
    } catch (err: any) {
        console.error(err.message);
        return NextResponse.json({ msg: 'Server Error' }, { status: 500 });
    }
}
