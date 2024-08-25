import React, { useState, useEffect } from 'react';
import './Loader.css';

function Loader() {
    const messages = [
        "Crafting your perfect week...",
        "Designing your ideal weekend...",
        "Adding a splash of color...",
        "Putting the final touches...",
        "Getting everything just right...",
        "Double-checking the details...",
        "Making it look awesome...",
        "Almost there, stay with us...",
        "Just a few more seconds...",
        "Your plan is almost ready..."
    ];

    const [currentMessage, setCurrentMessage] = useState(0);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentMessage((prevMessage) => (prevMessage + 1) % messages.length);
        }, 3000); // Change the text every 3 seconds

        return () => clearInterval(intervalId);
    }, [messages.length]);

    return (
        <div className="container">
            <h3>Please Wait...</h3>
            <div className="loader"></div>
            <h3 className='message'>{messages[currentMessage]}</h3>
        </div>
    );
}

export default Loader;
