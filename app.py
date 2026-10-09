from flask import Flask, request, render_template, jsonify
import joblib
import numpy as np
import os

app = Flask(__name__)

# Load the model using a path relative to this file
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "california.joblib")

obj = joblib.load(MODEL_PATH)

model = obj["Model"]
columns = obj["Columns"]

print(columns)


@app.route("/")
def main():
    return render_template("index.html", columns=columns)


@app.route("/predict")
def predict():
    INPUT = []

    try:
        for i in columns:
            val = request.args.get(i)

            if val is None or val == "":
                return jsonify({
                    "error": f"Missing value: {i}"
                }), 400

            INPUT.append(float(val))

        out = model.predict([INPUT])

        return jsonify({
            "prediction": float(out[0])
        })

    except ValueError:
        return jsonify({
            "error": "Please enter valid numerical values."
        }), 400

    except Exception as e:
        return jsonify({
            "error": str(e)
        }), 500


if __name__ == "__main__":
    app.run(debug=True)