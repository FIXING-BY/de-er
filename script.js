@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');

:root {
    --accent: rgb(96,255,127);
    --bg: #05070a;
    --glass-bg: rgba(255, 255, 255, 0.03);
    --glass-border: rgba(255, 255, 255, 0.08);
    --text: #ffffff;
    --text-mute: rgba(255, 255, 255, 0.5);
    --msg-user: #1a1d23;
}

body.theme-grey {
    --bg: #f5f7fa;
    --glass-bg: rgba(0, 0, 0, 0.03);
    --glass-border: rgba(0, 0, 0, 0.08);
    --text: #1a1a1a;
    --text-mute: #666;
    --accent: #2d3436;
}

body.theme-soft-dark {
    --bg: #000;
    --glass-bg: rgba(255, 255, 255, 0.02);
    --accent: rgb(96,255,127);
}

* { box-sizing: border-box; margin: 0; padding: 0; }

body {
    font-family: 'Plus Jakarta Sans', sans-serif;
    background: var(--bg);
    color: var(--text);
    height: 100vh;
    display: flex;
    overflow: hidden;
}

.glass {
    background: var(--glass-bg);
    backdrop-filter: blur(25px) saturate(180%);
    border: 1px solid var(--glass-border);
}

/* Yan Menü Apple Tarzı */
#sidebar {
    position: fixed; left: -320px; top: 15px; bottom: 15px; width: 300px;
    border-radius: 24px; z-index: 1000; transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
    padding: 30px; display: flex; flex-direction: column;
}
#sidebar.active { left: 15px; box-shadow: 0 40px 100px rgba(0,0,0,0.8); }

#sidebar-blur {
    display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.3);
    z-index: 999; backdrop-filter: blur(5px);
}
#sidebar-blur.active { display: block; }

.sidebar-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 40px; }
.brand-name { font-weight: 800; font-size: 1.2rem; letter-spacing: -0.5px; color: var(--accent); }
#close-menu { background: none; border: none; color: var(--text); font-size: 1.2rem; cursor: pointer; }

.menu-item label { font-size: 0.7rem; font-weight: 700; text-transform: uppercase; color: var(--text-mute); margin-bottom: 12px; display: block; }
.theme-btns { display: grid; gap: 8px; margin-bottom: 30px; }
.t-btn { padding: 12px; border-radius: 12px; border: 1px solid var(--glass-border); background: rgba(255,255,255,0.02); color: var(--text); cursor: pointer; font-weight: 600; font-size: 0.85rem; }
.t-btn:hover { background: var(--accent); color: #000; }

/* Main Area */
.main-screen { flex: 1; display: flex; flex-direction: column; position: relative; width: 100%; }

.banner {
    margin: 15px; height: 70px; border-radius: 20px; display: flex; align-items: center; 
    justify-content: space-between; padding: 0 25px; z-index: 10;
}

.banner-left { display: flex; align-items: center; gap: 20px; }
.menu-icon { background: none; border: none; cursor: pointer; display: flex; flex-direction: column; gap: 6px; }
.menu-icon span { width: 24px; height: 2px; background: var(--text); border-radius: 10px; }

.app-logo { width: 34px; height: 34px; color: var(--accent); }
.brand-title { font-size: 1.2rem; font-weight: 800; }

.ai-status { font-size: 0.75rem; color: var(--accent); background: rgba(96,255,127,0.1); padding: 6px 16px; border-radius: 100px; font-weight: 600; }

/* Chat Flow */
#chat-flow { flex: 1; overflow-y: auto; padding: 40px 20px; display: flex; flex-direction: column; gap: 25px; }
.intro-box { max-width: 600px; margin: 100px auto; text-align: center; }
.intro-box h2 { font-size: 3rem; margin-bottom: 15px; font-weight: 800; letter-spacing: -2px; }
.intro-box p { color: var(--text-mute); font-size: 1.1rem; line-height: 1.6; }

.message { max-width: 800px; width: fit-content; padding: 20px 26px; border-radius: 28px; line-height: 1.6; font-size: 1.05rem; animation: pop 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
.msg-bot { align-self: flex-start; background: var(--glass-bg); border: 1px solid var(--glass-border); border-bottom-left-radius: 4px; }
.msg-user { align-self: flex-end; background: var(--msg-user); border-bottom-right-radius: 4px; }

.sources { margin-top: 15px; font-size: 0.8rem; color: var(--accent); padding-top: 12px; border-top: 1px solid var(--glass-border); font-weight: 500; }

/* Yüzen Input Pill */
.input-float-wrap { padding: 40px 20px; width: 100%; max-width: 850px; margin: 0 auto; display: flex; flex-direction: column; align-items: center; }
.input-pill { width: 100%; display: flex; align-items: center; padding: 8px 12px; border-radius: 24px; transition: 0.3s; }
.input-pill:focus-within { border-color: var(--accent); box-shadow: 0 0 30px rgba(96,255,127,0.1); }

#query-input { flex: 1; background: none; border: none; outline: none; color: var(--text); padding: 12px 15px; font-size: 1.1rem; }
#send-trigger { background: var(--accent); border: none; width: 48px; height: 48px; border-radius: 18px; color: #000; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: 0.2s; }
#send-trigger:hover { transform: scale(1.05) rotate(-10deg); }
#send-trigger svg { width: 22px; height: 22px; }

.helper-text { font-size: 0.75rem; color: var(--text-mute); margin-top: 15px; }

@keyframes pop { from { opacity: 0; transform: scale(0.9) translateY(10px); } to { opacity: 1; transform: scale(1) translateY(0); } }

/* Scrollbar Customization */
#chat-flow::-webkit-scrollbar { width: 5px; }
#chat-flow::-webkit-scrollbar-thumb { background: var(--glass-border); border-radius: 10px; }
