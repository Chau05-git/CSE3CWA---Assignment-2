"use client";

import Link from "next/link";
import "./esc-room.css";
import EscTimer from "./Time/EscTimer";

export default function EscapeRoomPage() {
    return (
        <main className="escape-room-page">
            <div className ="Headline">
                <p> Escape Room challenge!</p>
            </div>
            <EscTimer initialSeconds={70} autoStart={false} onExpire={() => {alert("⏰ Time's up")}} />
            <Link href="/">Go back to Home</Link>
        </main>
    );
}

