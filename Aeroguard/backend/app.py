import os
import json
import time
import random
import threading
from datetime import datetime
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import joblib
import numpy as np

app = Flask(__name__)
CORS(app)

BASE_DIR = os.path.dirname(__file__)
UPLOAD_FOLDER = os.path.join(BASE_DIR, 'uploads')
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
DB_FILE = os.path.join(BASE_DIR, 'database.json')
MODEL_PATH = os.path.join(BASE_DIR, 'model.pkl')

# Load Trained Isolation Forest Model
if os.path.exists(MODEL_PATH):
    ml_model = joblib.load(MODEL_PATH)
    print("AeroGuard ML Isolation Forest Model loaded successfully!")
else:
    ml_model = None
    print("Warning: model.pkl not found! Run 'python train_model.py' first.")

# Default Pre-configured Admin Accounts
DEFAULT_ADMINS = [
    {
        "id": "admin_prasanna",
        "username": "PrasannaAdmin",
        "password": "Brainspark_2816",
        "name": "Prasanna K",
        "regNo": "73152513701",
        "gmail": ["prasannakcse2529@ksrce.ac.in", "prasannakk2007@gmail.com"],
        "mobile": "7010661415",
        "college": "K.S.R. College of Engineering",
        "role": "admin",
        "avatar": ""
    },
    {
        "id": "admin_keerthi",
        "username": "KeerthiAdmin",
        "password": "Brainspark_2816",
        "name": "Keerthi V",
        "regNo": "73152513076",
        "gmail": ["keerthivcse25_29@ksrce.ac.in", "keerthivenkatesh208@gmail.com"],
        "mobile": "9922545462",
        "college": "K.S.R. College of Engineering",
        "role": "admin",
        "avatar": ""
    },
    {
        "id": "admin_karnika",
        "username": "KarnikaAdmin",
        "password": "Brainspark_2816",
        "name": "Karnika N",
        "regNo": "73152513067",
        "gmail": ["karnikancse25_29@ksrce.ac.in"],
        "mobile": "9344633198",
        "college": "K.S.R. College of Engineering",
        "role": "admin",
        "avatar": ""
    },
    {
        "id": "admin_poonkodi",
        "username": "PoonkodiAdmin",
        "password": "Brainspark_2816",
        "name": "Poonkodi E",
        "regNo": "73152513122",
        "gmail": ["poonkodiecse25_29@ksrce.ac.in"],
        "mobile": "9361407017",
        "college": "K.S.R. College of Engineering",
        "role": "admin",
        "avatar": ""
    }
]

def init_db():
    if not os.path.exists(DB_FILE):
        initial_data = {
            "users": DEFAULT_ADMINS,
            "incidents": [
                {
                    "id": "AG-1047",
                    "time": "14:32 PM",
                    "type": "Wind Speed Spike",
                    "riskLevel": "Critical",
                    "status": "Active",
                    "location": "Chennai Airspace",
                    "riskScore": 92,
                    "description": "Sudden increase in wind speed detected beyond safe threshold.",
                    "filedBy": "Prasanna K"
                },
                {
                    "id": "AG-1046",
                    "time": "13:50 PM",
                    "type": "Pressure Drop",
                    "riskLevel": "Warning",
                    "status": "Investigating",
                    "location": "Coimbatore Sector",
                    "riskScore": 68,
                    "description": "Rapid barometric pressure drop recorded in low-altitude telemetry.",
                    "filedBy": "Keerthi V"
                }
            ],
            "accidents": [
                {
                    "id": "AC-1001",
                    "date": "14 Jan 2025",
                    "flightNo": "AI-720",
                    "type": "Engine Failure",
                    "severity": "High",
                    "status": "Resolved",
                    "location": "Tiruchirappalli Airport",
                    "description": "Engine 1 flameout during climb phase due to thermal inversion.",
                    "filedBy": "Prasanna K"
                },
                {
                    "id": "AC-1002",
                    "date": "22 Nov 2024",
                    "flightNo": "SG-314",
                    "type": "Hard Landing",
                    "severity": "Critical",
                    "status": "Investigating",
                    "location": "Chennai International Airport",
                    "description": "Aircraft experienced hard landing due to sudden wind shear.",
                    "filedBy": "Keerthi V"
                }
            ],
            "tickets": []
        }
        with open(DB_FILE, 'w') as f:
            json.dump(initial_data, f, indent=4)

def read_db():
    init_db()
    with open(DB_FILE, 'r') as f:
        return json.load(f)

def write_db(data):
    with open(DB_FILE, 'w') as f:
        json.dump(data, f, indent=4)

