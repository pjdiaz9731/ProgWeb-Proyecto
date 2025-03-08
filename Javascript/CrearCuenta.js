require("dotenv").config();
const express = require("express");
const sql = require("mssql");
const cors = require("cors");
const bodyParser = require("body-parser");
const crypto = require("crypto");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Configuración de la base de datos (usando tu servidor de Azure)
const config = {
    user: process.env.DB_USER,              // Tu nombre de usuario de SQL Server
    password: process.env.DB_PASSWORD,      // Tu contraseña de SQL Server
    server: 'progweb2025.database.windows.net',  // Nombre de tu servidor de Azure
    database: process.env.DB_NAME,          // Nombre de tu base de datos
    options: {
        encrypt: true,                      // Necesario para Azure SQL
        enableArithAbort: true
    }
};

// Función para cifrar la contraseña con SHA-256
function hashPassword(password) {
    return crypto.createHash("sha256").update(password).digest("hex");
}

// Ruta para registrar usuario
app.post("/signup", async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const hashedPassword = hashPassword(password); // Cifrar la contraseña

        let pool = await sql.connect(config);  // Conectarse a la base de datos
        let result = await pool.request()
            .input("NombreUsuario", sql.NVarChar, username)
            .input("Email", sql.NVarChar, email)
            .input("Contraseña", sql.NVarChar, hashedPassword)
            .query("INSERT INTO Usuarios (NombreUsuario, Email, Contraseña) VALUES (@NombreUsuario, @Email, @Contraseña)");

        res.status(201).send({ message: "✅ Usuario registrado correctamente" });
    } catch (err) {
        console.error(err);
        res.status(500).send({ error: "❌ Error al registrar usuario" });
    }
});

// Ruta para verificar credenciales en login
app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    const hashedPassword = hashPassword(password);

    try {
        let pool = await sql.connect(config);
        let result = await pool.request()
            .input("Email", sql.NVarChar, email)
            .query("SELECT UsuarioID, NombreUsuario, Email, Contraseña FROM Usuarios WHERE Email = @Email");

        if (result.recordset.length === 0) {
            return res.status(401).send({ error: "❌ Usuario no encontrado" });
        }

        const user = result.recordset[0];

        if (user.Contraseña !== hashedPassword) {
            return res.status(401).send({ error: "❌ Contraseña incorrecta" });
        }

        res.status(200).send({ message: "✅ Inicio de sesión exitoso", user: { id: user.UsuarioID, username: user.NombreUsuario, email: user.Email } });
    } catch (err) {
        console.error(err);
        res.status(500).send({ error: "❌ Error al iniciar sesión" });
    }
});

app.listen(3000, () => {
    console.log("✅ Servidor corriendo en http://localhost:3000");
});
