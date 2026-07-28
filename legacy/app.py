import os
import re
import smtplib
from pathlib import Path
from email.message import EmailMessage

from flask import Flask, jsonify, request, send_from_directory

try:
    from dotenv import load_dotenv
except ImportError:  # pragma: no cover
    def load_dotenv():
        return False

try:
    from groq import Groq
except ImportError:  # pragma: no cover
    Groq = None

load_dotenv()

BASE_DIR = Path(__file__).resolve().parent
app = Flask(__name__, static_folder=str(BASE_DIR), static_url_path="")

KNOWLEDGE_BASE = """
Trung tâm Nghiên cứu và Ứng dụng Trí tuệ nhân tạo (AIC) trực thuộc Trường Công nghệ Thông tin và Truyền thông (SICT), Đại học Công nghiệp Hà Nội (HaUI).

Mục tiêu của AIC:
- Nghiên cứu và ứng dụng AI trong giáo dục, công nghiệp và đổi mới sáng tạo.
- Xây dựng môi trường để sinh viên tham gia học thuật, phát triển kỹ năng kỹ thuật và làm sản phẩm thực tế.

Thông tin về các lab sinh viên:
1. AIC-INNOVATION LAB:
- Tập trung phát triển sản phẩm, hỗ trợ startup sinh viên và triển khai dự án AI thực tế.

2. AIC-FOUNDRY LAB:
- Tập trung nghiên cứu khoa học, sáng chế, phát triển học thuật và công bố nghiên cứu.

Hệ thống cấp bậc trong lab:
- Thành viên
- Chiến binh
- Đội trưởng
- Chỉ huy
- Thủ lĩnh

Các hướng nghiên cứu cốt lõi:
- Khoa học dữ liệu và dữ liệu lớn
- Toán ứng dụng và tối ưu hóa
- Điều khiển và tự động hóa
- Công nghệ giáo dục với trọng tâm LLM và AI phù hợp bối cảnh Việt Nam

Điều kiện tham gia:
- Sinh viên năm 1, 2, 3 của Đại học Công nghiệp Hà Nội
- Có đam mê AI, khả năng lập trình và tư duy logic
- Có thể cam kết thời gian cho hoạt động lab

Một số thành tựu nổi bật:
- Công bố nghiên cứu quốc tế về NLP
- Giải nhất cuộc thi AI Startup HaUI
- Tổ chức chuỗi hội thảo AI trong kỷ nguyên số
"""

SYSTEM_PROMPT = f"""
Bạn là AIC Assistant, trợ lý AI của Trung tâm Nghiên cứu và Ứng dụng Trí tuệ nhân tạo (AIC) thuộc SICT - Đại học Công nghiệp Hà Nội.

Nhiệm vụ:
- Trả lời hoàn toàn bằng tiếng Việt.
- Giọng điệu chuyên nghiệp, rõ ràng, ngắn gọn và thân thiện.
- Chỉ trả lời trong phạm vi thông tin đã được cung cấp về AIC.
- Nếu người dùng hỏi ngoài phạm vi, hãy nói rõ rằng bạn chỉ hỗ trợ thông tin về AIC và khuyên họ liên hệ trực tiếp trung tâm.
- Khi phù hợp, có thể dùng gạch đầu dòng ngắn để trả lời dễ đọc.

Tri thức nền:
{KNOWLEDGE_BASE}
"""

EMAIL_REGEX = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")


def get_env_bool(name: str, default: bool = False) -> bool:
    raw = os.getenv(name)
    if raw is None:
        return default
    return raw.strip().lower() in {"1", "true", "yes", "on"}


def validate_contact_payload(payload: dict) -> tuple[bool, str]:
    name = (payload.get("name") or "").strip()
    email = (payload.get("email") or "").strip()
    subject = (payload.get("subject") or "").strip()
    message = (payload.get("message") or "").strip()
    company = (payload.get("company") or "").strip()

    if company:
        return False, "Yêu cầu không hợp lệ."
    if not name or not email or not subject or not message:
        return False, "Vui lòng điền đầy đủ họ tên, email, chủ đề và nội dung."
    if not EMAIL_REGEX.match(email):
        return False, "Email chưa đúng định dạng."
    if len(subject) > 180 or len(name) > 120:
        return False, "Thông tin nhập quá dài."
    if len(message) < 10:
        return False, "Nội dung liên hệ quá ngắn."
    return True, ""


