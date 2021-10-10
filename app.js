const $ = document.querySelector.bind(document);
let randomWord;
let score = 0;
// audio https://api.dictionaryapi.dev/api/v2/entries/en/hello
async function renderType_Audio(text) {
  const prononce = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${text}`);
  const data = await prononce.json();
  let arrData = data[0];
  let ArrPrononce = arrData.meanings;
  //nhóm tất cả các loại từ thành 1 mảng rồi join lại
  let newArrPrononces = [];
  ArrPrononce.map((item) => {
    newArrPrononces.push(item.partOfSpeech);
  });
  let wordType = newArrPrononces.join(",");
  //mặc định phonetics[0] là sẽ có link audio
  let urlAudio = arrData.phonetics[0].audio;
  updateAudioPrononce(arrData, urlAudio, wordType);
}
async function renderFullWord() {
  let random = Math.floor(Math.random() * 258);
  const words = await fetch(`https://my-learn-english-api.herokuapp.com/Allword/${random}`);
  const data = await words.json();
  randomWord = data.word;
  //render audio prononce
  renderType_Audio(randomWord).catch((err) => console.error(err));
  //reder từ và nghĩa
  $("#words").innerHTML = data.mean;
}
function updateAudioPrononce(data, urlAudio, wordType) {
  $("#prononce").innerHTML = "/" + data.phonetic + "/";
  $("#word-type").innerHTML = wordType;
  $("#audio").innerHTML = `<source src=${urlAudio}>`;
  //reload lại thanh audio mà ko bị reload trang
  $("#audio").load();
}
const inputText = $("#text");
inputText.addEventListener("input", (e) => {
  const insertedText = e.target.value;
  handler(insertedText, e);
});
//handler right

function handler(text, e) {
  //nếu đúng thì thực hiện xóa input
  if (text.toLowerCase() === randomWord.toLowerCase()) {
    inputText.style.outlineColor = "green";
    score++;
    //tăng số từ đã học
    $("#score").innerHTML = score;
    //set lại ô input thành null
    setTimeout(() => {
      e.target.value = "";
      inputText.style.outlineColor = "black";
    }, 500);

    //render lại từ mới
    renderFullWord();
  }
}
const btn = $("#btn");
const hint = $(".hint");
btn.addEventListener("click", () => {
  hint.innerHTML = randomWord;
  hint.classList.remove("hide");
  setTimeout(() => {
    hint.classList.add("hide");
  }, 1000);
});

renderFullWord().catch((err) => console.error(err));
