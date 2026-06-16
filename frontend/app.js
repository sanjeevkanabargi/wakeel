const chatEl = document.getElementById('chat');
const msgEl = document.getElementById('message');
const sendBtn = document.getElementById('send');
const composer = document.getElementById('composer');

function createMessage(text, who='bot'){
  const wrapper = document.createElement('div');
  wrapper.className = `message ${who}`;

  const avatar = document.createElement('div');
  avatar.className = 'avatar';
  avatar.textContent = who === 'user' ? 'U' : 'W';

  const bubble = document.createElement('div');
  bubble.className = 'bubble';
  bubble.textContent = text;

  wrapper.appendChild(avatar);
  wrapper.appendChild(bubble);
  return { wrapper, bubble };
}

function addTypingIndicator(){
  const wrapper = document.createElement('div');
  wrapper.className = 'message bot typing-wrapper';

  const avatar = document.createElement('div');
  avatar.className = 'avatar';
  avatar.textContent = 'W';

  const bubble = document.createElement('div');
  bubble.className = 'bubble';

  const dots = document.createElement('span');
  dots.className = 'typing';
  for(let i=0;i<3;i++){ const d = document.createElement('span'); d.className='dot'; dots.appendChild(d) }

  bubble.appendChild(dots);
  wrapper.appendChild(avatar);
  wrapper.appendChild(bubble);
  chatEl.appendChild(wrapper);
  chatEl.scrollTop = chatEl.scrollHeight;
  return wrapper;
}

async function send(){
  const message = msgEl.value.replace(/\n+$/,'');
  if(!message.trim()) return;
  // user message
  const userMsg = createMessage(message,'user');
  chatEl.appendChild(userMsg.wrapper);
  msgEl.value='';
  chatEl.scrollTop = chatEl.scrollHeight;

  // typing indicator
  const typingEl = addTypingIndicator();

  try{
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type':'application/json' },
      body: JSON.stringify({ message })
    });
    const data = await res.json();
    // remove typing
    typingEl?.remove();
    if(data.reply){
      const botMsg = createMessage(data.reply,'bot');
      chatEl.appendChild(botMsg.wrapper);
    } else {
      const botMsg = createMessage('No reply from server','bot');
      chatEl.appendChild(botMsg.wrapper);
    }
    chatEl.scrollTop = chatEl.scrollHeight;
  } catch(e){
    console.error(e);
    typingEl?.remove();
    const botMsg = createMessage('Error contacting server','bot');
    chatEl.appendChild(botMsg.wrapper);
    chatEl.scrollTop = chatEl.scrollHeight;
  }
}

composer.addEventListener('submit', (e)=>{ e.preventDefault(); send(); });
// Enter to send, Shift+Enter for newline
msgEl.addEventListener('keydown', (e)=>{
  if(e.key === 'Enter' && !e.shiftKey){
    e.preventDefault();
    send();
  }
});
