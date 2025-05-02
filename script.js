// script.js

document.addEventListener("DOMContentLoaded", () => {
    const hamburger = document.getElementById("hamburger");
    const mobileMenu = document.getElementById("mobileMenu");
    const closeMenu = document.getElementById("closeMenu");
    const links = document.querySelectorAll(".mobile-link");
  
    hamburger.addEventListener("click", () => {
      mobileMenu.classList.remove("translate-x-full");
      mobileMenu.classList.add("translate-x-0");
    });
  
    closeMenu.addEventListener("click", () => {
      mobileMenu.classList.add("translate-x-full");
      mobileMenu.classList.remove("translate-x-0");
    });
  
    links.forEach(link => {
      link.addEventListener("click", () => {
        mobileMenu.classList.add("translate-x-full");
        mobileMenu.classList.remove("translate-x-0");
      });
    });
  });

  document.querySelectorAll('[data-toggle]').forEach(button => {
    button.addEventListener('click', () => {
      const id = button.getAttribute('data-toggle');
      const target = document.getElementById(id);
      const icon = document.querySelector(`svg[data-icon="${id}"]`);
      const isOpen = target.classList.contains('max-h-[500px]');

      // Zárjunk le mindent
      document.querySelectorAll('[id^="faq"]').forEach(div => {
        div.classList.remove('max-h-[500px]', 'py-4', 'pb-4');
        div.classList.add('max-h-0', 'pb-0');
      });
      document.querySelectorAll('svg[data-icon]').forEach(i => {
        i.classList.remove('rotate-180');
      });

      // Ha nem volt nyitva, nyissuk ki és adjuk hozzá a paddingeket
      if (!isOpen) {
        target.classList.remove('max-h-0', 'pb-0');
        target.classList.add('max-h-[500px]', 'py-4', 'pb-4');
        icon.classList.add('rotate-180');
      }
    });
  });
  
  const fields = {
    name: {
      el: document.getElementById('name'),
      error: document.getElementById('error-name'),
      validate: (value) => value.trim().length > 0,
      message: 'Kérjük, add meg a neved.'
    },
    email: {
      el: document.getElementById('email'),
      error: document.getElementById('error-email'),
      validate: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
      message: 'Kérjük, érvényes email címet adj meg.'
    },
    package: {
      el: document.getElementById('package'),
      error: document.getElementById('error-package'),
      validate: (value) => value !== '',
      message: 'Kérjük, válassz csomagot.'
    },
    message: {
      el: document.getElementById('message'),
      error: document.getElementById('error-message'),
      validate: (value) => value.trim().length > 0,
      message: 'Kérjük, írd le röviden, miben segíthetünk.'
    }
  };

  Object.values(fields).forEach(({ el, error, validate, message }) => {
    el.addEventListener('input', () => {
      const value = el.value;
      if (!validate(value)) {
        el.classList.remove('focus:ring-2', 'focus:ring-gray-900');
        el.style.boxShadow = '0 0 0 2px rgba(248, 113, 113, 1), 0 0 10px 0 rgba(248, 113, 113, 0.4)';
        error.textContent = message;
        error.classList.remove('hidden');
      } else {
        el.style = null;
        el.classList.add('focus:ring-2', 'focus:ring-gray-900');
        error.classList.add('hidden');
      }
    });
  });

  document.querySelector('form').addEventListener('submit', function (e) {
    let hasError = false;

    Object.values(fields).forEach(({ el, error, validate, message }) => {
      const value = el.value;
      if (!validate(value)) {
        el.style.boxShadow = '0 0 0 2px rgba(248, 113, 113, 1), 0 0 10px 0 rgba(248, 113, 113, 0.4)';
        error.textContent = message;
        error.classList.remove('hidden');
        hasError = true;
      }
    });

    if (hasError) {
      e.preventDefault(); // megakadályozzuk az elküldést
    } else {
      alert('Köszönjük! Üzeneted megérkezett.');
      e.target.reset();
      Object.values(fields).forEach(({ el, error }) => {
        el.classList.remove('ring-2', 'ring-red-400', 'focus:ring-red-400');
        el.style.boxShadow = 'none';
        error.classList.add('hidden');
      });
    }
  });



  