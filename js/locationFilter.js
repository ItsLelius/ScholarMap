// ── locationFilter.js ─────────────────────────────────────
// Custom dropdown UI + cascading PSGC location filter
// using local JSON files. No native <select> elements.

// ── State ──────────────────────────────────────────────────
let PSGC = {};
const selected = { region: null, province: null, city: null, barangay: null };

// ── Dropdown Registry ──────────────────────────────────────
// Each dropdown is a self-contained object
const dropdowns = {};

/**
 * Creates a custom dropdown component.
 * @param {string} id       - unique id (matches wrap-{id}, dot-{id})
 * @param {string} placeholder
 */
function createDropdown(id, placeholder) {
    const wrap    = document.getElementById(`wrap-${id}`);
    const trigger = wrap.querySelector('.loc-trigger');
    const triggerText = wrap.querySelector('.loc-trigger-text');
    const panel   = wrap.querySelector('.loc-panel');
    const search  = wrap.querySelector('.loc-search');
    const optList = wrap.querySelector('.loc-options');
    const spinner = wrap.querySelector('.loc-spinner');

    let isOpen    = false;
    let isDisabled = true;
    let items     = [];
    let currentValue = null;

    function open() {
        if (isDisabled || !items.length) return;
        isOpen = true;
        trigger.classList.add('is-open');

        // Decide direction: open up if not enough space below
        const rect = wrap.getBoundingClientRect();
        const spaceBelow = window.innerHeight - rect.bottom;
        panel.classList.remove('opens-up', 'opens-down');
        panel.classList.add(spaceBelow < 280 ? 'opens-up' : 'opens-down');
        panel.classList.add('is-open');

        if (search) {
            search.value = '';
            filterOptions('');
            requestAnimationFrame(() => search.focus());
        }

        // Close other dropdowns
        Object.values(dropdowns).forEach(d => { if (d.id !== id) d.close(); });
    }

    function close() {
        isOpen = false;
        trigger.classList.remove('is-open');
        panel.classList.remove('is-open');
    }

    function toggle() { isOpen ? close() : open(); }

    function filterOptions(q) {
        const query = q.toLowerCase();
        let hasVisible = false;
        optList.querySelectorAll('.loc-option').forEach(opt => {
            const match = opt.textContent.toLowerCase().includes(query);
            opt.classList.toggle('is-hidden', !match);
            if (match) hasVisible = true;
        });
        // Empty state
        let empty = optList.querySelector('.loc-empty');
        if (!hasVisible) {
            if (!empty) {
                empty = document.createElement('div');
                empty.className = 'loc-empty';
                empty.textContent = 'No results found';
                optList.appendChild(empty);
            }
        } else {
            if (empty) empty.remove();
        }
    }

    function populate(newItems) {
        items = newItems;
        isDisabled = false;
        trigger.classList.remove('is-disabled');
        currentValue = null;
        triggerText.textContent = placeholder;
        trigger.classList.remove('has-value');

        optList.innerHTML = '';
        [...items]
            .sort((a, b) => a.name.localeCompare(b.name))
            .forEach(item => {
                const opt = document.createElement('div');
                opt.className = 'loc-option';
                opt.textContent = item.name;
                opt.dataset.code = item.code;
                opt.addEventListener('click', () => selectOption(item.code, item.name, opt));
                optList.appendChild(opt);
            });
    }

    function selectOption(code, name, optEl) {
        currentValue = code;
        triggerText.textContent = name;
        trigger.classList.add('has-value');

        // Highlight selected
        optList.querySelectorAll('.loc-option').forEach(o => o.classList.remove('is-selected'));
        if (optEl) optEl.classList.add('is-selected');

        close();
        wrap.dispatchEvent(new CustomEvent('loc:change', { detail: { code, name } }));
    }

    function reset() {
        isDisabled = true;
        isOpen = false;
        currentValue = null;
        items = [];
        trigger.classList.add('is-disabled');
        trigger.classList.remove('is-open', 'has-value');
        panel.classList.remove('is-open');
        triggerText.textContent = placeholder;
        optList.innerHTML = '';
        activeDot(id, false);
    }

    function setLoading(on) {
        if (on) {
            wrap.classList.add('loc-loading');
        } else {
            wrap.classList.remove('loc-loading');
        }
    }

    // Events
    trigger.addEventListener('click', (e) => { e.stopPropagation(); toggle(); });
    if (search) search.addEventListener('input', e => filterOptions(e.target.value));

    // Close on outside click
    document.addEventListener('click', (e) => {
        if (isOpen && !wrap.contains(e.target)) close();
    });

    const dd = { id, open, close, toggle, populate, reset, setLoading, get value() { return currentValue; } };
    dropdowns[id] = dd;
    return dd;
}

// ── DOM ────────────────────────────────────────────────────
const filterTrigger = document.getElementById('filter-trigger');
const filterSidebar = document.getElementById('filter-sidebar');
const closeFilter   = document.getElementById('close-filter');
const overlay       = document.getElementById('sidebar-overlay');
const summary       = document.getElementById('loc-summary');

