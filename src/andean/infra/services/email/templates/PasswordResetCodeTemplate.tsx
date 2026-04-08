import {
	Html,
	Head,
	Body,
	Container,
	Section,
	Text,
	Hr,
	Font,
	Img,
} from '@react-email/components';
import * as React from 'react';

interface PasswordResetCodeTemplateProps {
	code: string;
}

const ACCENT = '#3067b0';
const TEXT = '#191919';
const BACKGROUND = '#ffffff';
const BORDER_COLOR = '#3067b0';

export function PasswordResetCodeTemplate({
	code,
}: PasswordResetCodeTemplateProps) {
	return (
		<Html lang="en">
			<Head>
				<Font
					fontFamily="Montserrat"
					fallbackFontFamily="Arial"
					webFont={{
						url: 'https://fonts.gstatic.com/s/montserrat/v29/JTUHjIg1_i6t8kCHKm4532VJOt5-QNFgpCtr6Hw5aXo.woff2',
						format: 'woff2',
					}}
					fontWeight={400}
					fontStyle="normal"
				/>
				<Font
					fontFamily="Montserrat"
					fallbackFontFamily="Arial"
					webFont={{
						url: 'https://fonts.gstatic.com/s/montserrat/v29/JTUHjIg1_i6t8kCHKm4532VJOt5-QNFgpCuM70w5aXo.woff2',
						format: 'woff2',
					}}
					fontWeight={700}
					fontStyle="normal"
				/>
			</Head>
			<Body
				style={{
					backgroundColor: '#ffffff',
					fontFamily: 'Montserrat, Arial, sans-serif',
					margin: 0,
					padding: '32px 0',
				}}
			>
				<Container
					style={{
						backgroundColor: BACKGROUND,
						borderRadius: '16px',
						maxWidth: '600px',
						margin: '0 auto',
						overflow: 'hidden',
					}}
				>
					{/* Header */}
					<Section
						style={{
							backgroundColor: ACCENT,
							padding: '32px 40px',
							textAlign: 'center',
						}}
					>
						<Img
							src="https://andean-marketplace-front-production.up.railway.app/img/Header/logo-white.png"
							alt="Andean Republic"
							width={198}
							height={65}
							style={{
								display: 'block',
								margin: '0 auto',
							}}
						/>
					</Section>

					{/* Body */}
					<Section style={{ padding: '40px 40px 0' }}>
						<Text
							style={{
								color: TEXT,
								fontSize: '22px',
								fontWeight: '700',
								margin: '0 0 8px',
							}}
						>
							Reset Your Password
						</Text>
						<Text
							style={{
								color: '#666666',
								fontSize: '15px',
								lineHeight: '1.6',
								margin: '0 0 32px',
							}}
						>
							We received a request to reset the password for your Andean
							Marketplace account. Enter the code below in the app to create a
							new password.
						</Text>

						{/* Prominent 6-digit code */}
						<Section
							style={{
								backgroundColor: '#faf8f5',
								borderRadius: '12px',
								padding: '32px 20px',
								marginBottom: '32px',
								textAlign: 'center',
							}}
						>
							<Text
								style={{
									color: '#666666',
									fontSize: '13px',
									margin: '0 0 12px',
									fontWeight: '700',
									textTransform: 'uppercase',
									letterSpacing: '1px',
								}}
							>
								Your Reset Code
							</Text>
							<Text
								style={{
									color: TEXT,
									fontSize: '40px',
									fontWeight: '700',
									letterSpacing: '12px',
									margin: 0,
									fontVariantNumeric: 'tabular-nums',
								}}
							>
								{code}
							</Text>
						</Section>

						<Hr
							style={{
								border: 'none',
								borderTop: `1px solid ${BORDER_COLOR}`,
								margin: '0 0 24px',
							}}
						/>

						{/* Expiry notice */}
						<Section
							style={{
								backgroundColor: '#faf8f5',
								borderRadius: '12px',
								padding: '16px 20px',
								marginBottom: '32px',
							}}
						>
							<Text
								style={{
									color: '#666666',
									fontSize: '13px',
									margin: '0 0 4px',
									fontWeight: '700',
									textTransform: 'uppercase',
									letterSpacing: '1px',
								}}
							>
								Important
							</Text>
							<Text
								style={{
									color: TEXT,
									fontSize: '14px',
									margin: 0,
									lineHeight: '1.5',
								}}
							>
								This code expires in <strong>5 minutes</strong>. If you
								didn&apos;t request a password reset, you can safely ignore this
								email — your password will not change.
							</Text>
						</Section>
					</Section>

					{/* Footer */}
					<Section
						style={{
							padding: '32px 40px',
							textAlign: 'center',
						}}
					>
						<Text
							style={{
								color: '#999999',
								fontSize: '12px',
								margin: '0 0 4px',
							}}
						>
							Questions? Contact us at{' '}
							<a
								href="mailto:hola@andeanrepublic.com"
								style={{ color: ACCENT }}
							>
								hola@andeanrepublic.com
							</a>
						</Text>
						<Text
							style={{
								color: '#cccccc',
								fontSize: '11px',
								margin: 0,
							}}
						>
							© {new Date().getFullYear()} Andean Marketplace. All rights
							reserved.
						</Text>
					</Section>
				</Container>
			</Body>
		</Html>
	);
}

export default PasswordResetCodeTemplate;
