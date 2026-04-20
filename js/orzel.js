// Inicjalizacja hologramu
(function () {
  console.log("orzel.js loaded");

  function initHologram() {
    const holos = document.querySelectorAll(".holo-back");
    const bases = document.querySelectorAll(".base-back");
    const tops = document.querySelectorAll(".godlo-top");

    console.log("initHologram: found", holos.length, "holo-back");

    if (holos.length === 0) {
      console.warn("No .holo-back elements found!");
      return false;
    }

    // Wymuszenie widoczności
    bases.forEach(base => {
      base.style.display = "block";
      base.style.opacity = "1";
    });

    tops.forEach(top => {
      top.style.display = "block";
      top.style.opacity = "1";
    });

    holos.forEach(holo => {
      holo.style.opacity = "0.7";
      holo.style.backgroundPosition = "center 50%";
    });

    return true;
  }

  function handleOrientation(e) {
    if (!e || e.beta === null) return;

    const beta = e.beta;
    const holos = document.querySelectorAll(".holo-back");
    
    if (holos.length === 0) return;

    // Oblicz intensywność na podstawie kąta
    // beta: 0-180 (90 to pion)
    let intensity = Math.sin(Math.abs(beta - 90) * Math.PI / 180);
    intensity = Math.pow(intensity, 0.6); // Większa czułość
    
    // Opacity: 0.3-0.95
    const opacity = 0.3 + (intensity * 0.65);
    
    // Pozycja gradientu: 0% - 100%
    const position = 50 + (intensity * 50 * Math.sin(beta * Math.PI / 180));
    
    holos.forEach(holo => {
      holo.style.opacity = Math.min(0.95, Math.max(0.3, opacity));
      holo.style.backgroundPosition = `center ${position}%`;
    });
  }

  function enableMotionSensor() {
    // iOS 13+ wymaga zgody użytkownika
    if (typeof DeviceOrientationEvent !== 'undefined' && 
        typeof DeviceOrientationEvent.requestPermission === 'function') {
      console.log("iOS detected - waiting for user interaction");
      
      const requestPermission = () => {
        DeviceOrientationEvent.requestPermission()
          .then(response => {
            if (response === 'granted') {
              window.addEventListener('deviceorientation', handleOrientation);
              console.log("Motion permission granted");
            }
          })
          .catch(err => console.error("Permission error:", err));
        document.removeEventListener('click', requestPermission);
        document.removeEventListener('touchstart', requestPermission);
      };
      
      document.addEventListener('click', requestPermission);
      document.addEventListener('touchstart', requestPermission);
    } 
    // Android i inne przeglądarki
    else {
      window.addEventListener('deviceorientation', handleOrientation);
      console.log("Motion sensor attached");
    }
  }

  // Inicjalizacja
  if (initHologram()) {
    enableMotionSensor();
  }

  // Ponowna inicjalizacja przy powrocie do strony
  window.addEventListener("pageshow", () => initHologram());
})();
