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

const form = document.querySelector('form');
const modal = document.getElementById('successModal');
const submitBtn = document.getElementById('submitBtn');
const spinner = document.getElementById('spinner');
const submitText = document.getElementById('submitText');

function openModal() {
    const modal = document.getElementById('successModal');
    const content = document.getElementById('modalContent');
    modal.classList.remove('hidden');
    setTimeout(() => {
        content.classList.remove('scale-95', 'opacity-0');
        content.classList.add('scale-100', 'opacity-100');
    }, 20); // kis késleltetés az animációhoz
}

function closeModal() {
    const modal = document.getElementById('successModal');
    const content = document.getElementById('modalContent');
    content.classList.remove('scale-100', 'opacity-100');
    content.classList.add('scale-95', 'opacity-0');
    setTimeout(() => {
        modal.classList.add('hidden');
    }, 300); // animáció időtartama
}

function showErrorModal() {
    document.getElementById('errorModal').classList.remove('hidden');
  }
  
  function closeErrorModal() {
    document.getElementById('errorModal').classList.add('hidden');
  }
  

form.addEventListener('submit', async function (e) {
    e.preventDefault(); // megakadályozzuk a frissítést
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

    if (!hasError) {
        let message = {
            name: fields.name.el.value,
            email: fields.email.el.value,
            message: fields.message.el.value,
            package: null
        }
        switch (fields.package.el.value) {
            case 'starter':
                message.package = 'Indulásbiztos';
                break;
            case 'standard':
                message.package = 'Rendbetesz';
                break;
            case 'partner':
                message.package = 'QA Partner';
                break;
            case 'unknown':
                message.package = 'Még nem tudom';
                break;
        }
        try {
            // Küldés előtt:
            submitBtn.disabled = true;
            spinner.classList.remove('hidden');
            submitText.textContent = 'Küldés...';
            const res = await fetch('http://localhost:3000/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(message)
            });

            const result = await res.json();

            if (result.success) {
                submitBtn.disabled = false;
                spinner.classList.add('hidden');
                submitText.textContent = 'Üzenet elküldése';
                openModal();
                form.reset();
                Object.values(fields).forEach(({ el, error }) => {
                    el.classList.remove('ring-2', 'ring-red-400', 'focus:ring-red-400');
                    error.classList.add('hidden');
                });
            } else {
                form.reset();
                fields.email.el.disabled = true;
                fields.name.el.disabled = true;
                fields.message.el.disabled = true;
                fields.package.el.disabled = true;
                spinner.classList.add('hidden');
                submitText.textContent = 'Jelenleg nem küldhető üzenet.';
                showErrorModal();
            }
        } catch (err) {
            console.error(err);
            form.reset();
            fields.email.el.disabled = true;
            fields.name.el.disabled = true;
            fields.message.el.disabled = true;
            fields.package.el.disabled = true;
            spinner.classList.add('hidden');
            submitText.textContent = 'Jelenleg nem küldhető üzenet.';
            showErrorModal();
        }
    }


});


