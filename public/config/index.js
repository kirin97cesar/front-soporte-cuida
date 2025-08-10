// Define una constante global PROD
window.API_BASE_URL = 'https://backend-soporte-cuida.onrender.com/';

// Define una constante global TEST
//window.API_BASE_URL = 'http://127.0.0.1/api/';


async function cargarComponente(nombre, idDestino) {
    try {
        const url = '../components/aside.html?v=' + Date.now(); // evita cache
        const res = await fetch(url);
        const html = await res.text();
        document.getElementById(idDestino).insertAdjacentHTML('beforeend', html);
    } catch (err) {
        console.error(`Error cargando ${nombre}:`, err);
    } finally {
        const informacionUser = leerDesdeLocalStorage(
          "user",
          localStorage.getItem("token"),
        );

        if (informacionUser) {
          const jsonInfo = JSON.parse(informacionUser);
          document.getElementById("userEmail").innerText = jsonInfo.email;
          document.getElementById("avatarInicial").innerText = jsonInfo.email[0].toUpperCase();
        }

        const info = localStorage.getItem('detalle');
        const detalle = JSON.parse(info);

        if(!detalle || ( detalle && detalle.secciones.length == 0) ) {
          localStorage.clear();
          window.location.href = "../index.html";
          return;
        }

        for (const seccion of detalle.secciones) {
          if(seccion == 'PRINCIPAL') {
            document.getElementById('menu-principal').style.display = 'block';
          }

          if(seccion == 'PRODUCTOS') {
            document.getElementById('menu-producto').style.display = 'block';
          }

          if(seccion == 'AGENTES') {
            document.getElementById('menu-agentes').style.display = 'block';
          }

          if(seccion == 'MOTORIZADOS') {
            document.getElementById('menu-motorizado').style.display = 'block';
          }
          
          if(seccion == 'SEGUIMIENTOS') {
            document.getElementById('menu-seguimiento').style.display = 'block';
          }

          if(seccion == 'PEDIDOS/SOLICITUDES') {
            document.getElementById('menu-pedido').style.display = 'block';
          }

          if(seccion == 'ESQUEMAS') {
            document.getElementById('menu-esquemas').style.display = 'block';
          }

          if(seccion == 'CLIENTES') {
            document.getElementById('menu-cliente').style.display = 'block';
          }
        }
    }
}

window.CARGAR_COMPONENTE = cargarComponente;


const registrarSoporte = async ({ tipo, payload }) => {

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("X-Auth-Token", localStorage.getItem('token'));

    const raw = JSON.stringify({
        tipo,
        payload
    });

    const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
    };

    fetch(`${API_BASE_URL}public/soporte.php`, requestOptions)
    .then((response) => response.text())
    .then((result) => console.log(result))
    .catch((error) => console.error(error));

}

window.REGISTRAR_SOPORTE = registrarSoporte;