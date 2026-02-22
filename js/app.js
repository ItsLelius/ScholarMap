/* ═══════════════════════════════════════════════════════
   app.js — ScholarMap Dashboard
   Fully functional: search, filter, sort, save, modal,
   view switching, At-a-Glance stats, location filter
═══════════════════════════════════════════════════════ */
'use strict';

/* ── Saved state (persists in sessionStorage) ─────────── */
const SAVED_KEY = 'scholarmap_saved';
let savedIds = new Set(JSON.parse(sessionStorage.getItem(SAVED_KEY) || '[]'));

function persistSaved() {
    sessionStorage.setItem(SAVED_KEY, JSON.stringify([...savedIds]));
}

/* ── Active filters state ─────────────────────────────── */
const filters = {
    search:   '',
    type:     'all',
    level:    'all',
    sort:     'newest',
    location: { region: '', province: '', city: '', barangay: '' },
    view:     'browse',  // 'browse' | 'saved'
};

/* ── DOM shortcuts ────────────────────────────────────── */
const $  = id => document.getElementById(id);
const $$ = sel => [...document.querySelectorAll(sel)];

const globalSearch    = $('global-search');
const scholarGrid     = $('scholar-grid');
const emptyState      = $('empty-state');
const showingCount    = $('showing-count');
const totalCount      = $('total-count');
const viewTitle       = $('view-title');
const countTotal      = $('count-total');
const countOpen       = $('count-open');
const countUrgent     = $('count-urgent');
const countSaved      = $('count-saved');
const navCountBrowse  = $('nav-count-browse');
const navCountSaved   = $('nav-count-saved');
const vcMain          = $('vc-main');
const vcSub           = $('vc-sub');
const activeFiltersEl = $('active-filters');
const filterTrigger   = $('filter-trigger');
const filterSidebar   = $('filter-sidebar');
const sidebarOverlay  = $('sidebar-overlay');
const closeFilter     = $('close-filter');
const clearFilters    = $('clear-filters');
const applyFilters    = $('apply-filters');
const modalBackdrop   = $('modal-backdrop');
const modalClose      = $('modal-close');
const resetAllBtn     = $('reset-all-btn');
const navHamburger    = $('nav-hamburger');
const leftBar         = $('left-bar');
const sidebarDim      = $('sidebar-dim');

/* ═══════════════════════════════════════════════════════
   RENDER ENGINE
   Called whenever any filter/sort/view changes.
═══════════════════════════════════════════════════════ */
function render() {
    let pool = [...SCHOLARSHIPS];

    /* 1 — View: saved only */
    if (filters.view === 'saved') {
        pool = pool.filter(s => savedIds.has(s.id));
    }

    /* 2 — Location filter */
    const loc = filters.location;
    if (loc.region) {
        pool = pool.filter(s =>
            !s.region ||
            s.region.toLowerCase().includes(loc.region.toLowerCase())
        );
    }
    if (loc.province) {
        pool = pool.filter(s =>
            !s.province ||
            s.province.toLowerCase().includes(loc.province.toLowerCase())
        );
    }
    if (loc.city) {
        pool = pool.filter(s =>
            !s.city ||
            s.city.toLowerCase().includes(loc.city.toLowerCase())
        );
    }

    /* 3 — Search */
    if (filters.search.trim()) {
        const q = filters.search.toLowerCase();
        pool = pool.filter(s =>
            s.name.toLowerCase().includes(q) ||
            s.org.toLowerCase().includes(q) ||
            s.description.toLowerCase().includes(q) ||
            s.region.toLowerCase().includes(q) ||
            s.province.toLowerCase().includes(q) ||
            s.city.toLowerCase().includes(q) ||
            s.requirements.some(r => r.toLowerCase().includes(q))
        );
    }

    /* 4 — Type tag filter */
    if (filters.type !== 'all') {
        pool = pool.filter(s => s.type === filters.type);
    }

    /* 5 — Level tag filter */
    if (filters.level !== 'all') {
        pool = pool.filter(s => s.level === filters.level);
    }

    /* 6 — Sort */
    pool = sortPool(pool, filters.sort);

    /* 7 — Render cards */
    renderCards(pool);

    /* 8 — Update counters */
    showingCount.textContent = pool.length;
    totalCount.textContent   = SCHOLARSHIPS.length;

    /* 9 — Empty state */
    if (pool.length === 0) {
        emptyState.classList.remove('hidden');
        scholarGrid.style.display = 'none';
    } else {
        emptyState.classList.add('hidden');
        scholarGrid.style.display = '';
    }
}