// ── Init Dropdowns ─────────────────────────────────────────
const ddRegion   = createDropdown('region',   'Select Region');
const ddProvince = createDropdown('province', 'Select Province');
const ddCity     = createDropdown('city',     'Select City / Municipality');
const ddBarangay = createDropdown('barangay', 'Select Barangay');

// ── Sidebar ────────────────────────────────────────────────
function openSidebar() {
    overlay.classList.remove('hidden');
    requestAnimationFrame(() => {
        filterSidebar.classList.add('open');
        overlay.classList.add('opacity-100');
        overlay.classList.remove('opacity-0');
    });
}
function closeSidebar() {
    filterSidebar.classList.remove('open');
    overlay.classList.remove('opacity-100');
    overlay.classList.add('opacity-0');
    // Close any open dropdowns
    Object.values(dropdowns).forEach(d => d.close());
    setTimeout(() => overlay.classList.add('hidden'), 450);
}

filterTrigger.addEventListener('click', openSidebar);
closeFilter.addEventListener('click', closeSidebar);
overlay.addEventListener('click', closeSidebar);

// ── Helpers ────────────────────────────────────────────────
function activeDot(id, on) {
    const dot = document.getElementById(`dot-${id}`);
    if (dot) dot.style.opacity = on ? '1' : '0.4';
}

function refreshSummary() {
    const map = [
        { key: 'region',   icon: '🗺️' },
        { key: 'province', icon: '📍' },
        { key: 'city',     icon: '🏙️' },
        { key: 'barangay', icon: '🏘️' },
    ];
    const filled = map.filter(m => selected[m.key]);
    if (!filled.length) { summary.classList.add('hidden'); return; }
    summary.classList.remove('hidden');
    summary.innerHTML = filled.map(m =>
        `<span class="loc-pill">${m.icon} ${selected[m.key].name}</span>`
    ).join('');
}

// ── Load Local PSGC Data ───────────────────────────────────
async function loadPSGC() {
    ddRegion.setLoading(true);
    try {
        const [regions, provinces, cities, munis, barangays] = await Promise.all([
            fetch('./assets/psgc/regions.json').then(r => r.json()),
            fetch('./assets/psgc/provinces.json').then(r => r.json()),
            fetch('./assets/psgc/cities.json').then(r => r.json()),
            fetch('./assets/psgc/municipalities.json').then(r => r.json()),
            fetch('./assets/psgc/barangays.json').then(r => r.json()),
        ]);
        PSGC = { regions, provinces, cities, munis, barangays };
        ddRegion.populate(regions);
    } catch (e) {
        console.error('Failed to load PSGC data:', e);
    } finally {
        ddRegion.setLoading(false);
    }
}

// ── Cascade Events ─────────────────────────────────────────
document.getElementById('wrap-region').addEventListener('loc:change', ({ detail }) => {
    selected.region   = detail;
    selected.province = selected.city = selected.barangay = null;
    ddProvince.reset(); ddCity.reset(); ddBarangay.reset();
    activeDot('region', true);
    refreshSummary();

    const provs = PSGC.provinces.filter(p => p.regionCode === detail.code);
    ddProvince.populate(provs);
});

document.getElementById('wrap-province').addEventListener('loc:change', ({ detail }) => {
    selected.province = detail;
    selected.city = selected.barangay = null;
    ddCity.reset(); ddBarangay.reset();
    activeDot('province', true);
    refreshSummary();

    const cities = PSGC.cities.filter(c => c.provinceCode === detail.code);
    const munis  = PSGC.munis.filter(m => m.provinceCode === detail.code);
    ddCity.populate([...cities, ...munis]);
});

document.getElementById('wrap-city').addEventListener('loc:change', ({ detail }) => {
    selected.city = detail;
    selected.barangay = null;
    ddBarangay.reset();
    activeDot('city', true);
    refreshSummary();

    const brgys = PSGC.barangays.filter(b =>
        b.cityCode === detail.code || b.municipalityCode === detail.code
    );
    ddBarangay.populate(brgys);
});

document.getElementById('wrap-barangay').addEventListener('loc:change', ({ detail }) => {
    selected.barangay = detail;
    activeDot('barangay', true);
    refreshSummary();
});

// ── Clear & Apply ──────────────────────────────────────────
document.getElementById('clear-filters').addEventListener('click', () => {
    ddRegion.reset(); ddProvince.reset(); ddCity.reset(); ddBarangay.reset();
    // Re-enable region after reset
    ddRegion.populate(PSGC.regions || []);
    Object.keys(selected).forEach(k => selected[k] = null);
    refreshSummary();
});

document.getElementById('apply-filters').addEventListener('click', () => {
    // 🔌 Plug your scholarship filter logic here
    console.log('Filtering by:', selected);
    closeSidebar();
});

// ── Init ───────────────────────────────────────────────────
window.addEventListener('load', () => {
    document.getElementById('app-main').classList.add('active');
    loadPSGC();
});