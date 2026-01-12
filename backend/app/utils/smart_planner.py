def generate_smart_plan(subject, hours, category, difficulty):
    breakdown = {}
    tips = []

    if category == "theory":
        breakdown = {
            "Reading": round(hours * 0.5, 1),
            "Notes": round(hours * 0.3, 1),
            "Revision": round(hours * 0.2, 1),
        }
        tips.append("Understand concepts before memorizing.")

    elif category == "problem":
        breakdown = {
            "Concept Review": round(hours * 0.2, 1),
            "Practice": round(hours * 0.6, 1),
            "Revision": round(hours * 0.2, 1),
        }
        tips.append("Daily practice improves speed and accuracy.")

    elif category == "practical":
        breakdown = {
            "Learning": round(hours * 0.3, 1),
            "Hands-on": round(hours * 0.5, 1),
            "Debugging & Review": round(hours * 0.2, 1),
        }
        tips.append("Code more than you watch tutorials.")

    if difficulty == "hard":
        tips.append("Use shorter Pomodoro sessions.")
        tips.append("Add extra revision on weekends.")

    if difficulty == "easy":
        tips.append("Consistency matters more than extra hours.")

    daily = round(hours / 6, 1)

    return {
        "subject": subject,
        "weekly_hours": hours,
        "breakdown": breakdown,
        "daily_suggestion": f"{daily} hrs/day (Mon–Sat)",
        "tips": tips,
    }
