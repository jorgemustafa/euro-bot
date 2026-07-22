import { describe, expect, it } from 'vitest';
import { isWhatsAppConfigured } from '../src/whatsapp.js';

describe('isWhatsAppConfigured', () => {
  it('requires token, phone number id and recipient', () => {
    expect(
      isWhatsAppConfigured({
        WHATSAPP_TOKEN: 'token',
        WHATSAPP_PHONE_NUMBER_ID: 'phone-id',
        WHATSAPP_TO: '5511999999999',
      }),
    ).toBe(true);

    expect(isWhatsAppConfigured({ WHATSAPP_TOKEN: 'token' })).toBe(false);
  });
});
