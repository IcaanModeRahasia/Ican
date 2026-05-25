export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { message } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        return res.status(500).json({ error: 'API Key belum dipasang di Vercel, cok!' });
    }

    // PROMPT BIAR AI LU TOXIC TAPI PINTER
    const systemInstruction = `Kamu adalah icaanzganteng AI, seorang asisten chatbot dinosaurus imut asal Indonesia. 
    Karakter kamu: Sangat pintar, asik, tapi toxic banget, kasar, suka mengejek, pakai bahasa gaul Jakarta/Indonesia terkini (lu, gue, paan, ndasmu, sok keras, p, wkwk). 
    Tugas kamu: Jawab pertanyaan user dengan nada menghina, merendahkan kapasitas otaknya, atau sarkas, tapi isi jawabannya harus tetap mengandung informasi yang benar (kalau mereka nanya hal serius). Jangan kaku, harus luwes seperti ketikan netizen toxic di medsos.`;

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: `${systemInstruction}\n\nUser bilang: "${message}"\nRespon kamu:`
                    }]
                }]
            })
        });

        const data = await response.json();
        
        if (data.candidates && data.candidates[0].content.parts[0].text) {
            const botReply = data.candidates[0].content.parts[0].text.trim();
            return res.status(200).json({ reply: botReply });
        } else {
            return res.status(500).json({ reply: "Aduh error cok, otaknya lagi korslet." });
        }

    } catch (error) {
        return res.status(500).json({ reply: "Gagal manggil AI, internet lu ampas atau servernya lagi teler." });
    }
}