function sortPool(pool, sort) {
    const today = new Date();
    return [...pool].sort((a, b) => {
        switch (sort) {
            case 'newest':
                return new Date(b.deadline) - new Date(a.deadline);
            case 'deadline': {
                const da = new Date(a.deadline) - today;
                const db = new Date(b.deadline) - today;
                if (da < 0 && db >= 0) return 1;
                if (db < 0 && da >= 0) return -1;
                return da - db;
            }
            case 'amount': {
                const parse = s => parseInt(s.amount.replace(/[^0-9]/g, '')) || 0;
                return parse(b) - parse(a);
            }
            case 'name':
                return a.name.localeCompare(b.name);
            default:
                return 0;
        }
    });
}

/* ═══════════════════════════════════════════════════════
   CARD RENDERER
═══════════════════════════════════════════════════════ */
function renderCards(list) {
    scholarGrid.innerHTML = '';
    list.forEach((s, i) => {
        const card = buildCard(s, i);
        scholarGrid.appendChild(card);
    });
}

function buildCard(s, index) {
    const { label: dlLabel, urgency } = formatDeadline(s.deadline);
    const loc = getLocationBreadcrumb(s);
    const isSaved = savedIds.has(s.id);

    const badgeClass = {
        'Government': 't-gov',
        'Foundation': 't-found',
        'Private':    't-priv',
        'LGU':        't-lgu',
    }[s.type] || '';

    const article = document.createElement('article');
    article.className = 's-card';
    article.dataset.id = s.id;
    article.style.animationDelay = `${Math.min(index * 0.04, 0.4)}s`;

    article.innerHTML = `
        <div class="s-card-img" style="background:${s.imgBg}">
            ${s.emoji}
            <span class="s-card-type-badge ${badgeClass}">${s.type}</span>
            <button class="s-card-save ${isSaved ? 'saved' : ''}" data-id="${s.id}" title="${isSaved ? 'Remove from saved' : 'Save'}">
                <svg width="14" height="14" fill="${isSaved ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
                    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
                </svg>
            </button>
        </div>
        <div class="s-card-body">
            <div class="s-card-loc">
                ${loc.map((p, i) => `
                    ${i > 0 ? '<span class="s-card-loc-sep">›</span>' : ''}
                    <span class="s-card-loc-item">${p}</span>
                `).join('')}
            </div>
            <h3 class="s-card-name">${s.name}</h3>
            <div class="s-card-tags">
                ${s.requirements.slice(0, 3).map(r => `<span class="s-card-tag">${r}</span>`).join('')}
                ${s.requirements.length > 3 ? `<span class="s-card-tag">+${s.requirements.length - 3} more</span>` : ''}
            </div>
            <div class="s-card-footer">
                <div class="s-card-deadline dl-${urgency}">
                    <svg width="11" height="11" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
                    </svg>
                    ${urgency === 'expired' ? 'Closed' : dlLabel}
                </div>
                <div class="s-card-amount">${s.amount}</div>
            </div>
            <button class="s-card-view-btn" data-id="${s.id}">View Details</button>
        </div>
    `;

    /* Save button */
    article.querySelector('.s-card-save').addEventListener('click', e => {
        e.stopPropagation();
        toggleSave(s.id);
    });

    /* View details */
    article.querySelector('.s-card-view-btn').addEventListener('click', () => {
        openModal(s);
    });

    return article;
}

/* ═══════════════════════════════════════════════════════
   SAVE / UNSAVE
═══════════════════════════════════════════════════════ */
function toggleSave(id) {
    if (savedIds.has(id)) {
        savedIds.delete(id);
    } else {
        savedIds.add(id);
    }
    persistSaved();
    updateGlanceStats();
    updateNavCounts();

    /* Re-render if in saved view */
    if (filters.view === 'saved') render();
    else refreshCardSaveButtons(id);
}

