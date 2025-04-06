from flask import Flask, request, jsonify
import uuid
from datetime import datetime

app = Flask(__name__)

@app.route('/consulta', methods=['POST'])
def consulta():
    
    data = request.get_json()
    
   
    request_id = str(uuid.uuid4())
    
    
    respuesta = {
        "id_detalle_pedido": data["id_detalle_pedido"],
        "id_pedido": data["id_pedido"],
        "id_inventario": data["id_inventario"],
        "cantidad": 50
    }
    
    with open("/opt/data/log_python.txt", "a") as f:
        f.write(f"{datetime.now().isoformat()}|{request_id}|{respuesta}\n")
    
  
    return jsonify(respuesta)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080)