import { memo } from 'react';
import { AlertTriangle, BarChart3, ChevronRight, Maximize2, Package } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

import { GALLERY_DATA, MATERIAL_DATA, THICKNESS_DATA } from '../dashboard/constants';
import type { DetailModalType } from '../dashboard/types';

interface ConfirmModalState {
  show: boolean;
  title: string;
  message: string;
  action: () => void;
}

const DetailsModal = memo(
  ({
    detailType,
    onClose,
  }: {
    detailType: DetailModalType | null;
    onClose: () => void;
  }) => (
  <AnimatePresence>
    {detailType && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-rui-overlay/95 backdrop-blur-xl p-8 overflow-y-auto"
      >
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-10">
            <div className="flex items-center gap-4">
              <div className="w-1 h-10 bg-rui-blue rounded-full" />
              <h2 className="text-4xl font-display font-medium text-rui-dark tracking-[-0.04em]">
                {detailType === 'thickness' ? '厚度占比详情' : '料型占比详情'}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-3 hover:bg-rui-surface rounded-[12px] border border-rui-divider/60 transition-colors"
            >
              <Maximize2 className="w-8 h-8 text-rui-slate rotate-45" />
            </button>
          </div>

          {detailType === 'thickness' ? (
            <div className="bg-rui-surface p-8 rounded-[20px] border border-rui-divider/60">
              <div className="flex items-center gap-3 mb-8">
                <BarChart3 className="w-5 h-5 text-rui-blue" />
                <span className="text-lg font-display font-medium text-rui-dark uppercase tracking-wider">
                  厚度占比详情
                </span>
              </div>
              <div className="space-y-8">
                {THICKNESS_DATA.map((item) => (
                  <div key={item.name} className="space-y-3">
                    <div className="flex justify-between items-end gap-6">
                      <div className="flex flex-1 items-center gap-3">
                        <div className="px-3 py-1 rounded-[9999px] bg-rui-surface-strong text-xs font-display font-medium text-rui-dark border border-rui-divider/60">
                          {item.name}
                        </div>
                        <div className="h-1.5 flex-1 bg-rui-divider/25 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{ width: `${item.value}%`, backgroundColor: item.color }}
                          />
                        </div>
                      </div>
                      <span className="text-2xl font-display font-medium text-rui-blue">
                        {item.value}%
                      </span>
                    </div>
                    {item.subItems && (
                      <div className="grid grid-cols-2 gap-4 pl-4 border-l-2 border-rui-divider/30">
                        {item.subItems.map((sub) => (
                          <div key={sub.name} className="flex justify-between items-center">
                            <span className="text-xs text-rui-slate font-sans">{sub.name}</span>
                            <span className="text-xs font-display font-medium text-rui-dark">
                              {sub.value}%
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-rui-surface p-8 rounded-[20px] border border-rui-divider/60">
              <div className="flex items-center gap-3 mb-8">
                <Package className="w-5 h-5 text-rui-blue" />
                <span className="text-lg font-display font-medium text-rui-dark uppercase tracking-wider">
                  更多料型分布
                </span>
              </div>
              <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                {MATERIAL_DATA.map((item) => (
                  <div
                    key={item.name}
                    className="flex items-center gap-3 bg-rui-surface-strong p-3 rounded-[20px] border border-rui-divider/60"
                  >
                    <div
                      className="h-10 w-1.5 rounded-full shrink-0"
                      style={{ backgroundColor: item.color }}
                    />
                    <div className="flex-1">
                      <div className="flex justify-between mb-1.5">
                        <span className="text-xs font-display font-medium text-rui-dark">
                          {item.name}
                        </span>
                        <span className="text-xs font-display font-medium text-rui-blue">
                          {item.value}%
                        </span>
                      </div>
                      <div className="h-1 w-full bg-rui-divider/20 rounded-full overflow-hidden">
                        <div
                          className="h-full"
                          style={{ width: `${item.value}%`, backgroundColor: item.color }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    )}
  </AnimatePresence>
));

DetailsModal.displayName = 'DetailsModal';

const ConfirmationModal = memo(
  ({
    show,
    title,
    message,
    onConfirm,
    onCancel,
  }: {
    show: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
  }) => (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-rui-overlay/78 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-rui-surface p-8 rounded-[20px] max-w-sm w-full border border-rui-divider/70"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-[12px] bg-rui-warning/10 text-rui-warning border border-rui-warning/20">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-display font-medium text-rui-dark tracking-tight">{title}</h3>
            </div>
            <p className="text-[14px] text-rui-slate mb-8 leading-relaxed font-sans">{message}</p>
            <div className="flex gap-3">
              <button
                onClick={onCancel}
                className="btn-pill flex-1 px-4 py-2.5 bg-rui-surface-strong border-rui-divider/60 text-rui-dark hover:bg-rui-surface-soft"
              >
                取消
              </button>
              <button
                onClick={onConfirm}
                className="btn-pill flex-1 px-4 py-2.5 bg-rui-blue text-rui-dark hover:bg-rui-action-blue"
              >
                确认执行
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  ),
);

ConfirmationModal.displayName = 'ConfirmationModal';

const ImageCarouselModal = memo(
  ({
    show,
    currentSlide,
    onPrev,
    onNext,
    onClose,
  }: {
    show: boolean;
    currentSlide: number;
    onPrev: () => void;
    onNext: () => void;
    onClose: () => void;
  }) => (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[110] bg-rui-overlay/90 backdrop-blur-2xl flex items-center justify-center p-12"
        >
          <button
            onClick={onClose}
            className="absolute top-12 right-12 p-4 bg-rui-surface rounded-[12px] border border-rui-divider/60 hover:bg-rui-surface-strong transition-colors z-20"
          >
            <Maximize2 className="w-8 h-8 text-rui-slate rotate-45" />
          </button>

          <div className="relative w-full max-w-6xl aspect-[16/10] flex items-center gap-10">
            <button
              onClick={onPrev}
              className="p-6 bg-rui-surface-strong rounded-[20px] border border-rui-divider/60 hover:bg-rui-surface transition-all group"
            >
              <ChevronRight className="w-10 h-10 text-rui-slate group-hover:text-rui-blue rotate-180" />
            </button>

            <div className="flex-1 h-full bg-rui-surface rounded-[20px] overflow-hidden p-6 border border-rui-divider/60">
              <div className="grid grid-cols-2 grid-rows-2 gap-6 h-full">
                {GALLERY_DATA[currentSlide].images.map((src, idx) => (
                  <div
                    key={idx}
                    className="relative rounded-[20px] overflow-hidden border border-rui-divider/40 group aspect-video"
                  >
                    <img
                      src={src}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      referrerPolicy="no-referrer"
                      loading="lazy"
                    />
                    <div className="absolute top-3 left-3 px-3 py-1 bg-rui-overlay/80 rounded-[9999px] text-[10px] text-rui-dark font-display font-medium uppercase tracking-wider">
                      VIEW_0{idx + 1}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={onNext}
              className="p-6 bg-rui-surface-strong rounded-[20px] border border-rui-divider/60 hover:bg-rui-surface transition-all group"
            >
              <ChevronRight className="w-10 h-10 text-rui-slate group-hover:text-rui-blue" />
            </button>

            <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 flex items-center gap-6">
              <span className="text-[12px] font-display font-medium text-rui-slate tracking-widest uppercase">
                Batch {currentSlide + 1} / {GALLERY_DATA.length}
              </span>
              <div className="flex gap-2">
                {GALLERY_DATA.map((_, idx) => (
                  <div
                    key={idx}
                    className={`h-1.5 transition-all rounded-full ${idx === currentSlide ? 'w-12 bg-rui-blue' : 'w-3 bg-rui-divider'}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  ),
);

ImageCarouselModal.displayName = 'ImageCarouselModal';

interface ModalLayerProps {
  detailType: DetailModalType | null;
  onCloseDetails: () => void;
  showImageModal: boolean;
  currentSlide: number;
  onPrevSlide: () => void;
  onNextSlide: () => void;
  onCloseImageModal: () => void;
  confirmModal: ConfirmModalState;
  onCancelConfirm: () => void;
}

export const ModalLayer = memo(
  ({
    detailType,
    onCloseDetails,
    showImageModal,
    currentSlide,
    onPrevSlide,
    onNextSlide,
    onCloseImageModal,
    confirmModal,
    onCancelConfirm,
  }: ModalLayerProps) => (
    <>
      <DetailsModal detailType={detailType} onClose={onCloseDetails} />
      <ImageCarouselModal
        show={showImageModal}
        currentSlide={currentSlide}
        onPrev={onPrevSlide}
        onNext={onNextSlide}
        onClose={onCloseImageModal}
      />
      <ConfirmationModal
        show={confirmModal.show}
        title={confirmModal.title}
        message={confirmModal.message}
        onConfirm={confirmModal.action}
        onCancel={onCancelConfirm}
      />
    </>
  ),
);

ModalLayer.displayName = 'ModalLayer';
