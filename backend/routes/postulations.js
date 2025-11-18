const express = require("express");
const router = express.Router();
const db = require("../db");
const auth = require("../middleware/auth"); 

// Crear postulación
router.post("/", auth, async (req, res) => {
  try {
    const { id_oferta } = req.body;
    const id_usuario = req.user.id_usuario;

    if (!id_oferta) {
      return res.status(400).json({ message: "Debes indicar la oferta a la que postulas" });
    }

    // Verificar si ya se postuló
    const [existe] = await db.query(
      "SELECT * FROM postulaciones WHERE id_usuario = ? AND id_oferta = ?",
      [id_usuario, id_oferta]
    );

    if (existe.length > 0) {
      return res.status(400).json({ message: "Ya te has postulado a esta oferta" });
    }

    await db.query(
      "INSERT INTO postulaciones (id_usuario, id_oferta) VALUES (?, ?)",
      [id_usuario, id_oferta]
    );

    res.status(201).json({ message: "Postulación enviada con éxito" });

  } catch (error) {
    console.error("❌ Error al postularse:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
});

// Obtener postulaciones de un Usuario
router.get("/", auth, async (req, res) => {
  try {
    const id_usuario = req.user.id_usuario;

    const [rows] = await db.query(
      `SELECT p.id_postulacion, o.titulo, o.empresa, o.ubicacion, o.fecha_publicacion
       FROM postulaciones p
       JOIN ofertas o ON p.id_oferta = o.id_oferta
       WHERE p.id_usuario = ?
       ORDER BY p.fecha_postulacion DESC`,
      [id_usuario]
    );

    res.json(rows);

  } catch (error) {
    console.error("❌ Error al obtener postulaciones:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
});

// Actualizar postulación
router.put("/:id", auth, async (req, res) => {
  try {
    const id_usuario = req.user.id_usuario;
    const id_postulacion = req.params.id;
    const { id_oferta } = req.body;

    if (!id_oferta) {
      return res.status(400).json({ message: "Debes indicar la nueva oferta" });
    }

    // Verificar que la postulación existe y pertenece al usuario
    const [existe] = await db.query(
      "SELECT * FROM postulaciones WHERE id_postulacion = ? AND id_usuario = ?",
      [id_postulacion, id_usuario]
    );

    if (existe.length === 0) {
      return res.status(404).json({ message: "Postulación no encontrada" });
    }

    // Actualizar la postulación con la nueva oferta
    await db.query(
      "UPDATE postulaciones SET id_oferta = ?, fecha_postulacion = CURRENT_TIMESTAMP WHERE id_postulacion = ? AND id_usuario = ?",
      [id_oferta, id_postulacion, id_usuario]
    );

    res.json({ message: "Postulación actualizada correctamente" });

  } catch (error) {
    console.error("❌ Error al actualizar postulación:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
});

// Eliminar postulación
router.delete("/:id", auth, async (req, res) => {
  try {
    const id_usuario = req.user.id_usuario;
    const id_postulacion = req.params.id;

    const [existe] = await db.query(
      "SELECT * FROM postulaciones WHERE id_postulacion = ? AND id_usuario = ?",
      [id_postulacion, id_usuario]
    );

    if (existe.length === 0) {
      return res.status(404).json({ message: "Postulación no encontrada" });
    }

    await db.query(
      "DELETE FROM postulaciones WHERE id_postulacion = ? AND id_usuario = ?",
      [id_postulacion, id_usuario]
    );

    res.json({ message: "Postulación eliminada correctamente" });

  } catch (error) {
    console.error("❌ Error al eliminar postulación:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
});


module.exports = router;
