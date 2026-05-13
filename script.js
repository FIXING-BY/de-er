const API_KEY = "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";
const API_URL = "https://api.groq.com/openai/v1/chat/completions";

const chatContainer = document.getElementById('chat-container');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');
const sidebar = document.getElementById('sidebar');
const historyList = document.getElementById('history-list');

// Sidebar ve Tema Kontrolleri
document.getElementById('open-menu').onclick = () => sidebar.classList.add('active');
document.getElementById('close-menu').onclick = () => sidebar.classList.remove('active');

function setTheme(t) {
    document.body.className = 'theme-' + t;
    localStorage.setItem('deger_theme', t);
}

// Sohbet Geçmişi
let history = JSON.parse(localStorage.getItem('deger_history')) || [];
function updateHistoryUI() {
    historyList.innerHTML = '';
    history.forEach(q => {
        const div = document.createElement('div');
        div.className = 'hist-item';
        div.innerText = q.substring(0, 30) + "...";
        div.onclick = () => { userInput.value = q; sidebar.classList.remove('active'); };
        historyList.appendChild(div);
    });
}

function addMessage(text, isBot = true, sources = []) {
    const div = document.createElement('div');
    div.className = `msg ${isBot ? 'bot' : 'user'}`;
    let html = `<div>${text}</div>`;
    if (sources.length > 0) {
        html += `<div class="bibliography"><b>Kaynakça:</b> ${sources.join(', ')}</div>`;
    }
    div.innerHTML = html;
    chatContainer.appendChild(div);
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

// GROQ API ANALİZİ (Kısıtlı Mod)
async function getAIResponse(question, contextData, bookTitle) {
    const systemPrompt = `
    Adın: Değer YZ. Yapımcıların: Ozan Nigar ve Hasan Eymen Kartal.
    
    TALİMATLAR:
    1. SADECE sana verilen "DEĞERLENDİRME METİNLERİ"ndeki bilgileri kullan.
    2. Genel kültürünü, internet bilgilerini veya kendi aklını ASLA kullanma.
    3. Eğer sorulan sorunun cevabı metinlerde yoksa ŞUNU SÖYLE: "Bu bilgiye kütüphanemdeki değerlendirmelerden ulaşamadım, kitap veya film hakkında başka bir şey sorabilirsin."
    4. Sadece kitap ve film hakkında konuş.
    
    DEĞERLENDİRME METİNLERİ:
    ${contextData.map(d => `[Yazar: ${d.author}]: ${d.content}`).join("\n\n")}
    `;

    try {
        const res = await fetch(API_URL, {
            method: "POST",
            headers: { 
                "Authorization": `Bearer ${API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "llama-3.1-8b-instant",
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: question }
                ],
                temperature: 0.0 // Uydurmayı önlemek için sıfır yaratıcılık
            })
        });
        const data = await res.json();
        return data.choices[0].message.content;
    } catch (e) {
        return "Yapay zeka analiz motoruna şu an bağlanılamıyor.";
    }
}

async function startAnalysis(query) {
    const lowQ = query.toLocaleLowerCase('tr-TR');

    // Kimlik Sorguları
    if (lowQ.includes("kimsin") || lowQ.includes("adın ne")) return addMessage("Ben Değer YZ. Kitap ve filmleri analiz ederim.");
    if (lowQ.includes("kim yaptı") || lowQ.includes("yapımcın")) return addMessage("Ben Ozan Nigar ve Hasan Eymen Kartal tarafından kodlandım.");

    try {
        const res = await fetch('index.json');
        const data = await res.json();
        
        // Kitabı bul (Küçük harf eşleşmesi)
        const book = data.kütüphane.find(k => lowQ.includes(k.ad.toLocaleLowerCase('tr-TR')));

        if (!book) return addMessage("Bu eser kütüphanemde kayıtlı değil.");

        // Yazarları ayır ve sırala ((ö) olanlar başa)
        let sortedAuthors = [
            ...book.yazarlar.filter(a => a.toLocaleLowerCase('tr-TR').includes("(ö)")),
            ...book.yazarlar.filter(a => !a.toLocaleLowerCase('tr-TR').includes("(ö)"))
        ];

        let fetchedDocs = [];
        let successAuthors = [];

        // Dosyaları çek (Hepsini küçük harfe zorla)
        for (const author of sortedAuthors) {
            try {
                const folder = book.ad.toLocaleLowerCase('tr-TR');
                const file = author.toLocaleLowerCase('tr-TR');
                const url = `değerlendirmeler/${folder}/${file}.txt`;
                
                const fRes = await fetch(encodeURI(url));
                if (fRes.ok) {
                    fetchedDocs.push({ author: author, content: await fRes.text() });
                    successAuthors.push(author);
                }
            } catch (e) {}
        }

        if (successAuthors.length > 0) {
            addMessage("<i>Değer YZ kütüphaneyi tarıyor ve analiz ediyor...</i>");
            const aiResult = await getAIResponse(query, fetchedDocs, book.ad);
            addMessage(aiResult, true, successAuthors);
            
            // Geçmişe ekle
            if (!history.includes(query)) {
                history.unshift(query);
                if (history.length > 10) history.pop();
                localStorage.setItem('deger_history', JSON.stringify(history));
                updateHistoryUI();
            }
        } else {
            addMessage("Bu kitap için değerlendirme dosyası bulunamadı.");
        }
    } catch (e) {
        addMessage("Sistem hatası: index.json okunamadı.");
    }
}

sendBtn.onclick = () => {
    const val = userInput.value.trim();
    if (val) {
        addMessage(val, false);
        startAnalysis(val);
        userInput.value = '';
    }
};

userInput.onkeypress = (e) => { if (e.key === 'Enter') sendBtn.click(); };

document.getElementById('clear-history').onclick = () => {
    localStorage.removeItem('deger_history');
    history = [];
    updateHistoryUI();
};

window.onload = () => {
    setTheme(localStorage.getItem('deger_theme') || 'standard');
    updateHistoryUI();
};