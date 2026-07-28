import { Button } from "../components/ui/Button";
import { PageContainer } from "../components/ui/PageContainer";

export function NotFoundPage() {
  return (
    <PageContainer className="flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <p className="text-sm font-bold text-aic-gold-dark">404</p>
      <h1 className="mt-3 font-display text-4xl font-bold text-aic-navy">Không tìm thấy trang</h1>
      <Button href="/" className="mt-7">
        Về trang chủ
      </Button>
    </PageContainer>
  );
}
