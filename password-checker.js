function calculatePasswordStrength(password) {
    // Define scoring formula
    let score = 0;
    const n = 3; // You can set your own values for n and other parameters

    // Initialize variables for counting additions
    let numbers = 0;
    let symbols = 0;
    let middleNumbersOrSymbols = 0;

    // Additions
    score += password.length * 4;

    // Count the number of uppercase letters, lowercase letters, numbers, and symbols
    let uppercaseCount = 0;
    let lowercaseCount = 0;
    let numbersCount = 0;
    let symbolsCount = 0;

    for (const char of password) {
        if (/[A-Z]/.test(char)) {
            uppercaseCount++;
        } else if (/[a-z]/.test(char)) {
            lowercaseCount++;
        } else if (/\d/.test(char)) {
            numbersCount++;
        } else if (/[\W_]/.test(char)) {
            symbolsCount++;
        }
    }

    // Use these counts to calculate the scores
    score += uppercaseCount * 2;
    score += lowercaseCount * 2;
    score += numbersCount * 4;
    score += symbolsCount * 6;

    // Calculate middle numbers or symbols
    middleNumbersOrSymbols = password.substring(1, password.length - 1).split('').filter(char => /\d|[\W_]/.test(char)).length;

    // Apply the points for middle numbers/symbols
    score += middleNumbersOrSymbols * 2;

    // Count the number of repeated characters
    const repeatChars = password.length - new Set(password.toLowerCase()).size;

    // Deduct for repeated characters (case-insensitive)
    score -= repeatChars * 0.5;

    // Deduct for consecutive uppercase letters
    score -= (password.match(/[A-Z]{2,}/g) || []).reduce((total, match) => (match.length - 1) * 2, 0);

    // Deduct for consecutive lowercase letters
    score -= (password.match(/[a-z]{2,}/g) || []).reduce((total, match) => (match.length - 1) * 2, 0);

    // Deduct for consecutive numbers
    score -= (password.match(/\d{2,}/g) || []).reduce((total, match) => (match.length - 1) * 2, 0);

    // Deduct for sequential letters (e.g., "abc", "zyx")
    score -= (password.match(/[a-zA-Z]{3,}/g) || []).reduce((total, match) => (match.length - 2) * 3, 0);

    // Deduct for sequential numbers (e.g., "123", "987")
    score -= (password.match(/\d{3,}/g) || []).reduce((total, match) => (match.length - 2) * 3, 0);

    // Deduct for sequential symbols (e.g., "!@#", "#$%", "$%^")
    score -= (password.match(/[\W_]{3,}/g) || []).reduce((total, match) => (match.length - 2) * 3, 0);

    // Requirements: Add a flat score for meeting certain requirements
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSymbol = /[\W_]/.test(password);

    if (hasUppercase && hasLowercase && hasNumber && hasSymbol) {
        score += n * 2; // Adjust "n" as needed
    }

    // Calculate the number of uppercase and lowercase letters
    const totalLength = password.length;
    const upperCaseCount = password.replace(/[^A-Z]/g, "").length;
    const lowerCaseCount = password.replace(/[^a-z]/g, "").length;

    // Apply the points for uppercase and lowercase letters (modified to account for not being used)
    score += (hasUppercase ? (totalLength - upperCaseCount) * 2 : 0);
    score += (hasLowercase ? (totalLength - lowerCaseCount) * 2 : 0);

    // Apply the points for symbols (modified to account for not being used)
    score += (hasSymbol ? symbolsCount * 6 : 0);

    // Ensure the score is within the 0-100 range
    score = Math.max(0, Math.min(100, score));

    // Update the variable scores
    const variableScores = {
        'Length (Addition)': password.length * 4,
        'Uppercase Letters (Addition)': (hasUppercase ? (totalLength - upperCaseCount) * 2 : 0),
        'Lowercase Letters (Addition)': (hasLowercase ? (totalLength - lowerCaseCount) * 2 : 0),
        'Numbers (Addition)': numbersCount * 4,
        'Symbols (Addition)': hasSymbol ? symbolsCount * 6 : 0,
        'Middle Numbers/Symbols (Addition)': middleNumbersOrSymbols * 2,
        'Repeat Characters (Deduction)': repeatChars * 0.5,
        'Numbers Only (Deduction)': (password.match(/^\d+$/) ? password.length : 0) * -1,
        'Letters Only (Deduction)': (password.match(/^[A-Za-z]+$/) ? password.length : 0) * -1,
        'Consecutive Uppercase Letters (Deduction)': (password.match(/[A-Z]{2,}/g) || []).reduce((total, match) => (match.length - 1) * 2, 0),
        'Consecutive Lowercase Letters (Deduction)': (password.match(/[a-z]{2,}/g) || []).reduce((total, match) => (match.length - 1) * 2, 0),
        'Consecutive Numbers (Deduction)': (password.match(/\d{2,}/g) || []).reduce((total, match) => (match.length - 1) * 2, 0),
        'Sequential Letters (Deduction)': (password.match(/[a-zA-Z]{3,}/g) || []).reduce((total, match) => (match.length - 2) * 3, 0),
        'Sequential Numbers (Deduction)': (password.match(/\d{3,}/g) || []).reduce((total, match) => (match.length - 2) * 3, 0),
        'Sequential Symbols (Deduction)': (password.match(/[\W_]{3,}/g) || []).reduce((total, match) => (match.length - 2) * 3, 0),
        'Requirements (Addition)': (hasUppercase && hasLowercase && hasNumber && hasSymbol) ? n * 2 : 0,
    };

    updateVariableScores(variableScores);

    return score;
}

function updateVariableScores(scores) {
    const variableScores = document.getElementById('variableScores');
    variableScores.innerHTML = '';

    for (const variable in scores) {
        const score = scores[variable];
        const listItem = document.createElement('li');
        listItem.innerHTML = `<strong>${variable}:</strong> Score: ${score}`;
        variableScores.appendChild(listItem);
    }
}

function updatePasswordStrength() {
    const password = document.getElementById('passwordInput').value;
    const passwordStrength = calculatePasswordStrength(password);

    document.getElementById('passwordStrength').textContent = passwordStrength;
}

let passwordChart;
