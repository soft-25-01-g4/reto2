package reto2.response;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

public class Response {

    private int id_detalle_pedido;
    private int id_pedido;
    private int id_inventario;
    private int cantidad;


    public Response(int id_detalle_pedido, int id_pedido, int id_inventario, int cantidad) {
        this.id_detalle_pedido = id_detalle_pedido;
        this.id_pedido = id_pedido;
        this.id_inventario = id_inventario;
        this.cantidad = cantidad;
    }

    // Getters
    public int getId_detalle_pedido() { return id_detalle_pedido; }
    public int getId_pedido() { return id_pedido; }
    public int getId_inventario() { return id_inventario; }
    public int getCantidad() { return cantidad; }

    @Override
    public String toString() {
        try {
            return new ObjectMapper().writeValueAsString(this);
        } catch (JsonProcessingException e) {
            return String.format(
                    "{\"id_detalle_pedido\":%d,\"id_pedido\":%d,\"id_inventario\":%d,\"cantidad\":%d}",
                     id_detalle_pedido, id_pedido, id_inventario, cantidad
            );
        }
    }

}

