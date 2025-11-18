const express = require("express");
const router = express.Router();
const db = require("../db");
const jwt = require("jsonwebtoken");

// Middleware para validar token
function auth(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) return res.status(401).json({ message: "Token requerido" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token inválido" });
  }
}

router.post("/", auth, async (req, res) => {
  try {
    if (req.user.rol !== "empleador" && req.user.rol !== "admin") {
      return res.status(403).json({ message: "No autorizado" });
    }

    const { titulo, descripcion, empresa, ubicacion } = req.body;
    if (!titulo || !descripcion) return res.status(400).json({ message: "Datos incompletos" });

    await db.query(
      `INSERT INTO ofertas (id_empleador, titulo, descripcion, empresa, ubicacion) 
       VALUES (?, ?, ?, ?, ?)`,
      [
        req.user.id_usuario,
        titulo,
        descripcion,
        empresa || null,
        ubicacion || "Corredor ecológico"
      ]
    );

    res.status(201).json({ message: "Oferta creada exitosamente" });
  } catch (error) {
    console.error("❌ Error al crear oferta:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
});


router.get("/", auth, async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT o.*, u.nombre AS empleador 
      FROM ofertas o
      JOIN usuarios u ON o.id_empleador = u.id_usuario
      ORDER BY fecha_publicacion DESC
    `);
    res.json(rows);
  } catch (error) {
    console.error("❌ Error al obtener ofertas:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
});

router.get("/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query(
      `SELECT o.*, u.nombre AS empleador
       FROM ofertas o 
       JOIN usuarios u ON o.id_empleador = u.id_usuario
       WHERE o.id_oferta = ?`,
      [id]
    );

    if (rows.length === 0) return res.status(404).json({ message: "Oferta no encontrada" });

    res.json(rows[0]);
  } catch (error) {
    console.error("❌ Error al obtener oferta:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
});

router.put("/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { titulo, descripcion, empresa, ubicacion } = req.body;

    const [oferta] = await db.query("SELECT * FROM ofertas WHERE id_oferta = ?", [id]);
    if (oferta.length === 0) return res.status(404).json({ message: "Oferta no encontrada" });

    if (oferta[0].id_empleador !== req.user.id_usuario && req.user.rol !== "admin") {
      return res.status(403).json({ message: "No autorizado" });
    }

    await db.query(
      `UPDATE ofertas SET titulo = ?, descripcion = ?, empresa = ?, ubicacion = ?
       WHERE id_oferta = ?`,
      [
        titulo || oferta[0].titulo,
        descripcion || oferta[0].descripcion,
        empresa || oferta[0].empresa,
        ubicacion || oferta[0].ubicacion,
        id
      ]
    );

    res.json({ message: "Oferta actualizada con éxito" });
  } catch (error) {
    console.error("❌ Error al actualizar oferta:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
});

router.delete("/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;

    const [oferta] = await db.query("SELECT * FROM ofertas WHERE id_oferta = ?", [id]);
    if (oferta.length === 0) return res.status(404).json({ message: "Oferta no encontrada" });

    if (oferta[0].id_empleador !== req.user.id_usuario && req.user.rol !== "admin") {
      return res.status(403).json({ message: "No autorizado" });
    }

    await db.query("DELETE FROM ofertas WHERE id_oferta = ?", [id]);

    res.json({ message: "Oferta eliminada correctamente" });
  } catch (error) {
    console.error("❌ Error al eliminar oferta:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
});

module.exports = router;

