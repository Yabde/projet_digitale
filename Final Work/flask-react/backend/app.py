from flask import Flask, render_template

# routes
from routes import boundaryBoxCoord, dataRoute, saveRoute, itemRoute, updateRoute, deleteRoute
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# register the Blueprints
app.register_blueprint(boundaryBoxCoord)
app.register_blueprint(dataRoute)
app.register_blueprint(saveRoute)
app.register_blueprint(itemRoute)
app.register_blueprint(updateRoute)
app.register_blueprint(deleteRoute)

if __name__ == "__main__":
    app.run(debug=True)
