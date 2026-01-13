import Usuario from "../models/Usuario.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export const registrarUsuario = async (req, res) => {
  try {
    const { nombre, email, password } = req.body;

    const existe = await Usuario.findOne({ email });
    if (existe) {
      return res.status(400).json({ message: "El usuario ya existe" });
    }

    const usuario = new Usuario({ nombre, email, password });
    await usuario.save();

    res.status(201).json({ message: "Usuario registrado con éxito" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const loginUsuario = async (req, res) => {
  try {
    const { email, password } = req.body;
    const usuario = await Usuario.findOne({ email });

    if (!usuario) return res.status(404).json({ message: "Usuario no encontrado" });

    const isMatch = await usuario.matchPassword(password);
    if (!isMatch) return res.status(401).json({ message: "Contraseña incorrecta" });

    // Crear token JWT
    const token = jwt.sign(
      { id: usuario._id, email: usuario.email },
      "mi_secreto_seguro",
      { expiresIn: "7d" }
    );

    res.json({ message: "Login exitoso", usuario, token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
