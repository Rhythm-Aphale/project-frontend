const BASE_URL = "https://fakestoreapi.com";

// Fetch all products
export async function fetchProducts(): Promise<any[]> {
  try {
    const response = await fetch(`${BASE_URL}/products`);
    if (!response.ok) throw new Error("Failed to fetch products");
    return await response.json();
  } catch (error) {
    console.error(error);
    return [];
  }
}

// Fetch a single product by ID
export async function fetchProductById(id: string): Promise<any> {
  try {
    const response = await fetch(`${BASE_URL}/products/${id}`);
    if (!response.ok) throw new Error("Failed to fetch product");
    return await response.json();
  } catch (error) {
    console.error(error);
    return null;
  }
}

// Add a new product (Create)
export async function addProduct(productData: {
  title: string;
  price: number;
  description: string;
  image: string;
  category: string;
}): Promise<any> {
  try {
    const response = await fetch(`${BASE_URL}/products`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(productData),
    });

    if (!response.ok) throw new Error("Failed to add product");
    return await response.json();
  } catch (error) {
    console.error(error);
    return null;
  }
}

// Update an existing product (Update)
export async function updateProduct(
  id: string,
  updatedData: {
    title?: string;
    price?: number;
    description?: string;
    image?: string;
    category?: string;
  }
): Promise<any> {
  try {
    const response = await fetch(`${BASE_URL}/products/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedData),
    });

    if (!response.ok) throw new Error("Failed to update product");
    return await response.json();
  } catch (error) {
    console.error(error);
    return null;
  }
}

// Delete a product (Delete)
export async function deleteProduct(id: string): Promise<boolean> {
  try {
    const response = await fetch(`${BASE_URL}/products/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) throw new Error("Failed to delete product");
    console.log(`Product with ID ${id} deleted successfully.`);
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}