function refreshCardSaveButtons(id) {
    const isSaved = savedIds.has(id);
    $$(`[data-id="${id}"]`).forEach(el => {
        if (el.classList.contains('s-card-save')) {
            el.classList.toggle('saved', isSaved);
            const svg = el.querySelector('svg');
            svg.setAttribute('fill', isSaved ? 'currentColor' : 'none');
        }
    });
}

/* ═══════════════════════════════════════════════════════
   AT-A-GLANCE STATS
═══════════════════════════════════════════════════════ */
function updateGlanceStats() {
    const today = new Date();
    let open = 0, urgent = 0;

    SCHOLARSHIPS.forEach(s => {
        const dl   = new Date(s.deadline);
        const diff = Math.ceil((dl - today) / (1000 * 60 * 60 * 24));
        if (diff >= 0)  open++;
        if (diff >= 0 && diff <= 14) urgent++;
    });

    animateCount(countTotal,  SCHOLARSHIPS.length);
    animateCount(countOpen,   open);
    animateCount(countUrgent, urgent);
    animateCount(countSaved,  savedIds.size);
}

function updateNavCounts() {
    navCountBrowse.textContent = SCHOLARSHIPS.length;
    navCountSaved.textContent  = savedIds.size;
    navCountSaved.classList.toggle('hidden', savedIds.size === 0);
}

function animateCount(el, target) {
    if (!el) return;
    const start    = parseInt(el.textContent) || 0;
    const duration = 600;
    const startMs  = performance.now();
    function step(now) {
        const progress = Math.min((now - startMs) / duration, 1);
        const ease     = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(start + (target - start) * ease);
        if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
}

/* ═══════════════════════════════════════════════════════
   VIEW SWITCHING
═══════════════════════════════════════════════════════ */
function setView(view) {
    filters.view = view;
    $$('.snav-btn').forEach(b => b.classList.toggle('active', b.dataset.view === view));

    if (view === 'map') {
        openMapView();
        return;
    }

    closeMapView();

    const titles = { browse: 'Browse Scholarships', saved: 'Saved Scholarships' };
    viewTitle.textContent = titles[view] || 'Browse Scholarships';
    render();
}

/* ── Map view ─────────────────────────────────────────── */
function openMapView() {
    let overlay = $('map-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.id        = 'map-overlay';
        overlay.className = 'map-overlay';
        overlay.innerHTML = `
            <div class="map-top-bar">
                <button class="map-close-btn" id="map-close-btn">
                    <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" viewBox="0 0 24 24"><path d="M18 6 6 18M6 6l12 12"/></svg>
                    Back to Browse
                </button>
                <span class="map-top-label">Philippine Scholarship Map — <strong id="map-count">0</strong> locations active</span>
            </div>
            <iframe id="map-iframe" src="./map.html" title="Scholarship Map"></iframe>
        `;
        document.body.appendChild(overlay);
        $('map-close-btn').addEventListener('click', () => {
            setView('browse');
            $$('.snav-btn').forEach(b => b.classList.remove('active'));
            $('btn-browse').classList.add('active');
        });
    }
    overlay.classList.add('open');

    /* Send scholarship location data to the map iframe */
    const iframe = $('map-iframe');
    iframe.onload = () => {
        const locData = SCHOLARSHIPS.map(s => ({
            region:   s.region,
            province: s.province,
            city:     s.city,
            name:     s.name,
            id:       s.id,
        }));
        iframe.contentWindow.postMessage({ type: 'SCHOLAR_DATA', data: locData }, '*');
        $('map-count').textContent = new Set(locData.map(l => l.region || 'Nationwide').filter(Boolean)).size;
    };
}

function closeMapView() {
    const overlay = $('map-overlay');
    if (overlay) overlay.classList.remove('open');
}

/* ═══════════════════════════════════════════════════════
   MODAL
═══════════════════════════════════════════════════════ */
let currentModalId = null;

function openModal(s) {
    currentModalId = s.id;
    const { label: dlLabel, urgency } = formatDeadline(s.deadline);
    const loc     = getLocationBreadcrumb(s);
    const isSaved = savedIds.has(s.id);

    $('modal-hero').style.background = s.imgBg;
    $('modal-hero').textContent       = s.emoji;

    $('modal-loc').innerHTML = loc.map((p, i) =>
        `${i > 0 ? '<span class="modal-loc-sep">›</span>' : ''}<span>${p}</span>`
    ).join('');

    $('modal-org').textContent   = s.org;
    $('modal-title').textContent = s.name;
    $('modal-desc').textContent  = s.description;

    $('modal-req-list').innerHTML = s.requirements
        .map(r => `<li>${r}</li>`).join('');

    $('modal-meta-row').innerHTML = `
        <div class="modal-meta-item">
            <div class="modal-meta-lbl">Amount</div>
            <div class="modal-meta-val">${s.amount}</div>
        </div>
        <div class="modal-meta-item">
            <div class="modal-meta-lbl">Slots</div>
            <div class="modal-meta-val">${s.slots}</div>
        </div>
        <div class="modal-meta-item">
            <div class="modal-meta-lbl">Deadline</div>
            <div class="modal-meta-val dl-${urgency}" style="font-size:0.78rem">${dlLabel}</div>
        </div>
        <div class="modal-meta-item">
            <div class="modal-meta-lbl">Level</div>
            <div class="modal-meta-val">${s.level}</div>
        </div>
    `;

    $('modal-apply-btn').href = s.applyUrl;
    updateModalSaveState(isSaved);

    modalBackdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    modalBackdrop.classList.remove('open');
    document.body.style.overflow = '';
    currentModalId = null;
}

function updateModalSaveState(isSaved) {
    const btnTop  = $('modal-save-btn');
    const btnFull = $('modal-save-btn-full');

    btnTop.classList.toggle('saved', isSaved);
    btnFull.classList.toggle('saved', isSaved);

    $('modal-save-label').textContent      = isSaved ? 'Saved' : 'Save';
    $('modal-save-full-label').textContent = isSaved ? 'Remove from Saved' : 'Add to Saved';
}

function modalToggleSave() {
    if (!currentModalId) return;
    toggleSave(currentModalId);
    updateModalSaveState(savedIds.has(currentModalId));
}

$('modal-save-btn').addEventListener('click',      modalToggleSave);
$('modal-save-btn-full').addEventListener('click', modalToggleSave);
modalClose.addEventListener('click', closeModal);
modalBackdrop.addEventListener('click', e => { if (e.target === modalBackdrop) closeModal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') { closeModal(); closeSidebar(); } });

/* ═══════════════════════════════════════════════════════
   SEARCH
═══════════════════════════════════════════════════════ */
let searchTimer;
globalSearch.addEventListener('input', () => {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => {
        filters.search = globalSearch.value;
        render();
    }, 220);
});

/* Keyboard shortcut ⌘K / Ctrl+K */
document.addEventListener('keydown', e => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        globalSearch.focus();
        globalSearch.select();
    }
});

