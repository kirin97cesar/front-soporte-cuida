// ===============================
// 🔹 CONFIGURACIÓN API
// ===============================

// Producción
window.API_BASE_URL = 'https://backend-soporte-cuida.onrender.com/';

// Desarrollo
//window.API_BASE_URL = 'http://127.0.0.1/api/';


// ===============================
// 🔹 FUNCIONES DE ENCRIPTADO
// ===============================

const guardarEnLocalStorage = (clave, valor, token) => {
  const encriptado = CryptoJS.AES.encrypt(valor, token).toString();
  localStorage.setItem(clave, encriptado);
};

const leerDesdeLocalStorage = (clave, token) => {
  const cifrado = localStorage.getItem(clave);
  if (!cifrado) return null;

  try {
    const bytes = CryptoJS.AES.decrypt(cifrado, token);
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch (err) {
    console.error("Error al desencriptar:", err);
    return null;
  }
};

window.guardarEnLocalStorage = guardarEnLocalStorage;
window.leerDesdeLocalStorage = leerDesdeLocalStorage;


// ===============================
// 🔹 UTILIDADES
// ===============================

const truncarTexto = (texto, longitudMax = 20) => {
  return texto.length > longitudMax
    ? texto.substring(0, longitudMax) + " ..."
    : texto;
};

window.truncarTexto = truncarTexto;


// ===============================
// 🔹 CARGAR COMPONENTE HTML
// ===============================

async function cargarComponente(nombre, idDestino) {
  try {
    const url = `../components/${nombre}.html?v=${Date.now()}`; // evita cache
    const res = await fetch(url);
    const html = await res.text();
    document.getElementById(idDestino).insertAdjacentHTML('beforeend', html);
  } catch (err) {
    console.error(`Error cargando ${nombre}:`, err);
  } finally {
    inicializarUsuario();
    validarSecciones();
  }
}

window.CARGAR_COMPONENTE = cargarComponente;


// ===============================
// 🔹 FUNCIONES INTERNAS
// ===============================

function inicializarUsuario() {
  const informacionUser = leerDesdeLocalStorage(
    "user",
    localStorage.getItem("token")
  );

  if (informacionUser) {
    const jsonInfo = JSON.parse(informacionUser);
    document.getElementById("userEmail").innerText = jsonInfo.email;
    document.getElementById("avatarInicial").innerText =
      jsonInfo.email[0].toUpperCase();
  }
}

function validarSecciones() {
  const info = localStorage.getItem('detalle');
  const detalle = JSON.parse(info);

  if (!detalle || detalle.secciones.length === 0) {
    localStorage.clear();
    window.location.href = "../index.html";
    return;
  }

  const mapSecciones = {
    'PRINCIPAL': 'menu-principal',
    'PRODUCTOS': 'menu-producto',
    'AGENTES': 'menu-agentes',
    'MOTORIZADOS': 'menu-motorizado',
    'SEGUIMIENTOS': 'menu-seguimiento',
    'PEDIDOS/SOLICITUDES': 'menu-pedido',
    'ESQUEMAS': 'menu-esquemas',
    'CLIENTES': 'menu-cliente',
    'CUENTAS': 'menu-cuenta',
    'TEDEF': 'menu-tedef',
  };

  detalle.secciones.forEach(seccion => {
    if (mapSecciones[seccion]) {
      document.getElementById(mapSecciones[seccion]).style.display = 'block';
    }
  });
}


// ===============================
// 🔹 REGISTRAR SOPORTE
// ===============================

const registrarSoporte = async ({ tipo, payload }) => {
  try {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("X-Auth-Token", localStorage.getItem('token'));

    const raw = JSON.stringify({ tipo, payload });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    const response = await fetch(`${API_BASE_URL}public/soporte.php`, requestOptions);
    const result = await response.text();
    console.log(result);
  } catch (error) {
    console.error("Error registrando soporte:", error);
  }
};

window.REGISTRAR_SOPORTE = registrarSoporte;
