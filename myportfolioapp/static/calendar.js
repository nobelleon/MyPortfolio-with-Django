console.clear();

// define images for each month
const monthBackgrounds = {
  0: "https://images.pexels.com/photos/3171837/pexels-photo-3171837.jpeg", // Jan
  1: "https://images.pexels.com/photos/300857/pexels-photo-300857.jpeg",
  2: "https://images.pexels.com/photos/906023/pexels-photo-906023.jpeg",
  3: "https://images.pexels.com/photos/414083/pexels-photo-414083.jpeg",
  4: "https://images.pexels.com/photos/158063/bellingrath-gardens-alabama-landscape-scenic-158063.jpeg",
  5: "https://images.pexels.com/photos/131723/pexels-photo-131723.jpeg",
  6: "https://images.pexels.com/photos/12969365/pexels-photo-12969365.jpeg",
  7: "https://images.pexels.com/photos/462024/pexels-photo-462024.jpeg",
  8: "https://images.pexels.com/photos/1136466/pexels-photo-1136466.jpeg",
  9: "https://cdn.britannica.com/15/189715-050-4310222B/Dubai-United-Arab-Emirates-Burj-Khalifa-top.jpg",
  10: "https://images.pexels.com/photos/1878293/pexels-photo-1878293.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  11: "https://boutiquejapan.com/wp-content/uploads/2019/07/yasaka-pagoda-higashiyama-kyoto-japan.jpg",
};

// define dates
// only including fixed date holidays - ideally this would use an api to get holidays for each month as it is loaded
const fixedHolidays = [
  { month: 0, day: 1, name: "New Year's Day" },
  { month: 0, day: 26, name: "Republic Day (India)" },
  { month: 1, day: 14, name: "Valentine's Day" },
  { month: 2, day: 17, name: "St. Patrick's Day" },
  { month: 3, day: 22, name: "Earth Day" },
  { month: 4, day: 1, name: "Labour Day" },
  { month: 4, day: 5, name: "Children's Day (Japan)" },
  { month: 6, day: 4, name: "Independence Day (USA)" },
  { month: 7, day: 15, name: "Assumption Day" },
  { month: 7, day: 17, name: "Independence Day (Indonesia)" },
  { month: 8, day: 21, name: "International Day of Peace" },
  { month: 9, day: 31, name: "Halloween" },
  { month: 10, day: 11, name: "Veterans Day" },
  { month: 11, day: 25, name: "Christmas" },
  { month: 11, day: 31, name: "New Year's Eve" }
];

// element selectors
const btnNavPrev = document.getElementById('btn-prev');
const btnNavNext = document.getElementById('btn-next');
const btnNavToday = document.getElementById('btn-today');
const monthTitleEl = document.getElementById('current-month-name');
const calendarEl = document.getElementById('calendar-grid');

// define time 
let current = new Date();
let year = current.getFullYear();
let month = current.getMonth();
let minuteInterval = null; // track the interval

