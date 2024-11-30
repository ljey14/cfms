// resources/js/components/FeedbackForm.js

import React, { useState } from 'react';

function FeedbackForm() {
    const [feedback, setFeedback] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        fetch('/submit-feedback', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content, // Laravel CSRF token
            },
            body: JSON.stringify({ feedback }),
        })
        .then(response => response.json())
        .then(data => alert('Feedback submitted successfully!'))
        .catch(error => alert('There was an error submitting your feedback.'));
    };

    return (
        <form onSubmit={handleSubmit}>
            <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Write your feedback here"
                required
            />
            <button type="submit">Submit Feedback</button>
        </form>
    );
}

export default Feedback;
