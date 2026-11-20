/**
 * Amazing Smile Dental Care - Master Interactive Engine
 * Principles: Apple Fluid Motion (WWDC) + Conversion Optimization
 * Author: Craftvale
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initBeforeAfterSlider();
  initTestimonialsMarquee();
  initCalScheduler();
  initScrollReveals();
  initCounters();
  initFaqAccordions();
  initWhatsAppBookingForms();
  initGalleryLightbox();
  initImageGuard();
  initDynamicSettings();
});

/* --- 1. Navbar Glass & Mobile Drawer --- */
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  const toggle = document.querySelector('.nav-toggle');
  const menu = document.querySelector('.nav-menu');

  if (navbar) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 25) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }, { passive: true });
  }

  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      const isOpen = menu.classList.toggle('open');
      toggle.setAttribute('aria-expanded', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    menu.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        menu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }
}

/* --- 2. Interactive Before / After Smile Slider (Direct Pointer Manipulation & Width Sync) --- */
function initBeforeAfterSlider() {
  const sliders = document.querySelectorAll('.comparison-slider');
  if (!sliders.length) return;

  function syncImageWidth() {
    sliders.forEach(slider => {
      const sliderWidth = slider.offsetWidth;
      const beforeImg = slider.querySelector('.comparison-before img');
      if (beforeImg && sliderWidth > 0) {
        beforeImg.style.width = sliderWidth + 'px';
      }
    });
  }

  window.addEventListener('resize', syncImageWidth);
  syncImageWidth();
  setTimeout(syncImageWidth, 200);

  sliders.forEach(slider => {
    const beforeWrap = slider.querySelector('.comparison-before');
    const handle = slider.querySelector('.comparison-handle');
    if (!beforeWrap || !handle) return;

    let isDragging = false;

    function setSliderPosition(x) {
      const rect = slider.getBoundingClientRect();
      let percent = ((x - rect.left) / rect.width) * 100;
      percent = Math.max(0, Math.min(100, percent));

      beforeWrap.style.width = `${percent}%`;
      handle.style.left = `${percent}%`;
    }

    slider.addEventListener('pointerdown', (e) => {
      isDragging = true;
      slider.setPointerCapture(e.pointerId);
      setSliderPosition(e.clientX);
    });

    slider.addEventListener('pointermove', (e) => {
      if (!isDragging) return;
      setSliderPosition(e.clientX);
    });

    slider.addEventListener('pointerup', (e) => {
      isDragging = false;
      try { slider.releasePointerCapture(e.pointerId); } catch (_) {}
    });

    slider.addEventListener('pointercancel', (e) => {
      isDragging = false;
    });

    // Keyboard accessibility
    slider.setAttribute('tabindex', '0');
    slider.setAttribute('role', 'slider');
    slider.setAttribute('aria-label', 'Before and after smile comparison slider');
    slider.addEventListener('keydown', (e) => {
      const currentWidth = parseFloat(beforeWrap.style.width) || 50;
      if (e.key === 'ArrowLeft') {
        const next = Math.max(0, currentWidth - 5);
        beforeWrap.style.width = `${next}%`;
        handle.style.left = `${next}%`;
        e.preventDefault();
      } else if (e.key === 'ArrowRight') {
        const next = Math.min(100, currentWidth + 5);
        beforeWrap.style.width = `${next}%`;
        handle.style.left = `${next}%`;
        e.preventDefault();
      }
    });
  });
}

/* --- 2B. Testimonials Infinite Rotating Ticker (Pause on Hover / Touch) --- */
function initTestimonialsMarquee() {
  const track = document.querySelector('.testimonials-track');
  if (!track) return;

  track.addEventListener('pointerenter', () => {
    track.style.animationPlayState = 'paused';
  });
  track.addEventListener('pointerleave', () => {
    track.style.animationPlayState = 'running';
  });
  track.addEventListener('touchstart', () => {
    track.style.animationPlayState = 'paused';
  }, { passive: true });
  track.addEventListener('touchend', () => {
    track.style.animationPlayState = 'running';
  }, { passive: true });
}