// draw calendar
function drawCalendar(year, month) {
  // set background image via CSS variable
  document.documentElement.style.setProperty(
    '--bg-img',
    `url("${monthBackgrounds[month]}")`
  );

  // clear previous cells
  calendarEl.innerHTML = '';

  // weekday headers
  const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  for (const day of weekdays) {
    const weekdayHeader = document.createElement('div');
    weekdayHeader.classList.add('weekday-header');
    weekdayHeader.textContent = day;
    calendarEl.appendChild(weekdayHeader);
  }
  
  const startDate = new Date(year, month, 1);
  const endDate = new Date(year, month + 1, 0);
  const prevMonthEnd = new Date(year, month, 0);
  const daysInPrevMonth = prevMonthEnd.getDate();
  const daysInMonth = endDate.getDate();
  const firstWeekday = (startDate.getDay() + 6) % 7; // Monday = 0
  const now = new Date();

  // always 6 rows (42 cells)
  const totalCells = 42;

  // month title
  monthTitleEl.textContent = startDate.toLocaleString('default', {
    month: 'long',
    year: 'numeric',
  });

  // month position class
  calendarEl.classList.remove('past-month', 'current-month', 'future-month');
  if (year < now.getFullYear() || (year === now.getFullYear() && month < now.getMonth())) {
    calendarEl.classList.add('past-month');
  } else if (year === now.getFullYear() && month === now.getMonth()) {
    calendarEl.classList.add('current-month');
  } else {
    calendarEl.classList.add('future-month');
  }

  // build day cells
  for (let i = 0; i < totalCells; i++) {
    const dayCell = document.createElement('div');
    dayCell.classList.add('day-cell');

    let dayNum;
    let inCurrentMonth = false;

    if (i < firstWeekday) {
      dayNum = daysInPrevMonth - (firstWeekday - i - 1);
      dayCell.classList.add('other-month');
    } else if (i < firstWeekday + daysInMonth) {
      dayNum = i - firstWeekday + 1;
      inCurrentMonth = true;
    } else {
      dayNum = i - firstWeekday - daysInMonth + 1;
      dayCell.classList.add('other-month');
    }

    // date weekday and day number 
    const headerDiv = document.createElement('div');
    headerDiv.classList.add('day-header');

    const cellDate = new Date(year, month, dayNum);
    const weekday = cellDate.toLocaleDateString([], { weekday: 'short' });

    headerDiv.innerHTML = `
      <p>
        <span class="weekday">${weekday}</span>
        <span class="day-number">${dayNum}</span>
      </p>
    `;

    // CURRENT DAY
    if (
      inCurrentMonth &&
      dayNum === now.getDate() &&
      month === now.getMonth() &&
      year === now.getFullYear()
    ) {
      dayCell.classList.add('current-day');

      // current time display (24-hour format with seconds)
      const timeSpan = document.createElement('span');
      timeSpan.classList.add('current-time');
      timeSpan.textContent = formatCurrentTime(now);
      headerDiv.appendChild(timeSpan);

      // create breakdown overlay for current date only
      const dayBreakdownDiv = document.createElement('div');
      dayBreakdownDiv.classList.add('breakdown');

      for (let h = 0; h < 24; h++) {
        const hourDiv = document.createElement('div');
        hourDiv.classList.add('hour-row');

        if (h === now.getHours()) {
          hourDiv.classList.add('current-hour');
          hourDiv.style.display = 'flex';

          // 60-minute blocks
          for (let m = 0; m < 60; m++) {
            const minuteDiv = document.createElement('div');
            minuteDiv.style.flex = '1';

            if (m < now.getMinutes()) minuteDiv.classList.add('elapsed-minute');
            else if (m === now.getMinutes()) minuteDiv.classList.add('current-minute');
            else minuteDiv.classList.add('future-minute');

            hourDiv.appendChild(minuteDiv);
          }
        }
        dayBreakdownDiv.appendChild(hourDiv);
      }
      dayCell.appendChild(dayBreakdownDiv);
    }

    // append header last to keep it above overlays
    dayCell.appendChild(headerDiv);

    // add holidays
    const holiday = fixedHolidays.find(h => h.day === dayNum && h.month === month);
    if (holiday) {
      const holDiv = document.createElement('div');
      holDiv.classList.add('holiday');
      holDiv.innerHTML = `<span class="dot"></span>${holiday.name}`;
      dayCell.appendChild(holDiv);
    }
    calendarEl.appendChild(dayCell);
  }

  // start minute update for current day
  if (year === current.getFullYear() && month === current.getMonth()) {
    startMinuteUpdate();
  }
}

// format time in 24-hour with seconds
function formatCurrentTime(date) {
  return date.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });
}

// update current day seconds and minutes
function startMinuteUpdate() {
  if (minuteInterval) clearInterval(minuteInterval);

  const currentDayCell = document.querySelector('.day-cell.current-day');
  if (!currentDayCell) return;

  const currentHourRow = currentDayCell.querySelector('.hour-row.current-hour');

  function updateMinute() {
    const now = new Date();

    if (currentHourRow) currentHourRow.style.setProperty('--minutes-past', now.getMinutes());

    const timeSpan = currentDayCell.querySelector('.current-time');
    if (timeSpan) timeSpan.textContent = formatCurrentTime(now);
  }

  updateMinute();
  minuteInterval = setInterval(updateMinute, 1000);
}

// navigation with View Transitions 
function startTransition(newYear, newMonth, direction = 'forward') {
  document.documentElement.style.setProperty('--slide-direction', direction);
  if (document.startViewTransition) {
    document.startViewTransition(() => drawCalendar(newYear, newMonth));
  } else drawCalendar(newYear, newMonth);
}

