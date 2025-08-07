// Define una constante global PROD
//window.API_BASE_URL = 'https://backend-soporte-cuida.onrender.com/';


// Define una constante global TEST
window.API_BASE_URL = 'http://127.0.0.1/api/';


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