const API_URL = "https://api.joshlei.com/v2/growagarden/stock";

const rarityData = {
  "common": ["carrot", "strawberry", "blueberry"],
  "uncommon": ["rose", "orange_tulip", "stonebite"],
  "rare": ["tomato", "daffodil", "cauliflower", "raspberry", "foxglove", "peace_lily", "corn", "paradise_petal", "dandelion", "nectarshade", "mint", "succulent", "bee_balm", "pear", "delphinium", "candy_sunflower", "glowshroom"],
  "legendary": ["watermelon", "pumpkin", "apple", "bamboo", "coconut", "cantaloupe", "avocado", "green_apple", "banana", "papaya", "rafflesia", "lilac", "cranberry", "durian", "moonflower", "starfruit", "aloe_vera", "lumira", "horned_dinoshroom", "boneboo"],
  "mythical": ["peach", "pineapple", "guanabana", "cactus", "dragon_fruit", "mango", "kiwi", "bell_pepper", "prickly_pear", "pink_lily", "purple_dahlia", "firefly_fern", "eggplant", "easter_egg", "moonglow", "blood_banana", "moon_melon", "celestiberry", "nectarine", "honeysuckle", "suncoil", "lily_of_the_valley"],
  "divine": ["grape", "loquat", "mushroom", "pepper", "cacao", "feijoa", "pitcher_plant", "sunflower", "fossilight", "cursed_fruit", "soul_fruit", "mega_mushroom", "moon_blossom", "moon_mango", "hive_fruit", "dragon_pepper", "rosy_delight", "traveler's_fruit", "candy_blossom", "venus_fly_trap", "lotus", "cherry_blossom"],
  "prismatic": ["beanstalk", "ember_lily", "elephant_ears", "burning_bud", "giant_pinecone", "sugar_apple"],
  "transcendent": ["bone_blossom"]
};

// Check login
function checkLogin() {
  if (localStorage.getItem("authenticated") !== "true") {
    window.location.href = "login.html";
  }
}

// Dark mode
function toggleDarkMode() {
  document.body.classList.toggle("dark");
  localStorage.setItem("darkMode", document.body.classList.contains("dark"));
}

// Utilities
function getRarity(itemId) {
  return Object.entries(rarityData).find(([_, list]) => list.includes(itemId))?.[0] || null;
}

function rarityPriority(r) {
  return ["common", "uncommon", "rare", "legendary", "mythical", "divine", "prismatic", "transcendent"].indexOf(r);
}

// Marquee alert system
let alertQueue = [];
let isAlertShowing = false;

function showAlert(text) {
  alertQueue.push(text);
  if (!isAlertShowing) {
    displayAlert();
  }
}

function displayAlert() {
  if (alertQueue.length === 0) {
    isAlertShowing = false;
    return;
  }

  isAlertShowing = true;
  const marquee = document.getElementById("alert-marquee");
  const container = document.getElementById("marquee-container");

  marquee.textContent = alertQueue.join(" • ");
  container.style.display = "flex"; // always visible
}

// Close marquee
function closeMarquee() {
  const container = document.getElementById("marquee-container");
  container.style.display = "none";
}

// Render filters
function renderFilters() {
  const filterDiv = document.getElementById("rarity-filters");
  filterDiv.innerHTML = Object.keys(rarityData).map(r =>
    `<label><input type="checkbox" value="${r}" checked/> ${r}</label><br>`
  ).join("");
}

// Filter logic
function matchesFilters(item) {
  const q = document.getElementById("search").value.toLowerCase();
  const checked = [...document.querySelectorAll("#rarity-filters input:checked")].map(i => i.value);
  const r = getRarity(item.item_id);
  return (!q || item.display_name.toLowerCase().includes(q)) && (!r || checked.includes(r));
}

// Main stock loader
async function loadStock() {
  const container = document.getElementById("items");
  const loadingContainer = document.getElementById("loading-container");
  const loadingBar = document.getElementById("loading-bar");
  const updateSound = document.getElementById("update-sound");

  // Show loading overlay
  loadingContainer.style.display = "flex";
  let progress = 0;
  let progressInterval = setInterval(() => {
    if (progress < 90) {
      progress += Math.random() * 5;
      loadingBar.style.width = `${Math.min(progress, 90)}%`;
    }
  }, 100);

  try {
    const res = await fetch(API_URL);
    const data = await res.json();

    container.innerHTML = "";
    alertQueue = [];

    Object.keys(data).forEach(cat => {
      if (!Array.isArray(data[cat])) return;
      const group = data[cat].filter(matchesFilters);
      if (!group.length) return;

      const divg = document.createElement("div");
      divg.className = "item-group";
      divg.innerHTML = `<h2>${cat.replace("_", " ").toUpperCase()}</h2>`;

      group.forEach(item => {
        const r = getRarity(item.item_id);
        const pri = rarityPriority(r);

        if (pri >= rarityPriority("rare")) {
          alertQueue.push(`🌟 ${item.display_name} (${r.toUpperCase()}) is in stock ×${item.quantity}`);
        }

        const el = document.createElement("div");
        el.className = "item";
        el.innerHTML = `
          <img src="${item.icon}" alt="" />
          <div class="item-details">
            <strong>${item.display_name}</strong> ×${item.quantity}
            <br>
            <small class="countdown" data-end="${item.end_date_unix}"></small>
          </div>
          ${r ? `<div class="rarity-box rarity-${r}">${r.toUpperCase()}</div>` : ""}
        `;
        divg.appendChild(el);
      });

      container.appendChild(divg);
    });

    if (alertQueue.length > 0) {
      displayAlert();
      updateSound.play().catch(() => {}); // safe play
    }

    updateCountdowns();
  } catch (err) {
    console.error("Stock loading failed:", err);
  } finally {
    clearInterval(progressInterval);
    loadingBar.style.width = "100%";
    setTimeout(() => {
      loadingContainer.style.display = "none";
      loadingBar.style.width = "0%";
    }, 400);
  }
}


// Timer countdowns
function updateCountdowns() {
  document.querySelectorAll(".countdown").forEach(el => {
    const end = +el.dataset.end;
    const diff = Math.max(0, end - Math.floor(Date.now() / 1000));
    const m = Math.floor(diff / 60);
    const s = diff % 60;
    el.textContent = `${m}m ${s}s`;
  });
}

// Init on load
function init() {
  if (localStorage.getItem("darkMode") === "true") {
    document.body.classList.add("dark");
  }

  renderFilters();
  document.getElementById("search").oninput = loadStock;
  document.getElementById("rarity-filters").onchange = loadStock;
  document.getElementById("close-marquee").onclick = closeMarquee;

  setInterval(updateCountdowns, 1000);
  setInterval(loadStock, 60000);

  loadStock();
}