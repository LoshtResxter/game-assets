const weapons = [
  {
    name: "Nuke",
    energy: 3,
    unlock: 1,
    use: "A larger and heavier rocket has about 3x blast radius upon impact and about 3x damage.",
    icon: "images/effects/explosion3.png",
    type: "weapon",
  },
  {
    name: "Mine",
    energy: 2,
    unlock: 1,
    use: "A projectile that sticks to a piece of land and any opponent of the user takes damage.",
    icon: "images/ui_nonspritesheet/drag_dot_50.png",
    type: "weapon",
  },
  {
    name: "Rapidfire",
    energy: 3,
    unlock: 2,
    use: "Five little rockets fired in quick succession, slightly spread out.",
    icon: "images/ui_nonspritesheet/drag-icon-missile.png",
    type: "weapon",
  },
  {
    name: "Shield",
    energy: 3,
    unlock: 4,
    use: "A bubble that surrounds you and bounces opponent weapons back.",
    icon: "images/ui_nonspritesheet/shine-128.png",
    type: "weapon",
  },
  {
    name: "Flak",
    energy: 3,
    unlock: 6,
    use: "Multiple quick, fast & small rockets that deal a medium amount of damage in a short range.",
    icon: "images/effects/parts.png",
    type: "weapon",
  },
  {
    name: "Grenade",
    energy: 2,
    unlock: 8,
    use: "Multiple small balls that explode after contact with either land or a tank.",
    icon: "images/ui_nonspritesheet/drag_dot_50.png",
    type: "weapon",
  },
  {
    name: "Drill",
    energy: 2,
    unlock: 10,
    use: "Cuts through land for a certain distance then opens up a hole.",
    icon: "images/ui_nonspritesheet/drag-to-aim-dot.png",
    type: "weapon",
  },
  {
    name: "Homing",
    energy: 3,
    unlock: 12,
    use: "Tracks opponents when reaching the required distance and speeds up after acquiring its target.",
    icon: "images/ui_nonspritesheet/drag-to-aim-lg.png",
    type: "weapon",
  },
  {
    name: "Whirlwind",
    energy: 2,
    unlock: 16,
    use: "A tornado-shaped weapon that can blow people in the direction it is pointing.",
    icon: "images/effects/smoke.png",
    type: "weapon",
  },
  {
    name: "Jetpack",
    energy: 2,
    unlock: 18,
    use: "Launches the user in the opposite direction for about a second and a half.",
    icon: "images/ui_nonspritesheet/drag-to-aim.png",
    type: "weapon",
  },
  {
    name: "Poison",
    energy: 2,
    unlock: 22,
    use: "A green bottle that opens into a large-radius green circle damaging anyone inside.",
    icon: "images/smoke_bottle.png",
    type: "weapon",
  },
  {
    name: "Laser",
    energy: 3,
    unlock: 24,
    use: "Instant long-ranged laser with a 2-second charge-up time.",
    icon: "images/ui/preview_laser.png",
    type: "weapon",
  },
  {
    name: "Smoke",
    energy: 2,
    unlock: 26,
    use: "A thick cloud of smoke that obscures vision for 5.6 seconds.",
    icon: "images/effects/smoke.png",
    type: "weapon",
  },
];

const perks = [
  {
    name: "Health",
    energy: 2,
    unlock: 1,
    use: "For each perk, the user's HP increases by 20%.",
    icon: "images/shop/plus.png",
    type: "perk",
  },
  {
    name: "Speed",
    energy: 3,
    unlock: 14,
    use: "Increases the tank's driving speed by 30%.",
    icon: "images/shop/arrow_1.png",
    type: "perk",
  },
  {
    name: "Insight",
    energy: 3,
    unlock: 20,
    use: "Allows the user to see what weapons an opponent has.",
    icon: "images/ui_nonspritesheet/tutorial-2mouse.png",
    type: "perk",
  },
  {
    name: "Magnet",
    energy: 3,
    unlock: 28,
    use: "Pulls in nearby coins and crates for the entire match.",
    icon: "images/shop/coins_3.png",
    type: "perk",
  },
  {
    name: "Healing Shield",
    energy: 8,
    unlock: 30,
    use: "Adds healing to your shield for anyone inside of it.",
    icon: "images/ui_nonspritesheet/shine-128.png",
    type: "perk",
  },
  {
    name: "Vampire",
    energy: 5,
    unlock: 32,
    use: "Damaging another player adds 50% of the damage to your health.",
    icon: "images/effects/explosion2.png",
    type: "perk",
  },
  {
    name: "Ammo",
    energy: 10,
    unlock: 50,
    use: "Gives a fourth rocket throughout the entire match.",
    icon: "images/ui/ammo/ammo-laser-base.png",
    type: "perk",
  },
];

const entries = [...weapons, ...perks];
const energyMax = 10;

const state = {
  selections: new Map(),
  energyUsed: 0,
};

const armoryModal = document.getElementById("armory-modal");
const openArmory = document.getElementById("open-armory");
const closeArmory = document.getElementById("close-armory");
const armoryGrid = document.getElementById("armory-grid");
const energyLeft = document.getElementById("energy-left");
const perkSlots = document.getElementById("perk-slots");
const weaponSlots = document.getElementById("weapon-slots");
const selectedItems = document.getElementById("selected-items");
const confirmLoadout = document.getElementById("confirm-loadout");
const matchLog = document.getElementById("match-log");
const simulateLobby = document.getElementById("simulate-lobby");
const lobbyStatus = document.getElementById("lobby-status");
const aiStatus = document.getElementById("ai-status");
const playersOnline = document.getElementById("players-online");

