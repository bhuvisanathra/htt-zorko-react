import React, { useEffect, useState } from "react";
import { Header } from "../components";
import { db, auth, storage } from "../Firebase/Firebase";
import {
  collection,
  addDoc,
  query,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
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

const Customers = () => {
  const [CustomerName, setCustomerName] = useState();
  const [customerEmail, setCustomerEmail] = useState();
  const [CustomerImage, setCustomerImage] = useState();
  const [siteLocation, setSiteLocation] = useState("");
  const [status, setStatus] = useState("");
  const [budget, setBudget] = useState("");
  const [state, setState] = useState("");
  const [photo, setPhoto] = useState();
  const [customerData, setCustomerData] = useState();
  const [editForm, setEditForm] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState();

  useEffect(() => {
    const q = query(collection(db, "customers"));
    const unsub = onSnapshot(q, (QuerySnapshot) => {
      let customerArray = [];
      QuerySnapshot.forEach((doc) => {
        customerArray.push({ ...doc.data(), id: doc.id });
      });
      console.log("Fetched orders:", customerArray); // Log fetched orders
      setCustomerData(customerArray);
    });
    return () => unsub();
  }, []);

  const [showForm, setShowForm] = useState(false);

  const addCustomer = async () => {
    const imgRef = ref(storage, `files/${v4()}`);
    const uploadTask = uploadBytes(imgRef, photo);
    const downloadURL = await uploadTask.then((snapshot) =>
      getDownloadURL(snapshot.ref)
    );

    await addDoc(collection(db, "customers"), {
      CustomerName: CustomerName,
      CustomerEmail: customerEmail,
      CustomerImage: downloadURL,
      ProjectName: siteLocation,
      Status: status,
      Budget: budget,
      State: state,
    });
    resetForm();
  };

  const updateCustomer = async () => {
    try {
      let updateData = {
        CustomerName: CustomerName,
        CustomerEmail: customerEmail,
        ProjectName: siteLocation,
        Status: status,
        Budget: budget,
        State: state,
      };

      if (photo) {
        const imgRef = ref(storage, `files/${v4()}`);
        await uploadBytes(imgRef, photo);
        const downloadURL = await getDownloadURL(imgRef);
        console.log("New file available at", downloadURL);
        updateData.CustomerImage = downloadURL;
      } else {
        updateData.CustomerImage = selectedCustomer.CustomerImage;
      }

      await updateDoc(doc(db, "customers", selectedCustomer.id), updateData);

      setEditForm(false);
      resetForm();
      setSelectedCustomer(null);
    } catch (error) {
      console.error("Error updating customer:", error);
    }
  };

  const deleteCustomer = async (id) => {
    try {
      await deleteDoc(doc(db, "customers", id));
    } catch (error) {
      console.error("Error deleting customer:", error);
    }
  };

  const resetForm = () => {
    setCustomerName("");
    setCustomerEmail("");
    setCustomerImage("");
    setSiteLocation("");
    setStatus("");
    setBudget("");
    setState("");
    setPhoto(null);
    setShowForm(false);
  };

  const handleEdit = (customer) => {
    setCustomerName(customer.CustomerName);
    setCustomerEmail(customer.CustomerEmail);
    setSiteLocation(customer.ProjectName);
    setStatus(customer.Status);
    setBudget(customer.Budget);
    setState(customer.State);
    if (customer.CustomerImage) {
      setPhoto(customer.CustomerImage);
    }
    setEditForm(true);
    setSelectedCustomer(customer);
  };

  return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
      <Header category="Page" title="Customers" />
      <div style={{ marginBottom: "1rem", marginRight: "1rem" }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setShowForm(true)}
        >
          Add New Customer
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
            value={CustomerName}
            onChange={(e) => setCustomerName(e.target.value)}
            required
          />
          <TextField
            margin="dense"
            id="email"
            label="Customer Email"
            type="email"
            fullWidth
            value={customerEmail}
            onChange={(e) => setCustomerEmail(e.target.value)}
            required
          />

          <input
            type="file"
            className="mb-2 mt-2"
            onChange={(e) => setPhoto(e.target.files[0])}
          />

          <TextField
            margin="dense"
            id="siteLocation"
            label="Site Location"
            type="text"
            fullWidth
            value={siteLocation}
            onChange={(e) => setSiteLocation(e.target.value)}
            required
          />
          <TextField
            margin="dense"
            id="Status"
            label="Status"
            type="text"
            fullWidth
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            required
          />
          <TextField
            margin="dense"
            id="budget"
            label="Budget"
            type="text"
            fullWidth
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            required
          />
          <TextField
            margin="dense"
            id="location"
            label="State"
            type="text"
            fullWidth
            value={state}
            onChange={(e) => setState(e.target.value)}
            required
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

          <Button onClick={addCustomer} color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={editForm} onClose={() => setShowForm(false)}>
        <DialogTitle>Update Customer</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Customer Name"
            type="text"
            fullWidth
            value={CustomerName}
            onChange={(e) => setCustomerName(e.target.value)}
            required
          />
          <TextField
            margin="dense"
            id="email"
            label="Customer Email"
            type="email"
            fullWidth
            value={customerEmail}
            onChange={(e) => setCustomerEmail(e.target.value)}
            required
          />

          <input
            type="file"
            className="mb-2 mt-2"
            onChange={(e) => setPhoto(e.target.files[0])}
          />

          <TextField
            margin="dense"
            id="siteLocation"
            label="Site Location"
            type="text"
            fullWidth
            value={siteLocation}
            onChange={(e) => setSiteLocation(e.target.value)}
            required
          />
          <TextField
            margin="dense"
            id="Status"
            label="Status"
            type="text"
            fullWidth
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            required
          />
          <TextField
            margin="dense"
            id="budget"
            label="Budget"
            type="text"
            fullWidth
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            required
          />
          <TextField
            margin="dense"
            id="location"
            label="State"
            type="text"
            fullWidth
            value={state}
            onChange={(e) => setState(e.target.value)}
            required
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
          <Button onClick={updateCustomer} color="primary">
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
              <th className="py-3 px-6">Customer Email</th>
              <th className="py-3 px-6">Site Location</th>
              <th className="py-3 px-6">Status</th>
              <th className="py-3 px-6">Budget</th>
              <th className="py-3 px-6">State</th>
              <th className="py-3 px-6">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {customerData?.map((customer, index) => (
              <tr
                key={customer.id}
                className="border-b border-gray-200 hover:bg-gray-100"
              >
                <td className="py-3 px-6 text-left whitespace-nowrap">
                  {index + 1}
                </td>
                <td className="py-3 px-6 text-left whitespace-nowrap flex justify-start items-center">
                  <img
                    src={customer.CustomerImage}
                    alt="customer Image"
                    style={{
                      width: "50px",
                      height: "50px",
                      borderRadius: "50%",
                      marginRight: "10px",
                    }}
                  />
                  <div>{customer.CustomerName}</div>
                </td>
                <td className="py-3 px-6 text-left whitespace-nowrap">
                  {customer.CustomerEmail}
                </td>
                <td className="py-3 px-6 text-left whitespace-nowrap">
                  {customer.ProjectName}
                </td>
                <td className="py-3 px-6 text-left whitespace-nowrap">
                  {customer.Status}
                </td>
                <td className="py-3 px-6 text-left whitespace-nowrap">
                  {customer.Budget}
                </td>
                <td className="py-3 px-6 text-left whitespace-nowrap">
                  {customer.State}
                </td>
                <td className="py-3 px-6 text-center whitespace-nowrap">
                  <div className="flex justify-between items-center">
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleEdit(customer)}
                      className="mr-3"
                    >
                      Edit
                    </Button>
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => deleteCustomer(customer.id)}
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

export default Customers;