# Live Background Telemetry Streaming Loop (Pre-seeded for instant graph)
telemetry_history = [
    {
        "temperature": round(random.uniform(25.0, 30.0), 1),
        "wind_speed": round(random.uniform(10.0, 16.0), 1),
        "visibility": round(random.uniform(8.0, 9.8), 1),
        "pressure": round(random.uniform(1011.0, 1015.0), 1),
        "risk_score": random.randint(10, 22),
        "anomaly": False,
        "timestamp": datetime.now().strftime("%H:%M:%S")
    }
    for _ in range(10)
]

current_telemetry = {
    "temperature": 28.4,
    "wind_speed": 14.2,
    "visibility": 8.7,
    "pressure": 1012.6,
    "risk_score": 12,
    "anomaly": False,
    "timestamp": datetime.now().strftime("%H:%M:%S")
}

def bg_telemetry_loop():
    global current_telemetry, telemetry_history
    while True:
        # Simulate realistic telemetry fluctuations
        is_spike = random.random() < 0.18 # 18% anomaly chance
        if is_spike:
            temp = round(random.uniform(37.5, 46.0), 1)
            wind = round(random.uniform(32.0, 54.0), 1)
            vis = round(random.uniform(0.3, 2.2), 1)
            press = round(random.uniform(972.0, 992.0), 1)
        else:
            temp = round(random.uniform(24.0, 31.0), 1)
            wind = round(random.uniform(8.0, 18.0), 1)
            vis = round(random.uniform(7.8, 10.0), 1)
            press = round(random.uniform(1010.0, 1016.0), 1)

        if ml_model:
            sample = np.array([[temp, wind, vis, press]])
            pred = ml_model.predict(sample)[0] # 1: Normal, -1: Anomaly
            scores = ml_model.decision_function(sample)[0]
            risk_score = min(100, max(5, int((0.15 - scores) * 220)))
            anomaly_detected = True if pred == -1 else False
        else:
            risk_score = random.randint(75, 95) if is_spike else random.randint(8, 22)
            anomaly_detected = is_spike

        current_telemetry = {
            "temperature": temp,
            "wind_speed": wind,
            "visibility": vis,
            "pressure": press,
            "risk_score": risk_score,
            "anomaly": anomaly_detected,
            "timestamp": datetime.now().strftime("%H:%M:%S")
        }

        telemetry_history.append(current_telemetry)
        if len(telemetry_history) > 25:
            telemetry_history.pop(0)

        time.sleep(3) # Live update cycle every 3s

threading.Thread(target=bg_telemetry_loop, daemon=True).start()

# API ROUTES

@app.route('/api/login', methods=['POST'])
def login():
    req = request.json or {}
    username = req.get('username', '').strip()
    password = req.get('password', '').strip()
    role_requested = req.get('role', 'user') # 'admin' or 'user'

    db = read_db()
    for user in db['users']:
        if (user.get('username') == username or username in user.get('gmail', [])) and user.get('password') == password:
            if role_requested == 'admin' and user.get('role') != 'admin':
                return jsonify({"error": "Unauthorized! Account is not an Admin."}), 403
            return jsonify({"message": "Login Successful", "user": user}), 200

    return jsonify({"error": "Invalid Username or Password!"}), 401

@app.route('/api/signup', methods=['POST'])
def signup():
    req = request.json or {}
    name = req.get('name', '').strip()
    email = req.get('email', '').strip()
    password = req.get('password', '').strip()

    if not name or not email or not password:
        return jsonify({"error": "All fields are required!"}), 400

    db = read_db()
    for u in db['users']:
        if u.get('username') == email or email in u.get('gmail', []):
            return jsonify({"error": "An account with this email already exists!"}), 400

    new_user = {
        "id": f"usr_{int(time.time())}",
        "username": email,
        "password": password,
        "name": name,
        "regNo": f"73152513{random.randint(100, 999)}",
        "gmail": [email],
        "mobile": "N/A",
        "college": "K.S.R. College of Engineering",
        "role": "user",
        "avatar": "",
        "created_at": datetime.now().strftime("%Y-%m-%d %H:%M")
    }

    db['users'].append(new_user)
    write_db(db)
    return jsonify({"message": "User registered successfully!", "user": new_user}), 201

@app.route('/api/users', methods=['GET'])
def get_users():
    db = read_db()
    return jsonify(db['users']), 200

