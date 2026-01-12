import os
from openai import OpenAI

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def generate_ai_study_plan(subject, hours, category, difficulty):
    prompt = f"""
You are an expert study planner.

Create an optimized weekly study plan.

Subject: {subject}
Total weekly hours: {hours}
Subject type: {category}
Difficulty: {difficulty}

Requirements:
- Break time into activities
- Suggest daily schedule
- Give 3 productivity tips
- Keep response concise and structured
"""

    response = client.chat.completions.create(
        model="gpt-4.1-mini",
        messages=[
            {"role": "system", "content": "You are a helpful study planning assistant."},
            {"role": "user", "content": prompt}
        ],
        temperature=0.7
    )

    return response.choices[0].message.content