const weaponsTable = document.getElementById("weapons-table");
const perksTable = document.getElementById("perks-table");

const maxSlots = {
  weapon: 3,
  perk: 3,
};

const renderTable = (items, container) => {
  container.innerHTML = "";
  items.forEach((item) => {
    const row = document.createElement("div");
    row.className = "table-row";
    row.innerHTML = `
      <strong>${item.name}</strong>
      <span>${item.use}</span>
      <div class="armory-meta">Energy: ${item.energy} • Unlock Lv. ${item.unlock}</div>
    `;
    container.appendChild(row);
  });
};

const updateEnergy = () => {
  const left = energyMax - state.energyUsed;
  energyLeft.textContent = `${left}/${energyMax}`;
  document.querySelector(".energy").textContent = `${left} / ${energyMax}`;
};

const updateSlots = () => {
  const selectedWeapons = entries.filter((item) => item.type === "weapon" && state.selections.get(item.name));
  const selectedPerks = entries.filter((item) => item.type === "perk" && state.selections.get(item.name));

  perkSlots.innerHTML = "";
  weaponSlots.innerHTML = "";

  for (let i = 0; i < maxSlots.perk; i += 1) {
    const slot = document.createElement("div");
    slot.className = "slot";
    slot.textContent = selectedPerks[i]?.name || "Empty";
    perkSlots.appendChild(slot);
  }

  for (let i = 0; i < maxSlots.weapon; i += 1) {
    const slot = document.createElement("div");
    slot.className = "slot";
    slot.textContent = selectedWeapons[i]?.name || "Empty";
    weaponSlots.appendChild(slot);
  }

  selectedItems.innerHTML = "";
  [...selectedPerks, ...selectedWeapons].forEach((item) => {
    const chip = document.createElement("div");
    chip.className = "chip";
    chip.textContent = `${item.name} (-${item.energy})`;
    selectedItems.appendChild(chip);
  });
};

const addLog = (message) => {
  const entry = document.createElement("div");
  const time = new Date().toLocaleTimeString();
  entry.textContent = `[${time}] ${message}`;
  matchLog.prepend(entry);
};

const canSelect = (item) => {
  const selectedCount = entries.filter((entry) => entry.type === item.type && state.selections.get(entry.name)).length;
  if (selectedCount >= maxSlots[item.type] && !state.selections.get(item.name)) {
    return false;
  }
  if (!state.selections.get(item.name) && state.energyUsed + item.energy > energyMax) {
    return false;
  }
  return true;
};

const toggleItem = (item) => {
  const isSelected = state.selections.get(item.name) || 0;
  if (isSelected) {
    state.selections.delete(item.name);
    state.energyUsed -= item.energy;
  } else if (canSelect(item)) {
    state.selections.set(item.name, 1);
    state.energyUsed += item.energy;
  }
  updateEnergy();
  updateSlots();
  renderArmory();
};

const renderArmory = () => {
  armoryGrid.innerHTML = "";
  entries.forEach((item) => {
    const isSelected = Boolean(state.selections.get(item.name));
    const card = document.createElement("div");
    card.className = "armory-item";
    card.innerHTML = `
      <img src="${item.icon}" alt="${item.name}" />
      <div>
        <h4>${item.name} <span class="armory-meta">${item.type}</span></h4>
        <div class="armory-meta">${item.use}</div>
        <div class="armory-meta">Energy ${item.energy} • Unlock Lv. ${item.unlock}</div>
      </div>
      <div class="counter">
        <button data-action="remove" ${!isSelected ? "disabled" : ""}>-</button>
        <span>${isSelected ? 1 : 0}</span>
        <button data-action="add" ${!canSelect(item) && !isSelected ? "disabled" : ""}>+</button>
      </div>
    `;

    const [removeBtn, , addBtn] = card.querySelectorAll("button, span");
    removeBtn.addEventListener("click", () => toggleItem(item));
    addBtn.addEventListener("click", () => toggleItem(item));

    armoryGrid.appendChild(card);
  });
};

openArmory.addEventListener("click", () => {
  armoryModal.classList.add("show");
  armoryModal.setAttribute("aria-hidden", "false");
});

closeArmory.addEventListener("click", () => {
  armoryModal.classList.remove("show");
  armoryModal.setAttribute("aria-hidden", "true");
});

confirmLoadout.addEventListener("click", () => {
  addLog("Loadout locked in. Waiting for aircraft deployment...");
  armoryModal.classList.remove("show");
});

simulateLobby.addEventListener("click", () => {
  const bots = Math.floor(Math.random() * 10) + 12;
  const players = Math.floor(Math.random() * 20) + 10;
  lobbyStatus.textContent = `Lobby filled with ${players} players + ${bots} AI bots.`;
  aiStatus.textContent = "Advanced neural bots calibrating trajectory boosts.";
  playersOnline.textContent = (7500 + Math.floor(Math.random() * 400)).toLocaleString();
  addLog("Matchmaking synced. AI bots feel very real.");
});

renderTable(weapons, weaponsTable);
renderTable(perks, perksTable);
updateEnergy();
updateSlots();
renderArmory();
