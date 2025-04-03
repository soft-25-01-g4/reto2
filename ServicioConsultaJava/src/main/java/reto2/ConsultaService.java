package reto2;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import reto2.request.Consulta;
import reto2.response.Response;
import java.io.FileWriter;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.UUID;

@SpringBootApplication
@RestController
public class ConsultaService {

    public static void main(String[] args) {
        SpringApplication.run(ConsultaService.class, args);
    }

    @PostMapping("/consulta")
    public Response consulta(@RequestBody Consulta request) {
        Response respuesta = new Response(
                request.getId_detalle_pedido(),
                request.getId_pedido(),
                request.getId_inventario(),
                50
        );
        logToFile(respuesta);
        return respuesta;
    }

    private void logToFile(Response respuesta) {
        try (FileWriter writer = new FileWriter("data_servicio.txt", true)) {
            String requestId = UUID.randomUUID().toString();
            String logLine = String.format("%s  %s  %s%n",
                    LocalDateTime.now(),
                    requestId,
                    respuesta.toString());
            writer.write(logLine);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}