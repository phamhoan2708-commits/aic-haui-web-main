# AIC Website Code Plan

Nguồn triển khai: `AIC_CODE_PLAN_v2.1.md`, áp dụng cùng `DESIGN.md` và toàn bộ ảnh trong `screenshots_aic/`.

## Scope

React + Vite + TypeScript + Tailwind, routing, component framework, media slots, responsive behavior, motion nhẹ, empty/hidden state, Docker/Nginx và tài liệu tích hợp.

## Guardrails

- Không bịa người, vai trò, BIO, email, nhóm/kết quả nghiên cứu, đối tác, số liệu, quy trình tuyển dụng, ảnh, video hoặc logo.
- Không thêm mock record vào production runtime.
- Nội dung nghiệp vụ phải nằm trong `src/content`, không nằm trong component.
- Dữ liệu thiếu phải `hidden` ở production hoặc `empty` để QA trong development.
- Không hotlink media và không dùng chân dung AI.
- Chỉ dùng một motion library (`motion`).
- `DESIGN.md` được ưu tiên khi screenshot mâu thuẫn về nav pill, radius, màu và motion.

## Modules

M0 foundation; M1 design system; M2 shell/routes; M3 home; M4 about/organization; M5 research; M6 cooperation; M7 students; M8 contact; M9 effects/responsive; M10 build/docs.
