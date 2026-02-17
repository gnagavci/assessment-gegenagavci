import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Upload.css";

const Upload = () => {
    const [title, setTitle] = useState("");
    const [file, setFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");

        if (!file) {
            setError("Please select a video file");
            return;
        }

        const formData = new FormData(); //files = binary data, can't be handled with JSON
        formData.append("video", file);
        formData.append("title", title);

        setIsUploading(true);

        try {
            const token = localStorage.getItem("token");
            const response = await fetch("/api/videos", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Upload failed");
            }

            navigate("/");
        } catch (error) {
            setError(error.message);
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="upload-container">
            <div className="upload-card">
                <h2>Upload Video</h2>
                {error && <p className="upload-error">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="title">Title</label>
                        <input
                            type="text"
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Give your video a title"
                            required
                            disabled={isUploading}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="video-file">Video File</label>
                        <input
                            type="file"
                            id="video-file"
                            accept="video/*" //allow user only videos
                            onChange={(e) => setFile(e.target.files[0])}
                            required
                            disabled={isUploading}
                        />
                    </div>
                    <button
                        type="submit"
                        className="upload-btn"
                        disabled={isUploading || !title.trim() || !file}
                    >
                        {isUploading ? "Uploading... please wait" : "Upload"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Upload;
