from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_jwt_extended import (
    JWTManager, create_access_token,
    jwt_required, get_jwt_identity
)
import sqlite3
import os
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename


app = Flask(__name__)
CORS(app)

# ------------------ CONFIG ------------------

app.config["JWT_SECRET_KEY"] = "geopoverty-secret"
app.config["UPLOAD_FOLDER"] = "uploads/images"

jwt = JWTManager(app)

# Create upload folder if not exists
os.makedirs(app.config["UPLOAD_FOLDER"], exist_ok=True)


# ------------------ DATABASE CONNECTION ------------------

def get_db():
    conn = sqlite3.connect("database.db")
    conn.row_factory = sqlite3.Row
    return conn


# ------------------ INIT DATABASE ------------------

def init_db():
    db = get_db()
    cur = db.cursor()

    # USERS TABLE
    cur.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            mobile TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL
        )
    """)

    # ANALYSIS TABLE
    cur.execute("""
        CREATE TABLE IF NOT EXISTS analysis (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            image_path TEXT,
            poverty_level TEXT,
            percentage REAL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(user_id) REFERENCES users(id)
        )
    """)

    db.commit()
    db.close()


init_db()


# ================== AUTH ROUTES ==================

@app.route("/", methods=["GET"])
def home():
    return jsonify({"msg": "Backend API is running"})

@app.route("/api/register", methods=["POST"])
def register():

    data = request.json

    name = data.get("name")
    email = data.get("email")
    mobile = data.get("mobile")
    password = data.get("password")

    if not name or not email or not mobile or not password:
        return jsonify({"msg": "All fields required"}), 400

    hashed_password = generate_password_hash(password)

    try:
        db = get_db()
        cur = db.cursor()

        cur.execute("""
            INSERT INTO users (name,email,mobile,password)
            VALUES (?,?,?,?)
        """, (name, email, mobile, hashed_password))

        db.commit()
        db.close()

        return jsonify({"msg": "Registered Successfully"}), 201

    except sqlite3.IntegrityError:
        return jsonify({"msg": "Email or Mobile already exists"}), 409


@app.route("/api/login", methods=["POST"])
def login():

    data = request.json

    login_id = data.get("login")   # email or mobile
    password = data.get("password")

    if not login_id or not password:
        return jsonify({"msg": "All fields required"}), 400

    db = get_db()
    cur = db.cursor()

    cur.execute("""
        SELECT * FROM users
        WHERE email=? OR mobile=?
    """, (login_id, login_id))

    user = cur.fetchone()
    db.close()

    if not user:
        return jsonify({"msg": "User not found"}), 401

    if not check_password_hash(user["password"], password):
        return jsonify({"msg": "Wrong password"}), 401

    access_token = create_access_token(identity=user["id"])

    return jsonify({
        "token": access_token,
        "user": {
            "id": user["id"],
            "name": user["name"],
            "email": user["email"],
            "mobile": user["mobile"]
        }
    })


# ================== IMAGE UPLOAD ==================

@app.route("/api/upload", methods=["POST"])
@jwt_required()
def upload_image():

    if "image" not in request.files:
        return jsonify({"msg": "No file uploaded"}), 400

    file = request.files["image"]

    if file.filename == "":
        return jsonify({"msg": "No selected file"}), 400

    filename = secure_filename(file.filename)
    file_path = os.path.join(app.config["UPLOAD_FOLDER"], filename)

    file.save(file_path)

    # Dummy poverty result (AI later)
    poverty_level = "Medium"
    percentage = 52.4

    user_id = get_jwt_identity()

    db = get_db()
    cur = db.cursor()

    cur.execute("""
        INSERT INTO analysis (user_id,image_path,poverty_level,percentage)
        VALUES (?,?,?,?)
    """, (user_id, file_path, poverty_level, percentage))

    db.commit()
    db.close()

    return jsonify({
        "msg": "Image uploaded successfully",
        "result": {
            "poverty_level": poverty_level,
            "percentage": percentage
        }
    })


# ================== DASHBOARD ==================

@app.route("/api/dashboard", methods=["GET"])
@jwt_required()
def dashboard():

    user_id = get_jwt_identity()

    db = get_db()
    cur = db.cursor()

    cur.execute("""
        SELECT id, image_path, poverty_level, percentage, created_at
        FROM analysis
        WHERE user_id=?
        ORDER BY created_at DESC
    """, (user_id,))

    results = cur.fetchall()
    db.close()

    data = []
    for row in results:
        data.append({
            "id": row["id"],
            "image_path": row["image_path"],
            "poverty_level": row["poverty_level"],
            "percentage": row["percentage"],
            "created_at": row["created_at"]
        })

    return jsonify(data)


# ================== PROFILE ==================

@app.route("/api/profile", methods=["GET"])
@jwt_required()
def profile():

    user_id = get_jwt_identity()

    db = get_db()
    cur = db.cursor()

    cur.execute("SELECT id,name,email,mobile FROM users WHERE id=?", (user_id,))
    user = cur.fetchone()
    db.close()

    return jsonify({
        "id": user["id"],
        "name": user["name"],
        "email": user["email"],
        "mobile": user["mobile"]
    })


# ================== RUN SERVER ==================

if __name__ == "__main__":
    app.run(debug=True)