/* ═══════════════════════════════════════════════════════
   SORT
═══════════════════════════════════════════════════════ */
$$('.sort-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        $$('.sort-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        filters.sort = btn.dataset.sort;
        render();
    });
});

/* ═══════════════════════════════════════════════════════
   TYPE + LEVEL TAG FILTERS
═══════════════════════════════════════════════════════ */
$$('.tag-btn[data-tag]').forEach(btn => {
    btn.addEventListener('click', () => {
        $$('.tag-btn[data-tag]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        filters.type = btn.dataset.tag;
        render();
    });
});
$$('.tag-btn[data-level]').forEach(btn => {
    btn.addEventListener('click', () => {
        $$('.tag-btn[data-level]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        filters.level = btn.dataset.level;
        render();
    });
});

/* ═══════════════════════════════════════════════════════
   NAV BUTTONS (Browse All / Map / Saved)
═══════════════════════════════════════════════════════ */
$$('.snav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        setView(btn.dataset.view);
        /* Close mobile sidebar after navigation */
        if (window.innerWidth <= 900) closeMobileSidebar();
    });
});

/* ═══════════════════════════════════════════════════════
   LOCATION FILTER SIDEBAR
═══════════════════════════════════════════════════════ */
function openSidebar() {
    filterSidebar.classList.add('open');
    sidebarOverlay.classList.remove('hidden');
    requestAnimationFrame(() => sidebarOverlay.classList.add('visible'));
    filterTrigger.classList.add('active');
}