/* --- 2C. Fast Callback Hero Booking Engine (Direct from Website_3) --- */
function lumoraLead(e) {
  e.preventDefault();
  const f = e.target;
  const name = (f.querySelector('input[name="name"]').value || '').trim();
  const phone = (f.querySelector('input[name="phone"]').value || '').trim();
  if (!name || !phone) return false;

  const msg = encodeURIComponent(`Hi Dr. Manish Gangwani, I am ${name}. Please call me back at ${phone} for an appointment consultation at Amazing Smile Dental Care.`);
  try {
    window.open(`https://wa.me/919975999529?text=${msg}`, '_blank');
  } catch (_) {}

  const card = f.closest('.lead-form_card');
  if (card) {
    f.style.display = 'none';
    const head = card.querySelector('.lead-form_head');
    if (head) head.style.display = 'none';
    const ok = card.querySelector('.lead-form_success');
    if (ok) ok.style.display = 'block';
  }
  return false;
}
window.lumoraLead = lumoraLead;

/* --- 3. Scroll Reveal Engine (IntersectionObserver) --- */
function initScrollReveals() {
  const reveals = document.querySelectorAll('.reveal');
  if (!reveals.length) return;

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          obs.unobserve(entry.target);
        }
      });
    }, {
      rootMargin: '0px 0px -40px 0px',
      threshold: 0.1
    });

    reveals.forEach(el => observer.observe(el));
  } else {
    reveals.forEach(el => el.classList.add('active'));
  }
}

/* --- 4. Animated Statistics Counters --- */
function initCounters() {
  const counters = document.querySelectorAll('.stat-number');
  if (!counters.length) return;

  if ('IntersectionObserver' in window) {
    const counterObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.getAttribute('data-target'), 10);
          const suffix = el.getAttribute('data-suffix') || '';
          animateCounter(el, target, suffix);
          obs.unobserve(el);
        }
      });
    }, { threshold: 0.2 });

    counters.forEach(c => counterObserver.observe(c));
  } else {
    counters.forEach(c => {
      const target = c.getAttribute('data-target');
      const suffix = c.getAttribute('data-suffix') || '';
      c.textContent = `${target}${suffix}`;
    });
  }

  function animateCounter(el, target, suffix) {
    let current = 0;
    const duration = 1500;
    const stepTime = 20;
    const totalSteps = duration / stepTime;
    const increment = target / totalSteps;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        el.textContent = `${target.toLocaleString()}${suffix}`;
        clearInterval(timer);
      } else {
        el.textContent = `${Math.floor(current).toLocaleString()}${suffix}`;
      }
    }, stepTime);
  }
}

/* --- 5. Interactive FAQ Accordions --- */
function initFaqAccordions() {
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    if (!questionBtn) return;

    questionBtn.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      faqItems.forEach(other => {
        if (other !== item) other.classList.remove('active');
      });
      item.classList.toggle('active', !isActive);
    });
  });
}

