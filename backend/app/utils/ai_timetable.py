import os
from openai import OpenAI

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def generate_full_timetable(subject, hours, category, difficulty):
    prompt = f"""
You are an expert academic planner.

Create a realistic weekly study timetable (Monday to Sunday)
for the following course:

Subject: {subject}
Weekly hours available: {hours}
Subject type: {category}
Difficulty: {difficulty}

Rules:
- Limit daily study to max 1.5 hours
- Balance theory, practice, and revision
- Hard topics earlier in the week
- Light review or recap on weekends
- Avoid burnout
- Be realistic for a college student

Return output strictly in JSON with this structure:
{{
  "Monday": ["Task 1", "Task 2"],
  "Tuesday": ["Task 1"],
  ...
  "Sunday": ["Light revision / recap"]
}}
"""
    response = client.chat.completions.create(
        model="gpt-4.1-mini",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.6
    )

    return response.choices[0].message.content
