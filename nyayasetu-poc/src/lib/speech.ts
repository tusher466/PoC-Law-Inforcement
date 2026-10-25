/**
 * Web Speech API wrapper for Bangla (bn-BD) speech-to-text
 * Includes robust fallbacks and realistic preset simulation for offline or unsupported browsers.
 */

// Global interface declaration for Web Speech API
declare global {
  interface Window {
    SpeechRecognition?: any;
    webkitSpeechRecognition?: any;
  }
}

export interface SpeechListenerCallbacks {
  onResult: (transcript: string, isFinal: boolean) => void;
  onError: (error: string) => void;
  onEnd: () => void;
}

export function isSpeechRecognitionSupported(): boolean {
  return typeof window !== 'undefined' &&
    !!(window.SpeechRecognition || window.webkitSpeechRecognition);
}

export class BanglaSpeechRecognizer {
  private recognition: any = null;
  private isListening: boolean = false;

  constructor() {
    if (isSpeechRecognitionSupported()) {
      const SpeechRecognitionConstructor =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      this.recognition = new SpeechRecognitionConstructor();
      this.recognition.lang = 'bn-BD';
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
    }
  }

  public start(callbacks: SpeechListenerCallbacks) {
    if (!this.recognition) {
      callbacks.onError('আপনার ব্রাউজারে ভয়েস রিকগনিশন সুবিধা উপলব্ধ নেই।');
      return;
    }

    this.recognition.onresult = (event: any) => {
      let finalTranscript = '';
      let interimTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }

      callbacks.onResult(finalTranscript || interimTranscript, !!finalTranscript);
    };

    this.recognition.onerror = (event: any) => {
      callbacks.onError(event.error || 'মাইক্রোফোন সংযোগে সমস্যা হয়েছে');
    };

    this.recognition.onend = () => {
      this.isListening = false;
      callbacks.onEnd();
    };

    try {
      this.recognition.start();
      this.isListening = true;
    } catch (err: any) {
      callbacks.onError(err.message || 'ভয়েস রিকগনিশন শুরু করা যায়নি');
    }
  }

  public stop() {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    }
  }
}

/**
 * Realistic Bangla sample complaints for instant one-click simulation
 */
export const SAMPLE_BANGLA_VOICE_COMPLAINTS = [
  {
    titleBn: 'ধানমন্ডি ২৭ নম্বরে মোবাইল ছিনতাই',
    titleEn: 'Mobile Snatching at Dhanmondi Rd 27',
    type: 'theft',
    text: 'আজ সকাল আনুমানিক ১১:৩০ মিনিটে ধানমন্ডি ২৭ নম্বর রোডে রিকশায় থাকা অবস্থায় একটি কালো পালসার মোটরবাইকে দুইজন অজ্ঞাতনামা ব্যক্তি আমার হাত থেকে স্যামসাং গ্যালাক্সি এ৫৪ মোবাইলটি ছিনিয়ে নিয়ে মিরপুরের দিকে পালিয়ে যায়। ফোনে আমার প্রয়োজনীয় ডকুমেন্ট এবং বিকাশ অ্যাকাউন্ট লগইন করা ছিল।',
  },
  {
    titleBn: 'ফেসবুকে ভুয়া আইডি ও মানহানিকর সাইবার হয়রানি',
    titleEn: 'Defamatory Fake Profile Cyber Harassment',
    type: 'harassment',
    text: 'গত তিন দিন যাবত জনৈক অজ্ঞাত ব্যক্তি আমার ছবি বিকৃত করে ফেসবুকে একটি ভুয়া পেজ খুলে মিথ্যা অপপ্রচার চালাচ্ছে এবং মেসেঞ্জারে হুমকি প্রদান করছে। আমি তীব্র মানসিক নিরাপত্তাহীনতায় ভুগছি। অপরাধীদের শনাক্ত করে আইনানুগ ব্যবস্থা গ্রহণের আবেদন জানাচ্ছি।',
  },
  {
    titleBn: 'বিকাশ ওটিপি জালিয়াতির মাধ্যমে টাকা আত্মসাৎ',
    titleEn: 'bKash OTP Fraud Money Siphoning',
    type: 'cyber_fraud',
    text: 'গতকাল বিকেলে ০১৭৯৯-৮৮১২৩৪ নম্বর থেকে ফোন করে নিজেকে বিকাশ হেল্পলাইনের কর্মকর্তা পরিচয় দেয় এবং অ্যাকাউন্ট ভেরিফিকেশনের কথা বলে আমার কাছে আসা ওটিপি হাতিয়ে নিয়ে ২৫,০০০ টাকা অন্য একটি নম্বরে ক্যাশআউট করে নেয়। ট্রানজেকশন স্লিপের স্ক্রিনশট সংযুক্ত করলাম।',
  },
  {
    titleBn: 'জাতীয় পরিচয়পত্র ও সার্টিফিকেট হারিয়ে যাওয়া',
    titleEn: 'Lost National ID & Academic Certificate',
    type: 'lost_item',
    text: 'গত পরশু ফার্মগেট থেকে মতিঝিল যাওয়ার পথে আমার ব্যাগে থাকা জাতীয় পরিচয়পত্র (NID) এবং এসএসসি পরীক্ষার মূল সনদপত্রটি হারিয়ে গেছে। সম্ভাব্য সকল স্থানে খোঁজাখুঁজি করে পাওয়া যায়নি। ভবিষ্যতে অপব্যবহার রোধে সাধারণ ডায়েরিভুক্ত করার অনুরোধ জানাচ্ছি।',
  },
];
