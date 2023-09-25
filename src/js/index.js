const btnHist = document.querySelector(".histBtn i");
const historic = document.querySelector(".historic");
const trashBtnHist = document.querySelector(".trash");
const historicList = document.querySelector(".historicList");

//Historic toggle class
btnHist.addEventListener("click", () => {
  historic.classList.toggle("historic-active");
  btnHist.classList.toggle("fa-x");
});

trashBtnHist.addEventListener("click", () => {
  historicList.innerHTML = "";
});

const btnContainer = document.querySelector(".btnContainer");
const screenPrev = document.querySelector(".prev");
const screenCurrent = document.querySelector(".current");
const body = document.querySelector("body");

let prev = "";
let prevOperator;
let total = 0;

function buttonClick(value) {
  if (isNaN(value)) {
    handleSymbol(value);
  } else {
    handleNumber(value);
  }
}

function handleNumber(number) {
  if (screenCurrent.textContent == 0 || screenCurrent.textContent == "") {
    screenCurrent.textContent = number;
  } else {
    screenCurrent.textContent += number;
  }
}

function handleSymbol(symbol) {
  switch (symbol) {
    case "cleanAll":
      prev = "";
      screenCurrent.innerHTML = "";
      screenPrev.innerHTML = "";
      break;

    case "cleanCurrent":
      screenCurrent.innerHTML = "";
      break;

    case "cleanLast":
      screenCurrent.textContent = screenCurrent.textContent.substring(
        0,
        screenCurrent.textContent.length - 1
      );
      break;

    case "=":
      if (prevOperator === null) {
        return;
      }

      flushOperation(parseFloat(screenCurrent.textContent));
      prevOperator = null;
      screenCurrent.textContent = total;
      total = 0;
      break;

    case "flipValue":
      screenCurrent.textContent *= -1;
      break;

    case "decimal":
      screenCurrent.textContent += ".";
      break;

    case "/":
    case "*":
    case "+":
    case "-":
    case "²":
    case "√":
    case "1 / ":
    case " / 100":
      prev = screenCurrent.textContent;

      handleMath(symbol);
      break;
  }
}

function handleMath(symbol) {
  if (screenCurrent.textContent == 0 || screenCurrent.textContent === "") {
    return;
  }

  const intCalc = parseFloat(screenCurrent.textContent);

  if (total === 0) {
    total = intCalc;
  } else {
    flushOperation(intCalc);
  }

  prevOperator = symbol;
  screenCurrent.textContent = "";
}

function flushOperation(value) {
  if (prevOperator == "+") {
    updatePrev("+");
    total += value;
    addHistoric();
  } else if (prevOperator == "-") {
    updatePrev("-");
    total -= value;
    addHistoric();
  } else if (prevOperator == "*") {
    updatePrev("*");
    total *= value;
    addHistoric();
  } else if (prevOperator == "/") {
    updatePrev("/");
    total /= value;
    addHistoric();
  } else if (prevOperator == " / 100") {
    updatePrev(" / 100");
    total = total / 100;
    addHistoric();
  } else if (prevOperator == "²") {
    updatePrev("²");
    total = Math.pow(total, 2);
    addHistoric();
  } else if (prevOperator == "√") {
    updatePrev("√");
    total = Math.sqrt(total);
    if (total < 0) {
      total = "Raiz negativa não permitida";
    }
    addHistoric();
  } else if (prevOperator == "1 / ") {
    updatePrev("1 / ");
    total = 1 / total;
    if (total == 0) {
      total = "Não é possível dividir por 0";
    }
    addHistoric();
  }
}

function updatePrev(op) {
  screenPrev.textContent = "";
  if (op == "√" || op == "1 / ") screenPrev.textContent += prevOperator + prev;
  else
    screenPrev.textContent += prev + prevOperator + screenCurrent.textContent;
}

function addHistoric() {
  let li = document.createElement("li");
  li.setAttribute("dir", "ltr");
  li.classList.add("historicListItem");

  let span1 = document.createElement("span");
  span1.classList.add("histPrev");
  let span2 = document.createElement("span");
  span2.classList.add("histResult");

  span1.textContent = screenPrev.textContent;
  span2.textContent = total;

  li.appendChild(span1);
  li.appendChild(span2);
  historicList.appendChild(li);
}

function initCalc() {
  document.querySelector(".btnContainer").addEventListener("click", (e) => {
    buttonClick(e.target.dataset.key);
  });
}

initCalc();
