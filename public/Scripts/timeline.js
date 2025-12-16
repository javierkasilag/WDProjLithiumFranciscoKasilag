document.addEventListener("DOMContentLoaded", () => {

  const timeline = [
    

  {
    year: "1939",
    event: `
      <p>World War 2 begins with Poland rejecting the Reich's demands over Danzig. Poland quickly falls due to the double invasion by the Soviet Union and Germany.</p>
      <p>The invasion shocks Europe, and the world braces for a long conflict.</p>
    `,
    image: "../public/assets/poland_timeline.jpg",
    alt: "Germany Invades Poland"
  },
  {
    year: "1940",
    event: `
      <p>Germany turns west to the Lowlands and France, and executes its Blitzkrieg, quickly capitulating Belgium, Luxembourg, and the Netherlands with relatively few casualties. The French are surprised by this invasion, as their defenses center on Alsace-Lorraine. The British Expeditionary Forces, alongside French troops, are encircled in Dunkirk, and Germany either kills or captures 200-300k troops as POWs.</p>
      <br>
      <p>Paris soon falls, and France surrenders to the German Reich. This devastates the British public, leading to Churchill's removal. The new Prime Minister signs an armistice with Germany, although the Middle East and African Theatres remain active. Denmark and Norway are also captured during this campaign.</p>
    `,
    image: "../public/assets/germaninvadeussr.png",
    alt: "Blitzkrieg in France"
  },
  {
    year: "1941",
    event: `
      <p>Operation Barbarossa, the German invasion of the Soviet Union, and Pearl Harbor occur as usual. Japan struggles during the Pacific War because the Allies are not fighting in Europe. Japan still takes Indochina (Vietnam, Cambodia, Laos) but struggles to take the rest of Southeast Asia.</p>
    `,
    image: "../public/assets/france_timeline.jpg",
    alt: "Operation Barbarossa"
  },
  {
    year: "1942",
    event: `
      <p>The Germans quickly advance into the Soviet Union, taking key cities such as Kiev, Minsk, and Odessa, but their advance halts due to weather conditions. The war in China continues, with the Empire of Japan gaining some ground.</p>
    `,
    image: "../public/assets/japanchina.jpg",
    alt: "German Advance into Soviet Union"
  },
  {
    year: "1943",
    event: `
      <p>The French government in exile consolidates its land in West and Central Africa, as the German puppet state takes control of Algeria, France's North African colony. The Germans reach the gates of Moscow, and the battle for Moscow begins.</p>
    `,
    image: "../public/assets/franceinafrica.jpg",
    alt: "French Exile in Africa"
  },
  {
    year: "1944",
    event: `
      <p>Moscow is captured, and Stalin disappears. By the beginning of 1945, the Germans mostly achieve their European goals, and the fighting mostly stops, although no peace treaty is signed. The revolution in India, sparked by the Bengal Famine, begins, led by Subhas Chandra Bose. Henry A Wallace stays as Roosevelt's VP instead of being replaced by Truman.</p>
    `,
    image: "../public/assets/moscow.jpg",
    alt: "Capture of Moscow"
  },
  {
    year: "1945",
    event: `
      <p>Henry Wallace becomes President after Roosevelt's death. The American invasion of Siberia begins after Japan refuses to surrender. Operation Olympic commences with an invasion of Kyushu, followed by the atomic bombings of Hiroshima, Nagasaki, Kokura, and Yokohama. Japan sues for peace.</p>
    `,
    image: "../public/assets/japanbombed.jpg",
    alt: "End of WWII"
  }
];


  let index = 0;

  const timelineLine = document.getElementById("timeline-line");
  const timelineWrapper = document.querySelector(".timeline-wrapper");

  const eventContainer = document.createElement("div");
  eventContainer.classList.add("timeline-event-container");

  const eventImageEl = document.createElement("img");
  const eventTextEl = document.createElement("div");
  eventTextEl.classList.add("timeline-event");

  eventContainer.appendChild(eventImageEl);
  eventContainer.appendChild(eventTextEl);
  timelineWrapper.insertBefore(eventContainer, timelineLine);

  function generateDots() {
    timelineLine.innerHTML = "";

    timeline.forEach((item, i) => {
      const dot = document.createElement("div");
      dot.classList.add("dot");
      dot.dataset.index = i;
      dot.title = item.year;

      dot.onclick = () => {
        index = i;
        updateTimeline(true);
      };

      timelineLine.appendChild(dot);
    });
  }

  function updateTimeline(animate = false) {
    eventContainer.classList.remove("show");

    setTimeout(() => {
      const current = timeline[index];

      document.getElementById("year").textContent = current.year;
      eventTextEl.innerHTML = current.event;
      eventImageEl.src = current.image;
      eventImageEl.alt = current.alt;

      void eventContainer.offsetWidth;
      eventContainer.classList.add("show");

      document.querySelectorAll(".dot").forEach((dot, i) => {
        dot.classList.toggle("active-dot", i === index);
      });

      document.getElementById("prev").style.visibility =
        index === 0 ? "hidden" : "visible";
      document.getElementById("next").style.visibility =
        index === timeline.length - 1 ? "hidden" : "visible";

    }, animate ? 200 : 0);
  }

  document.getElementById("next").onclick = () => {
    if (index < timeline.length - 1) index++;
    updateTimeline(true);
  };

  document.getElementById("prev").onclick = () => {
    if (index > 0) index--;
    updateTimeline(true);
  };

  generateDots();
  updateTimeline(false);

});
