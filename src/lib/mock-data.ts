import { Product } from "@/types";

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
    name: "Chaqueta Denim",
    price: 89.99,
    description:
      "Chaqueta de denim vintage con lavado desgastado. Un clásico que nunca pasa de moda.",
    images: [
      "/products/chaqueta-denim-1.svg",
      "/products/chaqueta-denim-2.svg",
      "/products/chaqueta-denim-3.svg",
    ],
    sizes: ["S", "M", "L", "XL"],
    colors: ["Azul Claro", "Azul Oscuro"],
    category: "Chaquetas",
    inStock: true,
  },
  {
    id: "5",
    name: "Vestido Casual",
    price: 49.99,
    description:
      "Vestido casual de manga corta, perfecto para ocasiones informales. Tela ligera y transpirable.",
    images: [
      "/products/vestido-casual-1.svg",
      "/products/vestido-casual-2.svg",
      "/products/vestido-casual-3.svg",
    ],
    sizes: ["XS", "S", "M", "L"],
    colors: ["Blanco", "Rosa", "Azul"],
    category: "Vestidos",
    inStock: true,
  },
  {
    id: "6",
    name: "Camisa Formal",
    price: 69.99,
    description:
      "Camisa formal de algodón egipcio, corte regular. Ideal para ocasiones formales y de negocios.",
    images: [
      "/products/camisa-formal-1.svg",
      "/products/camisa-formal-2.svg",
      "/products/camisa-formal-3.svg",
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Blanco", "Azul Claro", "Rosa"],
    category: "Camisas",
    inStock: true,
  },
  {
    id: "7",
    name: "Shorts Deportivos",
    price: 34.99,
    description:
      "Shorts deportivos con tecnología dry-fit. Perfectos para entrenamientos y actividades físicas.",
    images: [
      "/products/shorts-deportivos-1.svg",
      "/products/shorts-deportivos-2.svg",
      "/products/shorts-deportivos-3.svg",
    ],
    sizes: ["S", "M", "L", "XL"],
    colors: ["Negro", "Gris", "Azul"],
    category: "Deportiva",
    inStock: true,
  },
  {
    id: "8",
    name: "Blazer Elegante",
    price: 129.99,
    description:
      "Blazer elegante de corte slim, perfecto para ocasiones especiales y eventos formales.",
    images: [
      "/products/blazer-elegante-1.svg",
      "/products/blazer-elegante-2.svg",
      "/products/blazer-elegante-3.svg",
    ],
    sizes: ["S", "M", "L", "XL"],
    colors: ["Negro", "Azul Marino", "Gris"],
    category: "Blazers",
    inStock: true,
  },
];

export const getProductById = (id: string): Product | undefined => {
  return mockProducts.find((product) => product.id === id);
};

export const getProductsByCategory = (category: string): Product[] => {
  return mockProducts.filter((product) => product.category === category);
};
