from flask import *
from flask_cors import *
from werkzeug import *
import os
import base64

app = Flask(__name__)
#To solve the problem of CORS on FLASK
cors = CORS(app, resources={r"/*": {"origins": "*"}})


@app.route("/api")
def showHomePage():
    return {"Welcome to the test-flask-api":"Yes!"}

@app.route("/api/predict",methods=['POST'])
def predict():
    questionText = request.form['questionText']
    questionImage = request.form['questionImage']

    saveLocation = "./Server-Saved-Data/requestObject"+"payload.txt"
    f = open(saveLocation,"wt")
    f.write("Question asked : " + questionText + "\n" + "Base64-Image : " + questionImage + "\n")

    imagedata = base64.b64decode(questionImage)
    filename = "./Server-Saved-Data/"+"questionImage.jpg"
    with open(filename,"wb") as f:
        f.write(imagedata)



# Write the logic to connect to ML-backend

    return {"Predicted" : "dummy-answer-from-ML"}

if __name__=="__main__":
    app.run(host="0.0.0.0",port=5000)