function closeSidebar() {
    filterSidebar.classList.remove('open');
    sidebarOverlay.classList.remove('visible');
    sidebarOverlay.addEventListener('transitionend', () => {
        sidebarOverlay.classList.add('hidden');
    }, { once: true });
    filterTrigger.classList.remove('active');
}

filterTrigger.addEventListener('click', openSidebar);
closeFilter.addEventListener('click',  closeSidebar);
sidebarOverlay.addEventListener('click', closeSidebar);

applyFilters.addEventListener('click', () => {
    /* Read from locationFilter.js global `selected` */
    const sel = window.selected || {};
    filters.location = {
        region:   sel.region?.name   || '',
        province: sel.province?.name || '',
        city:     sel.city?.name     || '',
        barangay: sel.barangay?.name || '',
    };

    /* Update view context chip */
    const parts = [filters.location.region, filters.location.province, filters.location.city, filters.location.barangay].filter(Boolean);
    if (parts.length) {
        vcMain.textContent = parts[parts.length - 1];
        vcSub.textContent  = parts.join(' › ');
    } else {
        vcMain.textContent = 'Nationwide';
        vcSub.textContent  = 'All 81 provinces';
    }

    /* Active filter pills */
    renderActivePills(parts);

    /* Dot indicators */
    ['region','province','city','barangay'].forEach(k => {
        const dot = $(`dot-${k}`);
        if (dot) dot.classList.toggle('active', !!filters.location[k]);
    });

    closeSidebar();
    render();
});

clearFilters.addEventListener('click', () => {
    filters.location = { region:'', province:'', city:'', barangay:'' };
    vcMain.textContent = 'Nationwide';
    vcSub.textContent  = 'All 81 provinces';
    renderActivePills([]);

    ['region','province','city','barangay'].forEach(k => {
        const dot = $(`dot-${k}`);
        if (dot) dot.classList.remove('active');
    });
});

function renderActivePills(parts) {
    if (parts.length === 0) {
        activeFiltersEl.innerHTML = '';
        activeFiltersEl.classList.add('hidden');
        return;
    }
    activeFiltersEl.classList.remove('hidden');
    activeFiltersEl.innerHTML = parts.map(p => `<span class="af-pill">${p}</span>`).join('');
}

/* ═══════════════════════════════════════════════════════
   RESET ALL
═══════════════════════════════════════════════════════ */
resetAllBtn?.addEventListener('click', () => {
    globalSearch.value   = '';
    filters.search       = '';
    filters.type         = 'all';
    filters.level        = 'all';
    filters.location     = { region:'', province:'', city:'', barangay:'' };
    $$('.sort-btn').forEach(b   => b.classList.toggle('active', b.dataset.sort === 'newest'));
    $$('.tag-btn[data-tag]').forEach(b => b.classList.toggle('active', b.dataset.tag === 'all'));
    $$('.tag-btn[data-level]').forEach(b => b.classList.toggle('active', b.dataset.level === 'all'));
    vcMain.textContent = 'Nationwide';
    vcSub.textContent  = 'All 81 provinces';
    renderActivePills([]);
    render();
});

/* ═══════════════════════════════════════════════════════
   MOBILE SIDEBAR (hamburger)
═══════════════════════════════════════════════════════ */
function openMobileSidebar() {
    leftBar.classList.add('mobile-open');
    sidebarDim.classList.add('active');
}
function closeMobileSidebar() {
    leftBar.classList.remove('mobile-open');
    sidebarDim.classList.remove('active');
}
navHamburger?.addEventListener('click', () => {
    if (leftBar.classList.contains('mobile-open')) closeMobileSidebar();
    else openMobileSidebar();
});
sidebarDim?.addEventListener('click', closeMobileSidebar);

/* ═══════════════════════════════════════════════════════
   INIT
═══════════════════════════════════════════════════════ */
function init() {
    updateGlanceStats();
    updateNavCounts();
    render();
    /* Stagger sidebar entrance */
    requestAnimationFrame(() => {
        document.getElementById('app-body')?.classList.add('ready');
    });
}

init();