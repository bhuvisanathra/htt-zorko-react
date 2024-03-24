import React, { useEffect, useState } from "react";
import { Header } from "../components";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@material-ui/core";
import {
  collection,
  addDoc,
  query,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { db, auth, storage } from "../Firebase/Firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 } from "uuid";

const Community = () => {
  const [postData, setPostData] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [postedBy, setPostedBy] = useState("");
  const [photo, setPhoto] = useState(null);
  const [postDescrption, setPostDescription] = useState("");
  const [editForm, setEditForm] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [postName, setPostName] = useState("");

  useEffect(() => {
    const q = query(collection(db, "community"));
    const unsub = onSnapshot(q, (QuerySnapshot) => {
      let postArray = [];
      QuerySnapshot.forEach((doc) => {
        postArray.push({ ...doc.data(), id: doc.id });
      });
      setPostData(postArray);
    });
    return () => unsub();
  }, []);

  const addPost = async () => {
    const imgRef = ref(storage, `files/${v4()}`);
    const uploadTask = uploadBytes(imgRef, photo);
    const downloadURL = await uploadTask.then((snapshot) =>
      getDownloadURL(snapshot.ref)
    );

    await addDoc(collection(db, "community"), {
      PostedBy: postedBy,
      PostDescrption: postDescrption,
      PostImage: downloadURL,
      PostName: postName,
    });
    resetForm();
    setShowForm(false);
  };

  const updatePost = async () => {
    try {
      let updateData = {
        PostedBy: postedBy,
        PostDescrption: postDescrption,
        PostName: postName,
      };
      if (photo) {
        const imgRef = ref(storage, `files/${v4()}`);
        await uploadBytes(imgRef, photo);
        const downloadURL = await getDownloadURL(imgRef);
        updateData.PostImage = downloadURL;
      } else {
        updateData.PostImage = selectedPost.PostImage;
      }

      await updateDoc(doc(db, "community", selectedPost.id), updateData);

      setEditForm(false);
      resetForm();
      setSelectedPost(null);
    } catch (error) {
      console.error("Error updating post:", error);
    }
  };

  const resetForm = () => {
    setPostedBy("");
    setPhoto(null);
    setPostDescription("");
    setPostName("");
  };

  const handleEdit = (post) => {
    setPostedBy(post.PostedBy);
    setPhoto(post.PostImage);
    setPostDescription(post.PostDescrption);
    setPostName(post.PostName);
    setEditForm(true);
    setSelectedPost(post);
  };

  const deletePost = async (id) => {
    try {
      await deleteDoc(doc(db, "community", id));
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  return (
    <div className="container mx-auto py-10 rounded shadow-xl">
      <div className="bg-white rounded-3xl shadow-lg p-8 max-w-6xl mx-auto">
        <Header category="Page" title="Community" />
        <div className="mb-4">
          <Button
            variant="contained"
            color="primary"
            onClick={() => setShowForm(true)}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Add Community Post
          </Button>
        </div>

        <Dialog open={showForm} onClose={() => setShowForm(false)}>
          <DialogTitle className="text-2xl font-bold mb-4 ">
            Add New Post
          </DialogTitle>
          <DialogContent className="mb-4">
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Post Name"
              type="text"
              fullWidth
              value={postName}
              onChange={(e) => setPostName(e.target.value)}
              required
              className="mb-4"
            />
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Posted By"
              type="text"
              fullWidth
              value={postedBy}
              onChange={(e) => setPostedBy(e.target.value)}
              required
              className="mb-4"
            />
            <TextField
              margin="dense"
              id="email"
              label="Post Description"
              type="email"
              fullWidth
              value={postDescrption}
              onChange={(e) => setPostDescription(e.target.value)}
              required
              className="mb-4"
            />
            <input
              type="file"
              className="mb-4 mt-4"
              onChange={(e) => setPhoto(e.target.files[0])}
            />
          </DialogContent>
          <DialogActions className="mt-4">
            <Button
              onClick={() => setShowForm(false)}
              color="primary"
              type="button"
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mr-2"
            >
              Cancel
            </Button>

            <Button
              onClick={addPost}
              color="primary"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Add
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog open={editForm} onClose={() => setEditForm(false)}>
          <DialogTitle className="text-2xl font-bold mb-4">
            Edit Post
          </DialogTitle>
          <DialogContent className="mb-4">
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Post Name"
              type="text"
              fullWidth
              value={postName}
              onChange={(e) => setPostName(e.target.value)}
              required
              className="mb-4"
            />
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Posted By"
              type="text"
              fullWidth
              value={postedBy}
              onChange={(e) => setPostedBy(e.target.value)}
              required
              className="mb-4"
            />
            <TextField
              margin="dense"
              id="email"
              label="Post Description"
              type="email"
              fullWidth
              value={postDescrption}
              onChange={(e) => setPostDescription(e.target.value)}
              required
              className="mb-4"
            />

            <input
              type="file"
              className="mb-4 mt-4"
              onChange={(e) => setPhoto(e.target.files[0])}
            />
          </DialogContent>
          <DialogActions className="mt-4">
            <Button
              onClick={() => setEditForm(false)}
              color="primary"
              type="button"
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mr-2"
            >
              Cancel
            </Button>

            <Button
              onClick={updatePost}
              color="primary"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Update
            </Button>
          </DialogActions>
        </Dialog>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {postData?.map((post) => (
            <div
              key={post.id}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <div className="flex flex-col md:flex-row">
                <img
                  src={post.PostImage}
                  alt={`Post by ${post.PostedBy}`}
                  className="md:w-1/2 h-48 object-cover"
                />
                <div className="p-4 md:w-1/2">
                  <h2 className="text-2xl font-bold mb-2 mt-2 text-blue-600">
                    {post.PostName}
                  </h2>
                  <h1 className="text-lg font-bold mb-2">Post Description</h1>
                  <p className="text-gray-700 text-base mb-4">
                    {post.PostDescrption}
                  </p>
                  <div className="flex justify-end">
                    <button
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
                      onClick={() => handleEdit(post)}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                      onClick={() => deletePost(post.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Community;
