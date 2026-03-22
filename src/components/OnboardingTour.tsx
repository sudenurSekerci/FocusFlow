import { useEffect, useState, useCallback } from 'react';

const STORAGE_KEY = 'focusflow-tour-completed';

const TOUR_STEPS: ReadonlyArray<{
  target: string;
  fallbackTarget?: string;
  title: string;
  content: string;
}> = [
  {
    target: '[data-tour="task-form"]',
    title: 'Görev Ekleme Formu',
    content:
      'Buradan yeni görev ekleyebilirsin. Başlık, açıklama, önem ve aciliyet seviyesini belirle. Süre alanından Pomodoro dakikasını yaz (boş bırakırsan 25 dk kullanılır). Önem ve aciliyet, görevin listede nerede görüneceğini belirler.',
  },
  {
    target: '[data-tour="stats-panel"]',
    title: 'İstatistik Paneli',
    content:
      'Toplam görev sayısı, tamamlananlar, ilerleme yüzdesi ve acil görev sayısını burada görürsün. Verimliliğini takip etmek için kullan.',
  },
  {
    target: '[data-tour="filters"]',
    title: 'Filtreleme (İki Boyutlu)',
    content:
      'Görevler iki filtreyle birlikte listelenir: Durum (Tümü, Yapılacak, Devam Ediyor, Tamamlandı) ve Aciliyet (Tümü, Acil, Orta, Düşük). Örn. "Tamamlandı" + "Acil" seçerek sadece acil tamamlanan görevleri görebilirsin.',
  },
  {
    target: '[data-tour="task-list"]',
    title: 'Listeleme Nasıl Çalışır?',
    content:
      'Görevler önce önceliğe (önem × aciliyet), sonra duruma göre sıralanır. Yüksek öncelikli görevler üstte, her grupta devam edenler en başta gelir. Sayaç başlattığında görevin "Devam Ediyor" olması, kendi öncelik grubunda biraz yukarı kaymasına neden olabilir — bu beklenen bir davranıştır, görev sadece kendi grubunda hareket eder.',
  },
  {
    target: '[data-tour="task-card"]',
    fallbackTarget: '[data-tour="task-list"]',
    title: 'Görev Kartı',
    content:
      'Her karttan Pomodoro sayacını başlatabilir, görevi düzenleyebilir veya tamamlayabilirsin. Sayaç bitince görev otomatik tamamlanır. Duraklatınca süre korunur. Henüz görev yoksa önce sol panelden ekle.',
  },
];

export function wasTourCompleted(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'true';
  } catch {
    return false;
  }
}

export function setTourCompleted(): void {
  try {
    localStorage.setItem(STORAGE_KEY, 'true');
  } catch {
    // ignore
  }
}

type OnboardingTourProps = {
  isActive: boolean;
  onComplete: () => void;
};

const TOOLTIP_EST_HEIGHT = 340;
const PADDING = 16;

function getTooltipStyle(targetRect: DOMRect): { top: number; left: number } {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const tooltipWidth = 320;

  const spaceRight = vw - targetRect.right - PADDING;
  const spaceLeft = targetRect.left - PADDING;
  const spaceBelow = vh - targetRect.bottom - PADDING;
  const spaceAbove = targetRect.top - PADDING;

  let top: number;
  let left: number;

  if (spaceRight >= tooltipWidth + PADDING && targetRect.left < vw / 2) {
    left = targetRect.right + PADDING;
    top = Math.max(
      PADDING,
      Math.min(targetRect.top, vh - TOOLTIP_EST_HEIGHT - PADDING)
    );
  } else if (spaceLeft >= tooltipWidth + PADDING && targetRect.right > vw / 2) {
    left = targetRect.left - tooltipWidth - PADDING;
    top = Math.max(
      PADDING,
      Math.min(targetRect.top, vh - TOOLTIP_EST_HEIGHT - PADDING)
    );
  } else {
    if (spaceBelow >= TOOLTIP_EST_HEIGHT) {
      top = targetRect.bottom + PADDING;
    } else if (spaceAbove >= TOOLTIP_EST_HEIGHT) {
      top = targetRect.top - PADDING - TOOLTIP_EST_HEIGHT;
    } else {
      top = Math.max(PADDING, (vh - TOOLTIP_EST_HEIGHT) / 2);
    }
    top = Math.max(PADDING, Math.min(top, vh - TOOLTIP_EST_HEIGHT - PADDING));

    const centerX = targetRect.left + targetRect.width / 2;
    left = centerX - tooltipWidth / 2;
    left = Math.max(PADDING, Math.min(left, vw - tooltipWidth - PADDING));
  }

  return { top, left };
}

