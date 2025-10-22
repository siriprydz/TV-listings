//--------LÅT STÅ-----------
// Definiera fasta "konstanter" för olika typer av animering av menyn
ANIMATION = {
  NONE: "none", // Ingen animation
  TIMER: "timer", // setInterval-baserad animation
  ALTERNATIVE: "alternative", // ytterligare alternativ
};

// Ändra värdet för att styra vilken meny-animation som ska användas
window.MENU_ANIMATION_MODE ??= ANIMATION.NONE; // ANIMATION.TIMER (Default) = ingen animation (G-nivå), ANIMATION.TIMER // (VG-nivå), ANIMATION.ALTERNATIVE // ytterligare ett alternativ (VG-nivå);

/*
 Användningsexempel för animationer beroende på inställning
*/
if (window.MENU_ANIMATION_MODE === ANIMATION.NONE) {
  console.log("Ingen meny-animation används");
} else if (window.MENU_ANIMATION_MODE === ANIMATION.TIMER) {
  console.log("Meny-animation med timer används");
} else if (window.MENU_ANIMATION_MODE === ANIMATION.ALTERNATIVE) {
  console.log("Meny-animation med alternativ metod används");
}
//--------------------------

// Menu functionality

function toggleMenu() {
  console.log("button clicked");
  revealMenu();
  changeMenuIcon();
  changeMenuIconBackgroundColor();
}

async function setChannel(channel) {
  const url = `./data/${channel}.json`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const result = await response.json();
    console.log(result);
  } catch (error) {
    console.error(error.message);
  }
}

function revealMenu() {
  let UlMenuCssRule = document.styleSheets[2].cssRules[8].style;
  let UlMenuPosition = UlMenuCssRule.setProperty("left", "0px");
}

function changeMenuIcon() {
  let menuIcon = document.querySelector("i");
  menuIcon.classList.remove("fas", "fa-bars");
  const crossIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" fill="currentColor" class="bi bi-x" viewBox="3 2.9 16 16">
  <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"/></svg>`;
  let iconDiv = document.querySelector("i");
  iconDiv.innerHTML = crossIcon;
}

function changeMenuIconBackgroundColor() {
  let MenuIconCssRule = document.styleSheets[2].cssRules[6].style;
  let MenuIconBackgroundcolor = MenuIconCssRule.setProperty(
    "background-color",
    "azure"
  );
  let MenuIconBorderRadius = MenuIconCssRule.setProperty(
    "border-radius",
    "10px"
  );
}
