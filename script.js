const display = document.getElementById('result_field');
const scroller = document.getElementById('scroller');
const buttons = document.getElementsByTagName('button');
const clickSound = new Audio('UI_Assets/click_sound.mp3');
const SCROLL_STEP = 10;

let displayedString = "";

function scrollDisplay(direction) {
    scroller.scrollLeft += direction * SCROLL_STEP;
}

function createString(input) {
    if (display.innerText === "ERROR") display.innerText = "";
    if (input === "___") {
        display.innerText = "";
      } else if (input === "" || input === " ") {
        display.innerText = display.innerText.slice(0, -1);
      } else {
        display.innerText += input ?? "";
      }
    
      displayedString = display.innerText;
      scroller.scrollLeft = display.scrollWidth;
}

function calculate(num1, op, num2) {
    switch (op) {
      case '+': return num1 + num2;
      case '-': return num1 - num2;
      case '*': return num1 * num2;
      case '/': return num2 === 0 ? NaN : num1 / num2;
      case '^': return Math.pow(num1, num2);
      default:  return NaN;
    }
  }

  Array.from(buttons).forEach((button) => {
    button.addEventListener('click', () => {
      clickSound.currentTime = 0;
      clickSound.play().catch((error) => {
        console.error('Unable to play click sound:', error);
      });
    });
  });

  
////--------------------
  function evaluateExpression(str) {
    const clean = str.replace(/×/g, '*').replace(/÷/g, '/').replace(/\s+/g, '');
    const tokens = clean.match(/\d+\.?\d*|\.\d+|[+\-*/^()]/g);
  
    if (!tokens || tokens.join('') !== clean) throw new Error("Invalid input");
  
    let pos = 0;
    const peek = () => tokens[pos];
    const next = () => tokens[pos++];
  
    function parseExpression() {
      let left = parseTerm();
      while (peek() === '+' || peek() === '-') {
        const op = next();
        const right = parseTerm();
        left = calculate(left, op, right);
      }
      return left;
    }
  
    function parseTerm() {
      let left = parseUnary();
      while (peek() === '*' || peek() === '/') {
        const op = next();
        const right = parseUnary();
        left = calculate(left, op, right);
      }
      return left;
    }
  
    function parseUnary() {
      if (peek() === '-') {
        next();
        return -parseUnary();
      }
      return parsePower();
    }
  
    function parsePower() {
      const base = parsePrimary();
      if (peek() === '^') {
        next();
        const exponent = parseUnary();   
        return calculate(base, '^', exponent);
      }
      return base;
    }
  
    function parsePrimary() {
      const token = next();
      if (token === undefined) throw new Error("Unexpected end");
  
      if (token === '(') {
        const value = parseExpression();
        if (next() !== ')') throw new Error("Missing )");
        return value;
      }
  
      const num = parseFloat(token);
      if (Number.isNaN(num)) throw new Error("Unexpected " + token);
      return num;
    }
  
    const result = parseExpression();
    if (pos < tokens.length) throw new Error("Unexpected " + tokens[pos]);
    return result;
  }
  
  function calculateResult() {
    try {
      const result = evaluateExpression(displayedString);
      if (!Number.isFinite(result)) throw new Error("Math error");
  
      displayedString = String(parseFloat(result.toFixed(10)));
      display.innerText = displayedString;
    } catch (err) {
      console.error(err);          
      display.innerText = "ERROR";
      displayedString = "";
    }
    screen.scrollLeft = display.scrollWidth;
  }