/* --- 6. Direct WhatsApp Booking Engine --- */
function initWhatsAppBookingForms() {
  const forms = document.querySelectorAll('form[data-whatsapp-form], #booking-form, #appointment-form');

  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = form.querySelector('[name="name"], #patient-name');
      const phoneInput = form.querySelector('[name="phone"], #patient-phone');
      const emailInput = form.querySelector('[name="email"], #patient-email');
      const serviceInput = form.querySelector('[name="service"], #treatment-service');
      const dateInput = form.querySelector('[name="date"], #preferred-date');
      const timeInput = form.querySelector('[name="time"], #preferred-time');
      const notesInput = form.querySelector('[name="notes"], #patient-notes');

      const name = nameInput ? nameInput.value.trim() : 'Patient';
      const phone = phoneInput ? phoneInput.value.trim() : 'Not provided';
      const email = emailInput && emailInput.value.trim() ? emailInput.value.trim() : 'Not provided';
      const service = serviceInput ? serviceInput.value.trim() : 'General Consultation';
      const date = dateInput && dateInput.value.trim() ? dateInput.value.trim() : 'Earliest Available';
      const time = timeInput ? timeInput.value.trim() : 'Flexible';
      const notes = notesInput && notesInput.value.trim() ? notesInput.value.trim() : 'None';

      const doctorNumber = '919975999529'; // Dr. Manish Gangwani clinic contact
      const text = `*New Appointment Request — Amazing Smile Dental Care*%0A%0A` +
                   `*Patient Name:* ${encodeURIComponent(name)}%0A` +
                   `*Contact Phone:* ${encodeURIComponent(phone)}%0A` +
                   `*Email:* ${encodeURIComponent(email)}%0A` +
                   `*Required Treatment:* ${encodeURIComponent(service)}%0A` +
                   `*Preferred Date:* ${encodeURIComponent(date)}%0A` +
                   `*Preferred Slot:* ${encodeURIComponent(time)}%0A` +
                   `*Notes/Symptoms:* ${encodeURIComponent(notes)}%0A%0A` +
                   `Please confirm availability. Thank you!`;

      // Dual-dispatch: Persist to backend database without delaying user action
      try {
        fetch('/api/appointments', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name,
            phone,
            email: email === 'Not provided' ? '' : email,
            service,
            date,
            time,
            notes,
            source: 'booking_form'
          })
        }).catch(() => {});
      } catch (_) {}

      // Visual feedback and anti-duplicate submit
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn ? submitBtn.innerHTML : '';
      if (submitBtn) {
        submitBtn.innerHTML = 'Connecting to WhatsApp...';
        submitBtn.disabled = true;
        submitBtn.style.opacity = '0.85';
      }

      setTimeout(() => {
        window.open(`https://wa.me/${doctorNumber}?text=${text}`, '_blank');
        if (submitBtn) {
          submitBtn.innerHTML = '✓ Appointment Request Sent!';
          submitBtn.style.background = 'linear-gradient(135deg, #16C784 0%, #0E9B64 100%)';
          setTimeout(() => {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            submitBtn.style.opacity = '1';
            submitBtn.style.background = '';
          }, 3500);
        }
      }, 300);
    });
  });
}

/* --- 7. Modern Click-to-Expand Gallery Lightbox --- */
function initGalleryLightbox() {
  const galleryItems = document.querySelectorAll('.gallery-item');
  if (!galleryItems.length) return;

  // Create lightbox modal DOM element if not already present
  let lightbox = document.querySelector('.lightbox-modal');
  if (!lightbox) {
    lightbox = document.createElement('div');
    lightbox.className = 'lightbox-modal';
    lightbox.innerHTML = `
      <button class="lightbox-close" aria-label="Close Lightbox">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
      </button>
      <div class="lightbox-content">
        <img src="" alt="" class="lightbox-img">
        <div class="lightbox-caption"></div>
      </div>
    `;
    document.body.appendChild(lightbox);
  }

  const lightboxImg = lightbox.querySelector('.lightbox-img');
  const lightboxCaption = lightbox.querySelector('.lightbox-caption');
  const closeBtn = lightbox.querySelector('.lightbox-close');

  function openLightbox(src, caption) {
    lightboxImg.src = src;
    lightboxImg.alt = caption;
    lightboxCaption.textContent = caption;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      const overlay = item.querySelector('.gallery-overlay');
      const caption = overlay ? overlay.textContent.trim() : (img ? img.alt : 'Clinic Facility');
      if (img) openLightbox(img.src, caption);
    });
  });

  closeBtn.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) {
      closeLightbox();
    }
  });
}

/* --- 8. Resilient Image Guard --- */
function initImageGuard() {
  const images = document.querySelectorAll('img');
  const fallbackSvg = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%23079ED8"/><stop offset="100%" stop-color="%23087BC1"/></linearGradient></defs><rect width="600" height="400" fill="url(%23g)"/><text x="50%" y="46%" font-family="system-ui,sans-serif" font-weight="bold" font-size="24" fill="%23FFFFFF" text-anchor="middle">Amazing Smile Dental Care</text><text x="50%" y="56%" font-family="system-ui,sans-serif" font-size="16" fill="%23E0F2FE" text-anchor="middle">Ulhasnagar Clinic Facility</text></svg>`;

  images.forEach(img => {
    img.addEventListener('error', () => {
      img.src = fallbackSvg;
      img.alt = 'Amazing Smile Dental Care Clinic Facility';
    });
  });
}