export function OnboardingTour({ isActive, onComplete }: OnboardingTourProps) {
  const [step, setStep] = useState(0);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const [tooltipStyle, setTooltipStyle] = useState<{ top: number; left: number } | Record<string, string>>({});

  const updateTargetRect = useCallback(() => {
    const config = TOUR_STEPS[step];
    const el =
      document.querySelector(config.target) ||
      (config.fallbackTarget
        ? document.querySelector(config.fallbackTarget)
        : null);
    if (el) {
      el.scrollIntoView({ behavior: 'auto', block: 'center' });
      const rect = el.getBoundingClientRect();
      setTargetRect(rect);
      setTooltipStyle(getTooltipStyle(rect));
    } else {
      setTargetRect(null);
      setTooltipStyle({});
    }
  }, [step]);

  useEffect(() => {
    if (!isActive) return;
    const timer = setTimeout(updateTargetRect, 100);
    window.addEventListener('resize', updateTargetRect);
    window.addEventListener('scroll', updateTargetRect, true);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', updateTargetRect);
      window.removeEventListener('scroll', updateTargetRect, true);
    };
  }, [isActive, step, updateTargetRect]);

  useEffect(() => {
    if (isActive) {
      setStep(0);
    }
  }, [isActive]);

  const handleNext = () => {
    if (step >= TOUR_STEPS.length - 1) {
      setTourCompleted();
      onComplete();
    } else {
      setStep((s) => s + 1);
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep((s) => s - 1);
    }
  };

  const handleFinish = () => {
    setTourCompleted();
    onComplete();
  };

  if (!isActive) return null;

  const currentStep = TOUR_STEPS[step];
  const isFirst = step === 0;
  const isLast = step === TOUR_STEPS.length - 1;

  return (
    <div
      className="tour-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="tour-title"
      aria-describedby="tour-content"
    >
      {targetRect && (
        <div
          className="tour-spotlight"
          style={{
            top: targetRect.top - 8,
            left: targetRect.left - 8,
            width: targetRect.width + 16,
            height: targetRect.height + 16,
          }}
        />
      )}

      <div
        className="tour-tooltip"
        style={targetRect ? tooltipStyle : { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
      >
        <div className="tour-tooltip__inner">
          <h3 id="tour-title" className="tour-tooltip__title">
            {currentStep.title}
          </h3>
          <p id="tour-content" className="tour-tooltip__content">
            {currentStep.content}
          </p>
          <div className="tour-tooltip__actions">
            {!isFirst && (
              <button
                type="button"
                className="tour-tooltip__btn tour-tooltip__btn--back"
                onClick={handleBack}
              >
                Geri
              </button>
            )}
            {!isLast && (
              <button
                type="button"
                className="tour-tooltip__btn tour-tooltip__btn--primary"
                onClick={handleNext}
              >
                İleri
              </button>
            )}
            <button
              type="button"
              className="tour-tooltip__btn tour-tooltip__btn--finish"
              onClick={handleFinish}
            >
              Turu Bitir
            </button>
          </div>
          <div className="tour-tooltip__progress">
            {step + 1} / {TOUR_STEPS.length}
          </div>
        </div>
      </div>
    </div>
  );
}
