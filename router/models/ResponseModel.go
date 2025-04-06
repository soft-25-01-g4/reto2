package models

type Response struct {
	id_detalle_pedido int `json:"id_detalle_pedido"`
	id_pedido         int `json:"id_pedido"`
	id_inventario     int `json:"id_inventario"`
	cantidad          int `json:"cantidad"`
}
