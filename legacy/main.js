function getFallbackReply(message) {
    const text = message.toLowerCase();
    if (text.includes("aic là gì") || text.includes("gioi thieu") || text.includes("giới thiệu")) {
        return "AIC là Trung tâm Nghiên cứu và Ứng dụng Trí tuệ nhân tạo trực thuộc SICT - Đại học Công nghiệp Hà Nội. Trung tâm tập trung vào nghiên cứu AI, ứng dụng trong giáo dục và công nghiệp, đồng thời tạo môi trường phát triển cho sinh viên.";
    }
    if (text.includes("lab")) {
        return "AIC hiện nổi bật với hai lab sinh viên: AIC-INNOVATION LAB thiên về phát triển sản phẩm, startup; AIC-FOUNDRY LAB thiên về nghiên cứu khoa học, sáng chế và công bố học thuật.";
    }
    if (text.includes("nghiên cứu") || text.includes("hướng")) {
        return "Các hướng nghiên cứu cốt lõi gồm: khoa học dữ liệu và dữ liệu lớn, toán ứng dụng và tối ưu hóa, điều khiển và tự động hóa, cùng công nghệ giáo dục với trọng tâm LLM và AI phù hợp bối cảnh Việt Nam.";
    }
    if (text.includes("tham gia") || text.includes("tuyển")) {
        return "Đối tượng phù hợp là sinh viên năm 1-3 của HaUI, có đam mê AI, nền tảng lập trình và khả năng cam kết thời gian cho hoạt động lab. Bạn có thể dùng form đăng ký trên website để liên hệ trực tiếp.";
    }
    return "Mình có thể hỗ trợ về giới thiệu AIC, lab sinh viên, định hướng nghiên cứu và cách tham gia trung tâm. Bạn hãy hỏi cụ thể hơn một chút để mình trả lời chính xác.";
}

function createMessageElement(role, content) {
    const element = document.createElement("div");
    // Styling with Tailwind CSS classes based on role
    const baseClasses = "max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap shadow-sm";
    if (role === "user") {
        element.className = `${baseClasses} bg-primary text-white self-end rounded-tr-sm`;
    } else {
        element.className = `${baseClasses} bg-surface-container border border-outline-variant text-on-surface self-start rounded-tl-sm`;
    }
    element.textContent = content;
    return element;
}

function createTypingElement() {
    const typing = document.createElement("div");
    typing.className = "self-start bg-surface-container border border-outline-variant px-4 py-3 rounded-2xl rounded-tl-sm shadow-sm flex gap-1 items-center";
    typing.id = "typing-indicator";
    typing.innerHTML = `
        <span class="w-2 h-2 bg-outline rounded-full animate-bounce" style="animation-delay: 0ms"></span>
        <span class="w-2 h-2 bg-outline rounded-full animate-bounce" style="animation-delay: 150ms"></span>
        <span class="w-2 h-2 bg-outline rounded-full animate-bounce" style="animation-delay: 300ms"></span>
    `;
    return typing;
}

