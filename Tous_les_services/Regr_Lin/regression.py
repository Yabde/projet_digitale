import os
import numpy as np
from flask import Flask, request, jsonify, render_template, flash, url_for, redirect, Blueprint
import pickle

regression = Blueprint("regression", __name__, static_folder="static", template_folder="templates")

# On commence par vérifier si notre model se trouve bien dans le dossier en question
if os.path.isfile('.\\Regr_Lin\model.pkl'):
    # Notre model se trouve déjà dans le dossier
    model = pickle.load(open("Regr_Lin\model.pkl", 'rb'))
else:
    # En important notre script Python l'éxécute et donc notre model est enregistrer dans le dossier
    from Regr_Lin import Regression_Lineaire

@regression.route('/')
def home():
    return render_template('regression.html')

@regression.route('/prediction_Regr_Lin', methods=['POST'])
def predict():
    donnees_initial = [int(x) for x in request.form.values()]     # On récupère les données du 'form' via la requête
    donnees_final = [np.array(donnees_initial)]

    prediction = model.predict(donnees_final)
    output = round(prediction[0], 2)  # 2 chiffres après la virgule

    return render_template('regression.html', prediction_text=' {} '.format(output))

