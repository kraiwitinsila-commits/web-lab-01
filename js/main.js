/**
 * THE NOCTURNE - Main JavaScript
 * Handles navigation, menu filtering, gallery lightbox, day/night ambience toggle, and reservation logic
 */

document.addEventListener('DOMContentLoaded', () => {
    initHeaderScroll();
    initMobileMenu();
    initMenuFilter();
    initDayNightToggle();
    initReservationForm();
    initDatePickerMin();
});

// 1. Header scroll blur effect
function initHeaderScroll() {
    const header = document.getElementById('main-header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 40) {
            header.classList.add('shadow-xl', 'bg-noir-950/95', 'py-1');
        } else {
            header.classList.remove('shadow-xl', 'bg-noir-950/95', 'py-1');
        }
    });
}

// 2. Mobile Menu Toggle
function initMobileMenu() {
    const mobileBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-nav-link');

    if (!mobileBtn || !mobileMenu) return;

    mobileBtn.addEventListener('click', () => {
        const isHidden = mobileMenu.classList.contains('hidden');
        if (isHidden) {
            mobileMenu.classList.remove('hidden');
            mobileBtn.innerHTML = '<i class="fa-solid fa-xmark text-2xl"></i>';
        } else {
            mobileMenu.classList.add('hidden');
            mobileBtn.innerHTML = '<i class="fa-solid fa-bars-staggered text-2xl"></i>';
        }
    });

    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.add('hidden');
            mobileBtn.innerHTML = '<i class="fa-solid fa-bars-staggered text-2xl"></i>';
        });
    });
}

// 3. Menu Filtering (All, Specialty Coffee, Cocktails, Mocktails, Tapas)
function initMenuFilter() {
    const filterBtns = document.querySelectorAll('.menu-tab-btn');
    const menuItems = document.querySelectorAll('.menu-item-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active state
            filterBtns.forEach(b => {
                b.classList.remove('active', 'bg-timber-600', 'border-timber-500', 'text-white', 'shadow-md');
                b.classList.add('bg-noir-900/60', 'border-white/10', 'text-gray-300');
            });
            btn.classList.add('active', 'bg-timber-600', 'border-timber-500', 'text-white', 'shadow-md');
            btn.classList.remove('bg-noir-900/60', 'border-white/10', 'text-gray-300');

            const category = btn.getAttribute('data-category');

            menuItems.forEach(item => {
                const itemCat = item.getAttribute('data-category');
                if (category === 'all' || itemCat === category) {
                    item.style.display = 'block';
                    item.classList.add('animate-fade-in');
                } else {
                    item.style.display = 'none';
                    item.classList.remove('animate-fade-in');
                }
            });
        });
    });
}

// 4. Day & Night Ambience Toggle
function initDayNightToggle() {
    const toggleBtn = document.getElementById('theme-ambience-toggle');
    const themeIcon = document.getElementById('theme-icon');
    const themeText = document.getElementById('theme-text');

    if (!toggleBtn) return;

    let isNight = true;

    toggleBtn.addEventListener('click', () => {
        isNight = !isNight;

        if (!isNight) {
            // Day Cafe Mode
            themeIcon.className = 'fa-solid fa-sun text-amber-300';
            themeText.textContent = 'Day Cafe';
            toggleBtn.classList.add('border-amber-400/50', 'bg-amber-950/20');
            showToast('☕ สลับสู่โหมดบรรยากาศกลางวัน (Day Specialty Cafe)');
        } else {
            // Night Bar Mode
            themeIcon.className = 'fa-solid fa-moon text-amberGlow-400';
            themeText.textContent = 'Night Bar';
            toggleBtn.classList.remove('border-amber-400/50', 'bg-amber-950/20');
            showToast('🍸 สลับสู่โหมดบรรยากาศค่ำคืน (Night Botanical Bar)');
        }
    });
}

