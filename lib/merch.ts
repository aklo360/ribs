export type MerchProduct = {
  id: string;
  name: string;
  detail: string;
  price: string;
  image: string;
  url: string;
};

export const MERCH_STORE_URL = "https://ribs.printful.me/";

/** Reviewed products from the public RIBS Printful Quick Store. */
export const MERCH_PRODUCTS: MerchProduct[] = [
  {
    id: "ribs-hoodie",
    name: "RIBS Hoodie",
    detail: "Art front / logo back",
    price: "$43.50",
    image: "/img/merch/ribs-hoodie.jpg",
    url: "https://ribs.printful.me/product/ribs-hoodie-art-frontlogo-back",
  },
  {
    id: "ribs-t-shirt",
    name: "RIBS T-Shirt",
    detail: "Art front / logo back",
    price: "$23.00",
    image: "/img/merch/printful-2026-07-20-v2/ribs-t-shirt.webp",
    url: "https://ribs.printful.me/product/ribs-t-shirt-art-frontlogo-back-6a5e6562750ba",
  },
  {
    id: "golf-rope-cap",
    name: "Golf rope cap",
    detail: "Roots in Blue Stone wordmark",
    price: "$17.50",
    image: "/img/merch/golf-rope-cap.jpg",
    url: "https://ribs.printful.me/product/golf-rope-cap",
  },
];
