function calculateAttention(words, divider) {
    const n = words.length;
    
    let seed = 42;
    function random() {
        let x = Math.sin(seed++) * 10000;
        return x - Math.floor(x);
    }

    let Q = words.map(() => Array.from({length: 4}, () => random() * 2));
    let K = words.map(() => Array.from({length: 4}, () => random() * 2));

    // 1. Skalarprodukt Q * K^T
    let scores = math.multiply(Q, math.transpose(K));

    // 2. REALISMUS-UPDATE: Füge einen festen Bonus auf die Diagonale (i == j) hinzu
    for (let i = 0; i < n; i++) {
        scores[i][i] += 1.5; // Dieser Bonus sorgt für eine stabile, sichtbare Diagonale
    }

    // 3. Skalierung
    let scaledScores = math.divide(scores, divider);

    // 4. Softmax + Rundungskorrektur
    let attentionMatrix = [];
    for (let i = 0; i < n; i++) {
        let row = scaledScores[i];
        let exponents = row.map(val => Math.exp(val));
        let sumExponents = exponents.reduce((a, b) => a + b, 0);
        
        let finalRow = exponents.map(exp => exp / sumExponents);
        
        // Visueller 100%-Ausgleich für den Bildschirm
        let roundedSum = finalRow.reduce((acc, val) => acc + Math.round(val * 100) / 100, 0);
        let diff = 1.00 - roundedSum;
        if (Math.abs(diff) > 0.001) {
            let maxIdx = finalRow.indexOf(Math.max(...finalRow));
            finalRow[maxIdx] += diff;
        }
        attentionMatrix.push(finalRow);
    }

    return attentionMatrix;
}