def send_contact_email(payload: dict) -> None:
    smtp_host = os.getenv("SMTP_HOST")
    smtp_port = int(os.getenv("SMTP_PORT", "587"))
    smtp_username = os.getenv("SMTP_USERNAME")
    smtp_password = os.getenv("SMTP_PASSWORD")
    smtp_from = os.getenv("SMTP_FROM_EMAIL") or smtp_username
    contact_recipient = os.getenv("CONTACT_RECEIVER_EMAIL")
    use_tls = get_env_bool("SMTP_USE_TLS", True)
    use_ssl = get_env_bool("SMTP_USE_SSL", False)

    if not all([smtp_host, smtp_username, smtp_password, smtp_from, contact_recipient]):
        raise RuntimeError(
            "Thiếu cấu hình SMTP. Cần các biến: SMTP_HOST, SMTP_PORT, SMTP_USERNAME, "
            "SMTP_PASSWORD, SMTP_FROM_EMAIL, CONTACT_RECEIVER_EMAIL."
        )

    name = payload["name"].strip()
    email = payload["email"].strip()
    subject = payload["subject"].strip()
    message = payload["message"].strip()

    mail = EmailMessage()
    mail["Subject"] = f"[AIC Contact] {subject}"
    mail["From"] = smtp_from
    mail["To"] = contact_recipient
    mail["Reply-To"] = email
    mail.set_content(
        f"Ho ten: {name}\n"
        f"Email: {email}\n"
        f"Chu de: {subject}\n\n"
        f"Noi dung:\n{message}\n"
    )

    if use_ssl:
        with smtplib.SMTP_SSL(smtp_host, smtp_port, timeout=20) as server:
            server.login(smtp_username, smtp_password)
            server.send_message(mail)
        return

    with smtplib.SMTP(smtp_host, smtp_port, timeout=20) as server:
        if use_tls:
            server.starttls()
        server.login(smtp_username, smtp_password)
        server.send_message(mail)


@app.route("/")
def index():
    return send_from_directory(BASE_DIR, "index.html")


@app.route("/api/chat", methods=["POST"])
def chat():
    data = request.get_json(silent=True) or {}
    user_message = (data.get("message") or "").strip()

    if not user_message:
        return jsonify({"response": "Bạn chưa nhập câu hỏi."}), 400

    api_key = os.getenv("GROQ_API_KEY")
    if Groq is None:
        return jsonify({
            "response": (
                "Máy chủ chưa cài package `groq`, nên chatbot API chưa thể gọi mô hình. "
                "Giao diện sẽ dùng phản hồi dự phòng."
            )
        }), 503

    if not api_key:
        return jsonify({
            "response": (
                "Hệ thống chưa được cấu hình `GROQ_API_KEY`, nên chatbot hiện chỉ có thể dùng "
                "phản hồi dự phòng ở phía giao diện."
            )
        }), 503

    try:
        client = Groq(api_key=api_key)
        completion = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            temperature=0.4,
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": user_message},
            ],
        )
        reply = completion.choices[0].message.content or "Mình chưa tạo được phản hồi phù hợp."
        return jsonify({"response": reply})
    except Exception as exc:
        return jsonify({
            "response": f"Đã có lỗi khi gọi mô hình LLM: {exc}"
        }), 500


@app.route("/api/contact", methods=["POST"])
def contact():
    data = request.get_json(silent=True) or {}
    valid, error_message = validate_contact_payload(data)

    if not valid:
        return jsonify({"response": error_message}), 400

    try:
        send_contact_email(data)
        return jsonify({
            "response": "Đã gửi liên hệ thành công. AIC sẽ phản hồi qua email của bạn khi cần."
        })
    except Exception as exc:
        return jsonify({
            "response": f"Không thể gửi liên hệ lúc này: {exc}"
        }), 500


@app.route("/<path:path>")
def static_files(path: str):
    return send_from_directory(BASE_DIR, path)


if __name__ == "__main__":
    app.run(debug=True, port=5000)
