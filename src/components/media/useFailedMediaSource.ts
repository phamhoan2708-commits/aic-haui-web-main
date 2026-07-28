import { useState } from "react";

export function useFailedMediaSource(src?: string) {
  const [failedSource, setFailedSource] = useState<string>();

  return {
    failed: Boolean(src && failedSource === src),
    handleError: () => {
      if (src) setFailedSource(src);
    },
  };
}
