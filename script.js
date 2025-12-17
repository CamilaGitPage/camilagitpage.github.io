const EMAILJS_SERVICE_ID = "service_43a1civ";
const EMAILJS_TEMPLATE_ID = "template_pb4wd0d";
const EMAILJS_PUBLIC_KEY = "TtniCxXpJ007d83R6";

document.addEventListener('DOMContentLoaded', () => {
    const body = document.body;

    const startColor = { r: 233, g: 171, b: 174 };
    const endColor = { r: 150, g: 53, b: 66 };

    function interpolateColor(start, end, factor) {
        const result = {
            r: Math.round(start.r + (end.r - start.r) * factor),
            g: Math.round(start.g + (end.g - start.g) * factor),
            b: Math.round(start.b + (end.b - start.b) * factor)
        };
        return `rgb(${result.r}, ${result.g}, ${result.b})`;
    }

    let isMessageViewActive = false;

    function onScroll() {
        if (isMessageViewActive) return;

        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;

        let scrollFraction = scrollTop / scrollHeight;

        if (isNaN(scrollFraction)) scrollFraction = 0;
        if (scrollFraction < 0) scrollFraction = 0;
        if (scrollFraction > 1) scrollFraction = 1;

        const newColor = interpolateColor(startColor, endColor, scrollFraction);
        body.style.backgroundColor = newColor;
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    const replyBtn = document.getElementById('reply-button');
    const sendBtn = document.getElementById('send-button');
    const msgInput = document.getElementById('message-input');
    const overlay = document.getElementById('transition-overlay');
    const storyView = document.getElementById('story-view');
    const messageView = document.getElementById('message-view');

    replyBtn.addEventListener('click', () => {
        overlay.style.opacity = '1';

        setTimeout(() => {
            storyView.classList.add('hidden');
            messageView.classList.remove('hidden');

            isMessageViewActive = true;
            body.style.backgroundColor = 'var(--ripe-cherries)';

            window.scrollTo(0, 0);

            setTimeout(() => {
                overlay.style.opacity = '0';
            }, 50);
        }, 1500);
    });

    (function () {
        emailjs.init(EMAILJS_PUBLIC_KEY);
    })();

    sendBtn.addEventListener('click', () => {
        const message = msgInput.value;
        if (!message.trim()) return;

        sendBtn.textContent = 'Envoi...';
        sendBtn.disabled = true;

        emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
            message: message,
        })
            .then(() => {
                sendBtn.textContent = 'Envoyé !';
                msgInput.value = '';
            })
            .catch((error) => {
                console.error('EmailJS Error:', error);
                sendBtn.textContent = 'Erreur';
                setTimeout(() => {
                    sendBtn.disabled = false;
                    sendBtn.textContent = 'Envoyer';
                }, 2000);
            });
    });
});
