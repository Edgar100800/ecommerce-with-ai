import type { Product } from "@/types";

export const mockProducts: Product[] = [
    {
        id: "1",
        name: "Campera deportiva Argentina",
        price: 29.99,
        description:
            "Campera de deportivo pesado blanca con mangas combinadas celestes, vivos gris y bolsillos. Con estampa Argentina en frente y espalda.",
        images: [
            "/products/camiseta-blanca-1.jpg",
            "/products/camiseta-blanca-2.jpg",
            "/products/camiseta-blanca-3.jpg",
        ],
        sizes: ["XS", "S", "M", "L", "XL"],
        colors: ["Blanco", "Negro", "Gris"],
        category: "Camisetas",
        inStock: true,
    },
    {
        id: "2",
        name: "Jeans Slim Fit",
        price: 79.99,
        description:
            "Jeans de corte slim fit con elastano para mayor comodidad. Perfecto balance entre estilo y funcionalidad.",
        images: [
            "/products/jeans-slim-1.jpg",
            "/products/jeans-slim-2.jpg",
            "/products/jeans-slim-3.jpg",
        ],
        sizes: ["28", "30", "32", "34", "36"],
        colors: ["Azul Oscuro", "Negro", "Azul Claro"],
        category: "Pantalones",
        inStock: true,
    },
    {
        id: "3",
        name: "Sudadera Con Capucha",
        price: 59.99,
        description:
            "Sudadera con capucha de algodón mezcla, interior afelpado para mayor calidez y comodidad.",
        images: [
            "/products/sudadera-capucha-1.jpg",
            "/products/sudadera-capucha-2.jpg",
            "/products/sudadera-capucha-3.jpg",
        ],
        sizes: ["S", "M", "L", "XL", "XXL"],
        colors: ["Gris", "Negro", "Azul Marino"],
        category: "Sudaderas",
        inStock: true,
    },
    {
        id: "4",
        name: "Vestido de jersey estampado sansi melage con bolsillo",
        price: 49.99,
        description:
            "Vestido musculosa largo con espalda competición, de jersey estampado sansi melange, con tajos y bolsillos. \nCOMPOSICIÓN: 50% VISCOSA- 50% POLIESTER",
        images: ["/products/vestido_jersey.jpg"],
        sizes: ["XS", "S", "M", "L", "XL"],
        colors: ["Sansi"],
        category: "Camisetas",
        inStock: true,
    },
    {
        id: "5",
        name: "Campera entallada de poliéster elastizado cemento grisáceo",
        price: 49.99,
        description:
            "Campera entallada de rústico poliéster elastizado cemento grisáceo , con bolsillos y capucha.",
        images: ["/products/campera_cemento.jpg"],
        sizes: ["XS", "S", "M", "L", "XL"],
        colors: ["Cemento"],
        category: "Camisetas",
        inStock: true,
    },
    {
        id: "6",
        name: "Buzo de poliéster elastizado negro con vivos",
        price: 49.99,
        description:
            "Buzo holgado de poliéster elastizado negro, con capucha, cuello alto, vivos y puños mitón.",
        images: ["/products/buzo_poliester.jpg"],
        sizes: ["XS", "S", "M", "L", "XL"],
        colors: ["Negro"],
        category: "Camisetas",
        inStock: true,
    },
    {
        id: "7",
        name: "Top de LYCRA metalizada gris plomo",
        price: 49.99,
        description:
            "Top de LYCRA de seda metalizada gris plomo, con faja y espalda cruzada.",
        images: ["/products/top_licra.jpg"],
        sizes: ["XS", "S", "M", "L", "XL"],
        colors: ["Gris"],
        category: "Camisetas",
        inStock: true,
    },
    {
        id: "8",
        name: "Remera oversize corta de jersey blanco con estampa retro",
        price: 49.99,
        description:
            "Línea 1992. Remera oversize corta de jersey blanca, con estampa retro sonder.",
        images: ["/products/remera_oversize.jpg"],
        sizes: ["XS", "S", "M", "L", "XL"],
        colors: ["Gris"],
        category: "Camisetas",
        inStock: true,
    },
    {
        id: "9",
        name: "Remera corta y suelta de jersey liviano magenta",
        price: 49.99,
        description:
            "Línea 1992. Remera oversize corta de jersey blanca, con estampa retro sonder.",
        images: ["/products/remera_magenta.jpg"],
        sizes: ["XS", "S", "M", "L", "XL"],
        colors: ["Magenta"],
        category: "Camisetas",
        inStock: true,
    },
    {
        id: "10",
        name: "Musculosa corta de LYCRA negra",
        price: 49.99,
        description:
            "Línea Recta 1992. Musculosa corta escote en U, de LYCRA de seda negra con estampa.",
        images: ["/products/musculosa.jpg"],
        sizes: ["XS", "S", "M", "L", "XL"],
        colors: ["Negro"],
        category: "Camisetas",
        inStock: true,
    },
    {
        id: "11",
        name: "Ciclista corta sin tiro de LYCRA gris oscura",
        price: 49.99,
        description:
            "Línea 1992. Calza ciclista corta sin tiro, de LYCRA de seda gris oscura. Con cintura faja y costura bordada celeste en piernas.",
        images: ["/products/ciclista.jpg"],
        sizes: ["XS", "S", "M", "L", "XL"],
        colors: ["Negro"],
        category: "Camisetas",
        inStock: true,
    },
];

export const getProductById = (id: string): Product | undefined => {
    return mockProducts.find((product) => product.id === id);
};

export const getProductsByCategory = (category: string): Product[] => {
    return mockProducts.filter((product) => product.category === category);
};
