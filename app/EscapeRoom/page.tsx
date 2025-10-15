import Link from "next/link";
import "./esc-room.css";

export default function EscapeRoomPage() {
    return (
        <main className="escape-room-page">
            <div className ="Headline">
                <p> Escape Room challenge!</p>
            </div>
            
            <Link href="/">Go back to Home</Link>
        </main>
    );
}

