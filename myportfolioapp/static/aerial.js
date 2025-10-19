(() => {
  const container = document.getElementById("container");

  const hexagons = container.querySelectorAll(".hexagon");
  const hexagonElements = new Array(...hexagons);

  const ripple = (target) => {
    if (container.classList.contains("show-ripple")) {
      return;
    }
    const targetRect = target.getBoundingClientRect();
    const data = hexagonElements
      .map((element) => {
        const rect = element.getBoundingClientRect();
        const centerX = rect.x + rect.width / 2;
        const centerY = rect.y + rect.height / 2;
        const distance = Math.round(
          Math.sqrt(
            Math.pow(rect.x - targetRect.x, 2) +
              Math.pow(rect.y - targetRect.y, 2)
          )
        );
        return { element, rect, centerX, centerY, distance };
      })
      .sort((a, b) =>
        a.distance > b.distance ? 1 : a.distance < b.distance ? -1 : 0
      );

    const [max] = data.slice(-1);
    data.forEach((item) =>
      item.element.style.setProperty(
        "--ripple-factor",
        `${(item.distance * 100) / max.distance}`
      )
    );
    container.classList.toggle("show-ripple");
    const cleanUp = () => {
      requestAnimationFrame(() => {
        container.classList.remove("show-ripple");
        data.forEach((item) =>
          item.element.style.removeProperty("--ripple-factor")
        );
        max.element.removeEventListener("animationend", cleanUp);
      });
    };
    max.element.addEventListener("animationend", cleanUp);
  };

  hexagons.forEach((hexagon) => {
    hexagon.addEventListener("click", () => {
      ripple(hexagon, hexagons);
    });
  });

   const switchButton = document.getElementById('switch');
    const toggleTheme = () => {
        switchButton.classList.toggle('checked');
        document.documentElement.classList.toggle('vision-ui');
    };
    switchButton.addEventListener('click', toggleTheme);

    // demo
    setTimeout(() => {
    ripple(hexagonElements[0], hexagons);
    setTimeout(() => {
      toggleTheme();
      setTimeout(() => {
        ripple(hexagonElements[0], hexagons);
      }, 600);
    }, 900);
  }, 300);
})();


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

