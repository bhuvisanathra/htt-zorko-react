import React, { useEffect, useState } from "react";
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

import { ordersData, contextMenuItems, ordersGrid } from "../data/dummy";
import { Header } from "../components";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@material-ui/core";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 } from "uuid";

const deleteOrder = async (id) => {
  await deleteDoc(doc(db, "orders", id));
};
const Orders = () => {
  const editing = { allowDeleting: true, allowEditing: true };
  const [orderData, setOrderData] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [item, setItem] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [totalAmount, setTotalAmount] = useState("");
  const [photo, setPhoto] = useState("");
  const [editForm, setEditForm] = useState(false);
  const [selectedOrder, setSelectedorder] = useState(null);

  useEffect(() => {
    const q = query(collection(db, "orders"));
    const unsub = onSnapshot(q, (QuerySnapshot) => {
      let ordersArray = [];
      QuerySnapshot.forEach((doc) => {
        ordersArray.push({ ...doc.data(), id: doc.id });
      });
      console.log("Fetched orders:", ordersArray); // Log fetched orders
      setOrderData(ordersArray);
    });
    return () => unsub();
  }, []);

  const addOrder = async () => {
    try {
      const imgRef = ref(storage, `files/${v4()}`);
      const uploadTask = uploadBytes(imgRef, photo);
      const downloadURL = await uploadTask.then((snapshot) =>
        getDownloadURL(snapshot.ref)
      );

      await addDoc(collection(db, "orders"), {
        OrderName: customerName,
        OrderItems: item,
        OrderPrice: parseFloat(price),
        OrderQuantity: parseInt(quantity),
        TotalAmount: parseFloat(totalAmount),
        customerImage: downloadURL,
      });
      resetForm();
      setShowForm(false);
    } catch (error) {
      console.error("Error adding order:", error);
    }
  };

  const updateOrder = async () => {
    try {
      let updateData = {
        OrderName: customerName,
        OrderItems: item,
        OrderPrice: parseFloat(price),
        OrderQuantity: parseInt(quantity),
        TotalAmount: parseFloat(totalAmount),
      };

      if (photo) {
        const imgRef = ref(storage, `files/${v4()}`);
        const uploadTask = uploadBytes(imgRef, photo);
        const snapshot = await uploadTask;
        const downloadURL = await getDownloadURL(snapshot.ref);
        console.log("New file available at", downloadURL);
        updateData.customerImage = downloadURL;
      }

      console.log(updateData);
      await updateDoc(doc(db, "orders", selectedOrder.id), updateData);

      const q = query(collection(db, "orders"));
      const unsub = onSnapshot(q, (QuerySnapshot) => {
        let ordersArray = [];
        QuerySnapshot.forEach((doc) => {
          ordersArray.push({ ...doc.data(), id: doc.id });
        });
        console.log("Fetched orders:", ordersArray);
        setOrderData(ordersArray);
      });

      resetForm();
      setSelectedorder(null);
      setEditForm(false);
      setShowForm(false);
    } catch (error) {
      console.error("Error updating order:", error);
    }
  };

  const resetForm = () => {
    setCustomerName("");
    setItem("");
    setPhoto("");
    setPrice("");
    setQuantity("");
    setPrice("");
    setPhoto(null);
    setShowForm(false);
  };

  const handleEdit = (order) => {
    setCustomerName(order.OrderName);
    setItem(order.OrderItems);
    setPrice(order.OrderPrice);
    setQuantity(order.OrderQuantity);
    setTotalAmount(order.TotalAmount);
    setPhoto(order.customerImage);
    setSelectedorder(order);
    setPhoto(order.orderImage);
    setEditForm(true);
  };

  return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
      <Header category="Page" title="Orders" />
      <div style={{ marginBottom: "1rem", marginRight: "1rem" }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setShowForm(true)}
        >
          Add New Orders
        </Button>
      </div>

      <Dialog open={showForm} onClose={() => setShowForm(false)}>
        <DialogTitle>Add New order</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Customer Name"
            type="text"
            fullWidth
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            required
          />
          <TextField
            margin="dense"
            id="price"
            label="Item"
            type="text"
            fullWidth
            value={item}
            onChange={(e) => setItem(e.target.value)}
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
            label="Quantity"
            type="text"
            fullWidth
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            required
          />
          <TextField
            margin="dense"
            id="totalAmount"
            label="Total Amount"
            type="number"
            fullWidth
            value={totalAmount}
            onChange={(e) => setTotalAmount(e.target.value)}
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
          <Button onClick={addOrder} color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={editForm} onClose={() => setShowForm(false)}>
        <DialogTitle>Update order</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Customer Name"
            type="text"
            fullWidth
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            required
          />
          <TextField
            margin="dense"
            id="price"
            label="Item"
            type="text"
            fullWidth
            value={item}
            onChange={(e) => setItem(e.target.value)}
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
            label="Quantity"
            type="text"
            fullWidth
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            required
          />
          <TextField
            margin="dense"
            id="totalAmount"
            label="Total Amount"
            type="number"
            fullWidth
            value={totalAmount}
            onChange={(e) => setTotalAmount(e.target.value)}
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
            onClick={() => setEditForm(false)}
            color="primary"
            type="button"
          >
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
              <th className="py-3 px-6">Customer Name</th>
              <th className="py-3 px-6">Item</th>
              <th className="py-3 px-6">Price</th>
              <th className="py-3 px-6">Quantity</th>
              <th className="py-3 px-6">Total Amount</th>
              <th className="py-3 px-6">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {orderData.map((order, index) => (
              <tr
                key={order.id}
                className="border-b border-gray-200 hover:bg-gray-100"
              >
                <td className="py-3 px-6 text-left whitespace-nowrap">
                  {index + 1}
                </td>
                <td className="py-3 px-6 text-left whitespace-nowrap flex justify-start items-center">
                  <img
                    src={order.customerImage}
                    alt="order Image"
                    style={{
                      width: "50px",
                      height: "50px",
                      borderRadius: "50%",
                      marginRight: "10px",
                    }}
                  />
                  <div>{order.OrderName}</div>
                </td>
                <td className="py-3 px-6 text-left whitespace-nowrap">
                  {order.OrderItems}
                </td>
                <td className="py-3 px-6 text-left whitespace-nowrap">
                  {order.OrderPrice}
                </td>
                <td className="py-3 px-6 text-left whitespace-nowrap">
                  {order.OrderQuantity}
                </td>
                <td className="py-3 px-6 text-left whitespace-nowrap">
                  {order.TotalAmount}
                </td>
                <td className="py-3 px-6 text-center whitespace-nowrap">
                  <div className="flex justify-between items-center">
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleEdit(order)}
                      className="mr-3"
                    >
                      Edit
                    </Button>
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => deleteOrder(order.id)}
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
export default Orders;
