import { Case, SmsMessage } from '../types';

/**
 * Creates an outbound simulated SMS message
 */
export function createSms(
  to: string,
  body: string,
  caseId?: string
): SmsMessage {
  return {
    id: 'sms-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
    to,
    body,
    at: new Date().toISOString(),
    direction: 'out',
    caseId,
  };
}

/**
 * Pre-formatted Bangla SMS templates for transparent citizen updates
 */
export const SMS_TEMPLATES = {
  caseFiled: (caseId: string, title: string) =>
    `[ন্যায়সেতু] আপনার জিডি গ্রহণ করা হয়েছে। কেস আইডি: ${caseId} (${title})। ট্র্যাক করতে এই লিংকে যান বা STATUS ${caseId} লিখে পাঠান। ২৪ ঘণ্টার মধ্যে তদন্ত শুরু হবে।`,

  statusUpdated: (caseId: string, stageBn: string, note: string) =>
    `[ন্যায়সেতু আপডেট] কেস #${caseId} বর্তমান পর্যায়: ${stageBn}। বিবরণ: ${note}। বিস্তারিত জানতে অ্যাপ দেখুন বা কল করুন ১০৬।`,

  ioAssigned: (caseId: string, ioName: string, ioPhone: string) =>
    `[ন্যায়সেতু] কেস #${caseId}-এর তদন্ত কর্মকর্তা (IO) হিসেবে নিযুক্ত হয়েছেন: এসআই ${ioName} (ফোন: ${ioPhone})। তদন্ত শুরু হচ্ছে।`,

  evidenceAdded: (caseId: string, fileName: string, shaPrefix: string) =>
    `[ন্যায়সেতু] কেস #${caseId}-এ নতুন আলামত সংযুক্ত করা হয়েছে (${fileName})। সিকিউর হ্যাশ: ${shaPrefix}। ডিজিটাল প্রমাণ ভল্টে সংরক্ষিত।`,

  courtDateSet: (caseId: string, dateStr: string, courtName: string) =>
    `[ন্যায়সেতু] কেস #${caseId}-এর পরবর্তী শুনানির তারিখ: ${dateStr}, আদালত: ${courtName}। যথাসময়ে উপস্থিত থাকার অনুরোধ করা হলো।`,

  sosTriggered: (caseId: string, stationName: string) =>
    `[জরুরি ৯৯৯ অ্যালার্ট] আপনার প্রেরিত এসওএস সফলভাবে ৯৯৯ কন্ট্রোল রুম ও ${stationName} থানায় পৌঁছেছে। নিকটস্থ প্যাট্রোল টিম পাঠানো হচ্ছে। শান্ত থাকুন।`,
};

/**
 * Handles incoming citizen SMS commands (e.g. "STATUS NS-2026-DHK-000123" or "HELP")
 */
export function processInboundSms(
  messageBody: string,
  fromPhone: string,
  cases: Case[]
): SmsMessage {
  const clean = messageBody.trim();
  const upper = clean.toUpperCase();

  let replyText = '';
  let linkedCaseId: string | undefined = undefined;

  if (upper.startsWith('STATUS') || upper.startsWith('অবস্থা')) {
    const parts = upper.split(/\s+/);
    const caseIdQuery = parts[1];

    if (!caseIdQuery) {
      replyText =
        'অনুগ্রহ করে কেস আইডি উল্লেখ করুন। উদাহরণ: STATUS NS-2026-DHK-000142';
    } else {
      const found = cases.find(
        (c) => c.id.toUpperCase() === caseIdQuery.toUpperCase()
      );
      if (found) {
        linkedCaseId = found.id;
        const stageNamesBn: Record<string, string> = {
          filed: 'দাখিলকৃত',
          received: 'থানায় গৃহীত',
          assigned: 'তদন্ত কর্মকর্তা নিযুক্ত',
          investigation: 'তদন্তাধীন',
          chargesheet: 'চার্জশিট দাখিল',
          court: 'আদালতে বিচারাধীন',
          closed: 'নিষ্পত্তি',
        };
        replyText = `[ন্যায়সেতু ট্র্যাকিং] কেস আইডি: ${found.id} | অবস্থা: ${stageNamesBn[found.status] || found.status} | আইও: ${found.ioName || 'অপেক্ষমান'} | থানা: ${found.stationId.toUpperCase()}।`;
      } else {
        replyText = `দুঃখিত! '${caseIdQuery}' নম্বরের কোন কেস খুঁজে পাওয়া যায়নি। অনুগ্রহ করে আইডি যাচাই করে আবার চেষ্টা করুন।`;
      }
    }
  } else if (upper.startsWith('HELP') || upper.startsWith('সাহায্য')) {
    replyText =
      '[ন্যায়সেতু এসএমএস সেবা] доступный কমান্ড: \n1. STATUS <CaseID> (কেসের অবস্থা)\n2. SOS (জরুরি সাহায্য)\n3. SCAN <নম্বর> (প্রতারণা যাচাই)';
  } else if (upper.includes('SOS') || upper.includes('বাঁচাও')) {
    replyText =
      '[জরুরি বার্তা] আপনি বিপদে থাকলে সরাসরি ৯৯৯-এ কল করুন। ন্যায়সেতু ইমার্জেন্সি রেসপন্স চালু রয়েছে।';
  } else {
    replyText =
      '[ন্যায়সেতু] বার্তাটি বুঝতে পারিনি। কেসের স্ট্যাটাস জানতে লিখুন: STATUS <আপনার কেস আইডি>। তথ্যের জন্য কল করুন ৯৯৯ বা ১০৬।';
  }

  return {
    id: 'sms-reply-' + Date.now(),
    to: fromPhone,
    body: replyText,
    at: new Date().toISOString(),
    direction: 'out',
    caseId: linkedCaseId,
  };
}
