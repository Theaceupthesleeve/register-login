import React, { useRef, useState, useEffect } from "react";
import { collection, addDoc, getDocs, updateDoc, doc, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "../firebaseconfig/config";
import { auth } from "../firebaseconfig/config"; 
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { FiMessageCircle } from "react-icons/fi";

const InstagramClone = () => {
  const [posts, setPosts] = useState([]);
  const [text, setText] = useState("");
  const [comments, setComments] = useState({});
  const [commentText, setCommentText] = useState({});
  const postInput = useRef();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "posts"));
        const postsArray = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPosts(postsArray);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };
    fetchPosts();
  }, []);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
  
    try {
      const user = auth.currentUser;
      if (!user) {
        console.error("User not logged in");
        return;
      }
  
      const docRef = await addDoc(collection(db, "posts"), {
        text,
        timestamp: new Date(),
        likes: 0,
        email: user.email, // Store user email
      });
  
      setPosts((prevPosts) => [
        { id: docRef.id, text, timestamp: new Date(), likes: 0, email: user.email },
        ...prevPosts,
      ]);
      setText("");
    } catch (error) {
      console.error("Error adding document:", error);
    }
  };
  

  const handleLike = async (postId, currentLikes) => {
    try {
      const postRef = doc(db, "posts", postId);
      await updateDoc(postRef, {
        likes: currentLikes + 1,
      });
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId ? { ...post, likes: currentLikes + 1 } : post
        )
      );
    } catch (error) {
      console.error("Error updating likes:", error);
    }
  };

  const fetchComments = (postId) => {
    const q = query(collection(db, "posts", postId, "comments"), orderBy("timestamp", "asc"));
    return onSnapshot(q, (snapshot) => {
      const postComments = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setComments((prevComments) => ({
        ...prevComments,
        [postId]: postComments,
      }));
    });
  };

  const handleAddComment = async (postId) => {
    if (!commentText[postId]?.trim()) return;
    try {
      await addDoc(collection(db, "posts", postId, "comments"), {
        text: commentText[postId],
        timestamp: new Date(),
      });
      setCommentText((prev) => ({
        ...prev,
        [postId]: "",
      }));
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen flex">
      <aside className="fixed left-0 top-0 h-full w-64 bg-gray-800 text-white p-6 shadow-lg">
        <h2 className="flex text-3xl font- mb-6"><FaInstagram />Instagram
        </h2>
        <ul className="space-y-4">
          <li><a href="#" className="hover:text-pink-400 block">Feed</a></li>
          <li><a href="#" className="hover:text-pink-400 block">Explore</a></li>
          <li><a href="#" className="hover:text-pink-400 block">Marketplace</a></li>
          <li><a href="#" className="hover:text-pink-400 block">Groups</a></li>
          <li><a href="#" className="hover:text-pink-400 block">My Favorites</a></li>
          <li><a href="#" className="hover:text-pink-400 block">Messages</a></li>
          <li><a href="#" className="hover:text-pink-400 block">Settings</a></li>
        </ul>
        <br />

      </aside>

      <div className="flex-1 mr-30 p-8">
      <form onSubmit={handleSubmit} className="bg-white p-4 shadow-md rounded-md w-[500px] mx-auto">
  <input 
    type="text"
    value={text}
    onChange={(e) => setText(e.target.value)}
    placeholder="What's on your mind?"
    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none"
  />

  <div className="flex justify-between mt-3">
    <button className="flex items-center space-x-2 text-gray-600 hover:text-red-500">
      <span>Live Video</span>
    </button>
    <button className="flex items-center space-x-2 text-gray-600 hover:text-blue-500">
      <span>Photos</span>
    </button>
    <button className="flex items-center space-x-2 text-gray-600 hover:text-yellow-500">
      <span>Feeling</span>
    </button>
  </div>

  <button 
    type="submit"
    className="mt-3 bg-pink-600 text-white py-2 px-4 rounded-md hover:bg-pink-800 w-full"
  >
    Post
  </button>
</form>


        <div className="mt-10 mr-30flex flex-col items-center">
          {posts.map((post) => (
            <div key={post.id} className="bg-white p-5 shadow-lg rounded-lg w-[500px] mb-4">
            <p className="text-sm text-gray-500">{post.email || "Unknown User"}</p>
            <p className="font-semibold text-lg">{post.text}</p>
            <p className="text-sm text-gray-500">{new Date(post.timestamp.seconds * 1000).toLocaleString()}</p>
              <div className="flex justify-between mt-3 items-center">
                <div className="flex items-center space-x-2">
                  <button onClick={() => handleLike(post.id, post.likes)}>
                    {post.likes > 0 ? <FaHeart className="text-red-500" /> : <FaRegHeart />}
                  </button>
                  <span>{post.likes}</span>
                </div>
                <FiMessageCircle 
                  className="cursor-pointer text-xl"
                  onClick={() => fetchComments(post.id)}
                />
              </div>

              <div className="mt-4 border-t pt-2">
                {comments[post.id]?.map((comment) => (
                  <p key={comment.id} className="text-sm text-gray-700">{comment.text}</p>
                  
                ))}

                <div className="flex items-center mt-2">
                  <input 
                    type="text"
                    placeholder="Add a comment..."
                    value={commentText[post.id] || ""}
                    onChange={(e) => setCommentText({ ...commentText, [post.id]: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                  <button 
                    onClick={() => handleAddComment(post.id)}
                    className="ml-2 bg-pink-600 text-white py-1 px-3 rounded-md hover:bg-pink-800 pointer"
                  >
                    Post
                  </button>
                </div>
              </div>
            </div>
          ))}

          <aside className="fixed right-0 top-0 h-full w-64 bg-white p-6 shadow-lg">
      <h3 className="text-lg font-semibold mb-4">You might like..</h3>
      <ul className="space-y-2">
        <li className="flex items-center space-x-3">
          <img src="https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.vectorstock.com%2Froyalty-free-vectors%2Fperson-placeholder-vectors&psig=AOvVaw27WparG9EJljbINaar5QyY&ust=1739207886961000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCKCW8buMt4sDFQAAAAAdAAAAABAJ" className="w-9 h-9 rounded-full" />
          <span className="text-gray-700">John Doe</span><br />
          <button className="text-blue-500 hover:underline">Follow</button>
        </li>
        <li className="flex items-center space-x-3">
          <img src="https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.vectorstock.com%2Froyalty-free-vectors%2Fperson-placeholder-vectors&psig=AOvVaw27WparG9EJljbINaar5QyY&ust=1739207886961000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCKCW8buMt4sDFQAAAAAdAAAAABAJ" className="w-10 h-10 rounded-full" />
          <span className="text-gray-700">Jane Smith</span>
          <button className="text-blue-500 hover:underline">Follow</button>
        </li>
      </ul>

      <h3 className="text-lg font-semibold mt-6 mb-4">Upcoming events</h3>
      <ul className="space-y-2">
        <li className="text-gray-600 text-sm">🔥 "New Year, New Goals!" - 12k likes</li>
        <li className="text-gray-600 text-sm">🏆 "Best moments of 2024" - 9k likes</li>
      </ul>

      <h3 className="text-lg font-semibold mt-6 mb-4">Notifications</h3>
      <ul className="space-y-2">
        <li className="text-gray-600 text-sm">💬 Alex commented on your post</li>
        <li className="text-gray-600 text-sm">❤️ Sarah liked your photo</li>
      </ul>
    </aside>
  </div>


        
      </div>
    </div>
    
  );
};

export default InstagramClone;
