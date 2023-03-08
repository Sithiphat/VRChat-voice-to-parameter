var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition
var SpeechGrammarList = SpeechGrammarList || window.webkitSpeechGrammarList
var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent

var colors = [ 'happy','sad'];

var recognition = new SpeechRecognition();

///
let request = new XMLHttpRequest();

///

if (SpeechGrammarList) {
  // SpeechGrammarList is not currently available in Safari, and does not have any effect in any other browser.
  // This code is provided as a demonstration of possible capability. You may choose not to use it.
  var speechRecognitionList = new SpeechGrammarList();
  var grammar = '#JSGF V1.0; grammar colors; public <color> = ' + colors.join(' | ') + ' ;'
  speechRecognitionList.addFromString(grammar, 1);
  //recognition.grammars = speechRecognitionList;
}
recognition.continuous = true;
recognition.lang = 'en-US';
//recognition.lang = 'th-TH';

recognition.interimResults = false;
recognition.maxAlternatives = 1;

var diagnostic = document.querySelector('.output');
var bg = document.querySelector('html');
var hints = document.querySelector('.hints');

var colorHTML= '';
colors.forEach(function(v, i, a){
  console.log(v, i);
  colorHTML +=  v + ' </span>';
});
hints.innerHTML = 'click start button then say something. Try ' + colorHTML + '.';

// document.body.onclick = function() {
//   recognition.start();
//   console.log('Ready to receive a color command.');
// }
const button1 = document.getElementById('button1');
const button2 = document.getElementById('button2');

button1.addEventListener('click', function() {
  recognition.start();
  console.log('Ready to receive a command.');
});

button2.addEventListener('click', function() {
  recognition.stop();
  console.log('stoped record.');
});

recognition.onresult = function(event) {
  // The SpeechRecognitionEvent results property returns a SpeechRecognitionResultList object
  // The SpeechRecognitionResultList object contains SpeechRecognitionResult objects.
  // It has a getter so it can be accessed like an array
  // The first [0] returns the SpeechRecognitionResult at the last position.
  // Each SpeechRecognitionResult object contains SpeechRecognitionAlternative objects that contain individual results.
  // These also have getters so they can be accessed like arrays.
  // The second [0] returns the SpeechRecognitionAlternative at position 0.
  // We then return the transcript property of the SpeechRecognitionAlternative object
  var color = event.results[event.results.length-1][0].transcript;
  diagnostic.textContent = 'Result received: ' + color + '.';
// bg.style.backgroundColor = color;
  console.log(event.results[event.results.length-1][0].transcript);

///////
  request.open("GET","http://localhost:3000/word/"+color.trim());
  request.send();
  //console.log('Confidence: ' + event.results[0][0].confidence);

    

}

//recognition.onspeechend = function() {
 // recognition.stop();
//}

recognition.onnomatch = function(event) {
  diagnostic.textContent = "I didn't recognise that color.";
}

recognition.onerror = function(event) {
  diagnostic.textContent = 'Error occurred in recognition: ' + event.error;
}


recognition.onstart =function(event) {
  diagnostic.textContent = 'Speech recognition start';


}

recognition.onend =function(event) {
  diagnostic.textContent = 'Speech recognition service disconnected';


}