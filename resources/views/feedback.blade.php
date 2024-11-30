<!DOCTYPE html>
<html lang="en"> <!-- Add the lang attribute -->
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0"> <!-- Add viewport meta -->
    <title>Feedback Form</title> <!-- Add a title -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <style>
        body {
            background-color: #123524; /* Dark green background */
            color: #000;
            font-family: Arial, sans-serif;
        }
        .container {
            background-color: #fff;
            padding: 20px;
            border-radius: 8px;
            margin-top: 30px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        .form-title {
            text-align: center;
            font-size: 1.5rem;
            margin-bottom: 20px;
        }
        .btn-submit {
            background-color: #2e6930; /* Green button */
            color: #fff;
        }
        .btn-submit:hover {
            background-color: #245823;
        }
        .rating-group {
            display: flex;
            justify-content: center;
            gap: 10px;
            margin: 10px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="text-center">
            <img src="logo-placeholder.png" alt="Logo" style="max-width: 80px;">
            <h4>Mindoro State University</h4>
            <p>Bonabong Campus</p>
        </div>
        <h2 class="form-title">Customer Feedback Form</h2>
        
        <form action="/submit-feedback" method="POST">
            @csrf <!-- Include CSRF token -->
            <div class="row mb-3">
                <div class="col-md-6">
                    <label for="clientType" class="form-label">Client Type:</label>
                    <select id="clientType" name="client_type" class="form-select" required>
                        <option value="">Select</option>
                        <option value="Student">Student</option>
                        <option value="Faculty">Faculty</option>
                        <option value="Visitor">Visitor</option>
                    </select>
                </div>
                <div class="col-md-6">
                    <label for="transaction" class="form-label">Transaction:</label>
                    <input type="text" id="transaction" name="transaction" class="form-control" placeholder="Transaction">
                </div>
            </div>
            <div class="row mb-3">
                <div class="col-md-6">
                    <label for="office" class="form-label">Office:</label>
                    <select id="office" name="office" class="form-select" required>
                        <option value="">Select</option>
                        <option value="Registrar">Registrar</option>
                        <option value="Finance">Finance</option>
                        <option value="Library">Library</option>
                    </select>
                </div>
                <div class="col-md-6">
                    <label for="transactionCode" class="form-label">Transaction Code:</label>
                    <input type="text" id="transactionCode" name="transaction_code" class="form-control" placeholder="Transaction code" readonly>
                </div>
            </div>

            <h5 class="mt-4">Rate the questions below based on your experience:</h5>
            <p>5 - Outstanding | 4 - Very Good | 3 - Good | 2 - Fair | 1 - Poor</p>
            
            <div class="mb-3">
                <label class="form-label">How do you rate the office of the following:</label>
                <div class="rating-group">
                    <label>5 <input type="radio" name="rating1" value="5"></label>
                    <label>4 <input type="radio" name="rating1" value="4"></label>
                    <label>3 <input type="radio" name="rating1" value="3"></label>
                    <label>2 <input type="radio" name="rating1" value="2"></label>
                    <label>1 <input type="radio" name="rating1" value="1"></label>
                </div>
            </div>

            <div class="mb-3">
                <label for="feedbackMessage" class="form-label">Feedback Message:</label>
                <textarea id="feedbackMessage" name="message" class="form-control" rows="4" placeholder="Type your feedback here..." required></textarea>
            </div>

            <div class="text-center">
                <button type="submit" class="btn btn-submit">Submit</button>
            </div>
        </form>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