btnNavPrev.addEventListener('click', () => {
  month--;
  if (month < 0) { month = 11; year--; }
  startTransition(year, month, 'backward');
});

btnNavNext.addEventListener('click', () => {
  month++;
  if (month > 11) { month = 0; year++; }
  startTransition(year, month, 'forward');
});

btnNavToday.addEventListener('click', () => {
  const currentDate = new Date();
  const newYear = currentDate.getFullYear();
  const newMonth = currentDate.getMonth();

  let direction =
    newYear > year || (newYear === year && newMonth > month)
      ? 'forward'
      : newYear < year || (newYear === year && newMonth < month)
      ? 'backward'
      : 'none';

  startTransition(newYear, newMonth, direction);
  year = newYear;
  month = newMonth;
});

// initial draw
drawCalendar(year, month);

// ------------------------------------------------------------------- //
// -----------------------  CUSTOM DOT CURSOR  ----------------------- //

var cursor = {
    delay: 8,
    _x: 0,
    _y: 0,
    endX: (window.innerWidth / 2),
    endY: (window.innerHeight / 2),
    cursorVisible: true,
    cursorEnlarged: false,
    $dot: document.querySelector('.cursor-dot'),
    $outline: document.querySelector('.cursor-dot-outline'),
    
    init: function() {
        // Set up element sizes
        this.dotSize = this.$dot.offsetWidth;
        this.outlineSize = this.$outline.offsetWidth;
        
        this.setupEventListeners();
        this.animateDotOutline();
    },
    
    setupEventListeners: function() {
        var self = this;
        
        // Anchor hovering
        document.querySelectorAll('a').forEach(function(el) {
            el.addEventListener('mouseover', function() {
                self.cursorEnlarged = true;
                self.toggleCursorSize();
            });
            el.addEventListener('mouseout', function() {
                self.cursorEnlarged = false;
                self.toggleCursorSize();
            });
        });
        
        // Click events
        document.addEventListener('mousedown', function() {
            self.cursorEnlarged = true;
            self.toggleCursorSize();
        });
        document.addEventListener('mouseup', function() {
            self.cursorEnlarged = false;
            self.toggleCursorSize();
        });
  
  
        document.addEventListener('mousemove', function(e) {
            // Show the cursor
            self.cursorVisible = true;
            self.toggleCursorVisibility();

            // Position the dot
            self.endX = e.pageX;
            self.endY = e.pageY;
            self.$dot.style.top = self.endY + 'px';
            self.$dot.style.left = self.endX + 'px';
        });
        
        // Hide/show cursor
        document.addEventListener('mouseenter', function(e) {
            self.cursorVisible = true;
            self.toggleCursorVisibility();
            self.$dot.style.opacity = 1;
            self.$outline.style.opacity = 1;
        });
        
        document.addEventListener('mouseleave', function(e) {
            self.cursorVisible = true;
            self.toggleCursorVisibility();
            self.$dot.style.opacity = 0;
            self.$outline.style.opacity = 0;
        });
    },
    
    animateDotOutline: function() {
        var self = this;
        
        self._x += (self.endX - self._x) / self.delay;
        self._y += (self.endY - self._y) / self.delay;
        self.$outline.style.top = self._y + 'px';
        self.$outline.style.left = self._x + 'px';
        
        requestAnimationFrame(this.animateDotOutline.bind(self));
    },
    
    toggleCursorSize: function() {
        var self = this;
        
        if (self.cursorEnlarged) {
            self.$dot.style.transform = 'translate(-50%, -50%) scale(0.75)';
            self.$outline.style.transform = 'translate(-50%, -50%) scale(1.5)';
        } else {
            self.$dot.style.transform = 'translate(-50%, -50%) scale(1)';
            self.$outline.style.transform = 'translate(-50%, -50%) scale(1)';
        }
    },
    
    toggleCursorVisibility: function() {
        var self = this;
        
        if (self.cursorVisible) {
            self.$dot.style.opacity = 1;
            self.$outline.style.opacity = 1;
        } else {
            self.$dot.style.opacity = 0;
            self.$outline.style.opacity = 0;
        }
    }
}

cursor.init();

