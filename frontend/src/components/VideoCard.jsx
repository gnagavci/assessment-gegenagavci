import { useState, useEffect, useContext, useRef } from "react";
import { AuthContext } from "../context/AuthContext";
import "./VideoCard.css";

const VideoCard = ({ video }) => {
    const { user } = useContext(AuthContext);
    const [annotations, setAnnotations] = useState([]);
    const [bookmarks, setBookmarks] = useState([]);
    const [activeAnnotation, setActiveAnnotation] = useState(null);
    const [text, setText] = useState("");
    const [bookmarkTitle, setBookmarkTitle] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const playerRef = useRef(null);

    useEffect(() => {
        const fetchAnnotations = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await fetch(
                    `/api/videos/${video._id}/annotations`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    },
                );

                const data = await response.json();
                if (response.ok) {
                    setAnnotations(data);
                }
            } catch (error) {
                console.error(`Failed to fetch annotations: ${error}`);
            }
        };
        fetchAnnotations();
    }, [video._id, user]);

    useEffect(() => {
        const fetchBookmarks = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await fetch(
                    `/api/videos/${video._id}/bookmarks`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    },
                );

                const data = await response.json();
                if (response.ok) {
                    setBookmarks(data);
                }
            } catch (error) {
                console.error(`Failed to fetch bookmarks: ${error}`);
            }
        };
        fetchBookmarks();
    }, [video._id, user]);

    //set active annotation to the one within one second of the playing time
    const handleProgress = (state) => {
        const time = state.playedSeconds;

        const match = annotations.find(
            (annotation) => Math.abs(annotation.timestamp - time) <= 1,
        );

        setActiveAnnotation(match || null);
    };

    //set currentTime to Bookmark timestamp and play
    const handleBookmarkClick = (timestamp) => {
        if (playerRef.current) {
            playerRef.current.currentTime = timestamp;
            playerRef.current.play();
        }
    };

    const handleAddAnnotation = async (e) => {
        e.preventDefault();
        if (!text.trim()) return;

        let timestamp;
        if (playerRef.current) {
            timestamp = playerRef.current.currentTime;
        } else {
            timestamp = 0;
        }

        setIsSubmitting(true);

        try {
            const token = localStorage.getItem("token");
            const response = await fetch(
                `/api/videos/${video._id}/annotations`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ text, timestamp }),
                },
            );

            if (response.ok) {
                const savedAnnotation = await response.json();
                //attach current user info to annotation
                savedAnnotation.user = {
                    _id: user._id,
                    username: user.username,
                };
                //add annotation to array
                setAnnotations((prev) => [...prev, savedAnnotation]);
                setText("");
            } else {
                alert("Failed to save annotation");
            }
        } catch (error) {
            console.error(`Error saving annotation: ${error}`);
            alert("Failed to save annotation");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleAddBookmark = async (event) => {
        event.preventDefault();

        if (playerRef.current) {
            playerRef.current.pause();
        }

        if (!bookmarkTitle.trim()) return;

        let timestamp;
        if (playerRef.current) {
            timestamp = playerRef.current.currentTime;
        } else {
            timestamp = 0;
        }

        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`/api/videos/${video._id}/bookmarks`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    title: bookmarkTitle.trim(),
                    timestamp,
                }),
            });
            if (response.ok) {
                const savedBookmark = await response.json();

                savedBookmark.user = {
                    _id: user._id,
                    username: user.username,
                };

                //add & sort asc according to timestamp
                setBookmarks((prev) =>
                    [...prev, savedBookmark].sort(
                        (a, b) => a.timestamp - b.timestamp,
                    ),
                );

                setBookmarkTitle("");
            } else {
                alert("Failed to save bookmark");
            }
        } catch (error) {
            console.error(`Error saving bookmark: ${error}`);
            alert("Failed to save bookmark");
        }
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        const formattedSecs = secs.toString().padStart(2, "0");
        return `${mins}:${formattedSecs}`;
    };

    return (
        <div className="video-card">
            <div className="player-wrapper">
                {video.videoUrl ? (
                    <video
                        ref={playerRef}
                        src={video.videoUrl}
                        controls
                        width="100%"
                        height="100%"
                        onTimeUpdate={(e) =>
                            handleProgress({
                                playedSeconds: e.target.currentTime,
                            })
                        }
                        onError={(error) =>
                            console.error(`Video playback error: ${error}`)
                        }
                        style={{ display: "block" }}
                    />
                ) : (
                    <div className="player-fallback">
                        <p>Video source not found.</p>
                    </div>
                )}
                {activeAnnotation && (
                    <div className="annotation-overlay">
                        <span className="annotation-text">
                            {activeAnnotation.text}
                        </span>
                    </div>
                )}
            </div>
            <div className="video-meta">
                <h3 className="video-title">{video.title}</h3>
                <p className="video-uploader">
                    {video.uploader?.username || "Unknown"}
                </p>
            </div>
            <div className="video-controls">
                <form
                    className="annotation-form"
                    onSubmit={handleAddAnnotation}
                >
                    <input
                        type="text"
                        className="annotation-input"
                        placeholder="Add note at current time"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        disabled={isSubmitting}
                    />
                    <button
                        type="submit"
                        className="annotation-submit"
                        disabled={isSubmitting || !text.trim()}
                    >
                        {isSubmitting ? "Creating..." : "Create Annotation"}
                    </button>
                </form>
                <form className="bookmark-form" onSubmit={handleAddBookmark}>
                    <input
                        type="text"
                        className="bookmark-input"
                        placeholder="Add Bookmark title"
                        value={bookmarkTitle}
                        onChange={(e) => setBookmarkTitle(e.target.value)}
                    />
                    <button
                        type="submit"
                        className="bookmark-submit"
                        disabled={!bookmarkTitle.trim()}
                    >
                        Create Bookmark
                    </button>
                </form>
            </div>
            {bookmarks.length > 0 && (
                <div className="bookmarks-section">
                    <h4 className="bookmarks-heading">Bookmarks</h4>
                    <ul className="bookmarks-list">
                        {bookmarks.map((bm) => (
                            <li
                                key={bm._id}
                                className="bookmark-item"
                                onClick={() =>
                                    handleBookmarkClick(bm.timestamp)
                                }
                            >
                                <span className="bookmark-time">
                                    {formatTime(bm.timestamp)}
                                </span>
                                <span className="bookmark-title">
                                    {bm.title}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};
export default VideoCard;
