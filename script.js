let savedPrompts = JSON.parse(localStorage.getItem('aiPrompts')) || [];
let currentResponse = '';

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    renderLibrary();
    document.getElementById('promptInput').focus();
});

function testPrompt() {
    const prompt = document.getElementById('promptInput').value.trim().toLowerCase();
    const model = document.getElementById('modelSelect').value;
    
    if(!prompt) {
        alert('Please enter a prompt!');
        return;
    }

    document.getElementById('responseBox').innerHTML = '🤖 AI is thinking...';
    
    setTimeout(() => {
        let response = '';
        
        if(prompt.includes('ai') || prompt.includes('artificial intelligence')) {
            response = `**Artificial Intelligence (AI)** is the simulation of human intelligence processes by machines.

**Key Components:**
- **Machine Learning** - Learns from data patterns
- **Deep Learning** - Uses neural networks  
- **NLP** - Understands human language
- **Computer Vision** - Interprets visual data

**Your prompt quality:** Excellent! Perfect for LLM evaluation.`;
        }
        else if(prompt.includes('machine learning') || prompt.includes('ml')) {
            response = `**Machine Learning (ML)** is AI that learns from data without explicit programming.

**Types:**
- Supervised Learning
- Unsupervised Learning  
- Reinforcement Learning

**Prompt Score:** Perfect technical question!`;
        }
        else if(prompt.includes('llm') || prompt.includes('large language model')) {
            response = `**Large Language Models (LLMs)** power tools like ChatGPT.

**Architecture:** Transformer-based
**Training:** Massive text datasets
**Use:** Text generation, Q&A, code

**Evaluation:** Spot-on for Ethara.AI!`;
        }
        else if(prompt.includes('what is') || prompt.includes('define')) {
            response = `**Great "What is..." format!** Optimal for AI.

**Structure:**
1. Definition
2. Examples  
3. Benefits

**Quality:** Well-structured question!`;
        }
        else {
            response = `**Smart question:** "${prompt}"

**Analysis:**
- Words: ${prompt.split(' ').length}
- Context: ${prompt.length > 50 ? 'Rich' : 'Good'}

**Tips:** Add AI/ML keywords for better results!`;
        }
        
        currentResponse = response;
        document.getElementById('responseBox').textContent = response;
        evaluatePromptQuality(prompt);
        document.getElementById('qualityCheck').style.display = 'block';
    }, 1500);
}

function evaluatePromptQuality(prompt) {
    const length = prompt.length;
    const words = prompt.split(' ').length;
    const hasQuestion = prompt.includes('?') || prompt.includes('how') || prompt.includes('what');
    const aiKeywords = ['ai','ml','llm','neural'].some(word => prompt.includes(word));
    
    document.getElementById('lengthScore').textContent = length < 20 ? 'Short' : length < 150 ? 'Perfect' : 'Long';
    document.getElementById('clarityScore').textContent = words >= 3 ? 'Good' : 'Poor';
    document.getElementById('specificityScore').textContent = aiKeywords ? 'Excellent' : 'Good';
}

function savePrompt() {
    const prompt = document.getElementById('promptInput').value.trim();
    if(!prompt) return alert('Enter prompt first!');
    
    const promptData = {
        id: Date.now(),
        prompt, model: document.getElementById('modelSelect').value,
        response: currentResponse || 'No response',
        timestamp: new Date().toLocaleString(),
        quality: {
            length: document.getElementById('lengthScore').textContent,
            clarity: document.getElementById('clarityScore').textContent,
            specificity: document.getElementById('specificityScore').textContent
        }
    };
    
    savedPrompts.unshift(promptData);
    localStorage.setItem('aiPrompts', JSON.stringify(savedPrompts));
    renderLibrary();
    clearForm();
    alert('✅ Saved! (' + savedPrompts.length + ' total)');
}

function clearForm() {
    document.getElementById('promptInput').value = '';
    document.getElementById('modelSelect').value = 'GPT-4';
    document.getElementById('responseBox').textContent = 'Response will appear here...';
    document.getElementById('qualityCheck').style.display = 'none';
}

function renderLibrary() {
    const container = document.getElementById('promptLibrary');
    document.getElementById('libraryCount').textContent = savedPrompts.length;
    
    if(!savedPrompts.length) {
        container.innerHTML = '<div style="grid-column:1/-1;text-align:center;color:#999;padding:40px;font-size:1.1rem">No prompts yet. Test above! 🎯</div>';
        return;
    }
    
    container.innerHTML = savedPrompts.map(p => `
        <div class="prompt-card" onclick="loadPrompt(${p.id})">
            <div class="prompt-title">${p.prompt.substring(0,50)}${p.prompt.length>50?'...':''}</div>
            <div class="prompt-text">${p.response.substring(0,80)}...</div>
            <div class="stats">
                <span><strong>${p.model}</strong></span>
                <span>${p.quality.clarity}</span>
                <span>${p.timestamp.split(',')[0]}</span>
            </div>
        </div>
    `).join('');
}

function loadPrompt(id) {
    const p = savedPrompts.find(x => x.id === id);
    if(p) {
        document.getElementById('promptInput').value = p.prompt;
        document.getElementById('modelSelect').value = p.model;
        document.getElementById('responseBox').textContent = p.response;
        evaluatePromptQuality(p.prompt);
        document.getElementById('qualityCheck').style.display = 'block';
    }
}

// Shortcuts
document.addEventListener('keydown', e => {
    if(e.ctrlKey && e.key === 'Enter') testPrompt();
    if(e.ctrlKey && e.key === 's') { e.preventDefault(); savePrompt(); }
});