/* --- 9. Cal.com Interactive 3-Column Scheduler Controller --- */
function initCalScheduler() {
  const cards = document.querySelectorAll('.cal-scheduler-card');
  if (!cards.length) return;

  cards.forEach(card => {
    const monthLabel = card.querySelector('#cal-month-label');
    const prevBtn = card.querySelector('#cal-prev-month');
    const nextBtn = card.querySelector('#cal-next-month');
    const daysGrid = card.querySelector('#cal-days-grid');
    const selectedDayLabel = card.querySelector('#cal-selected-day-label');
    const slotsContainer = card.querySelector('#cal-slots-container');
    const toggleBtns = card.querySelectorAll('.cal-toggle-btn');
    const bookingFormWrap = card.querySelector('#cal-booking-form-wrap');
    const confirmedSlotText = card.querySelector('#cal-confirmed-slot-text');
    const changeSlotBtn = card.querySelector('#cal-change-slot');
    const directForm = card.querySelector('#cal-direct-form');
    const hiddenDateInput = card.querySelector('#cal-hidden-date');
    const hiddenTimeInput = card.querySelector('#cal-hidden-time');

    if (!daysGrid || !slotsContainer) return;

    // Date state
    const today = new Date();
    let displayYear = today.getFullYear();
    let displayMonth = today.getMonth();
    let selectedDate = new Date(today);

    // If after 9pm, advance default selected day to tomorrow
    if (today.getHours() >= 21) {
      selectedDate.setDate(selectedDate.getDate() + 1);
      displayYear = selectedDate.getFullYear();
      displayMonth = selectedDate.getMonth();
    }

    let timeFormat = '12'; // '12' or '24'
    let selectedSlot = '11:00am';

    // Standard clinic slots for Amazing Smile Dental Care
    const rawSlots = [
      { h: 10, m: 0 },
      { h: 10, m: 30 },
      { h: 11, m: 0 },
      { h: 11, m: 30 },
      { h: 12, m: 0 },
      { h: 12, m: 30 },
      { h: 13, m: 0 },
      { h: 13, m: 30 },
      { h: 17, m: 0 },
      { h: 17, m: 30 },
      { h: 18, m: 0 },
      { h: 18, m: 30 },
      { h: 19, m: 0 },
      { h: 19, m: 30 },
      { h: 20, m: 0 },
      { h: 20, m: 30 },
      { h: 21, m: 0 }
    ];

    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const weekdayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const fullWeekdayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    function getOrdinal(n) {
      if (n > 3 && n < 21) return 'th';
      switch (n % 10) {
        case 1: return 'st';
        case 2: return 'nd';
        case 3: return 'rd';
        default: return 'th';
      }
    }

    function formatSlotString(slotObj, format) {
      const h = slotObj.h;
      const m = slotObj.m === 0 ? '00' : slotObj.m;
      if (format === '24') {
        const hh = h < 10 ? '0' + h : h;
        return `${hh}:${m}`;
      } else {
        const period = h >= 12 ? 'pm' : 'am';
        const displayH = h % 12 === 0 ? 12 : h % 12;
        return `${displayH}:${m}${period}`;
      }
    }

    function updateDayHeader() {
      if (!selectedDayLabel) return;
      const dayName = weekdayNames[selectedDate.getDay()];
      const dayNum = selectedDate.getDate();
      selectedDayLabel.textContent = `${dayName} ${dayNum}${getOrdinal(dayNum)}`;
    }

    function renderCalendar() {
      if (!monthLabel || !daysGrid) return;
      monthLabel.textContent = `${monthNames[displayMonth]} ${displayYear}`;
      daysGrid.innerHTML = '';

      const firstDayIndex = new Date(displayYear, displayMonth, 1).getDay();
      const daysInMonth = new Date(displayYear, displayMonth + 1, 0).getDate();
      const prevMonthDays = new Date(displayYear, displayMonth, 0).getDate();

      // Leading days from previous month
      for (let i = firstDayIndex - 1; i >= 0; i--) {
        const prevDay = prevMonthDays - i;
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'cal-day-cell cal-day-muted';
        btn.textContent = prevDay;
        btn.disabled = true;
        daysGrid.appendChild(btn);
      }

      // Current month days
      for (let day = 1; day <= daysInMonth; day++) {
        const thisDate = new Date(displayYear, displayMonth, day);
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'cal-day-cell';
        btn.textContent = day;

        // Check if today
        const isToday = thisDate.getFullYear() === today.getFullYear() &&
                        thisDate.getMonth() === today.getMonth() &&
                        thisDate.getDate() === today.getDate();
        if (isToday) btn.classList.add('cal-day-today');

        // Check if selected
        const isSelected = thisDate.getFullYear() === selectedDate.getFullYear() &&
                           thisDate.getMonth() === selectedDate.getMonth() &&
                           thisDate.getDate() === selectedDate.getDate();
        if (isSelected) btn.classList.add('cal-day-selected');

        // Check if in the past
        const isPast = new Date(displayYear, displayMonth, day, 23, 59, 59) < today;
        if (isPast) {
          btn.classList.add('cal-day-disabled');
          btn.disabled = true;
        } else {
          btn.addEventListener('click', () => {
            selectedDate = new Date(displayYear, displayMonth, day);
            updateDayHeader();
            renderCalendar();
            renderSlots();
            if (bookingFormWrap) bookingFormWrap.style.display = 'none';
            if (slotsContainer) slotsContainer.style.display = 'flex';
          });
        }

        daysGrid.appendChild(btn);
      }

      // Trailing days for next month to complete the grid
      const totalCells = daysGrid.children.length;
      const remainingCells = (7 - (totalCells % 7)) % 7;
      for (let j = 1; j <= remainingCells; j++) {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'cal-day-cell cal-day-muted';
        btn.textContent = j;
        btn.disabled = true;
        daysGrid.appendChild(btn);
      }
    }

    function renderSlots() {
      if (!slotsContainer) return;
      slotsContainer.innerHTML = '';

      rawSlots.forEach((slotObj) => {
        const formatted = formatSlotString(slotObj, timeFormat);
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'cal-slot-btn';
        btn.textContent = formatted;

        if (selectedSlot && (formatted === selectedSlot || formatSlotString(slotObj, '12') === selectedSlot || formatSlotString(slotObj, '24') === selectedSlot)) {
          btn.classList.add('active');
        }

        btn.addEventListener('click', () => {
          selectedSlot = formatted;
          slotsContainer.querySelectorAll('.cal-slot-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');

          // Open inline booking form
          if (bookingFormWrap) {
            bookingFormWrap.style.display = 'block';
            slotsContainer.style.display = 'none';

            const dayName = weekdayNames[selectedDate.getDay()];
            const dayNum = selectedDate.getDate();
            const monthStr = monthNames[selectedDate.getMonth()].slice(0, 3);
            if (confirmedSlotText) {
              confirmedSlotText.textContent = `${dayName} ${dayNum} ${monthStr} · ${formatted}`;
            }

            if (hiddenDateInput) {
              hiddenDateInput.value = `${fullWeekdayNames[selectedDate.getDay()]}, ${dayNum} ${monthNames[selectedDate.getMonth()]} ${selectedDate.getFullYear()}`;
            }
            if (hiddenTimeInput) {
              hiddenTimeInput.value = formatted;
            }

            const firstInput = bookingFormWrap.querySelector('input:not([type="hidden"])');
            if (firstInput) firstInput.focus();
          }
        });

        slotsContainer.appendChild(btn);
      });
    }

    // Month Navigation Listeners
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        displayMonth--;
        if (displayMonth < 0) {
          displayMonth = 11;
          displayYear--;
        }
        renderCalendar();
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        displayMonth++;
        if (displayMonth > 11) {
          displayMonth = 0;
          displayYear++;
        }
        renderCalendar();
      });
    }

    // 12h / 24h Toggle Listeners
    toggleBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        toggleBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        timeFormat = btn.dataset.timeFormat || '12';
        renderSlots();
      });
    });

    // Change Slot Listener
    if (changeSlotBtn) {
      changeSlotBtn.addEventListener('click', () => {
        if (bookingFormWrap) bookingFormWrap.style.display = 'none';
        if (slotsContainer) slotsContainer.style.display = 'flex';
      });
    }

    // Direct WhatsApp Submit from Cal Scheduler
    if (directForm) {
      directForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = (directForm.querySelector('[name="name"]') || {}).value || 'Patient';
        const phone = (directForm.querySelector('[name="phone"]') || {}).value || 'Not provided';
        const service = (directForm.querySelector('[name="service"]') || {}).value || 'General Consultation';
        const notes = (directForm.querySelector('[name="notes"]') || {}).value || 'None';
        const dateStr = hiddenDateInput ? hiddenDateInput.value : `${weekdayNames[selectedDate.getDay()]} ${selectedDate.getDate()} ${monthNames[selectedDate.getMonth()]}`;
        const timeStr = hiddenTimeInput ? hiddenTimeInput.value : selectedSlot;

        const doctorNumber = '919975999529';
        const text = `*New Confirmed Appointment — Amazing Smile Dental Care*%0A%0A` +
                     `*Host:* Dr. Manish Gangwani%0A` +
                     `*Patient Name:* ${encodeURIComponent(name)}%0A` +
                     `*WhatsApp Phone:* ${encodeURIComponent(phone)}%0A` +
                     `*Required Service:* ${encodeURIComponent(service)}%0A` +
                     `*Confirmed Date:* ${encodeURIComponent(dateStr)}%0A` +
                     `*Confirmed Time Slot:* ${encodeURIComponent(timeStr)}%0A` +
                     `*Clinic Location:* Gol Maidan, Ulhasnagar - 421002%0A` +
                     `*Symptoms/Notes:* ${encodeURIComponent(notes)}%0A%0A` +
                     `Please confirm this appointment slot. Thank you!`;

        // Dual-dispatch: Persist confirmed appointment to backend atomic database
        try {
          fetch('/api/appointments', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name,
              phone,
              service,
              date: dateStr,
              time: timeStr,
              notes,
              source: 'cal_scheduler'
            })
          }).catch(() => {});
        } catch (_) {}

        const submitBtn = directForm.querySelector('.cal-submit-btn');
        const origHtml = submitBtn ? submitBtn.innerHTML : '';
        if (submitBtn) {
          submitBtn.innerHTML = 'Connecting to WhatsApp...';
          submitBtn.disabled = true;
        }

        setTimeout(() => {
          window.open(`https://wa.me/${doctorNumber}?text=${text}`, '_blank');
          if (submitBtn) {
            submitBtn.innerHTML = '✓ Slot Reserved on WhatsApp!';
            setTimeout(() => {
              submitBtn.innerHTML = origHtml;
              submitBtn.disabled = false;
            }, 3500);
          }
        }, 300);
      });
    }

    // Initial render
    updateDayHeader();
    renderCalendar();
    renderSlots();
  });
}

