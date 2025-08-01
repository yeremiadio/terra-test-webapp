import {
  GoogleMap,
  GoogleMapProps,
  useLoadScript,
} from '@react-google-maps/api';
import { ReactNode, forwardRef, useEffect, useRef, useState } from 'react';
import { FiMinus, FiPlus } from 'react-icons/fi';

import { cn } from '@/lib/utils';
import useForwardRef from '@/utils/hooks/useForwardRef';
import googleMapsLibraries from '@/utils/constants/googleMapsLibraries';

const containerStyle = {
  width: '100%',
  height: '100%',
};

const fallbackCenter = {
  lat: -6.175248345105143,
  lng: 106.82706238705833,
};

const removePoiBusiness = [
  {
    featureType: 'poi',
    elementType: 'labels',
    stylers: [{ visibility: 'off' }],
  },
];

interface Props {
  children?: ReactNode;
  /**
   * if `true` zoom control will be small
   */
  enableSmallZoomCtrl?: boolean;
  onLoadedGoogleMaps?: (isLoaded: boolean) => void;
  /**
   * markers the map needs to be aware of. Used for `fitBounds`
   */
  markers?: { lat: number; lng: number }[];
  /**
   * to set max zoom level when fitting bounds
   * @default 15
   */
  maxZoom?: number;
}

export const GoogleMaps = forwardRef<GoogleMap, Props & GoogleMapProps>(
  (
    {
      children,
      center,
      zoom,
      enableSmallZoomCtrl,
      onLoadedGoogleMaps,
      markers,
      options,
      maxZoom = 15,
      ...rest
    },
    forwardRef,
  ) => {
    const ref = useForwardRef<GoogleMap>(forwardRef);
    const prevCenter = useRef(center);

    const [currentZoom, setCurrentZoom] = useState(zoom ?? 10);
    const { isLoaded } = useLoadScript({
      id: 'google-map-script',
      googleMapsApiKey: import.meta.env.VITE_MAPS_API_KEY ?? '',
      libraries: googleMapsLibraries,
    });

    useEffect(() => {
      if (isLoaded && markers && prevCenter.current === center) {
        fitBounds();
      }
    }, [isLoaded, markers, center]);

    const fitBounds = () => {
      const bounds = new window.google.maps.LatLngBounds();
      markers?.forEach((marker) => {
        // sometimes backend return undefined lat and lng
        if (marker?.lat && marker?.lng) {
          bounds?.extend(marker);
        }
      });
      const map = ref.current.state.map;
      if (zoom && markers && markers.length === 1) zoom && map?.setZoom(zoom);
      else {
        map?.setOptions({
          maxZoom,
        });
        map?.fitBounds(bounds);
      }
    };

    useEffect(() => {
      if (isLoaded && onLoadedGoogleMaps) {
        onLoadedGoogleMaps(isLoaded);
      }
    }, [isLoaded, onLoadedGoogleMaps]);

    const handleZoomIn = () => {
      if (currentZoom === 22) return;

      setCurrentZoom(currentZoom + 1);
    };

    const handleZoomOut = () => {
      if (currentZoom === 2) return;

      setCurrentZoom(currentZoom - 1);
    };

    const handleZoomChanged = () => {
      if (!ref?.current?.state.map) return;
      if (ref.current?.state.map?.getZoom() === currentZoom) return;
      setCurrentZoom(ref.current?.state.map?.getZoom() ?? currentZoom);
    };

    return isLoaded ? (
      <GoogleMap
        mapContainerStyle={containerStyle}
        ref={ref}
        options={{
          styles: [...removePoiBusiness],
          disableDefaultUI: true,
          zoomControl: false,
        }}
        center={center ?? fallbackCenter}
        zoom={currentZoom}
        onLoad={markers ? fitBounds : undefined}
        onZoomChanged={handleZoomChanged}
        {...rest}
      >
        {children ?? <></>}
        {/* Custom Zoom Control */}
        <div
          className={cn(
            'absolute bottom-7 right-5 flex flex-col gap-2 rounded-md border border-gray-300 bg-white px-2 py-2 text-gray-900',
            enableSmallZoomCtrl && 'bottom-4 right-4',
          )}
        >
          <button type="button" onClick={handleZoomIn} className="group">
            <FiPlus
              className={cn(
                'transition-all ease-in-out group-hover:scale-[1.15]',
                enableSmallZoomCtrl
                  ? 'text-lg'
                  : 'text-lg sm:text-2xl lg:text-3xl',
              )}
            />
          </button>
          <div className="h-[1px] w-full bg-white" />
          <button type="button" onClick={handleZoomOut} className="group">
            <FiMinus
              className={cn(
                'transition-all ease-in-out group-hover:scale-[1.15]',
                enableSmallZoomCtrl
                  ? 'text-lg'
                  : 'text-lg sm:text-2xl lg:text-3xl',
              )}
            />
          </button>
        </div>
      </GoogleMap>
    ) : (
      <></>
    );
  },
);
