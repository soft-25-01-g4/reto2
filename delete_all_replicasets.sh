#!/bin/bash

# Verifica si se proporcionó un nombre de namespace como argumento
if [ -z "$1" ]; then
  echo "Error: Debes proporcionar el nombre del namespace como argumento."
  echo "Uso: $0 <nombre-del-namespace>"
  exit 1
fi

NAMESPACE="$1"

echo "Namespace seleccionado: $NAMESPACE"
echo ""

# Opcional: Muestra los ReplicaSets que serán eliminados (comentado por defecto)
# echo "Los siguientes ReplicaSets en el namespace '$NAMESPACE' serán eliminados:"
# kubectl get replicasets -n "$NAMESPACE"
# echo ""

# Pide confirmación al usuario
echo "ADVERTENCIA: Esta acción eliminará TODOS los ReplicaSets en el namespace '$NAMESPACE'."
echo "Esto puede causar que los Pods gestionados por estos ReplicaSets también sean eliminados si no hay un Deployment u otro controlador superior."
read -p "¿Estás absolutamente seguro? Escribe 'si' para confirmar: " CONFIRMACION

# Convierte la entrada a minúsculas de forma portable usando 'tr'
CONFIRMACION_LOWER=$(echo "$CONFIRMACION" | tr '[:upper:]' '[:lower:]')

# Verifica la confirmación (ahora usando la variable convertida)
if [[ "$CONFIRMACION_LOWER" == "si" ]]; then
  echo "Procediendo con la eliminación de todos los ReplicaSets en el namespace '$NAMESPACE'..."
  kubectl delete replicaset --all -n "$NAMESPACE"

  if [ $? -eq 0 ]; then
    echo "Todos los ReplicaSets en el namespace '$NAMESPACE' han sido eliminados (o se ha iniciado su eliminación)."
  else
    echo "Error al intentar eliminar los ReplicaSets. Verifica los permisos o la conexión con el clúster."
    exit 1
  fi
else
  echo "Operación cancelada por el usuario."
  exit 0
fi

exit 0
