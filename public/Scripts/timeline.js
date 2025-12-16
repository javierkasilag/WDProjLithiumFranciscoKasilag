// Wait until the DOM is fully loaded before running the script
document.addEventListener("DOMContentLoaded", () => {

  // Timeline data: each object represents a historical year with its event, image, and alt text
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
        <p>Germany turns west to the Lowlands and France, and executes its Blitzkrieg...</p>
      `,
      image: "../public/assets/germaninvadeussr.png",
      alt: "Blitzkrieg in France"
    },
    // ... other years
  ];

  // Current index in the timeline array
  let index = 0;

  // Select main timeline elements from the DOM
  const timelineLine = document.getElementById("timeline-line");
  const timelineWrapper = document.querySelector(".timeline-wrapper");

  // Create container for displaying each timeline event
  const eventContainer = document.createElement("div");
  eventContainer.classList.add("timeline-event-container");

  // Create elements for event image and text
  const eventImageEl = document.createElement("img");
  const eventTextEl = document.createElement("div");
  eventTextEl.classList.add("timeline-event");

  // Append image and text to the container
  eventContainer.appendChild(eventImageEl);
  eventContainer.appendChild(eventTextEl);

  // Insert the container into the DOM before the timeline line
  timelineWrapper.insertBefore(eventContainer, timelineLine);

  // Function to generate dots for each timeline event
  function generateDots() {
    timelineLine.innerHTML = ""; // Clear existing dots

    timeline.forEach((item, i) => {
      const dot = document.createElement("div");
      dot.classList.add("dot");
      dot.dataset.index = i;
      dot.title = item.year; // Tooltip shows the year

      // Click event to navigate to the selected timeline event
      dot.onclick = () => {
        index = i;
        updateTimeline(true);
      };

      timelineLine.appendChild(dot);
    });
  }

  // Function to update timeline display based on current index
  function updateTimeline(animate = false) {
    eventContainer.classList.remove("show"); // Hide container before updating

    setTimeout(() => {
      const current = timeline[index];

      // Update year, event text, and image
      document.getElementById("year").textContent = current.year;
      eventTextEl.innerHTML = current.event;
      eventImageEl.src = current.image;
      eventImageEl.alt = current.alt;

      void eventContainer.offsetWidth; // Trigger reflow for CSS animation
      eventContainer.classList.add("show"); // Show container with animation

      // Highlight active dot
      document.querySelectorAll(".dot").forEach((dot, i) => {
        dot.classList.toggle("active-dot", i === index);
      });

      // Show/hide prev/next buttons based on current index
      document.getElementById("prev").style.visibility =
        index === 0 ? "hidden" : "visible";
      document.getElementById("next").style.visibility =
        index === timeline.length - 1 ? "hidden" : "visible";

    }, animate ? 200 : 0); // Delay if animating
  }

  // Event listeners for next and previous buttons
  document.getElementById("next").onclick = () => {
    if (index < timeline.length - 1) index++;
    updateTimeline(true);
  };

  document.getElementById("prev").onclick = () => {
    if (index > 0) index--;
    updateTimeline(true);
  };

  // Initialize timeline
  generateDots();
  updateTimeline(false);

});
