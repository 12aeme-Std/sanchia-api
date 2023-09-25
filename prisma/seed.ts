import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const hashedPassword = bcrypt.hashSync('pass123!', 10);

async function main() {
    const user = await prisma.user.upsert({
        where: { email: 'test-user@email.com' },
        update: { email: 'test-user@email.com' },
        create: {
            email: 'test-user@email.com',
            name: 'Test',
            lastname: 'User',
            password: hashedPassword,
            role: 'CLIENT',
            cart: {
                create: {},
            },
        },
    });

    const category = await prisma.category.create({
        data: {
            name: `Category ${faker.commerce.productName()}`, // Reemplaza con el nombre de la categoría que desees
        },
    });

    const product = await prisma.product.create({
        data: {
            name: `Product ${faker.commerce.productName()}`,
            description: 'Description of Product',
            price: 19.99,
            stock: 100,
            isAvailable: true,
            isNew: false,
            endurance: 'Endurance',
            color: 'Color 1',
            category: {
                connect: {
                    id: category.id,
                },
            },
        },
    });

    await prisma.image.createMany({
        data: [
            {
                url: 'image_url_1.jpg', // Reemplaza con la URL de la imagen
                isCover: true,
                productId: product.id,
            },
            {
                url: 'image_url_2.jpg', // Reemplaza con la URL de otra imagen
                isCover: false,
                productId: product.id,
            },
            // Puedes agregar más imágenes si es necesario
        ],
    });

    await prisma.order.create({
        data: {
            orderTracker: faker.string.uuid(),
            total: 100,
            store: 'Store 1',
            user: {
                connect: {
                    id: user.id,
                },
            },
            status: 'PREPARING',
        },
    });

    const warehouse = await prisma.warehouse.create({
        data: {
            name: `Warehouse ${faker.internet.userName()}`,
            description: 'Description of Warehouse',
            type: 'RAW_MATERIAL',
        },
    });

    await prisma.warehouseMovement.create({
        data: {
            userId: user.id,
            type: 'WAREHOUSE_TO_WAREHOUSE',
            warehouseOriginId: warehouse.id,
            quantity: 10,
        },
    });

    const rawMaterial = await prisma.rawMaterial.create({
        data: {
            name: `Raw Material ${faker.company.name()}`,
            stock: 50,
            warehouseId: warehouse.id,
        },
    });

    const mixtureMachine = await prisma.mixtureMachine.create({
        data: {
            name: `Mixer ${faker.lorem.word()}`,
        },
    });

    const manufactureMachine = await prisma.manufactureMachine.create({
        data: {
            name: `Manufacture ${faker.lorem.word()}`,
        },
    });

    const recipe = await prisma.recipe.create({
        data: {
            name: `Recipe ${faker.airline.seat()}`,
            description: 'Description of Recipe 1',
            quantity: 100,
        },
    });

    const mixture = await prisma.mixture.create({
        data: {
            name: `Mixture ${faker.lorem.word()}`,
            mixtureMachineId: mixtureMachine.id,
            recipeId: recipe.id,
        },
    });

    await prisma.rawMaterialOnMixture.create({
        data: {
            mixtureId: mixture.id,
            rawMaterialId: rawMaterial.id,
            quantity: 5,
        },
    });

    await prisma.mixtureResult.create({
        data: {
            mixtureId: mixture.id,
            quantity: 8,
        },
    });

    await prisma.resourceOnRecipe.create({
        data: {
            recipeId: recipe.id,
            rawMaterialId: rawMaterial.id,
        },
    });

    const manufacture = await prisma.manufacture.create({
        data: {
            name: `Manufacture ${faker.commerce.productName()}`,
            manufactureMachineId: manufactureMachine.id,
        },
    });

    await prisma.resourcesOnManufacture.create({
        data: {
            manufactureId: manufacture.id,
            rawMaterialId: rawMaterial.id,
            quantity: 10,
        },
    });

    await prisma.manufactureResult.create({
        data: {
            manufactureId: manufacture.id,
            waste: 2,
            burr: 1,
        },
    });
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
