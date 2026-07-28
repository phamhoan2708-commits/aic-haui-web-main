# AIC HaUI Website

Khung website React/Vite/TypeScript cho AIC. Nội dung và media chính thức được tích hợp qua `src/content` và `public/media`, không đặt trực tiếp trong component.

## Local development

```powershell
npm install
npm run dev
```

Vite mặc định phục vụ tại `http://localhost:5173`.

## Quality gates

```powershell
npm test
npm run lint
npm run build
npm run format
```

## Docker

```powershell
docker build -t aic-haui-web .
docker run --rm -p 8080:80 aic-haui-web
```

Nginx dùng `try_files ... /index.html`, vì vậy refresh trực tiếp tại route con vẫn chạy đúng SPA.

## Content and media

- Đọc [CONTENT_INTEGRATION.md](docs/CONTENT_INTEGRATION.md) trước khi nhập nội dung.
- Đọc [MEDIA_INTEGRATION.md](docs/MEDIA_INTEGRATION.md) trước khi thêm asset.
- `DESIGN.md` ở root là design contract chuẩn.
- `CODE_PLAN.md` ở root là guardrail triển khai.
- `legacy/` chỉ lưu bản website Flask/static trước migration và không tham gia build.