/* --- 10. Live Dynamic Settings & Offers Hydration --- */
async function initDynamicSettings() {
  try {
    const res = await fetch('/api/settings');
    if (!res.ok) return;
    const { settings } = await res.json();
    if (!settings) return;

    // 1. Phone number hydration
    if (settings.clinicPhone) {
      const cleanDigits = settings.clinicPhone.replace(/\s+/g, '');
      document.querySelectorAll('a[href^="tel:"]').forEach(el => {
        el.href = `tel:${cleanDigits}`;
        if (el.textContent.includes('9975999529') || el.classList.contains('btn-phone') || el.classList.contains('btn-call')) {
          const icon = el.querySelector('svg');
          if (icon) {
            el.innerHTML = '';
            el.appendChild(icon);
            el.appendChild(document.createTextNode(' ' + settings.clinicPhone));
          } else {
            el.textContent = settings.clinicPhone;
          }
        }
      });
    }

    // 2. WhatsApp numbers hydration
    if (settings.clinicWhatsapp) {
      document.querySelectorAll('a[href*="wa.me"]').forEach(el => {
        try {
          const url = new URL(el.href);
          const textParam = url.searchParams.get('text') || '';
          el.href = `https://wa.me/${settings.clinicWhatsapp}${textParam ? '?text=' + encodeURIComponent(textParam) : ''}`;
        } catch (_) {}
      });
    }

    // 3. Operating hours hydration
    if (settings.hoursWeekdays) {
      document.querySelectorAll('.top-bar-item').forEach(el => {
        if (el.textContent.includes('Mon–Sat') || el.textContent.includes('10:00 AM')) {
          const icon = el.querySelector('svg');
          if (icon) {
            el.innerHTML = '';
            el.appendChild(icon);
            el.appendChild(document.createTextNode(' ' + settings.hoursWeekdays));
          } else {
            el.textContent = settings.hoursWeekdays;
          }
        }
      });
    }

    // 4. Top Announcement bar
    const topBarRating = document.querySelector('.top-bar-rating span');
    if (topBarRating && settings.announcementNotice) {
      topBarRating.textContent = settings.announcementNotice;
    }
    const topBar = document.querySelector('.top-bar');
    if (topBar && settings.showAnnouncementNotice === false) {
      topBar.style.display = 'none';
    }

    // 5. Emergency Holiday Notice Banner
    if (settings.holidayNoticeActive && settings.holidayNoticeText) {
      let holidayBanner = document.getElementById('clinic-holiday-banner');
      if (!holidayBanner) {
        holidayBanner = document.createElement('div');
        holidayBanner.id = 'clinic-holiday-banner';
        holidayBanner.style.cssText = 'background: linear-gradient(90deg, #DC2626 0%, #B91C1C 100%); color: #FFFFFF; text-align: center; padding: 10px 20px; font-weight: 600; font-size: 14px; position: sticky; top: 0; z-index: 9999; box-shadow: 0 4px 12px rgba(220, 38, 38, 0.3);';
        document.body.prepend(holidayBanner);
      }
      holidayBanner.innerHTML = `⚠️ <strong>Notice:</strong> ${settings.holidayNoticeText}`;
    }

    // 6. Promotional Special Offer Banner
    if (settings.offerActive && settings.offerShowAsBanner) {
      let offerBanner = document.getElementById('clinic-offer-banner');
      if (!offerBanner) {
        offerBanner = document.createElement('div');
        offerBanner.id = 'clinic-offer-banner';
        offerBanner.style.cssText = 'background: linear-gradient(135deg, #079ED8 0%, #101D3A 100%); color: #FFFFFF; padding: 12px 24px; text-align: center; font-size: 14px; font-weight: 500; display: flex; align-items: center; justify-content: center; gap: 14px; flex-wrap: wrap; box-shadow: 0 4px 15px rgba(7, 158, 216, 0.2);';
        const topBarEl = document.querySelector('.top-bar');
        if (topBarEl && topBarEl.nextSibling) {
          topBarEl.parentNode.insertBefore(offerBanner, topBarEl.nextSibling);
        } else {
          document.body.prepend(offerBanner);
        }
      }
      const waDigits = settings.clinicWhatsapp || '919975999529';
      const offerMsg = encodeURIComponent(`Hi Dr. Manish, I would like to claim the special offer: ${settings.offerTitle} (${settings.offerCode || 'SMILE20'})`);
      offerBanner.innerHTML = `
        <span style="background: rgba(255,196,0,0.25); border: 1px solid #FFC400; color: #FFC400; font-size: 11px; font-weight: 800; padding: 3px 10px; border-radius: 999px; text-transform: uppercase; letter-spacing: 0.05em;">${settings.offerBadge || 'LIMITED OFFER'}</span>
        <span><strong>${settings.offerTitle || 'Special Dental Offer'}</strong>: ${settings.offerDescription || ''} (${settings.offerDiscount || ''})</span>
        <a href="https://wa.me/${waDigits}?text=${offerMsg}" target="_blank" style="background: #16C784; color: #FFFFFF; text-decoration: none; padding: 5px 14px; border-radius: 999px; font-weight: 700; font-size: 13px; display: inline-flex; align-items: center; gap: 6px;">
          ${settings.offerCtaText || 'Claim Offer'} →
        </a>
      `;
    }
  } catch (_) {}
}
