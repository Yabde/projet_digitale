from flask import Flask, render_template

from Regr_Lin.regression import regression
from Uploderrr.uploader import uploader
from Deep_Learn.deepl import deepl

app = Flask(__name__)
app.register_blueprint(regression, url_prefix='/regression')
app.register_blueprint(uploader, url_prefix='/uploader')
app.register_blueprint(deepl, url_prefix='/deepl')


@app.route('/')
def acceuil():
    return render_template('principal.html')


if __name__ == "__main__":
    app.run(debug=True)
