from flask import Flask, request, jsonify
from flask_cors import CORS
from prediction_service import predecir_partido, get_available_matches

app = Flask(__name__)
CORS(app)

@app.route('/predict', methods=['GET'])
def predict():
    local = request.args.get('local')
    visitante = request.args.get('visitante')

    if not local or not visitante:
        return jsonify({"error": "Debes proveer los nombres del equipo local y visitante."}), 400

    resultado = predecir_partido(local, visitante)
    return jsonify(resultado)

@app.route('/available-matches', methods=['GET'])
def available_matches():
    try:
        matches = get_available_matches()
        return jsonify(matches)
    except Exception as e:
        return jsonify({"error": f"Error al obtener partidos disponibles: {str(e)}"}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)