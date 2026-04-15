/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useCallback, useMemo, useState } from 'react';

import { ALARM_DATA, GALLERY_DATA } from './components/dashboard/constants';
import { BackgroundAccents } from './components/dashboard/common';
import type { DashboardActionType } from './components/dashboard/types';
import { CenterDashboardRegion } from './components/regions/CenterDashboardRegion';
import { FloatingActionRegion } from './components/regions/FloatingActionRegion';
import { LeftSidebarRegion } from './components/regions/LeftSidebarRegion';
import { ModalLayer } from './components/regions/ModalLayer';
import { RightAnalysisRegion } from './components/regions/RightAnalysisRegion';
import { TopBarRegion } from './components/regions/TopBarRegion';

export default function App() {
  const [activePointId, setActivePointId] = useState('4');
  const [showImageModal, setShowImageModal] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [confirmModal, setConfirmModal] = useState<{
    show: boolean;
    title: string;
    message: string;
    action: () => void;
  }>({
    show: false,
    title: '',
    message: '',
    action: () => {},
  });

  const handleOpenImageModal = useCallback((slideIdx: number) => {
    setCurrentSlide(slideIdx);
    setShowImageModal(true);
  }, []);
  const handleCloseImageModal = useCallback(() => setShowImageModal(false), []);
  const handlePrevSlide = useCallback(
    () => setCurrentSlide((prev) => (prev > 0 ? prev - 1 : GALLERY_DATA.length - 1)),
    [],
  );
  const handleNextSlide = useCallback(
    () => setCurrentSlide((prev) => (prev < GALLERY_DATA.length - 1 ? prev + 1 : 0)),
    [],
  );

  const handleAction = useCallback((type: DashboardActionType) => {
    if (type === 'abnormal') {
      setConfirmModal({
        show: true,
        title: '确认标记异常',
        message: '是否确认将当前车次标记为“异常车次”？标记后系统将记录异常状态并通知相关人员。',
        action: () => {
          console.log('Marked as abnormal');
          setConfirmModal((prev) => ({ ...prev, show: false }));
        },
      });
    } else if (type === 'end') {
      setConfirmModal({
        show: true,
        title: '确认结束判级',
        message: '是否确认结束当前车次的判级流程？结束后将生成最终判级报告，无法再次修改。',
        action: () => {
          console.log('Grading ended');
          setConfirmModal((prev) => ({ ...prev, show: false }));
        },
      });
    } else if (type === 'leave') {
      setConfirmModal({
        show: true,
        title: '确认中途离开',
        message: '是否确认中途离开当前判级任务？系统将保存当前进度，您可以稍后继续。',
        action: () => {
          console.log('Left midway');
          setConfirmModal((prev) => ({ ...prev, show: false }));
        },
      });
    }
  }, []);

  const sortedAlarms = useMemo(() => {
    const hasTriggered = ALARM_DATA.some((item) => item.system > 0);
    if (hasTriggered) {
      return [...ALARM_DATA].sort((a, b) => b.system - a.system);
    }

    return [...ALARM_DATA].sort((a, b) => {
      if (a.category === 'seal' && b.category === 'return') return -1;
      if (a.category === 'return' && b.category === 'seal') return 1;
      return 0;
    });
  }, []);

  return (
    <div className="h-screen bg-rui-white text-rui-dark font-sans selection:bg-rui-blue/20 overflow-hidden flex flex-col">
      <ModalLayer
        showImageModal={showImageModal}
        currentSlide={currentSlide}
        onPrevSlide={handlePrevSlide}
        onNextSlide={handleNextSlide}
        onCloseImageModal={handleCloseImageModal}
        confirmModal={confirmModal}
        onCancelConfirm={() => setConfirmModal((prev) => ({ ...prev, show: false }))}
      />

      <TopBarRegion activePointId={activePointId} onPointSelect={setActivePointId} />

      <main className="flex-1 grid grid-cols-12 gap-px bg-rui-divider/40 overflow-hidden">
        <LeftSidebarRegion sortedAlarms={sortedAlarms} />
        <CenterDashboardRegion
          activePointId={activePointId}
          onAction={handleAction}
          onImageClick={handleOpenImageModal}
        />
        <RightAnalysisRegion />
      </main>

      <FloatingActionRegion />
      <BackgroundAccents />
    </div>
  );
}
