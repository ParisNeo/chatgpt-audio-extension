const inputs =  document.querySelectorAll("input[type='text'], textarea");
console.log(`Found :${inputs}`)
const SpeechRecognition = window.SpeechRecognition || webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.interimResults = true;

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
    if (recognition.isStarted) {
      recognition.stop();
      input.value = "";
    } else {
      recognition.lang = select.value;
      recognition.start();
    }
  });
  
  recognition.addEventListener("result", (event) => {
      const transcript = event.results[0][0].transcript;
      input.value = transcript;
  });
  
  
  button.addEventListener("click", () => {
      if (recognition.isStarted) {
      recognition.stop();
      input.value = "";
      } else {
      recognition.start();
      }
  });
  
  recognition.addEventListener("start", () => {
    button.style.backgroundColor = "red";
  });
  
  recognition.addEventListener("end", () => {
    button.style.backgroundColor = "";
  });
  
  
});