// 5. Lightbox Modal for Atmosphere Gallery
function openLightbox(imgSrc, caption) {
    const modal = document.getElementById('lightbox-modal');
    const img = document.getElementById('lightbox-img');
    const cap = document.getElementById('lightbox-caption');

    if (!modal || !img) return;

    img.src = imgSrc;
    cap.textContent = caption;
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    const modal = document.getElementById('lightbox-modal');
    if (!modal) return;
    modal.classList.add('hidden');
    modal.classList.remove('flex');
    document.body.style.overflow = 'auto';
}

// Close lightbox on clicking backdrop
window.addEventListener('click', (e) => {
    const modal = document.getElementById('lightbox-modal');
    if (modal && e.target === modal) {
        closeLightbox();
    }
});

// 6. Reservation Form Handler & Modal
function initReservationForm() {
    const form = document.getElementById('booking-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('guest-name').value;
        const phone = document.getElementById('guest-phone').value;
        const date = document.getElementById('booking-date').value;
        const time = document.getElementById('booking-time').value;
        const guests = document.getElementById('guest-count').value;
        const zone = document.getElementById('seating-zone').value;
        const special = document.getElementById('special-request').value || 'ไม่มี';

        // Prepare Summary HTML
        const summaryBox = document.getElementById('booking-summary-box');
        summaryBox.innerHTML = `
            <div><span class="text-gray-400">ชื่อผู้จอง:</span> <strong class="text-white">${escapeHtml(name)}</strong></div>
            <div><span class="text-gray-400">เบอร์โทร:</span> <strong class="text-white">${escapeHtml(phone)}</strong></div>
            <div><span class="text-gray-400">วันที่:</span> <strong class="text-timber-300">${escapeHtml(date)}</strong></div>
            <div><span class="text-gray-400">เวลา:</span> <strong class="text-timber-300">${escapeHtml(time)} น.</strong></div>
            <div><span class="text-gray-400">จำนวนแขก:</span> <strong class="text-white">${escapeHtml(guests)} ท่าน</strong></div>
            <div><span class="text-gray-400">โซนที่นั่ง:</span> <strong class="text-white">${escapeHtml(zone)}</strong></div>
            ${special !== 'ไม่มี' ? `<div><span class="text-gray-400">คำขอพิเศษ:</span> <span class="text-gray-300">${escapeHtml(special)}</span></div>` : ''}
        `;

        // Create prefilled LINE link
        const lineMessage = encodeURIComponent(
            `สวัสดีครับ/ค่ะ ต้องการยืนยันการจองโต๊ะร้าน NOCTURNE\n` +
            `• ชื่อผู้จอง: ${name}\n` +
            `• เบอร์โทร: ${phone}\n` +
            `• วันที่: ${date}\n` +
            `• เวลา: ${time} น.\n` +
            `• จำนวน: ${guests} ท่าน\n` +
            `• โซน: ${zone}\n` +
            `• หมายเหตุ: ${special}`
        );

        const lineBtn = document.getElementById('line-notify-btn');
        lineBtn.href = `https://line.me/R/msg/text/?${lineMessage}`;

        // Show Modal
        const modal = document.getElementById('booking-modal');
        modal.classList.remove('hidden');
        modal.classList.add('flex');
        document.body.style.overflow = 'hidden';

        form.reset();
    });
}

function closeBookingModal() {
    const modal = document.getElementById('booking-modal');
    if (!modal) return;
    modal.classList.add('hidden');
    modal.classList.remove('flex');
    document.body.style.overflow = 'auto';
}

// 7. Date picker default minimum to today
function initDatePickerMin() {
    const dateInput = document.getElementById('booking-date');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.min = today;
        dateInput.value = today;
    }
}

// Helper: Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.innerText = text;
    return div.innerHTML;
}

// Simple Toast Notification
function showToast(msg) {
    const existing = document.getElementById('custom-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.id = 'custom-toast';
    toast.className = 'fixed top-24 right-6 z-50 px-5 py-3 rounded-sm bg-noir-900 border border-timber-500/50 text-white text-xs shadow-2xl backdrop-blur-md animate-fade-in flex items-center gap-3';
    toast.innerHTML = `<span>${msg}</span>`;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.5s ease';
        setTimeout(() => toast.remove(), 500);
    }, 2800);
}
