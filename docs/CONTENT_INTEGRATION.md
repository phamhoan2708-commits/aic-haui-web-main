# Content Integration

## Runtime hiện tại

`src/content/site.ts` xuất `siteContent` theo type `SiteContent`. Runtime hiện tại ghép hai nguồn:

- `src/content/verified.ts`: thông tin AIC đã xác minh, gồm nhận diện, đơn vị chủ quản, địa chỉ, email và tên hai lab.
- `src/content/stitch.ts`: bản ghi demo lấy từ Stitch để hoàn thiện bố cục prototype. Mỗi bản ghi demo có `source: "stitch"`.

Không coi người, chức danh, số liệu, nhóm nghiên cứu, đối tác hoặc tuyên bố trong Stitch là dữ liệu AIC đã xác minh. `src/content/empty.ts` chỉ phục vụ test/scaffold, không phải runtime production.

## Cơ chế merge verified-first

`composeSiteContent(verified, demo)` trong `src/content/site.ts` dùng pure helper `mergeRecordsById` cho people, council, directions, metrics, results, groups, activities, toàn bộ collection cooperation, partners, labs và join steps.

- Bản ghi verified trùng `id` thay thế toàn bộ bản ghi Stitch tại đúng vị trí của bản ghi Stitch.
- Bản ghi chỉ có trong Stitch được giữ nguyên.
- Bản ghi chỉ có trong verified được nối vào cuối collection, theo thứ tự trong collection verified.
- Với collection thông thường, runtime guard chỉ chấp nhận record có `source: "verified"`; record không có provenance sẽ không thay thế hoặc được nối vào runtime.
- Helper tạo object/array mới và không mutate hai nguồn đầu vào.
- `identity`, `about`, `contact`, `cooperation.contactHref` và `students.contactHref` luôn lấy từ verified.

Riêng hai lab hiện tại trong `verifiedSiteContent` chỉ là overlay tên đã xác minh, chưa phải record đầy đủ. Overlay không có `source` chỉ được ghép lên record Stitch cùng `id` và giữ `source: "stitch"`; source-less lab không trùng `id` sẽ không được công bố. Một lab chỉ được thay hoàn toàn hoặc nối mới khi record verified có đầy đủ field cần công bố và `source: "verified"`.

## Thay bản ghi Stitch bằng dữ liệu đã xác minh

Ví dụ thay một người có cùng `id`:

1. Xác minh toàn bộ field với đầu mối nội dung và quyền sử dụng media.
2. Thêm một record hoàn chỉnh vào collection tương ứng trong `verifiedSiteContent`, giữ cùng `id` và đặt `source: "verified"`.
3. Không cần xóa record Stitch cùng `id`: `composeSiteContent` tự thay bằng record verified và giữ vị trí hiện tại.
4. Nếu dùng `id` mới, record verified được nối cuối collection.
5. Cập nhật test nguồn/số lượng. Không sửa page, component hoặc JSX.

Mẫu ghép an toàn cho một collection:

```ts
people: mergeRecordsById(
  verifiedSiteContent.people,
  stitchContent.people,
  clonePerson,
),
```

Không đổi `source` ngay trong `src/content/stitch.ts`; type `StitchContent` cố ý buộc literal `"stitch"` để tránh gắn nhãn sai nguồn. Partial record không có `source: "verified"` không được xem là thay thế hoàn chỉnh.

## Quy tắc dữ liệu

- Không đưa copy nghiệp vụ vào `src/components` hoặc `src/pages`.
- Không thêm tên giả, số liệu ước đoán, link chưa duyệt hoặc record tạm ngoài dataset Stitch đã ghi nguồn.
- Email nằm trong config; link dùng dạng `mailto:`.
- `cooperation.enterprise`, `research`, `international`, `technologyTransfer` và `partners` là các collection độc lập.
- Lab có thể chỉ có `id` và `name`; mô tả, ảnh, hoạt động và lợi ích là optional.
- `contact.mapUrl` chỉ được thêm vào `verifiedSiteContent` sau khi URL embed đã được kiểm tra. Nếu thiếu URL này, runtime dùng semantic media ID `contact.map`; nếu manifest cũng chưa có `embedUrl` hoặc `src`, một media slot trung tính giữ nguyên tỷ lệ sẽ hiển thị.
- CTA chỉ render khi có `contactHref` hợp lệ.

## Scaffold và section rỗng

- `VITE_UI_SCAFFOLD_MODE=true` hiển thị shell trung tính để QA bố cục; `false` là cấu hình production.
- Scaffold không có chữ placeholder/demo, record giả, ảnh giả hoặc số liệu công khai.
- Mảng rỗng bị ẩn ở production theo selector của section tương ứng.
- Media semantic chưa có file vẫn giữ tỷ lệ cuối, nhưng không hiển thị wording thay thế.

## Kiểm tra

1. Chạy `npm.cmd test`, `npm.cmd run lint` và `npm.cmd run build`.
2. Kiểm tra record verified hoàn chỉnh có `source: "verified"`; bản ghi runtime cùng `id` phải giữ provenance này dù record demo vẫn còn trong `stitchContent`.
3. Kiểm tra desktop 1440px, tablet 768px và mobile 320px.
4. Xác nhận tên, chức vụ, BIO, email, số liệu và liên kết đều có bằng chứng phê duyệt.
5. Xác nhận không cần thay đổi JSX khi chỉ thay content hoặc media manifest.
