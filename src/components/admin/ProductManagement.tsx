"use client";
import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
}

export default function ProductManagement() {
  const [products, setProducts] = useState<Product[]>([]);
  const [formData, setFormData] = useState<Partial<Product>>({});

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const querySnapshot = await getDocs(collection(db, 'products'));
    const productsData = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Product[];
    setProducts(productsData);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.id) {
      await updateDoc(doc(db, 'products', formData.id), formData);
    } else {
      await addDoc(collection(db, 'products'), formData);
    }
    setFormData({});
    fetchProducts();
  };

  const handleDelete = async (id: string) => {
    await deleteDoc(doc(db, 'products', id));
    fetchProducts();
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="mb-8 p-4 bg-gray-100 rounded">
        <input
          type="text"
          placeholder="Product Name"
          value={formData.name || ''}
          onChange={e => setFormData({ ...formData, name: e.target.value })}
          className="block mb-2 p-2"
        />
        <input
          type="number"
          placeholder="Price"
          value={formData.price || ''}
          onChange={e => setFormData({ ...formData, price: Number(e.target.value) })}
          className="block mb-2 p-2"
        />
        <textarea
          placeholder="Description"
          value={formData.description || ''}
          onChange={e => setFormData({ ...formData, description: e.target.value })}
          className="block mb-2 p-2"
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          {formData.id ? 'Update Product' : 'Add Product'}
        </button>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map(product => (
          <div key={product.id} className="border p-4 rounded">
            <h3 className="text-xl font-bold">{product.name}</h3>
            <p className="text-gray-600">${product.price}</p>
            <p>{product.description}</p>
            <div className="mt-4">
              <button
                onClick={() => setFormData(product)}
                className="bg-yellow-500 text-white p-2 rounded mr-2"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(product.id)}
                className="bg-red-500 text-white p-2 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}