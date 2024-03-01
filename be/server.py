# Flask server to handle OTP requests

import random

import dotenv
import requests
from flask import Flask, jsonify, request
from flask_cors import CORS

dotenv.load_dotenv()
SMTP2GO_API_KEY = dotenv.dotenv_values().get("SMTP2GO_API_KEY")
OTP = {}

app = Flask(__name__)
CORS(app)


def send_otp_email(email: str, otp: str):
    """
    Send OTP to the user's email using smtp2go api
    """
    url = "https://api.smtp2go.com/v3/email/send"
    headers = {"Content-Type": "application/json"}
    data = {
        "api_key": SMTP2GO_API_KEY,
        "to": [email],
        "sender": "event@tedxjec.co",
        "subject": "OTP Verification",
        "text_body": f"Your OTP is {otp}",
    }
    response = requests.post(url, headers=headers, json=data)
    print(response.status_code)
    print(response.text)

    return response.status_code


@app.route("/send", methods=["POST"])
def otp():
    __email = request.json.get("email")

    print(f"Sending OTP to {__email}")
    __otp = random.randint(100000, 999999)

    if send_otp_email(__email, __otp) == 200:
        OTP[__email] = __otp
        return jsonify({"status": "ok"})
    else:
        return jsonify({"status": "error"}), 500


@app.route("/verify", methods=["POST"])
def verify_otp():
    data = request.json
    __u_email = data.get("email")
    __u_otp = data.get("otp")

    print(f"Verifying OTP for {__u_email}")

    if OTP.get(__u_email) == int(__u_otp):
        del OTP[__u_email]
        print("OTP Verified")
        return jsonify({"status": "ok"})
    else:
        print("Invalid OTP")
        return jsonify({"status": "error"}), 400


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
