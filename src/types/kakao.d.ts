declare global {
  interface Window {
    Kakao?: {
      init: (apiKey: string) => void;
      isInitialized: () => boolean;
      Share?: {
        sendDefault: (options: KakaoShareOptions) => void;
      };
    };
  }
}

export interface KakaoShareOptions {
  objectType: string;
  content: {
    title: string;
    description: string;
    imageUrl: string;
    link: {
      mobileWebUrl: string;
      webUrl: string;
    };
  };
  buttons: Array<{
    title: string;
    link: {
      mobileWebUrl: string;
      webUrl: string;
    };
  }>;
  callback?: () => void;
  serverCallbackArgs?: Record<string, string>;
}

// ES 모듈 시스템에서 필요한 export 문
export {}; 