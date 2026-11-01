const RegistroVip = require('../models/RegistroVip');

// POST /api/registro — Registrar nuevo cliente VIP (Ahora para Rifa Aniversario)
exports.registrar = async (req, res) => {
    try {
        const { nombre, celular, referidos } = req.body;

        // Validaciones básicas
        if (!nombre || !celular) {
            return res.status(400).json({
                success: false,
                message: 'Nombre y celular son obligatorios.',
            });
        }

        if (!/^\d{10}$/.test(celular.trim())) {
            return res.status(400).json({
                success: false,
                message: 'El celular debe tener exactamente 10 dígitos.',
            });
        }

        // Limpiar referidos vacíos o inválidos
        const referidosLimpios = Array.isArray(referidos)
            ? referidos.filter(r => r.nombre && r.nombre.trim() && r.celular && /^\d{10}$/.test(r.celular.trim()))
            : [];

        if (referidosLimpios.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Debes proporcionar al menos un referido válido (nombre y celular de 10 dígitos).',
            });
        }

        // Buscar si ya existe por celular, si existe actualizamos sus datos
        const existente = await RegistroVip.findOne({ celular: celular.trim() });

        if (existente) {
            existente.nombre = nombre.trim();
            // Agregar los referidos nuevos a los existentes (evitando sobreescribir si ya tenía)
            const nuevosReferidos = [...existente.referidos, ...referidosLimpios];
            // Opcional: Eliminar duplicados de referidos por número
            const referidosUnicos = Array.from(new Map(nuevosReferidos.map(r => [r.celular, r])).values());
            
            existente.referidos = referidosUnicos;
            existente.activo = true;
            await existente.save();

            return res.json({
                success: true,
                message: '¡Datos actualizados! Ya estabas registrado, actualizamos tu info de referidos.',
                data: existente,
                updated: true,
            });
        }

        // Crear nuevo registro
        const nuevoRegistro = await RegistroVip.create({
            nombre: nombre.trim(),
            celular: celular.trim(),
            referidos: referidosLimpios,
        });

        res.status(201).json({
            success: true,
            message: '¡Registro exitoso! Bienvenido a la rifa de Aniversario.',
            data: nuevoRegistro,
            updated: false,
        });
    } catch (error) {
        console.error('❌ Error en registro Aniversario:', error);

        // Duplicado por race condition
        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message: 'Este número ya está registrado.',
            });
        }

        res.status(500).json({
            success: false,
            message: 'Error interno del servidor.',
        });
    }
};

// GET /api/registro — Listar todos los registros (protegido para admin)
exports.listar = async (req, res) => {
    try {
        const registros = await RegistroVip.find({ activo: true })
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            count: registros.length,
            data: registros,
        });
    } catch (error) {
        console.error('❌ Error listando registros:', error);
        res.status(500).json({ success: false, message: 'Error del servidor.' });
    }
};

// GET /api/registro/stats — Estadísticas rápidas
exports.stats = async (req, res) => {
    try {
        const total = await RegistroVip.countDocuments({ activo: true });
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);
        const hoyCount = await RegistroVip.countDocuments({
            activo: true,
            createdAt: { $gte: hoy },
        });

        res.json({
            success: true,
            total,
            registrosHoy: hoyCount,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error del servidor.' });
    }
};

// DELETE /api/registro/:id — Desactivar registro (soft delete)
exports.eliminar = async (req, res) => {
    try {
        const registro = await RegistroVip.findById(req.params.id);
        if (!registro) {
            return res.status(404).json({
                success: false,
                message: 'Registro no encontrado.',
            });
        }

        registro.activo = false;
        await registro.save();

        res.json({
            success: true,
            message: 'Registro desactivado.',
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error del servidor.' });
    }
};
