

const inputSlider = document.querySelector("[data-lengthSlider]"); // sab cheej ko  bahar nikal liya ;
const lengthDisplay = document.querySelector("[data-lengthNumber]");

const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateButton");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';



   
//initially
let password = "";
let passwordLength = 10;
let checkCount = 0;
handleSlider();
//ste strength circle color to grey
setIndicator("#ccc");

//set passwordLength
function handleSlider() {
  // ye password Length ko UI pr darshata haib only ;
  inputSlider.value = passwordLength;
  lengthDisplay.innerText = passwordLength;
  //or kuch bhi karna chahiye ? - HW
}

function setIndicator(color) {
  indicator.backgroundColor = color;
  // shadow
}

function getRandInt(min, max) {
  // base function ise se saare generate ho rahe hai
  return Math.floor(Math.random() * (max - min)) + min;
}

function generateRandomNumber() {
  return getRandInt(0, 9);
}

function generateLowercase() {
  return String.fromCharCode(getRandInt(97, 120)); // type Casting
}

function generateUppercase() {
  return String.fromCharCode(getRandInt(65, 91)); // type casting
}

function generateSymbol() {
  const randNum = getRandInt(0, symbols.length); // string se utha liye randomly;
  return symbols.charAt(randNum);
}

function calculateStrength() {
  // ye rule apne paas se lga sakte hai
  let hasUpper = false;
  let hasLower = false;
  let hasNum = false;
  let hasSym = false;
  if (uppercaseCheck.checked) hasUpper = true;
  if (lowercaseCheck.checked) hasLower = true;
  if (numbersCheck.checked) hasNum = true;
  if (symbolsCheck.checked) hasSym = true;

  if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) {
    setIndicator("#0f0"); // setindex ko de diya
  } else if (
    (hasLower || hasUpper) &&
    (hasNum || hasSym) &&
    passwordLength >= 6
  ) {
    setIndicator("#ff0");
  } else {
    setIndicator("#f00");
  }
}

async function copyContent() {
  // API ke through kiya hai     ek promise return kar diya jisse await kar diya
  try {
    await navigator.clipboard.writeText(passwordDisplay.value); // API
    copyMsg.innerText = "copied";
  } catch (e) {
    copyMsg.innerText = "failed";
  }
  // to make copy wala span visible
  copyMsg.classList.add("active");

  setTimeout(() => {
    copyMsg.classList.remove("active"); // 2 sec baad remove kr do class ko
  }, 2000);
}

//for shuffling an array

function shufflePassword(array) {
  //Fisher Yates Method
  // step 1 ek random value nikal li 0-arrLength tk ki ok
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    // step 2 swap kr do random index se or last wale elment se ok
    // kyoki loop last se chla tha
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  // step 3 ab sabki swapping ho jayegi randomly

  let str = "";
  // step 4 ek empty string me add kra diya shuffle vala array ka charactar
  array.forEach((el) => (str += el));
  return str;
}

function handlecheckBoxChange() {
  //  handle karne ke liye ;
  allCheckBox.forEach((checkbox) => {
    if (checkbox.checked) {
      checkCount++;
    }
  });
  /// agar tumhare password le length check count se choti  hai to password li length me countCheck daal do
  if (passwordLength < checkCount) {
    // corner case
    passwordLength = checkCount;
    handleSlider();
  }
}

//Event listners
inputSlider.addEventListener("input", (e) => {
  passwordLength = e.target.value; // slider ki value ko passwordlength me daal diya
  handleSlider(); // for showing value upar h ye define
});

copyBtn.addEventListener("click", () => {
  if (passwordDisplay.value) {
    copyContent();
  }

  // if(passwordLength>0){
  //     copyContent();                       ye bhi logic lga sakte hai
  // }
});

allCheckBox.forEach((checkbox) => {
  checkbox.addEventListener("change", handlecheckBoxChange); // yaha par maine () lga diya tha jo n lgana tha
  // sab par alag alag bhi lga sakte hai eventListner
});

generateBtn.addEventListener("click", () => {
  // condition agar koi button check nahi h to
  if (checkCount == 0) {
    return;
  }
  if (passwordLength < checkCount) {
    passwordLength = checkCount;
    handleSlider();
  }
  // new password  find karne ke liye journey

  // remove old password
  password = "";

  //lets  put the stuff checkBox me jo mangi gyi hai use function ko call lgao or  baaki kuch bhi length bachi ho usme random kuch bhi  daal do

  // 1st Method

  // if(uppercaseCheck.checked){
  //     password +=generateUppercase();
  // }
  // if(lowercaseCheck.checked){
  //     password+=generateLowercase();
  // }
  // if(numbersCheck.checked){
  //     password += generateRandomNumber();
  // }
  // if(symbolsCheck.checked){
  //     password+=generateSymbol();
  // }

  // 2nd Method

  let funcAr = [];
  if (uppercaseCheck.checked) {
    funcAr.push(generateUppercase);
  }
  if (lowercaseCheck.checked) {
    funcAr.push(generateUppercase);
  }
  if (numbersCheck.checked) {
    funcAr.push(generateRandomNumber);
  }
  if (symbolsCheck.checked) {
    funcAr.push(generateSymbol);
  }

  // compolsury jo lena hi lena hai
  for (let i = 0; i < funcAr.length; i++) {
    password += funcAr[i](); // ise function kyo bnaya hai ?   kyoki maine neeche ise call kraya hao or me ise yaha bhi hybrid krke funcrion bna liya hai
  }
  // for remaining length of password;
  for (let i = 0; i < passwordLength - funcAr.length; i++) {
    let randomIndex = getRandInt(0, funcAr.length);
    password += funcAr[randomIndex]();
  }

  // security Badhane ke liye  shuffle karna padega na to func ]tion call ke aadhar par serial  wise password bbn jayega
  password = shufflePassword(Array.from(password));
  // show in UI
  passwordDisplay.value = password;
  // calculate strength
  calculateStrength();
});
