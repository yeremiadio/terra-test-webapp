import { FC, useEffect, useState } from 'react';
import {
  OverlayView,
  OverlayViewF,
  OverlayViewProps,
} from '@react-google-maps/api';
import { MdOutlineCheckCircle } from 'react-icons/md';

import { cn } from '@/lib/utils';

type Props = {
  isOverThreshold?: boolean;
  children?: React.ReactNode;
  isActive?: boolean;
  useBigMarker?: boolean;
  isWarning?: boolean;
  isConfirmedAlert?: boolean;
  className?: string;
  forceShowDetail?: boolean;
  useBigMarkerOnShowDetail?: boolean;
  additionalAction?: () => void;
};

export const PointMarker: FC<Props & Partial<OverlayViewProps>> = ({
  position,
  children,
  isOverThreshold,
  isActive = true,
  useBigMarker = false,
  isWarning,
  isConfirmedAlert,
  className,
  forceShowDetail,
  useBigMarkerOnShowDetail = false,
  additionalAction,
}) => {
  const [showDetail, setShowDetail] = useState(false);

  const handleClickMarker = () => {
    setShowDetail((prev) => !prev);

    if (additionalAction) {
      additionalAction();
    }
  };

  useEffect(() => {
    if (typeof forceShowDetail === 'boolean') {
      setShowDetail(forceShowDetail);
    }
  }, [forceShowDetail]);

  return (
    <OverlayViewF
      position={position}
      mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
    >
      <div
        className={cn(
          `animate-ping bg-green-500`,
          'absolute h-3 w-3 rounded-full',
          useBigMarker && 'h-5 w-5',
          useBigMarkerOnShowDetail && showDetail && 'h-5 w-5',
          isWarning && 'bg-yellow-600',
          isOverThreshold && 'bg-red-600',
          !isActive && 'bg-gray-400',
        )}
      />
      <div
        className={cn(
          'relative flex h-3 w-3 cursor-pointer items-center justify-center rounded-full bg-green-600 transition-all ease-in-out',
          isWarning && 'bg-yellow-600',
          isOverThreshold && 'bg-red-600',
          !isActive && 'bg-gray-400',
          showDetail &&
            'border-[1px] border-white shadow-[0_0_16px_rgba(255,255,255,.7)]',
          useBigMarker && 'h-5 w-5',
          useBigMarkerOnShowDetail && showDetail && 'h-5 w-5',
          className,
        )}
        onClick={handleClickMarker}
      >
        {!!isActive && isConfirmedAlert && (
          <MdOutlineCheckCircle
            className={cn(
              useBigMarker && 'h-5 w-5',
              !useBigMarker && 'h-3 w-3',
            )}
          />
        )}
        {showDetail && children}
      </div>
    </OverlayViewF>
  );
};
