let isRegister = false;

// Cambiar entre login y registro
function toggleAuth() {
    isRegister = !isRegister;

    document.getElementById("nombre").style.display = isRegister ? "block" : "none";
    document.getElementById("authTitle").innerText = isRegister ? "Registrarse" : "Iniciar Sesión";
    document.getElementById("authButton").innerText = isRegister ? "Registrarse" : "Iniciar Sesión";

    document.getElementById("toggleText").innerHTML = isRegister
        ? '¿Ya tienes cuenta? <span onclick="toggleAuth()">Inicia sesión</span>'
        : '¿No tienes cuenta? <span onclick="toggleAuth()">Regístrate</span>';
}

// Registrar o iniciar sesión
async function handleAuth() {
    const nombre = document.getElementById("nombre").value;
    const email = document.getElementById("email").value;
    const contrasena = document.getElementById("pass").value;

    if (!email || !contrasena || (isRegister && !nombre)) {
        alert("Completa todos los campos");
        return;
    }

    try {
        let url = "";
        let body = {};

        if (isRegister) {
            url = "http://localhost:4000/api/usuarios/register";
            body = { nombre, email, contrasena };
        } else {
            url = "http://localhost:4000/api/usuarios/login";
            body = { email, contrasena };
        }

        const res = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
        });

        const data = await res.json();

        if (!res.ok) {
            alert(data.message || "Error");
            return;
        }

        // Si fue login, guardar token
        if (!isRegister) {
            localStorage.setItem("token", data.token);
            await loadJobs();
            showJobs();
        } else {
            alert("Registro exitoso, ahora inicia sesión.");
            toggleAuth();
        }

    } catch (error) {
        alert("Error de conexión con el servidor");
        console.error(error);
    }
}

// Mostrar vista de ofertas
function showJobs() {
    document.getElementById("authSection").style.display = "none";
    document.getElementById("jobsView").style.display = "block";
}

// Cargar ofertas
async function loadJobs() {
    const token = localStorage.getItem("token");

    try {
        const res = await fetch("http://localhost:4000/api/ofertas", {
            headers: { "Authorization": "Bearer " + token }
        });

        if (!res.ok) {
            alert("No se pudieron cargar las ofertas");
            return;
        }

        const jobs = await res.json();
        const container = document.getElementById("jobsList");

        container.innerHTML = "";

        jobs.forEach(job => {
            container.innerHTML += `
                <div class="job-card">
                    <h3>${job.titulo}</h3>
                    <p>${job.descripcion}</p>
                    <small>Empresa: ${job.empresa || "Sin especificar"}</small><br>
                    <small>Ubicación: ${job.ubicacion}</small><br>
                    <small>Empleador: ${job.empleador}</small><br>
                    <button onclick="postular(${job.id_oferta})">Postularme</button>
                </div>
            `;
        });

    } catch (err) {
        alert("Error al cargar ofertas");
        console.error(err);
    }
}

// Postularse
async function postular(id_oferta) {
    const token = localStorage.getItem("token");

    try {
        const res = await fetch("http://localhost:4000/api/postulaciones", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            },
            body: JSON.stringify({ id_oferta })
        });

        const data = await res.json();
        alert(data.message);

    } catch (err) {
        alert("Error al postular");
        console.error(err);
    }
}

// Cerrar sesión
function logout() {
    localStorage.removeItem("token");
    document.getElementById("authSection").style.display = "block";
    document.getElementById("jobsView").style.display = "none";
}

// Si hay token, cargar ofertas automáticamente
window.onload = async () => {
    const token = localStorage.getItem("token");
    if (token) {
        await loadJobs();
        showJobs();
    }
};
