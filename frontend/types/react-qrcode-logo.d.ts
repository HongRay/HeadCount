declare module 'react-qrcode-logo' {
    import { ComponentType } from 'react';
  
    export interface QRCodeProps {
      value: string;
      size?: number;
      logoImage?: string;
      logoWidth?: number;
      logoHeight?: number;
      logoOpacity?: number;
      ecLevel?: 'L' | 'M' | 'Q' | 'H';
      eyeRadius?: number;
      quietZone?: number;
      bgColor?: string;
      fgColor?: string;
    }
  
    const QRCode: ComponentType<QRCodeProps>;
  
    export default QRCode;
  }
  