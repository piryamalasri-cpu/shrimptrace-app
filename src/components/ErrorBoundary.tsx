import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: undefined });
    if (this.props.onReset) {
      this.props.onReset();
    } else {
      window.location.reload();
    }
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="shrimp-card p-6 bg-[#FFFEFB] border-2 border-rose-300 rounded-[28px] shadow-lg text-center max-w-[460px] mx-auto my-6 animate-fadeIn">
          <div className="w-16 h-16 rounded-full bg-rose-100 border border-rose-300 flex items-center justify-center mx-auto mb-3 text-rose-600">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-black text-[#1A2B33] mb-1">
            {this.props.fallbackTitle || 'เกิดข้อผิดพลาดในการแสดงผล'}
          </h3>
          <p className="text-xs text-[#1A2B33]/70 mb-5 leading-relaxed">
            ระบบกำลังกู้คืนข้อมูลเพื่อความปลอดภัย กรุณากดปุ่มด้านล่างเพื่อโหลดใหม่
          </p>
          <button
            onClick={this.handleReset}
            className="w-full h-14 bg-[#FF7A1A] hover:bg-[#E65800] text-white font-black text-base rounded-2xl shadow-md shadow-[#FF7A1A]/30 flex items-center justify-center gap-2 active:scale-95 transition-all"
          >
            <RefreshCw className="w-5 h-5" />
            <span>กดโหลดใหม่</span>
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
