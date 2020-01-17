from __future__ import division, print_function

import os

import numpy as np
from flask import render_template, request, Blueprint, jsonify
from keras.applications import ResNet50
from keras.applications.imagenet_utils import preprocess_input, decode_predictions
from keras.models import load_model
from keras.preprocessing import image
from sympy.printing.tests.test_tensorflow import tf
from werkzeug.utils import secure_filename

deepl = Blueprint("deepl", __name__, static_folder="static", template_folder="templates")

MODEL_PATH = ".\\Deep_Learn\\my_model.h5"

# On commence par vérifier si notre model se trouve bien dans le dossier en question
if os.path.isfile('.\\Deep_Learn\\my_model.h5'):
    # Notre model se trouve déjà dans le dossier
    model = load_model(MODEL_PATH, compile=False)
    model._make_predict_function()
else:
    # On load directement de Keras
    model = ResNet50(weights='imagenet')
    model.save('.\\Deep_Learn\\my_model.h5')

# On sauvegarde au format H5 : le plus simple pour Keras, pas besoin de recompiler
# Inclus : Les poids, l'architecture, détails de la compilation (loss, metrics), optimisé.

@deepl.route('/', methods=['GET'])
def index():
    return render_template('construction_temp.html')

graph = tf.get_default_graph()  # Astuce : Utilisée pour le préprocessing de l'image sinon Tensorflow renvoie une erreur... problème avec certaines Versions !

@deepl.route('/prediction', methods=['GET', 'POST'])
def upload():
    if request.method == 'POST':
        # Récupération du fichier à travers la requete POST
        f = request.files['file']

        # On sauvegarde l'image dans un dossier ./uploads  pour pouvoir la réutiliser avec notre modèle
        basepath = os.path.dirname(__file__)
        file_path = os.path.join(basepath, 'uploads', secure_filename(f.filename))
        f.save(file_path)

        # Astuces : utiliser graph.as_default() quand on fait une Inférance (prédiction) pour contrer le problème entre TensorFlow et les Sessions (multi Thread...si plusieurs sessions)
        global graph
        with graph.as_default():
            # Quelques traitement d'images par défault pour ResNet
            img = image.load_img(file_path, target_size=(224, 224))  # Redimensionne l'image loader
            x = image.img_to_array(img)                     # Rajoute les 'channels' : x.shape = (224, 224, 3) Pour RGB et (224, 224, 1) Pour image grise
            x = np.expand_dims(x, axis=0)                   # Ici on étend la Dimension car : De base quand on load une image -> on obtient son Shape (Size1, Size2, channels)
                                                            # Or pour Keras : On veut des Batches d'images -> 1ère Dim = numéro du sample -> (samples, size1, size2, channels)
            x = preprocess_input(x, mode='caffe')           # Pour rendre Adequate notre image selon le model utilisé, 'caffe' par défault pour ResNet -> Non normalisé mais Centrée
            preds = model.predict(x)                        # Pour faire la prédiction

        # Récupération de l'information souhaitée
        pred_class = decode_predictions(preds, top=5)  # Decode ImageNet

        # Nos données finales : On ne vas ici prendre que les deux premières prédictions avec leur scores.
        first_class_name = str(pred_class[0][0][1])
        first_class_prediction = str(round(pred_class[0][0][2] * 100, 2))
        second_class_name = str(pred_class[0][1][1])
        second_class_prediction = str(round(pred_class[0][1][2] * 100, 2))

        # On utilise le format JSON pour la réponse
        reponse = {
            'classe': [
                {
                    'nom1': first_class_name,
                    'score1': first_class_prediction
                },
                {
                    'nom2': second_class_name,
                    'score2': second_class_prediction
                }
            ]
        }

        return jsonify(reponse)
    return None
