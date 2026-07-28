# Media Integration

## Thư mục và manifest

- `public/media/official/`: chỉ chứa asset AIC/HaUI đã xác minh, được phép dùng production.
- `public/media/prototype/`: chỉ chứa asset QA cục bộ; production content không được tham chiếu thư mục này.
- `src/content/assets.ts`: manifest semantic duy nhất cho media runtime.

Path public luôn bắt đầu bằng `/media/`, ví dụ `/media/official/home-hero.webp`. Không import trực tiếp từ `legacy/` và không đặt URL ảnh/video ngoài repo vào content.

## Semantic IDs, định dạng và tỷ lệ

| Nhóm             | Semantic ID                                                                  | Tỷ lệ hiển thị                     | File production                                        |
| ---------------- | ---------------------------------------------------------------------------- | ---------------------------------- | ------------------------------------------------------ |
| Logo AIC         | `brand.aic.logo`                                                             | 1:1                                | SVG hoặc WebP/JPG nền trong suốt/sạch, 512-1024px      |
| Home hero        | `home.hero`                                                                  | 4:3 slot; ảnh được cover toàn hero | WebP 1600x1200 hoặc WebM/MP4, có poster WebP 1600x1200 |
| Video giới thiệu | `about.intro-video`                                                          | 16:9                               | WebM hoặc MP4, poster WebP 1600x900                    |
| Chân dung        | 12 ID cụ thể trong danh sách đầy đủ bên dưới                                 | 4:5                                | WebP 800x1000                                          |
| Hướng nghiên cứu | `research-computer-vision`, `research-natural-language`, `research-robotics` | 4:3                                | WebP 1200x900                                          |
| Nhóm nghiên cứu  | 7 ID cụ thể trong danh sách đầy đủ bên dưới                                  | 4:3                                | WebP 1200x900                                          |
| Lab sinh viên    | `students.foundry`, `students.innovation`                                    | 4:3                                | WebP 1200x900                                          |
| Split hero       | `cooperation.hero`, `students.hero`                                          | 4:3                                | WebP 1600x1200                                         |
| Logo đối tác     | 8 ID cụ thể trong danh sách đầy đủ bên dưới                                  | 3:2, `object-contain`              | SVG ưu tiên hoặc WebP 900x600                          |
| Bản đồ           | `contact.map`                                                                | 16:9                               | `embedUrl` đã xác minh hoặc WebP 1600x900              |

Giữ đúng `aspectRatio` đã khai báo trong manifest để tránh layout shift. Ảnh có ý nghĩa phải có `alt` đã duyệt; media trang trí dùng `alt: ""`. Không dùng chân dung AI, stock ngẫu nhiên hoặc logo tự tạo.

### Danh sách semantic ID đầy đủ

```text
brand.aic.logo
home.hero
about.intro-video
person-tran-thi-an
person-nguyen-hop
person-le-cuong
person-hong-lan
person-thay-ha
person-manh-hung
person-dong-hung
person-nha
person-nien
person-long-nhat
person-bao
person-quan
research-computer-vision
research-natural-language
research-robotics
research-group-computer-vision-lab
research-group-nlp-lab
research-group-robotics-lab
research-group-data-science-lab
research-group-applied-ai-lab
research-group-iot-ai-lab
research-group-ai-ethics-lab
students.foundry
students.innovation
cooperation.hero
students.hero
partner.logo-1
partner.logo-2
partner.logo-3
partner.logo-4
partner.logo-5
partner.logo-6
partner.logo-7
partner.logo-8
contact.map
```

## Thay media

Thêm file vào `public/media/official/`, sau đó điền đúng semantic record trong `mediaManifest`:

```ts
"research-computer-vision": {
  id: "research-computer-vision",
  kind: "image",
  aspectRatio: "aspect-[4/3]",
  src: "/media/official/research-computer-vision.webp",
  alt: "Nhóm nghiên cứu thị giác máy tính tại AIC",
},
```

Video có thể thêm `poster`; bản đồ có thể thêm `embedUrl`. Không đổi semantic `id` hoặc tỷ lệ nếu layout đã được duyệt.

Chỉ `home.hero` hỗ trợ cả ảnh và video trong contract hiện tại. `DynamicHero` đọc `kind`, `src` và `poster`; khi reduced motion được bật, video home hero không autoplay. Khi dùng ảnh, đặt `kind: "image"` cùng `src` WebP. Khi dùng video, đổi cùng record sang `kind: "video"`, thêm `src` WebM/MP4 và `poster` WebP trong một thay đổi manifest.

Các split slot `cooperation.hero` và `students.hero` đi qua `HeroMedia` và vẫn là `kind: "image"`. Không đổi hai ID này sang video nếu chưa có thay đổi component, playback và accessibility contract riêng. `about.intro-video` đi qua `VideoFrame`, có controls và không dùng hành vi autoplay của home hero.

## Khi chưa có asset

- Semantic record vẫn tồn tại nhưng không có `src`, `poster` hoặc `embedUrl`.
- Runtime render `.prototype-media-slot` với tỷ lệ cuối và nền lưới/linear academic-tech tĩnh.
- Slot không có chữ placeholder/demo, không có orb/bokeh, không animation và được `aria-hidden` khi hoàn toàn trang trí.
- Video, ảnh, map và partner slot dùng cùng contract nên kích thước không đổi khi file thật được bổ sung.
- Nhãn `Logo 1` đến `Logo 8` là dữ liệu demo có nguồn từ Stitch, không phải wording do media slot sinh ra.

## Map fallback

`verifiedSiteContent.contact.mapUrl` có ưu tiên cao nhất khi đã được xác minh. Nếu không có `mapUrl`, `ContactPage` resolve `contact.map`: `embedUrl` trước, `src` ảnh sau, cuối cùng là slot 16:9 tĩnh. Không dùng URL bản đồ chưa duyệt và không cần sửa JSX khi chuyển giữa ba trạng thái này.

## Kiểm tra asset

1. Xác nhận file nằm trong `public/media/official/`, tên file ổn định và path phân biệt hoa/thường chính xác.
2. Kiểm tra tỷ lệ, crop, dung lượng, quyền sử dụng và `alt`.
3. Chạy `npm.cmd test`, `npm.cmd run build` và QA tại 1440px, 768px, 375px, 320px.
4. Bật reduced motion để xác nhận video hero không autoplay và marquee/grid không chuyển động.
