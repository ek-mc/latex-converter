const input = document.getElementById('input');
const output = document.getElementById('output');
const errorEl = document.getElementById('error');
const displayMode = document.getElementById('displayMode');
const autoRender = document.getElementById('autoRender');
const renderBtn = document.getElementById('renderBtn');
const copyTextBtn = document.getElementById('copyTextBtn');
const copyHtmlBtn = document.getElementById('copyHtmlBtn');
const downloadPngBtn = document.getElementById('downloadPngBtn');
const downloadSvgBtn = document.getElementById('downloadSvgBtn');
const sampleBtn = document.getElementById('sampleBtn');
const clearBtn = document.getElementById('clearBtn');
const homeBtn = document.getElementById('homeBtn');
const bannerBtn = document.getElementById('bannerBtn');

const PREF_KEY='latex-converter-prefs-v1';

function savePrefs(){
  localStorage.setItem(PREF_KEY, JSON.stringify({
    value: input.value,
    display: displayMode.checked,
    auto: autoRender.checked
  }));
}

function loadPrefs(){
  try{
    const p = JSON.parse(localStorage.getItem(PREF_KEY)||'{}');
    if (typeof p.value === 'string') input.value = p.value;
    if (typeof p.display === 'boolean') displayMode.checked = p.display;
    if (typeof p.auto === 'boolean') autoRender.checked = p.auto;
  }catch{}
}

function render(){
  errorEl.textContent='';
  const raw = input.value.trim();
  if(!raw){ output.textContent='Rendered output will appear here.'; return; }
  if (typeof window.katex === 'undefined') {
    output.textContent='';
    errorEl.textContent='Renderer not loaded yet. Please refresh once.';
    return;
  }

  // Accept pasted literal "\\n" and convert to real newlines
  const tex = raw.replace(/\\n/g, '\n');

  try{
    if (displayMode.checked && tex.includes('\n')) {
      // Render multiline display as separate blocks
      const parts = tex.split(/\n+/).map(s => s.trim()).filter(Boolean);
      output.innerHTML = '';
      for (const part of parts) {
        const line = document.createElement('div');
        line.style.marginBottom = '10px';
        window.katex.render(part, line, {throwOnError:true, displayMode:true, strict:'warn'});
        output.appendChild(line);
      }
    } else {
      window.katex.render(tex, output, {throwOnError:true, displayMode: displayMode.checked, strict:'warn'});
    }
  }catch(e){
    output.textContent='';
    errorEl.textContent='LaTeX error: ' + e.message;
  }
  savePrefs();
}

sampleBtn.onclick = ()=>{
  input.value = String.raw`\int_0^{2\pi} \sin(x)\,dx = 0
\frac{d}{dx}(x^3)=3x^2`;
  render();
};
clearBtn.onclick = ()=>{ input.value=''; render(); savePrefs(); };
homeBtn.onclick = ()=> window.scrollTo({top:0,behavior:'smooth'});
bannerBtn.onclick = ()=> window.scrollTo({top:0,behavior:'smooth'});
renderBtn.onclick = render;

async function flashBtn(btn, okText='Copied!', failText='Failed') {
  const old = btn.textContent;
  btn.textContent = okText;
  setTimeout(()=> btn.textContent = old, 1200);
}

copyTextBtn.onclick = async ()=>{
  const txt = output.textContent?.trim() || '';
  if (!txt) return flashBtn(copyTextBtn, 'Nothing to copy');
  try { await navigator.clipboard.writeText(txt); flashBtn(copyTextBtn, 'Copied!'); }
  catch { flashBtn(copyTextBtn, 'Copy failed'); }
};

copyHtmlBtn.onclick = async ()=>{
  const html = output.innerHTML?.trim() || '';
  if (!html) return flashBtn(copyHtmlBtn, 'Nothing to copy');
  try { await navigator.clipboard.writeText(html); flashBtn(copyHtmlBtn, 'Copied!'); }
  catch { flashBtn(copyHtmlBtn, 'Copy failed'); }
};

downloadPngBtn.onclick = async ()=>{
  if (!window.html2canvas) return flashBtn(downloadPngBtn, 'PNG unavailable');
  try {
    const canvas = await window.html2canvas(output, {backgroundColor:'#0d1424', scale:2});
    const a = document.createElement('a');
    a.href = canvas.toDataURL('image/png');
    a.download = 'latex-output.png';
    a.click();
    flashBtn(downloadPngBtn, 'PNG saved');
  } catch {
    flashBtn(downloadPngBtn, 'PNG failed');
  }
};

downloadSvgBtn.onclick = ()=>{
  const tex = (input.value || '').trim();
  if (!tex || !window.katex) return flashBtn(downloadSvgBtn, 'SVG unavailable');
  try {
    const mathml = window.katex.renderToString(tex, { throwOnError: true, output: 'mathml' });
    const svg = `<?xml version="1.0" encoding="UTF-8"?>\n<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="300">\n  <foreignObject x="0" y="0" width="1200" height="300">\n    <div xmlns="http://www.w3.org/1999/xhtml" style="font-size:28px;padding:20px;color:#e5e7eb;background:#0d1424;">${mathml}</div>\n  </foreignObject>\n</svg>`;
    const blob = new Blob([svg], {type:'image/svg+xml;charset=utf-8'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'latex-output.svg';
    a.click();
    URL.revokeObjectURL(url);
    flashBtn(downloadSvgBtn, 'SVG saved');
  } catch {
    flashBtn(downloadSvgBtn, 'SVG failed');
  }
};

displayMode.onchange = ()=>{ if(autoRender.checked) render(); savePrefs(); };
autoRender.onchange = savePrefs;
input.addEventListener('input', ()=>{ if(autoRender.checked) render(); else savePrefs(); });

loadPrefs();
render();
