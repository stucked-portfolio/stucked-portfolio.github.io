// ===== looping single line typing effect =====
const phrase = "Building something....";
let charIndex = 0;
let isDeleting = false;

function typePhraseLoop() {
    const typingElement = document.getElementById("typing");
    
    if (!typingElement) return;

    if (isDeleting) {
        typingElement.innerHTML = phrase.substring(0, charIndex - 1);
        charIndex--;
    } else {
        typingElement.innerHTML = phrase.substring(0, charIndex + 1);
        charIndex++;
    }

    let speed = isDeleting ? 25 : 50;

    if (!isDeleting && charIndex === phrase.length) {
        speed = 2500; 
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        speed = 600; 
    }

    setTimeout(typePhraseLoop, speed);
}

document.addEventListener("DOMContentLoaded", () => {
    typePhraseLoop();
});


// ===== scroll to projects =====
function scrollToProjects(){
    const projectsSection = document.getElementById("projects");
    if (projectsSection) {
        projectsSection.scrollIntoView({ behavior: "smooth" });
    }
}


// ===== scroll reveal animation =====
const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add("active");
        }
    });
}, { threshold: 0.15 });

document.querySelectorAll(".reveal").forEach(el => {
    observer.observe(el);
});



const links = document.querySelectorAll(".navlink");

window.addEventListener("scroll", () => {
    let fromTop = window.scrollY;

    links.forEach(link => {
        const href = link.getAttribute("href");
        const section = document.querySelector(href);

        if (section) {
            const sectionTop = section.offsetTop - 120; 
            const sectionHeight = section.offsetHeight;

            if (fromTop >= sectionTop && fromTop < sectionTop + sectionHeight) {
                link.classList.add("active");
            } else {
                link.classList.remove("active");
            }
        }
    });
});


// ===== LIVE DISCORD STATUS (Lanyard API) =====
// Replace DISCORD_USER_ID with your real Discord user ID.
// Requires joining the Lanyard Discord server: https://discord.gg/lanyard
const DISCORD_USER_ID = "979280490261532732";

const STATUS_LABELS = {
    online: "Online",
    idle: "Idle",
    dnd: "Do Not Disturb",
    offline: "Offline"
};

async function updateDiscordStatus(){
    const badge = document.getElementById("discordStatus");
    const label = document.getElementById("discordStatusText");
    if (!badge || !label) return;

    try {
        const res = await fetch(`https://api.lanyard.rest/v1/users/${DISCORD_USER_ID}`);
        const json = await res.json();

        if (!json.success) throw new Error("Lanyard: user not found in cache");

        const status = json.data.discord_status || "offline";

        badge.classList.remove("is-online", "is-idle", "is-dnd", "is-offline");
        badge.classList.add(`is-${status}`);

        label.textContent = STATUS_LABELS[status] || "Unknown";
    } catch (err) {
        badge.classList.remove("is-online", "is-idle", "is-dnd");
        badge.classList.add("is-offline");
        label.textContent = "Status unavailable";
        console.log("Discord status fetch failed:", err);
    }
}

if (document.getElementById("discordStatus")){
    updateDiscordStatus();
    setInterval(updateDiscordStatus, 60000); // refresh every 60s
}
