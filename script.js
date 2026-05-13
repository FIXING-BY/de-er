const API_KEY = "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";
const API_URL = "https://api.groq.com/openai/v1/chat/completions";

const chatContainer = document.getElementById('chat-container');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');
const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('sidebar-overlay');
const historyList = document.getElementById('history-list');

// Sidebar Kontrolleri
document.getElementById('open-menu').onclick = () => { sidebar.classList.add('active'); overlay.classList.add('active'); };
document.getElementById('close-menu').onclick = () => { sidebar.classList.remove('active'); overlay.classList.remove('active'); };
overlay.onclick = () => { sidebar.classList.remove('active'); overlay.classList.remove('active'); };

function setTheme(t) {
    document.body.className = 'theme-' + t;
    localStorage.setItem('deger_yz_theme', t);
}

function addMessage(text, isBot = true, sources = []) {
    const welcome = document.querySelector('.welcome-screen');
    if (welcome) welcome.remove();

    const div = document.createElement('div');
    div.className = `msg ${isBot ? 'bot' : 'user'}`;
    let html = `<div>${text}</div>`;
    if (sources.length > 0) {
        html += `<div class="bibliography"><b>Analiz Edilen Dosyalar:</b> ${sources.join(', ')}</div>`;
    }
    div.innerHTML = html;
    chatContainer.appendChild(div);
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

// GROQ API (Llama 3.1) Çağrısı
async function getAIResponse(question, contextData) {
    const systemPrompt = `
    Senin adın Değer YZ. Ozan Nigar ve Hasan Eymen Kartal tarafından geliştirildin.
    
    KURALLAR:
    1. Sadece sana verilen "METİNLER" üzerinden cevap ver. Dışarıdan bilgi ekleme.
    2. Eğer metinlerde cevap yoksa tam olarak şunu söyle: "Bu bilgiye kütüphanemdeki değerlendirmelerden ulaşamadım, kitap veya film hakkında başka bir şey sorabilirsin."
    3. Sadece kitap ve film konuş.
    
    METİNLER:
    ${contextData.map(d => `[Dosya: ${d.author}]: ${d.content}`).join("\n\n")}`;

    try {
        const res = await fetch(API_URL, {
            method: "POST",
            headers: { "Authorization": `Bearer ${API_KEY}`, "Content-Type": "application/json" },
            body: JSON.stringify({
                model: "llama-3.1-8b-instant",
                messages: [{ role: "system", content: systemPrompt }, { role: "user", content: question }],
                temperature: 0.0
            })
        });
        const data = await res.json();
        return data.choices[0].message.content;
    } catch (e) { return "Analiz yapılamadı, API bağlantısı kurulamıyor."; }
}

async function handleSearch(query) {
    const lowQ = query.toLocaleLowerCase('tr-TR');
    
    // Kimlik kontrolü
    if (lowQ.includes("kimsin") || lowQ.includes("adın ne")) return addMessage("Ben <b>Değer YZ</b>. Kitap ve filmleri Ozan Nigar ve Hasan Eymen Kartal'ın sistemindeki verilerle analiz ederim.");
    if (lowQ.includes("kim yaptı") || lowQ.includes("yapımcın")) return addMessage("Ben <b>Ozan Nigar</b> ve <b>Hasan Eymen Kartal</b> tarafından geliştirildim.");

    try {
        const res = await fetch('index.json');
        const data = await res.json();
        
        const book = data.kütüphane.find(k => lowQ.includes(k.ad.toLocaleLowerCase('tr-TR')));
        if (!book) return addMessage("Bu eser kütüphanemde kayıtlı değil.");

        let sortedAuthors = [
            ...book.yazarlar.filter(a => a.toLocaleLowerCase('tr-TR').includes("(ö)")),
            ...book.yazarlar.filter(a => !a.toLocaleLowerCase('tr-TR').includes("(ö)"))
        ];

        let fetchedDocs = [];
        let successAuthors = [];

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
            addMessage("<i>Veriler analiz ediliyor...</i>");
            const aiRes = await getAIResponse(query, fetchedDocs);
            addMessage(aiRes, true, successAuthors);
            saveHistory(query);
        } else {
            addMessage("Klasörde okunacak bir değerlendirme dosyası bulunamadı.");
        }
    } catch (e) { addMessage("Sistem hatası."); }
}

function saveHistory(q) {
    let hist = JSON.parse(localStorage.getItem('deger_history')) || [];
    if (!hist.includes(q)) {
        hist.unshift(q);
        if (hist.length > 15) hist.pop();
        localStorage.setItem('deger_history', JSON.stringify(hist));
        renderHistory();
    }
}

function renderHistory() {
    let hist = JSON.parse(localStorage.getItem('deger_history')) || [];
    historyList.innerHTML = hist.map(q => `<div class="hist-item" onclick="useHistory('${q}')">${q.substring(0, 30)}...</div>`).join('');
}

function useHistory(q) {
    userInput.value = q;
    sidebar.classList.remove('active');
    overlay.classList.remove('active');
}

sendBtn.onclick = () => {
    const val = userInput.value.trim();
    if (val) { addMessage(val, false); handleSearch(val); userInput.value = ''; }
};

userInput.onkeypress = (e) => { if (e.key === 'Enter') sendBtn.click(); };
window.onload = () => { setTheme(localStorage.getItem('deger_yz_theme') || 'standard'); renderHistory(); };
