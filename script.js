const EMAILJS_SERVICE_ID = "service_43a1civ";
const EMAILJS_TEMPLATE_ID = "template_pb4wd0d";
const EMAILJS_PUBLIC_KEY = "TtniCxXpJ007d83R6";

document.addEventListener('DOMContentLoaded', () => {
    const body = document.body;
    const overlay = document.getElementById('transition-overlay');
    const storyView = document.getElementById('story-view');
    const messageView = document.getElementById('message-view');
    const replyBtn = document.getElementById('reply-button');
    const sendBtn = document.getElementById('send-button');
    const msgInput = document.getElementById('message-input');

    function getCSSColor(variable) {
        const temp = document.createElement('div');
        temp.style.color = `var(${variable})`;
        temp.style.display = 'none';
        document.body.appendChild(temp);
        const style = window.getComputedStyle(temp);
        const color = style.color;
        document.body.removeChild(temp);

        const match = color.match(/\d+/g);
        if (match) {
            return { r: parseInt(match[0]), g: parseInt(match[1]), b: parseInt(match[2]) };
        }
        return { r: 0, g: 0, b: 0 };
    }

    const startColor = getCSSColor('--cherry-blossom');
    const endColor = getCSSColor('--ripe-cherries');

    let isMessageViewActive = false;

    function interpolateColor(start, end, factor) {
        const result = {
            r: Math.round(start.r + (end.r - start.r) * factor),
            g: Math.round(start.g + (end.g - start.g) * factor),
            b: Math.round(start.b + (end.b - start.b) * factor)
        };
        return `rgb(${result.r}, ${result.g}, ${result.b})`;
    }

    function onScroll() {
        if (isMessageViewActive) return;

        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;

        let scrollFraction = scrollTop / scrollHeight;
        scrollFraction = Math.max(0, Math.min(1, scrollFraction));

        const newColor = interpolateColor(startColor, endColor, scrollFraction);
        body.style.backgroundColor = newColor;
    }

    function switchView(targetViewId) {
        overlay.style.backgroundColor = 'var(--ripe-cherries)';
        overlay.style.opacity = '1';

        setTimeout(() => {
            if (targetViewId === 'message-view') {
                storyView.classList.add('hidden');
                messageView.classList.remove('hidden');
                isMessageViewActive = true;
                body.style.backgroundColor = 'var(--ripe-cherries)';
            } else {
                messageView.classList.add('hidden');
                storyView.classList.remove('hidden');
                isMessageViewActive = false;
                onScroll();
            }

            window.scrollTo(0, 0);

            setTimeout(() => {
                overlay.style.opacity = '0';
            }, 50);

        }, 1600);
    }

    window.addEventListener('scroll', onScroll, { passive: true });

    onScroll();

    replyBtn.addEventListener('click', () => {
        switchView('message-view');
    });

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

    (function () {
        emailjs.init(EMAILJS_PUBLIC_KEY);
    })();

    setTimeout(() => {
        overlay.style.opacity = '0';
    }, 500);

});
