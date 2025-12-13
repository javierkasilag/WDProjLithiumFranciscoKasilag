const timeline = [
  {year: "1939", event: "<p>World War 2 begins with the Polish rejection of the Reich's demands over Danzig. Poland quickly falls due to the double invasion by the Soviet Union and Germany.</p><p>The invasion shocks Europe, and the world braces for a long conflict.</p>"},
  {year: "1940", event: `
    <p>Germany turns west to the lowlands and France, and executes its Blitzkrieg, quickly capitulating Belgium, Luxembourg, and the Netherlands with relatively few casualties. The French were surprised by this invasion, as their defenses were centered on the region of Alsace-Lorraine. The British Expeditionary Forces, alongside French troops, were encircled in the city of Dunkirk, and Germany either killed or captured 200-300k troops as POWs.</p>
    <br>
    <p>Paris soon falls, and France surrenders to the German Reich. This devastates the British public, leading to Churchill's removal. The new Prime Minister signs an armistice with Germany, although the Middle East and African Theatres remain active. Denmark and Norway were also captured during this campaign.</p>
  `},
  {year: "1941", event: "<p> Operation Barbarossa / the invasion of the Soviet Union by the Germans and Pearl Harbor happen as usual, Japan however does worse during the Pacific War because the Allies aren't fighting in Europe. Japan is still able to take Indochina(Vietnam, Cambodia, Laos), but struggles to take the rest of SEA.</p>"},
  {year: "1942", event: "<p>The Germans quickly advance into the Soviet Union, taking key cities such as Kiev, Minsk, and Odessa, but pushes halt due weather conditions. The war in China is still ongoing with the Empire of Japan gaining some ground.</p>"},
  {year: "1943", event: "<p> The French goverment in exile consolidates its land in West and Central Africa, as thee German puppet state takes control of Algeria, France's North African colony. The Germans at the gates of Mosvow, and the battlee for Moscwo begins.</p>"},
  {year: "1944", event: "<p>Moscow is captured, and Stalin disappears. By the beginning of 1945, the Germans mostly achieve their European goals and the fighting mostly stops, although no peace treaty is ever signed. Revolution in India sparked by the Bengal Famine begins, led by Subhas Chandra Bose. Henry A Wallace stays as Roosevelt's VP instead of being replaced by Truman.</p>"},
  {year: "1945", event: "<p> Henry Wallace becomes President after Roosevelt's death. American invasion of Siberia begins after Japan refuses surrender, Operation Olympic commences with an invasion of Kyushu followed by the atomic bombings of Hiroshima, Nagasaki, Kokura, and Yokohama. Japan  sues for peace.</p>"}
];


let index = 0;

const timelineLine = document.getElementById("timeline-line");

function generateDots() {
  timelineLine.innerHTML = "";
  timeline.forEach((item, i) => {
    const dot = document.createElement("div");
    dot.classList.add("dot");
    dot.dataset.index = i;
    dot.title = item.year;
    dot.onclick = () => {
      index = i;
      updateTimeline();
    };
    timelineLine.appendChild(dot);
  });
}

function updateTimeline() {
  document.getElementById("year").textContent = timeline[index].year;
  document.getElementById("event").innerHTML = timeline[index].event;

  document.querySelectorAll(".dot").forEach((dot, i) => {
    dot.classList.toggle("active-dot", i === index);
  });

  document.getElementById("prev").style.visibility = index === 0 ? "hidden" : "visible";
  document.getElementById("next").style.visibility = index === timeline.length - 1 ? "hidden" : "visible";
}

document.getElementById("next").onclick = () => {
  if (index < timeline.length - 1) index++;
  updateTimeline();
};

document.getElementById("prev").onclick = () => {
  if (index > 0) index--;
  updateTimeline();
};

generateDots();
updateTimeline();