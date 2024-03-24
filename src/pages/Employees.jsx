import React, { useState, useEffect } from "react";
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
import { v4 } from "uuid";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

const Employees = () => {
  const [showForm, setShowForm] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [employeeName, setEmployeeName] = useState();
  const [designation, setDesignation] = useState();
  const [country, setCountry] = useState();
  const [hireDate, setHireDate] = useState();
  const [reportTo, setReportTo] = useState();
  const [photo, setPhoto] = useState();
  const [editForm, setEditForm] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  useEffect(() => {
    const q = query(collection(db, "employees"));
    const unsub = onSnapshot(q, (QuerySnapshot) => {
      let employeeArray = [];
      QuerySnapshot.forEach((doc) => {
        employeeArray.push({ ...doc.data(), id: doc.id });
      });
      setEmployees(employeeArray);
    });
    return () => unsub();
  }, []);

  const addEmployee = async () => {
    try {
      const imgRef = ref(storage, `files/employee/${v4()}`);
      const uploadTask = uploadBytes(imgRef, photo);
      uploadTask
        .then((snapshot) => {
          return getDownloadURL(snapshot.ref);
        })
        .then((downloadURL) => {
          console.log("File available at", downloadURL);
          addDoc(collection(db, "employees"), {
            Name: employeeName,
            Title: designation,
            Country: country,
            HireDate: hireDate,
            ReportsTo: reportTo,
            employeeImage: downloadURL,
          });
        });
      // await addDoc(collection(db, "employees"), {
      //   Name: employeeName,
      //   Title: designation,
      //   Country: country,
      //   HireDate: hireDate,
      //   ReportsTo: reportTo,
      //   employeeImage: photo,
      // });

      setShowForm(false);
      setEmployeeName("");
      setDesignation("");
      setCountry("");
      setHireDate("");
      setReportTo("");
      setPhoto(null);
    } catch (error) {
      console.error("Error adding employee:", error);
    }
  };

  const updateEmployee = async () => {
    try {
      let employeeData = {
        Name: employeeName,
        Title: designation,
        Country: country,
        HireDate: hireDate,
        ReportsTo: reportTo,
      };

      if (photo) {
        const imgRef = ref(storage, `files/employee/${v4()}`);
        const uploadTask = uploadBytes(imgRef, photo);
        const snapshot = await uploadTask;
        const downloadURL = await getDownloadURL(snapshot.ref);
        console.log("New file available at", downloadURL);
        employeeData.employeeImage = downloadURL;
      }

      await updateDoc(doc(db, "employees", selectedEmployee.id), employeeData);

      setEditForm(false);
      setEmployeeName("");
      setDesignation("");
      setCountry("");
      setHireDate("");
      setReportTo("");
      setPhoto(null);
      setSelectedEmployee(null);
    } catch (error) {
      console.error("Error updating employee:", error);
    }
  };

  const deleteEmployee = async (id) => {
    await deleteDoc(doc(db, "employees", id));
  };

  const handleEdit = (employee) => {
    setEmployeeName(employee.Name);
    setDesignation(employee.Title);
    setCountry(employee.Country);
    setHireDate(employee.HireDate);
    setReportTo(employee.ReportsTo);
    setSelectedEmployee(employee);
    setPhoto(employee.employeeImage);
    setEditForm(true);
  };

  return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
      <Header category="Page" title="Employees" />
      <div>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setShowForm(true)}
          style={{ marginBottom: "1rem", marginRight: "1rem" }}
        >
          Add New Employee
        </Button>
      </div>
      <Dialog open={showForm} onClose={() => setShowForm(false)}>
        <DialogTitle>Add New Employee</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="employeeName"
            label="Employee Name"
            type="text"
            fullWidth
            value={employeeName}
            onChange={(e) => setEmployeeName(e.target.value)}
            required
            style={{ marginBottom: "1rem" }}
          />
          <TextField
            margin="dense"
            id="designation"
            label="Designation"
            type="text"
            fullWidth
            value={designation}
            onChange={(e) => setDesignation(e.target.value)}
            required
            style={{ marginBottom: "1rem" }}
          />
          <TextField
            margin="dense"
            id="country"
            label="Country"
            type="text"
            fullWidth
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            required
            style={{ marginBottom: "1rem" }}
          />
          <TextField
            margin="dense"
            id="hireDate"
            label="Hire Date"
            type="date"
            fullWidth
            value={hireDate}
            onChange={(e) => setHireDate(e.target.value)}
            required
            style={{ marginBottom: "1rem" }}
          />
          <TextField
            margin="dense"
            id="reportTo"
            label="Report To"
            type="text"
            fullWidth
            value={reportTo}
            required
            onChange={(e) => setReportTo(e.target.value)}
            style={{ marginBottom: "1rem" }}
          />
          <input
            type="file"
            className="mb-2 mt-2"
            onChange={(e) => setPhoto(e.target.files[0])}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowForm(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={addEmployee} color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={editForm} onClose={() => setEditForm(false)}>
        <DialogTitle>Edit Employee</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="employeeName"
            label="Employee Name"
            type="text"
            fullWidth
            value={employeeName}
            onChange={(e) => setEmployeeName(e.target.value)}
            required
            style={{ marginBottom: "1rem" }}
          />
          <TextField
            margin="dense"
            id="designation"
            label="Designation"
            type="text"
            fullWidth
            value={designation}
            onChange={(e) => setDesignation(e.target.value)}
            required
            style={{ marginBottom: "1rem" }}
          />
          <TextField
            margin="dense"
            id="country"
            label="Country"
            type="text"
            fullWidth
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            required
            style={{ marginBottom: "1rem" }}
          />
          <TextField
            margin="dense"
            id="hireDate"
            label="Hire Date"
            type="date"
            fullWidth
            value={hireDate}
            onChange={(e) => setHireDate(e.target.value)}
            required
            style={{ marginBottom: "1rem" }}
          />
          <TextField
            margin="dense"
            id="reportTo"
            label="Report To"
            type="text"
            fullWidth
            value={reportTo}
            required
            onChange={(e) => setReportTo(e.target.value)}
            style={{ marginBottom: "1rem" }}
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
          <Button onClick={updateEmployee} color="primary">
            Update
          </Button>
        </DialogActions>
      </Dialog>

      <div className="overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-6">No.</th>
              <th className="py-3 px-6">Name</th>
              <th className="py-3 px-6">Title</th>
              <th className="py-3 px-6">Country</th>
              <th className="py-3 px-6">Hire Date</th>
              <th className="py-3 px-6">Reports To</th>
              <th className="py-3 px-6">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {employees.map((employee, index) => (
              <tr
                key={employee.id}
                className="border-b border-gray-200 hover:bg-gray-100"
              >
                <td className="py-3 px-6 text-left whitespace-nowrap">
                  {index + 1}
                </td>
                <td className="py-3 px-6 text-left whitespace-nowrap flex justify-center items-center">
                  <img
                    src={employee.employeeImage}
                    alt="Product Image"
                    style={{
                      width: "50px",
                      height: "50px",
                      borderRadius: "50%",
                      marginRight: "10px",
                    }}
                  />
                  <div>{employee.Name}</div>
                </td>
                <td className="py-3 px-6 text-left whitespace-nowrap">
                  {employee.Title}
                </td>
                <td className="py-3 px-6 text-left whitespace-nowrap">
                  {employee.Country}
                </td>
                <td className="py-3 px-6 text-left whitespace-nowrap">
                  {employee.HireDate}
                </td>
                <td className="py-3 px-6 text-left whitespace-nowrap">
                  {employee.ReportsTo}
                </td>
                <td className="py-3 px-6 text-center whitespace-nowrap">
                  <div className="flex justify-between items-center">
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleEdit(employee)}
                      className="mr-3"
                    >
                      Edit
                    </Button>
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => deleteEmployee(employee.id)}
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

export default Employees;
