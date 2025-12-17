// Add this inside your Dashboard function, before the return
const [newItem, setNewItem] = useState({ sku: "", name: "", stock: 0 });

const handleAdd = async (e) => {
  e.preventDefault();
  await fetch("/api/inventory", {
    method: "POST",
    body: JSON.stringify({
      sku: newItem.sku,
      name: newItem.name,
      currentStock: Number(newItem.stock),
    }),
  });
  window.location.reload(); // Refresh to see the new item
};

// Add this HTML just above your Metrics Cards in the return statement:
<form
  onSubmit={handleAdd}
  className="mb-8 p-4 bg-white rounded shadow flex gap-4"
>
  <input
    className="border p-2 rounded"
    placeholder="SKU"
    onChange={(e) => setNewItem({ ...newItem, sku: e.target.value })}
  />
  <input
    className="border p-2 rounded"
    placeholder="Product Name"
    onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
  />
  <input
    className="border p-2 rounded"
    type="number"
    placeholder="Initial Stock"
    onChange={(e) => setNewItem({ ...newItem, stock: e.target.value })}
  />
  <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
    Add Product
  </button>
</form>;
