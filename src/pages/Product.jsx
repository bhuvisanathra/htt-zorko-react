import React, { useState, useEffect } from "react";
import { v4 } from "uuid";
import {
  GridComponent,
  ColumnsDirective,
  ColumnDirective,
  Resize,
  Sort,
  ContextMenu,
  Selection,
  Toolbar,
  Filter,
  Page,
  ExcelExport,
  PdfExport,
  Edit,
  Inject,
} from "@syncfusion/ej2-react-grids";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@material-ui/core";
import { Header } from "../components";
import { db, storage } from "../Firebase/Firebase";
import {
  collection,
  addDoc,
  query,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { ordersData, ordersGrid, productGrid } from "../data/dummy";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

const Product = () => {
  const [products, setProducts] = useState([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [productId, setProductId] = useState();
  const [selectedproduct, setSelectedproduct] = useState(null);
  const [quantity, setQuantity] = useState(0);
  const [photo, setPhoto] = useState();
  const [descrption, setDescription] = useState();
  const [category, setCategory] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const q = query(collection(db, "products"));
      const unsub = onSnapshot(q, (QuerySnapshot) => {
        let productArray = [];
        QuerySnapshot.forEach((doc) => {
          productArray.push({ ...doc.data(), id: doc.id });
        });
        setProducts(productArray);
      });
      return () => unsub();
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const addProduct = async () => {
    try {
      const imgRef = ref(storage, `files/${v4()}`);
      const uploadTask = uploadBytes(imgRef, photo);
      uploadTask
        .then((snapshot) => {
          return getDownloadURL(snapshot.ref);
        })
        .then((downloadURL) => {
          console.log("File available at", downloadURL);
          addDoc(collection(db, "products"), {
            OrderItems: name,
            TotalAmount: parseFloat(price),
            ProductImage: downloadURL,
            Category: category,
            Quantity: quantity,
            Descrption: descrption,
          });
        });

      resetForm();
      setShowForm(false);
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  const updateOrder = async () => {
    try {
      console.log("Updating product with ID:", selectedproduct.id);
      let updateData = {
        OrderItems: name,
        TotalAmount: parseFloat(price),
        Category: category,
        Quantity: quantity,
        Descrption: descrption,
      };

      if (photo) {
        const imgRef = ref(storage, `files/${v4()}`);
        const uploadTask = uploadBytes(imgRef, photo);
        const downloadURL = await uploadTask.then((snapshot) =>
          getDownloadURL(snapshot.ref)
        );
        console.log("New file available at", downloadURL);

        updateData.ProductImage = downloadURL;
      } else {
        updateData.ProductImage = selectedproduct.ProductImage;
      }

      console.log(updateData);
      await updateDoc(doc(db, "products", selectedproduct.id), updateData);

      console.log("Product update completed.");
      setEditForm(false);
      resetForm();
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  const handleEdit = (product) => {
    setName(product.OrderItems);
    setPrice(product.TotalAmount);
    setSelectedproduct(product);
    setPhoto(product.ProductImage);
    setQuantity(product.Quantity);
    setDescription(product.Descrption);
    setEditForm(true);
  };

  const resetForm = () => {
    setName("");
    setPrice("");
    setPhoto(null);
    setDescription(null);
  };

  const toolbarOptions = ["Delete"];
  const selectionsettings = { type: "Single", mode: "Row" };
  const [editForm, setEditForm] = useState(false);

  const deleteProduct = async (id) => {
    await deleteDoc(doc(db, "products", id));
  };

  return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
      <Header category="Page" title="Products" />
      <div style={{ marginBottom: "1rem", marginRight: "1rem" }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setShowForm(true)}
        >
          Add New Product
        </Button>
      </div>
      <Dialog open={showForm} onClose={() => setShowForm(false)}>
        <DialogTitle>Add New Product</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Product Name"
            type="text"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <TextField
            margin="dense"
            id="category"
            label="Descrption"
            type="text"
            fullWidth
            value={descrption}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
          <TextField
            margin="dense"
            id="price"
            label="Price"
            type="number"
            fullWidth
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
          <TextField
            margin="dense"
            id="category"
            label="Category"
            type="text"
            fullWidth
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          />
          <TextField
            margin="dense"
            id="category"
            label="Quantity"
            type="number"
            fullWidth
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            required
          />
          <input
            type="file"
            className="mb-2 mt-2"
            onChange={(e) => setPhoto(e.target.files[0])}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setShowForm(false)}
            color="primary"
            type="button"
          >
            Cancel
          </Button>
          <Button onClick={addProduct} color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={editForm} onClose={() => setEditForm(false)}>
        <DialogTitle>Edit Product</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Product Name"
            type="text"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <TextField
            margin="dense"
            id="category"
            label="Descrption"
            type="text"
            fullWidth
            value={descrption}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
          <TextField
            margin="dense"
            id="price"
            label="Price"
            type="number"
            fullWidth
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
          <TextField
            margin="dense"
            id="category"
            label="Category"
            type="text"
            fullWidth
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          />
          <TextField
            margin="dense"
            id="category"
            label="Quantity"
            type="number"
            fullWidth
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            required
          />
          <input
            type="file"
            className="mb-2 mt-2"
            onChange={(e) => setPhoto(e.target.files[0])}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditForm(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={updateOrder} color="primary">
            Update
          </Button>
        </DialogActions>
      </Dialog>

      <div className="overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-6">No.</th>
              <th className="py-3 px-6">Product Name</th>
              <th className="py-3 px-6">Product Descrption</th>
              <th className="py-3 px-6">Category</th>
              <th className="py-3 px-6">Total Amount</th>
              <th className="py-3 px-6">Quantity</th>
              <th className="py-3 px-6">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {/* {console.log(products)} */}
            {products?.map((product, index) => (
              <tr
                key={product.id}
                className="border-b border-gray-200 hover:bg-gray-100"
              >
                <td className="py-3 px-6 text-left whitespace-nowrap">
                  {index + 1}
                </td>
                <td className="py-3 px-6 text-left whitespace-nowrap flex justify-start items-center">
                  <img
                    src={product.ProductImage}
                    alt="Product Image"
                    style={{
                      width: "50px",
                      height: "50px",
                      borderRadius: "50%",
                      marginRight: "10px",
                    }}
                  />
                  <div>{product.OrderItems}</div>
                </td>
                <td className="py-3 px-6 text-left whitespace-nowrap">
                  {product.Descrption}
                </td>
                <td className="py-3 px-6 text-left whitespace-nowrap">
                  {product.Category}
                </td>
                <td className="py-3 px-6 text-left whitespace-nowrap">
                  {product.TotalAmount}
                </td>
                <td className="py-3 px-6 text-left whitespace-nowrap">
                  {product.Quantity}
                </td>
                <td className="py-3 px-6 text-center whitespace-nowrap">
                  <div className="flex justify-between items-center">
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleEdit(product)}
                      className="mr-3"
                    >
                      Edit
                    </Button>
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => deleteProduct(product.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Product;
