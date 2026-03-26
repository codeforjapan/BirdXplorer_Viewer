import { useEffect, useRef, useState } from "react";

type Props = {
  src: string;
  title: string;
  sandbox?: string;
  minHeight?: number;
};

/**
 * iframe の高さを中身のコンテンツ高さに合わせて自動調整するコンポーネント。
 * 同一オリジンの iframe (例: /kouchou-ai/...) でのみ動作する。
 * Next.js の非同期レンダリングにも ResizeObserver で追従する。
 */
export function AutoResizeIframe({ src, title, sandbox, minHeight = 400 }: Props) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [height, setHeight] = useState(minHeight);
  const observerRef = useRef<ResizeObserver | null>(null);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    let rafId: ReturnType<typeof requestAnimationFrame>;

    const measureHeight = () => {
      const doc = iframe.contentDocument;
      if (!doc) return;

      // 一度 minHeight まで縮めることで、body/html の min-height:100vh 等が
      // scrollHeight を底上げするのを防ぎ、コンテンツ本来の高さを計測する
      iframe.style.height = `${minHeight}px`;

      const newHeight = Math.max(
        doc.documentElement.scrollHeight,
        doc.body?.scrollHeight ?? 0,
        minHeight,
      );

      // DOM に即反映（フリッカー防止）し、React state も同期
      iframe.style.height = `${newHeight}px`;
      setHeight(newHeight);
    };

    const handleLoad = () => {
      const doc = iframe.contentDocument;
      if (!doc) return;

      observerRef.current?.disconnect();
      measureHeight();

      // コンテンツ内部の動的変化（アコーディオン等）を検知
      const observer = new ResizeObserver(measureHeight);
      observer.observe(doc.documentElement);
      if (doc.body) observer.observe(doc.body);
      observerRef.current = observer;
    };

    // iframe 要素自体のリサイズ（ブラウザ幅変更等）を検知し、
    // コンテンツのリフロー完了後に計測する
    const iframeObserver = new ResizeObserver(() => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(measureHeight);
    });
    iframeObserver.observe(iframe);

    iframe.addEventListener("load", handleLoad);

    // すでにロード済みの場合（キャッシュ等）は即時実行
    if (iframe.contentDocument?.readyState === "complete") {
      handleLoad();
    }

    return () => {
      cancelAnimationFrame(rafId);
      iframe.removeEventListener("load", handleLoad);
      iframeObserver.disconnect();
      observerRef.current?.disconnect();
    };
  }, [src, minHeight]);

  return (
    <iframe
      height={height}
      ref={iframeRef}
      sandbox={sandbox}
      src={src}
      style={{ display: "block" }}
      title={title}
      width="100%"
    />
  );
}
