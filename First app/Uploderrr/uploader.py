import os
from flask import Flask, flash, url_for, render_template, app, Blueprint, request, Blueprint
from werkzeug.utils import secure_filename, redirect

#UPLOAD_FOLDER = "C:\\Users\\yassi\\Desktop\\Tentative Deep Learning\\Uploderrr"
UPLOAD_FOLDER = ".\\Uploderrr"
ALLOWED_EXTENSIONS = {'txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif', 'zip'}

uploader = Blueprint("uploader", __name__, template_folder="templates")


def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


@uploader.route('/upload_file', methods=['GET', 'POST'])
def upload_file():
    if request.method == 'POST':
        # Vérifie si la requete POST à le fichier dedans
        if 'file' not in request.files:
            flash('No file part')
            return redirect(request.url)

        # file = request.files['file']

        for file in request.files.getlist("file"):
            # Si l'utilsateur ne sélectionne pas de fichier, le navigateur non plus
            # Soumettre une partie vide sans nom de fichier
            if file.filename == '':
                # flash('No selected file')
                return redirect(request.url)
            print(file)
            filename = file.filename
            file.save(os.path.join(UPLOAD_FOLDER +
                                   "\\File_uploaded", filename))

        # Nous retourne une version sécurisée du NOM du fichier sans ..\\..\\.. etc
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            file.save(os.path.join(UPLOAD_FOLDER +
                                   "\\File_uploaded", filename))
            return redirect(url_for('uploader.upload_file', filename=filename))

    return render_template('uploader.html')