@app.route('/api/users/promote', methods=['POST'])
def promote_user():
    req = request.json or {}
    user_id = req.get('userId')
    db = read_db()
    for u in db['users']:
        if u['id'] == user_id:
            u['role'] = 'admin'
            write_db(db)
            return jsonify({"message": f"{u['name']} has been promoted to Admin!"}), 200
    return jsonify({"error": "User not found!"}), 404

@app.route('/api/telemetry', methods=['GET'])
def get_telemetry():
    return jsonify(current_telemetry), 200

@app.route('/api/telemetry/history', methods=['GET'])
def get_telemetry_history():
    return jsonify(telemetry_history), 200

@app.route('/api/incidents', methods=['GET', 'POST'])
def handle_incidents():
    db = read_db()
    if request.method == 'POST':
        req = request.json or {}
        inc = {
            "id": f"AG-{random.randint(1050, 9999)}",
            "time": datetime.now().strftime("%H:%M PM"),
            "type": req.get('type', 'Weather Hazard'),
            "riskLevel": req.get('riskLevel', 'Warning'),
            "status": "Active",
            "location": req.get('location', 'Regional Airspace'),
            "riskScore": req.get('riskScore', 75),
            "description": req.get('description', 'User filed hazard report'),
            "filedBy": req.get('filedBy', 'User')
        }
        db['incidents'].insert(0, inc)
        write_db(db)
        return jsonify(inc), 201
    return jsonify(db['incidents']), 200

@app.route('/api/accidents', methods=['GET', 'POST'])
def handle_accidents():
    db = read_db()
    if request.method == 'POST':
        req = request.json or {}
        new_acc = {
            "id": f"AC-{random.randint(1003, 9999)}",
            "date": datetime.now().strftime("%d %b %Y"),
            "flightNo": req.get('flightNo', 'AI-000'),
            "type": req.get('type', 'Weather Hazard'),
            "severity": req.get('severity', 'High'),
            "status": "Investigating",
            "location": req.get('location', 'Regional Airport'),
            "description": req.get('description', 'User reported aviation accident.'),
            "filedBy": req.get('filedBy', 'User')
        }
        db['accidents'].insert(0, new_acc)
        write_db(db)
        return jsonify(new_acc), 201
    return jsonify(db['accidents']), 200

@app.route('/api/help/tickets', methods=['GET', 'POST'])
def handle_tickets():
    db = read_db()
    if request.method == 'POST':
        req = request.json or {}
        t = {
            "id": f"TCK-{random.randint(100, 999)}",
            "user": req.get('user', 'User'),
            "email": req.get('email', ''),
            "subject": req.get('subject', ''),
            "message": req.get('message', ''),
            "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M")
        }
        db['tickets'].append(t)
        write_db(db)
        return jsonify(t), 201
    return jsonify(db['tickets']), 200

@app.route('/api/admin/report', methods=['GET'])
def get_admin_report():
    db = read_db()
    report = []
    for u in db['users']:
        uname = u.get('name', u.get('username'))
        filed_incidents = [i for i in db['incidents'] if i.get('filedBy') == uname]
        filed_tickets = [t for t in db['tickets'] if t.get('user') == uname or t.get('email') in u.get('gmail', [])]
        report.append({
            "id": u.get('id'),
            "name": uname,
            "role": u.get('role'),
            "email": u.get('gmail', [u.get('username')])[0],
            "registeredOn": u.get('created_at', 'System Admin'),
            "incidentsFiled": len(filed_incidents),
            "ticketsFiled": len(filed_tickets),
            "activitySummary": f"Filed {len(filed_incidents)} Incidents & {len(filed_tickets)} Tickets"
        })
    return jsonify(report), 200

@app.route('/api/profile/upload', methods=['POST'])
def upload_avatar():
    if 'avatar' not in request.files:
        return jsonify({"error": "No file uploaded!"}), 400
    file = request.files['avatar']
    user_id = request.form.get('userId')
    if file:
        filename = f"{user_id}_{int(time.time())}.png"
        filepath = os.path.join(UPLOAD_FOLDER, filename)
        file.save(filepath)

        db = read_db()
        for u in db['users']:
            if u['id'] == user_id:
                u['avatar'] = f"/uploads/{filename}"
                write_db(db)
                return jsonify({"message": "Avatar updated successfully!", "avatarUrl": u['avatar']}), 200

    return jsonify({"error": "Failed to upload avatar!"}), 500

@app.route('/uploads/<filename>')
def serve_upload(filename):
    return send_from_directory(UPLOAD_FOLDER, filename)

if __name__ == '__main__':
    print("AeroGuard ML Backend running on http://127.0.0.1:5000")
    app.run(port=5000, debug=True)