document.addEventListener("DOMContentLoaded", () => {
    const chatFab = document.getElementById("chat-fab");
    const chatPopup = document.getElementById("chat-popup");
    const chatClose = document.getElementById("chat-close");
    const chatMessages = document.getElementById("chat-messages");
    const chatForm = document.getElementById("chat-form");
    const chatInput = document.getElementById("chat-input");
    const chatStatus = document.getElementById("chat-status");
    const promptButtons = document.querySelectorAll(".prompt-btn");
    const mobileMenuBtn = document.getElementById("mobile-menu-btn");
    const mobileMenu = document.getElementById("mobile-menu");

    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }

    function scrollChatToBottom() {
        if (!chatMessages) return;
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function openChatPopup() {
        if (!chatPopup || !chatFab) return;
        chatPopup.classList.remove("opacity-0", "translate-y-4", "scale-95", "pointer-events-none");
        chatPopup.classList.add("opacity-100", "translate-y-0", "scale-100", "pointer-events-auto");
        chatFab.setAttribute("aria-expanded", "true");
    }

    function closeChatPopup() {
        if (!chatPopup || !chatFab) return;
        chatPopup.classList.remove("opacity-100", "translate-y-0", "scale-100", "pointer-events-auto");
        chatPopup.classList.add("opacity-0", "translate-y-4", "scale-95", "pointer-events-none");
        chatFab.setAttribute("aria-expanded", "false");
    }

    function toggleChatPopup() {
        if (!chatPopup) return;
        if (chatPopup.classList.contains("opacity-100")) {
            closeChatPopup();
        } else {
            openChatPopup();
            if (chatInput) chatInput.focus();
            scrollChatToBottom();
        }
    }

    if (promptButtons) {
        promptButtons.forEach((btn) => {
            btn.addEventListener("click", () => {
                const text = btn.innerText;
                openChatPopup();
                if (chatInput) {
                    chatInput.value = text;
                    chatInput.focus();
                }
            });
        });
    }

    async function handleChatSubmit(event) {
        event.preventDefault();
        if (!chatInput || !chatMessages || !chatStatus) return;

        const message = chatInput.value.trim();
        if (!message) return;

        chatMessages.appendChild(createMessageElement("user", message));
        chatInput.value = "";
        chatStatus.textContent = "Đang suy luận...";

        const typing = createTypingElement();
        chatMessages.appendChild(typing);
        scrollChatToBottom();

        try {
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message })
            });

            const data = await response.json();
            typing.remove();

            const reply = data.response || getFallbackReply(message);
            chatMessages.appendChild(createMessageElement("bot", reply));
            chatStatus.textContent = response.ok ? "Online" : "Đang dùng phản hồi dự phòng";
        } catch (error) {
            typing.remove();
            chatMessages.appendChild(createMessageElement("bot", getFallbackReply(message)));
            chatStatus.textContent = "Đang dùng phản hồi dự phòng";
        }

        scrollChatToBottom();
    }

    if (chatMessages) {
        chatMessages.appendChild(createMessageElement(
            "bot",
            "Bạn có thể hỏi về Trung tâm AIC, các lab sinh viên, định hướng nghiên cứu hoặc cách tham gia."
        ));
        scrollChatToBottom();
    }

    if (chatFab) chatFab.addEventListener("click", toggleChatPopup);
    if (chatClose) chatClose.addEventListener("click", closeChatPopup);
    if (chatForm) chatForm.addEventListener("submit", handleChatSubmit);

    // Contact Form Logic (only active on Student Lab page)
    const contactForm = document.getElementById("contact-form");
    const contactStatus = document.getElementById("contact-status");
    const contactSubmit = document.getElementById("contact-submit");

    if (contactForm) {
        contactForm.addEventListener("submit", async (event) => {
            event.preventDefault();
            if (!contactSubmit || !contactStatus) return;

            const formData = new FormData(contactForm);
            const payload = {
                name: (formData.get("name") || "").toString().trim(),
                email: (formData.get("email") || "").toString().trim(),
                subject: (formData.get("subject") || "").toString().trim(),
                message: (formData.get("message") || "").toString().trim(),
                company: (formData.get("company") || "").toString().trim()
            };

            if (!payload.name || !payload.email || !payload.subject || !payload.message) {
                contactStatus.textContent = "Vui lòng điền đủ họ tên, email, chủ đề và nội dung.";
                contactStatus.className = "text-sm text-error mt-2";
                return;
            }

            contactSubmit.disabled = true;
            contactStatus.textContent = "Đang gửi liên hệ qua backend bảo mật...";
            contactStatus.className = "text-sm text-on-surface-variant mt-2";

            try {
                const response = await fetch("/api/contact", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload)
                });

                const data = await response.json();
                if (!response.ok) throw new Error(data.response || "Không thể gửi liên hệ.");

                contactForm.reset();
                contactStatus.textContent = data.response || "Đã gửi liên hệ thành công.";
                contactStatus.className = "text-sm text-green-600 font-medium mt-2";
            } catch (error) {
                contactStatus.textContent = error.message || "Có lỗi xảy ra khi gửi liên hệ.";
                contactStatus.className = "text-sm text-error mt-2";
            } finally {
                contactSubmit.disabled = false;
            }
        });
    }

    // Optional: Smooth scroll for anchors
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const id = this.getAttribute('href');
            if (id && id !== "#") {
                const target = document.querySelector(id);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });
});
