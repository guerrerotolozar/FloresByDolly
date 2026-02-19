require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const mongoose = require('mongoose');
const User = require('../models/User');
const Category = require('../models/Category');
const Product = require('../models/Product');

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Conectado a MongoDB');

        // Limpiar datos existentes
        await User.deleteMany({});
        await Category.deleteMany({});
        await Product.deleteMany({});
        console.log('🗑️  Datos anteriores eliminados');

        // ===== ADMIN USER =====
        const admin = await User.create({
            username: 'admin',
            password: 'flores2025',
            displayName: 'Dolly Admin',
            role: 'admin',
        });
        console.log(`👤 Admin creado: ${admin.username}`);

        // ===== CATEGORÍAS =====
        const categories = await Category.insertMany([
            { name: 'Flores Sencillas', slug: 'sencillas', icon: 'fas fa-seedling', order: 1 },
            { name: 'Flores Especiales', slug: 'especiales', icon: 'fas fa-star', order: 2 },
            { name: 'Rosas', slug: 'rosas', icon: 'fas fa-heart', order: 3 },
            { name: 'Temporada', slug: 'temporada', icon: 'fas fa-calendar-alt', order: 4 },
        ]);
        console.log(`📂 ${categories.length} categorías creadas`);

        // Mapa rápido de slug → ObjectId
        const catMap = {};
        categories.forEach((c) => (catMap[c.slug] = c._id));

        // ===== PRODUCTOS =====
        const products = await Product.insertMany([
            {
                name: 'Astromelias',
                description:
                    'Flores reconocidas por sus colores vibrantes y su larga duración. Ideales para ramos mixtos y arreglos decorativos que llenan de alegría cualquier espacio.',
                price: 'Variable por Temporada',
                category: catMap['sencillas'],
                image: '',
                badgeLabel: 'Más Vendida',
                badgeClass: 'bg-success',
                features: [
                    'Duración: 10-14 días',
                    'Colores: Rosado, Amarillo, Blanco, Morado',
                    'Uso: Ramos, Centros de mesa',
                    'Cuidado: Agua fresca diaria',
                ],
                tags: ['Duraderas', 'Coloridas', 'Versátiles'],
                whatsappMsg:
                    'Hola! Me interesan las Astromelias. ¿Podrían darme información sobre disponibilidad y precios?',
                order: 1,
            },
            {
                name: 'Margaritas',
                description:
                    'Símbolos de pureza e inocencia, las margaritas son perfectas para expresar sentimientos sinceros. Su belleza simple y elegante las hace versátiles para cualquier ocasión.',
                price: 'Variable por Temporada',
                category: catMap['sencillas'],
                image: '',
                badgeLabel: 'Clásica',
                badgeClass: 'bg-info',
                features: [
                    'Duración: 7-10 días',
                    'Colores: Blanco, Amarillo, Rosa',
                    'Uso: Ramos, Decoración',
                    'Cuidado: Lugar fresco',
                ],
                tags: ['Delicadas', 'Elegantes', 'Frescas'],
                whatsappMsg:
                    'Hola! Quisiera información sobre las Margaritas. ¿Qué variedades tienen disponibles?',
                order: 2,
            },
            {
                name: 'Girasoles',
                description:
                    'Representan la alegría y la vitalidad. Los girasoles son ideales para iluminar cualquier espacio con su imponente presencia y color amarillo radiante.',
                price: 'Variable por Temporada',
                category: catMap['especiales'],
                image: '',
                badgeLabel: 'Popular',
                badgeClass: 'bg-warning text-dark',
                features: [
                    'Duración: 7-12 días',
                    'Tamaño: Grande, Mediano',
                    'Uso: Ramos, Arreglos individuales',
                    'Cuidado: Mucha agua, luz natural',
                ],
                tags: ['Imponentes', 'Alegres', 'Luminosos'],
                whatsappMsg:
                    'Hola! Estoy interesado/a en los Girasoles. ¿Tienen disponibles? ¿Cuál es el precio?',
                order: 3,
            },
            {
                name: 'Rosas',
                description:
                    'Las reinas de las flores. Nuestras rosas premium, incluyendo la exclusiva variedad Carnova, son perfectas para expresar amor y admiración en ocasiones especiales.',
                price: 'Variable por Temporada',
                category: catMap['rosas'],
                image: '',
                badgeLabel: 'Premium',
                badgeClass: 'bg-danger',
                features: [
                    'Duración: 7-14 días',
                    'Variedad: Carnova Premium disponible',
                    'Colores: Rojo, Rosa, Blanco, Amarillo',
                    'Cuidado: Agua con conservante',
                ],
                tags: ['Románticas', 'Premium', 'Elegantes'],
                whatsappMsg:
                    'Hola! Me gustaría saber sobre las Rosas disponibles, especialmente la variedad Carnova. ¿Precios?',
                order: 4,
            },
            {
                name: 'Ramos de Novia',
                description:
                    'Creaciones artesanales únicas para el día más especial. Cada ramo de novia es diseñado a medida, combinando las flores más finas según tu estilo y temática.',
                price: 'Consultar',
                category: catMap['temporada'],
                image: '',
                badgeLabel: 'Especial',
                badgeClass: 'bg-purple',
                features: [
                    'Diseño: Personalizado',
                    'Consulta: Previa cita',
                    'Incluye: Ramo + boutonnière',
                    'Flores: A elección de la novia',
                ],
                tags: ['Personalizado', 'Exclusivo', 'Artesanal'],
                whatsappMsg:
                    'Hola! Estoy interesada en un Ramo de Novia personalizado. ¿Podemos agendar una consulta?',
                order: 5,
            },
            {
                name: 'Arreglos Personalizados',
                description:
                    'Diseños únicos creados especialmente para ti. Combinamos diferentes flores según la ocasión: cumpleaños, aniversarios, condolencias o simplemente para alegrar el día.',
                price: 'Desde $30.000',
                category: catMap['temporada'],
                image: '',
                badgeLabel: 'A tu medida',
                badgeClass: 'bg-success',
                features: [
                    'Personalización: 100% a tu gusto',
                    'Ocasiones: Todas',
                    'Entrega: A domicilio disponible',
                    'Incluye: Tarjeta personalizada',
                ],
                tags: ['Personalizado', 'Versátil', 'Con entrega'],
                whatsappMsg:
                    'Hola! Me gustaría un Arreglo Personalizado. ¿Pueden ayudarme a diseñar algo especial?',
                order: 6,
            },
        ]);
        console.log(`🌸 ${products.length} productos creados`);

        console.log('\n✅ ¡Seed completado exitosamente!');
        console.log(`   Admin: admin / flores2025`);
        console.log(`   Categorías: ${categories.length}`);
        console.log(`   Productos: ${products.length}`);

        process.exit(0);
    } catch (error) {
        console.error('❌ Error en seed:', error);
        process.exit(1);
    }
};

seedData();
