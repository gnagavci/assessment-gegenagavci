import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import VideoCard from "../components/VideoCard";
import "./Home.css";

const Home = () => {
    const { user } = useContext(AuthContext);
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchVideos = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await fetch("/api/videos", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const data = await response.json();
                if (!response.ok) {
                    throw new Error(data.message || "Failed to fetch videos");
                }

                //backend does admin filtering (user sees own, admin sees all)
                setVideos(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchVideos();
    }, [user]);

    return (
        <div className="home-container">
            <div className="video-feed">
                {loading && <p className="feed-message">Loading videos...</p>}
                {error && <p className="feed-message error">{error}</p>}
                {!loading && !error && videos.length === 0 && (
                    <p className="feed-message">
                        You haven't uploaded any videos yet.
                    </p>
                )}
                {videos.map((video) => (
                    <div key={video._id} style={{ marginBottom: "40px" }}>
                        <VideoCard video={video} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Home;
