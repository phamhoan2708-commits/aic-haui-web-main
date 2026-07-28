# Huong dan deploy len Vercel

Day la bo file toi thieu de ban upload len Vercel va chay duoc website blog AIC kem chatbot.

## 1. Cac file can co trong project root

- `app.py`
- `index.html`
- `style.css`
- `main.js`
- `logoaic.jpg`
- `vercel.json`
- `requirements.txt`

Thu muc `aic-blog-chatbot` khong can cho ban deploy nay. Ban co the de nguyen, nhung neu muon project gon hon thi co the khong upload thu muc do.

## 2. Cach upload len Vercel

### Cach 1: Upload truc tiep

1. Nen hoac chon toan bo cac file o muc `1`.
2. Vao [Vercel](https://vercel.com/).
3. Chon `Add New Project`.
4. Upload thu muc `D:\Web_Blog_HaUI` hoac mot ban copy chi chua cac file can thiet.

### Cach 2: Dua len GitHub roi import vao Vercel

1. Tao repo moi tren GitHub.
2. Day cac file o muc `1` len repo.
3. Tren Vercel, chon `Import Git Repository`.
4. Chon repo vua tao.

## 3. Bien moi truong bat buoc neu muon chatbot LLM hoat dong that

Trong phan `Environment Variables` cua Vercel, tao:

- `GROQ_API_KEY` = API key Groq cua ban

Neu khong co bien nay:

- Website van mo duoc.
- Chatbot van hien giao dien.
- Nhung chatbot se chi dung cau tra loi du phong, khong goi LLM that.

## 4. Bien moi truong neu muon gui form lien he ma khong lo email ra frontend

De form lien he gui duoc email an toan qua backend, them cac bien:

- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_USERNAME`
- `SMTP_PASSWORD`
- `SMTP_FROM_EMAIL`
- `CONTACT_RECEIVER_EMAIL`

Tuy chon:

- `SMTP_USE_TLS` = `true` hoac `false`
- `SMTP_USE_SSL` = `true` hoac `false`

Khuyen nghi thong dung:

- Gmail SMTP:
  - `SMTP_HOST=smtp.gmail.com`
  - `SMTP_PORT=587`
  - `SMTP_USE_TLS=true`
  - `SMTP_USE_SSL=false`

Neu dung Gmail, ban nen dung App Password thay vi mat khau thuong.

Sau khi them hoac sua bien moi truong, can redeploy de thay doi co hieu luc.

## 5. Project nay chay nhu the nao tren Vercel

- `app.py` la entrypoint Python Flask.
- `vercel.json` cau hinh Vercel route tat ca request qua `app.py`.
- `requirements.txt` bao Vercel cai dung thu vien Python.
- `index.html`, `style.css`, `main.js`, `logoaic.jpg` duoc Flask phuc vu dang static files.
- API chat nam tai endpoint: `/api/chat`
- API form lien he nam tai endpoint: `/api/contact`

## 6. Sau khi deploy xong can test

1. Mo trang chu.
2. Kiem tra logo, CSS va JS da tai dung.
3. Thu gui 1 cau hoi trong chatbot.
4. Thu gui 1 form lien he.
5. Neu chatbot khong tra loi bang LLM:
   - Kiem tra `GROQ_API_KEY`
   - Kiem tra deployment logs tren Vercel
6. Neu form lien he khong gui duoc:
   - Kiem tra cac bien `SMTP_*`
   - Kiem tra `CONTACT_RECEIVER_EMAIL`
   - Kiem tra deployment logs tren Vercel

## 7. Neu ban muon tao ban upload gon nhat

Ban chi can tao mot thu muc moi va copy vao do cac file sau:

```text
app.py
index.html
style.css
main.js
logoaic.jpg
vercel.json
requirements.txt
```

Do la bo toi thieu de deploy.

## 8. Ghi chu quan trong

- Hien tai project root nay da du file de deploy.
- Neu ban muon, minh co the tao tiep cho ban mot thu muc moi, vi du `vercel-ready`, chi chua dung bo file toi thieu de ban nen va upload ngay.
