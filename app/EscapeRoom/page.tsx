import Link from "next/link";
import "./esc-room.css";

const EscapeRoomPage = () => {
    return (
        <main className="escape-room-page">
            <h1>Escape Room</h1>
            <p>Welcome to the Escape Room challenge!</p>
            <Link href="/">Go back to Home</Link>
        </main>
    );
}

export default EscapeRoomPage;