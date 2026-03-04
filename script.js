const input = document.getElementById('input');
const output = document.getElementById('output');
const errorEl = document.getElementById('error');
const displayMode = document.getElementById('displayMode');
const autoRender = document.getElementById('autoRender');
const renderBtn = document.getElementById('renderBtn');
const sampleBtn = document.getElementById('sampleBtn');
const clearBtn = document.getElementById('clearBtn');
const homeBtn = document.getElementById('homeBtn');

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
renderBtn.onclick = render;
displayMode.onchange = ()=>{ if(autoRender.checked) render(); savePrefs(); };
autoRender.onchange = savePrefs;
input.addEventListener('input', ()=>{ if(autoRender.checked) render(); else savePrefs(); });

loadPrefs();
render();
