from flask import Flask, request, jsonify
from flask_cors import CORS
import model

app = Flask(__name__)
CORS(app)

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()
    

    try:
        age = data['age']
        gender = data['gender']
        height = data['height']
        weight = data['weight']
        fitness_goal = data['fitness_goal']
        activity_level = data['activity_level']
        
        prediction = model.predict_plan(age, gender, height, weight, fitness_goal, activity_level)
        
        return jsonify(prediction)
    except Exception as e:
        return jsonify({'error': str(e)}), 400

if __name__ == '__main__':
    app.run(port=5001, debug=True)
