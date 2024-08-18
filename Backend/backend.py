from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import google.generativeai as genai
from google.ai.generativelanguage_v1beta.types import content
import os

genai.configure(api_key=os.environ["GEMINI_API_KEY"])

generation_config = {
  "temperature": 1,
  "top_p": 0.95,
  "top_k": 64,
  "max_output_tokens": 8192,
  "response_schema": content.Schema(
    type = content.Type.OBJECT,
    enum = [],
    required = ["weekly_schedule"],
    properties = {
      "weekly_schedule": content.Schema(
        type = content.Type.OBJECT,
        enum = [],
        required = ["days"],
        properties = {
          "days": content.Schema(
            type = content.Type.ARRAY,
            items = content.Schema(
              type = content.Type.OBJECT,
              enum = [],
              required = ["day_of_week", "wake_up_time", "bedtime", "schedule"],
              properties = {
                "day_of_week": content.Schema(
                  type = content.Type.STRING,
                  enum = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
                ),
                "wake_up_time": content.Schema(
                  type = content.Type.STRING,
                ),
                "bedtime": content.Schema(
                  type = content.Type.STRING,
                ),
                "schedule": content.Schema(
                  type = content.Type.ARRAY,
                  items = content.Schema(
                    type = content.Type.OBJECT,
                    enum = [],
                    required = ["time", "activity", "description", "goal"],
                    properties = {
                      "time": content.Schema(
                        type = content.Type.STRING,
                      ),
                      "activity": content.Schema(
                        type = content.Type.STRING,
                      ),
                      "description": content.Schema(
                        type = content.Type.STRING,
                      ),
                      "goal": content.Schema(
                        type = content.Type.STRING,
                      ),
                    },
                  ),
                ),
              },
            ),
          ),
        },
      ),
    },
  ),
  "response_mime_type": "application/json",
}

model = genai.GenerativeModel(
  model_name="gemini-1.5-pro",
  generation_config=generation_config,
  # safety_settings = Adjust safety settings
  # See https://ai.google.dev/gemini-api/docs/safety-settings
    system_instruction= """
You are tasked with generating a weekly schedule JSON for a user. The schedule should be structured as a 2D table where each row represents a time slot and each column represents a day of the week. The schedule should include daily essentials, user-specific goals, tasks, and activities. Additionally, ensure the schedule adheres to the following guidelines:

1. **Daily Structure**:
   - Include essential activities like waking up, breakfast, lunch, dinner, and bedtime.
   - Each day should have a wake-up time and bedtime that aligns with the user's preferences.
   - Work-related activities should only be scheduled during work hours, and no non-work activities should overlap with work hours.
   - Allow time for personal and social activities, especially during non-work hours.

2. **Time Slots**:
   - Activities should be assigned specific time slots in HH:MM format.
   - Each time slot should represent a logical duration for the activity (e.g., 30 minutes, 1 hour).
   - Ensure that no time slots overlap within a single day.

3. **Goals and Tasks**:
   - Each activity should be associated with a goal (e.g., "Daily Essentials," "Workout," "Expert in Codeforces").
   - Ensure that all user-defined tasks and goals are included and that they are appropriately spread out throughout the week.

4. **Weekly Overview**:
   - Each day of the week should have a schedule that includes at least one activity related to user-specific goals.
   - The schedule should be varied to avoid repetitive tasks being scheduled back-to-back unless necessary (e.g., daily workouts).
   - If the activity variation is set to "High", you can add creative and diverse activities to the schedule.
    """
)

chat_session = model.start_chat(
  history=[
  ]
)


app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

# Add a health check endpoint
@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy"})

@app.route('/schedule', methods=['POST'])
def post_endpoint():
    data = request.get_json()
    response = chat_session.send_message(json.dumps(data))

    return response.text

if __name__ == '__main__':
    app.run(debug=True)





