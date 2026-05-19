const display = document.getElementById("display");
const buttons = document.querySelectorAll(".buttons button, .scientific button");
const scientific = document.querySelector(".scientific");
const modeToggle = document.getElementById("modeToggle");
const themeToggle = document.getElementById("themeToggle");
const historyList = document.getElementById("historyList");

let currentInput = "";
let memory = 0;
let history = [];

/* -------------------- yardımcı -------------------- */

function toRad(x) {
    return x * (Math.PI / 180);
}

const functionsMap = {
    "sin": x => Math.sin(toRad(x)),
    "cos": x => Math.cos(toRad(x)),
    "tan": x => Math.tan(toRad(x)),
    "√": x => Math.sqrt(x),
    "log": x => Math.log10(x)
};

function safeEval(expr) {
    try {
        return Function('"use strict";return (' + expr + ')')();
    } catch {
        return "Hata";
    }
}

function addHistory(expression, result) {
    if (!historyList) return;

    const li = document.createElement("li");
    li.textContent = `${expression} = ${result}`;

    li.addEventListener("click", () => {
        currentInput = result.toString();
        display.value = currentInput;
    });

    historyList.prepend(li);
}

/* -------------------- butonlar -------------------- */

buttons.forEach(button => {
    button.addEventListener("click", () => {
        const value = button.textContent;

        if (value === "C") {
            currentInput = "";
        }

        else if (value === "⌫") {
            currentInput = currentInput.slice(0, -1);
        }

        else if (value === "=") {
            const expr = currentInput;

            currentInput = safeEval(currentInput).toString();

            if (currentInput !== "Hata") {
            addHistory(expr, currentInput);
            }
        }

        else if (value === "π") {
            currentInput += Math.PI;
        }

        else if (value === "x²") {
            currentInput = (safeEval(currentInput) ** 2).toString();
        }

        else if (functionsMap[value]) {
            currentInput = functionsMap[value](safeEval(currentInput)).toString();
        }

        else if (value === "M+") {
            memory += parseFloat(currentInput) || 0;
        }

        else if (value === "MR") {
            currentInput = memory.toString();
        }

        else if (value === "MC") {
            memory = 0;
        }

        else {
            currentInput += value;
        }

        display.value = currentInput;
    });
});

/* -------------------- mod geçişi -------------------- */

modeToggle.addEventListener("click", () => {
    scientific.classList.toggle("hidden");

    setTimeout(() => {
        scientific.classList.toggle(
            "show",
            !scientific.classList.contains("hidden")
        );
    }, 10);

    modeToggle.textContent =
        scientific.classList.contains("hidden")
            ? "Normal"
            : "Bilimsel";
});

/* -------------------- klavye -------------------- */

document.addEventListener("keydown", e => {
    const key = e.key;

    if (!isNaN(key) || ["+", "-", "*", "/", ".", "%", "(", ")"].includes(key)) {
        currentInput += key;
    }

    else if (key === "Enter") {
        const expr = currentInput;
        currentInput = safeEval(currentInput).toString();

        if (currentInput !== "Hata") {
            addHistory(expr, currentInput);
        }
    }

    else if (key === "Backspace") {
        currentInput = currentInput.slice(0, -1);
    }

    else if (key === "Escape") {
        currentInput = "";
    }

    display.value = currentInput;
});

/* -------------------- tema -------------------- */

if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark");
    themeToggle.textContent = "☀️";
}

themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark");

    if (document.body.classList.contains("dark")) {
        themeToggle.textContent = "☀️";
        localStorage.setItem("theme", "dark");
    } else {
        themeToggle.textContent = "🌙";
        localStorage.setItem("theme", "light");
    }
});