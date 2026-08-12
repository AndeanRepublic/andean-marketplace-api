export function assertEmailSenderConfigured(
	senderEmail: string,
	provider: 'ses' | 'resend',
): void {
	if (!senderEmail?.trim()) {
		throw new Error(
			provider === 'resend'
				? 'Email sender is not configured. Set RESEND_SENDER_EMAIL (or SES_SENDER_EMAIL) in .env'
				: 'Email sender is not configured. Set SES_SENDER_EMAIL in .env, or use EMAIL_PROVIDER=resend with RESEND_SENDER_EMAIL',
		);
	}
}
