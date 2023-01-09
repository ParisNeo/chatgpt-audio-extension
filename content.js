function splitString(string, maxLength) {
  const sentences = string.match(/[^.!?]+[.!?]/g);
  const strings = [];
  let currentString = '';

  if (sentences) {
    for (const sentence of sentences) {
      if (currentString.length + sentence.length > maxLength) {
        strings.push(currentString);
        currentString = '';
      }

      currentString += `${sentence} `;
    }
  } else {
    strings.push(string);
  }

  if (currentString) {
    strings.push(currentString);
  }

  return strings;
}


function addListeners(button, utterThis){
  console.log("Adding listeners")
  utterThis.onstart = (event) => {
    button.style.backgroundColor = "red";
    button.style.boxShadow = "2px 2px 0.5px #808080";
  };
  
  utterThis.onend = (event) => {
    button.style.backgroundColor = "";
    button.style.boxShadow = "";
  };
}


const synth = window.speechSynthesis || webkitspeechSynthesis;
voices = synth.getVoices();

const SpeechRecognition = window.SpeechRecognition || webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.continuous = true;
recognition.interimResults = true;
recognition.maxAlternatives = 10
let isStarted = false;
let isSpeaking= false;


var insertedNodes = [];
var observer = new WebKitMutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
        for(var i = 0; i < mutation.addedNodes.length; i++)
            insertedNodes.push(mutation.addedNodes[i]);
    })
});
observer.observe(document, {
    childList: true
});
console.log(insertedNodes);


const inputs =  document.querySelectorAll("input[type='text'], textarea");
const good_bad = document.getElementsByClassName("text-gray-400 flex self-end lg:self-center justify-center mt-2 gap-4 lg:gap-1 lg:absolute lg:top-0 lg:translate-x-full lg:right-0 lg:mt-0 lg:pl-2 visible")
console.log(good_bad)
console.log(`Found :${inputs}`)



inputs.forEach((input) => {
  const button = document.createElement("button");
  button.innerHTML = "🎤";
  const select = document.createElement("select");
  select.id = "language-select";
  select.classList.add("ml-2");
  const options = [
    { value: "fr-FR", label: "Français" },
    { value: "en-US", label: "English" },
    { value: "es-ES", label: "Español" },
  ];
  options.forEach((option) => {
    const opt = document.createElement("option");
    opt.value = option.value;
    opt.innerHTML = option.label;
    select.appendChild(opt);
  });
  input.parentNode.insertBefore(button, input.nextSibling);
  button.parentNode.insertBefore(select, button.nextSibling);  


  const wrapper = document.createElement("div");
  wrapper.classList.add("flex", "items-center");
  input.classList.add("flex-1");
  button.classList.add("ml-2");
  select.classList.add("ml-2");
  wrapper.appendChild(button);
  wrapper.appendChild(select);
  input.parentNode.insertBefore(wrapper, input);
  input.parentNode.removeChild(input);
  wrapper.appendChild(input);


  
  button.addEventListener("click", () => {
    if (isStarted) {
      console.log("Stopping previous recognition")
      recognition.stop();
      isStarted = false;
    } else {
      console.log("Starting new recognition")
      recognition.lang = select.value;
      recognition.start();
      isStarted = true;
    }
  });
  
  recognition.addEventListener("result", (event) => {
      let transcript = "";
      for (const result of event.results) {
        transcript += result[0].transcript;
      }
      input.value = transcript;
  });
  
  
  recognition.addEventListener("start", () => {
    button.style.backgroundColor = "red";
    button.style.boxShadow = "2px 2px 0.5px #808080";
  });
  
  recognition.addEventListener("end", () => {
    button.style.backgroundColor = "";
    button.style.boxShadow = "";
  });
  
  
});

let selects = [];

Array.prototype.forEach.call(good_bad, (gb) => {
  const button = document.createElement("button");
  button.innerHTML = "🕪";
  const select = document.createElement("select");
  select.id = "language-select";
  select.classList.add("ml-2");

  gb.parentNode.insertBefore(button, gb.nextSibling);
  button.parentNode.insertBefore(select, button.nextSibling);  


  const wrapper = document.createElement("div");
  wrapper.classList.add("flex", "items-center");
  gb.classList.add("flex-1");
  button.classList.add("ml-2");
  select.classList.add("ml-2");
  wrapper.appendChild(button);
  wrapper.appendChild(select);
  gb.parentNode.insertBefore(wrapper, gb);
  gb.parentNode.removeChild(gb);
  wrapper.appendChild(gb);
  selects.push(select);


  voices = []
  function populateVoiceList() {
    voices = synth.getVoices();
    selects.forEach((select)=>{
      for (let i = 0; i < voices.length ; i++) {
        const option = document.createElement('option');
        option.textContent = `${voices[i].name} (${voices[i].lang})`;
    
        if (voices[i].default) {
          option.textContent += ' — DEFAULT';
        }
    
        option.setAttribute('data-lang', voices[i].lang);
        option.setAttribute('data-name', voices[i].name);
        select.appendChild(option);
      }  
    });
  }

  if (synth.onvoiceschanged !== undefined) {
    speechSynthesis.onvoiceschanged = populateVoiceList;
  }
  
  
  button.addEventListener("click", () => {
    if(isSpeaking)
    {
      synth.cancel()
      isSpeaking= false;
    }
    else{
      isSpeaking=true;
      text=wrapper.previousSibling.textContent;
      console.log(text)


      const selectedOption = select.selectedOptions[0].getAttribute('data-name');
      var selectedVoice = null;
      for (let i = 0; i < voices.length ; i++) {
        if (voices[i].name === selectedOption) {
          selectedVoice = voices[i];
        }
      }
      console.log(selectedVoice.voiceURI)
      if (selectedVoice && selectedVoice.voiceURI === 'native'){
        console.log("native");
        const utterThis = new SpeechSynthesisUtterance(text);
        utterThis.voice = selectedVoice
        addListeners(button, utterThis)
        synth.speak(utterThis); 
      }
      else{
        console.log("Not native");
        texts = splitString(text, 200);
        texts.forEach((text)=>{
          const utterThis = new SpeechSynthesisUtterance(text);
          utterThis.voice = selectedVoice
          addListeners(button, utterThis)
          synth.speak(utterThis);   
        })
      }
    }
  

  });
  
  
});

