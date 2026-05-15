import {
	Html,
	Head,
	Body,
	Container,
	Section,
	Text,
	Hr,
	Font,
	Row,
	Column,
	Img,
} from '@react-email/components';
import * as React from 'react';
import { BookingConfirmationEmailData } from '../../../../app/datastore/Email.repo';

interface BookingConfirmationTemplateProps {
	data: BookingConfirmationEmailData;
}

const ACCENT = '#3067b0';
const TEXT = '#191919';
const BACKGROUND = '#ffffff';
const BORDER_COLOR = '#3067b0';

function formatCurrency(amount: number): string {
	return `$${amount.toFixed(2)}`;
}

function formatDate(date: Date): string {
	return new Date(date).toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
	});
}

export function BookingConfirmationTemplate({
	data,
}: BookingConfirmationTemplateProps) {
	const {
		bookingNumber,
		bookingDate,
		customerName,
		experienceName,
		experienceDate,
		days,
		nights,
		ageGroups,
		totalGuests,
		pricing,
	} = data;

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
							Booking Confirmed!
						</Text>
						<Text
							style={{
								color: '#666666',
								fontSize: '15px',
								margin: '0 0 24px',
							}}
						>
							Hi {customerName}, your experience booking has been confirmed.
							We&apos;re excited to have you join us!
						</Text>

						{/* Booking meta */}
						<Section
							style={{
								backgroundColor: '#faf8f5',
								borderRadius: '12px',
								padding: '16px 20px',
								marginBottom: '32px',
							}}
						>
							<Row>
								<Column>
									<Text
										style={{
											color: '#666666',
											fontSize: '12px',
											fontWeight: '700',
											letterSpacing: '1px',
											margin: '0 0 4px',
											textTransform: 'uppercase',
										}}
									>
										Booking Number
									</Text>
									<Text
										style={{
											color: ACCENT,
											fontSize: '16px',
											fontWeight: '700',
											margin: 0,
										}}
									>
										#{bookingNumber}
									</Text>
								</Column>
								<Column style={{ textAlign: 'right' }}>
									<Text
										style={{
											color: '#666666',
											fontSize: '12px',
											fontWeight: '700',
											letterSpacing: '1px',
											margin: '0 0 4px',
											textTransform: 'uppercase',
										}}
									>
										Booking Date
									</Text>
									<Text
										style={{
											color: TEXT,
											fontSize: '15px',
											margin: 0,
										}}
									>
										{formatDate(bookingDate)}
									</Text>
								</Column>
							</Row>
						</Section>

						{/* Experience Details */}
						<Text
							style={{
								color: TEXT,
								fontSize: '16px',
								fontWeight: '700',
								margin: '0 0 12px',
							}}
						>
							Experience Details
						</Text>

						<Section
							style={{
								backgroundColor: '#faf8f5',
								borderRadius: '12px',
								padding: '20px',
								marginBottom: '32px',
							}}
						>
							<Text
								style={{
									color: TEXT,
									fontSize: '15px',
									fontWeight: '700',
									margin: '0 0 12px',
								}}
							>
								{experienceName}
							</Text>
							<Row style={{ marginBottom: '8px' }}>
								<Column style={{ width: '50%' }}>
									<Text
										style={{
											color: '#666666',
											fontSize: '13px',
											margin: 0,
										}}
									>
										<strong>Date:</strong> {formatDate(experienceDate)}
									</Text>
								</Column>
								<Column style={{ width: '50%' }}>
									<Text
										style={{
											color: '#666666',
											fontSize: '13px',
											margin: 0,
										}}
									>
										<strong>Duration:</strong> {days} days, {nights} nights
									</Text>
								</Column>
							</Row>
							<Text
								style={{
									color: '#666666',
									fontSize: '13px',
									margin: 0,
								}}
							>
								<strong>Total Guests:</strong> {totalGuests}
							</Text>
						</Section>

						{/* Guest breakdown */}
						<Text
							style={{
								color: TEXT,
								fontSize: '16px',
								fontWeight: '700',
								margin: '0 0 12px',
							}}
						>
							Pricing Breakdown
						</Text>

						{/* Table header row */}
						<Section
							style={{
								borderBottom: `2px solid ${ACCENT}`,
								paddingBottom: '8px',
								marginBottom: '8px',
							}}
						>
							<Row>
								<Column style={{ width: '50%' }}>
									<Text
										style={{
											color: '#666666',
											fontSize: '11px',
											fontWeight: '700',
											letterSpacing: '1px',
											margin: 0,
											textTransform: 'uppercase',
										}}
									>
										Age Group
									</Text>
								</Column>
								<Column style={{ width: '15%', textAlign: 'center' }}>
									<Text
										style={{
											color: '#666666',
											fontSize: '11px',
											fontWeight: '700',
											letterSpacing: '1px',
											margin: 0,
											textTransform: 'uppercase',
										}}
									>
										Qty
									</Text>
								</Column>
								<Column style={{ width: '17%', textAlign: 'right' }}>
									<Text
										style={{
											color: '#666666',
											fontSize: '11px',
											fontWeight: '700',
											letterSpacing: '1px',
											margin: 0,
											textTransform: 'uppercase',
										}}
									>
										Unit
									</Text>
								</Column>
								<Column style={{ width: '18%', textAlign: 'right' }}>
									<Text
										style={{
											color: '#666666',
											fontSize: '11px',
											fontWeight: '700',
											letterSpacing: '1px',
											margin: 0,
											textTransform: 'uppercase',
										}}
									>
										Total
									</Text>
								</Column>
							</Row>
						</Section>

						{/* Age group rows */}
						{ageGroups.map((group, index) => (
							<Section
								key={index}
								style={{
									borderBottom: `1px solid ${BORDER_COLOR}`,
									paddingBottom: '12px',
									paddingTop: '12px',
								}}
							>
								<Row>
									<Column style={{ width: '50%' }}>
										<Text
											style={{
												color: TEXT,
												fontSize: '14px',
												fontWeight: '600',
												margin: 0,
											}}
										>
											{group.label}
										</Text>
									</Column>
									<Column style={{ width: '15%', textAlign: 'center' }}>
										<Text
											style={{
												color: TEXT,
												fontSize: '14px',
												margin: 0,
											}}
										>
											{group.quantity}
										</Text>
									</Column>
									<Column style={{ width: '17%', textAlign: 'right' }}>
										<Text
											style={{
												color: '#666666',
												fontSize: '14px',
												margin: 0,
											}}
										>
											{formatCurrency(group.unitPrice)}
										</Text>
									</Column>
									<Column style={{ width: '18%', textAlign: 'right' }}>
										<Text
											style={{
												color: TEXT,
												fontSize: '14px',
												fontWeight: '600',
												margin: 0,
											}}
										>
											{formatCurrency(group.total)}
										</Text>
									</Column>
								</Row>
							</Section>
						))}

						{/* Pricing summary */}
						<Section style={{ marginTop: '24px' }}>
							<Row style={{ marginBottom: '8px' }}>
								<Column>
									<Text
										style={{ color: '#666666', fontSize: '14px', margin: 0 }}
									>
										Subtotal
									</Text>
								</Column>
								<Column style={{ textAlign: 'right' }}>
									<Text style={{ color: TEXT, fontSize: '14px', margin: 0 }}>
										{formatCurrency(pricing.subtotal)}
									</Text>
								</Column>
							</Row>
							<Hr
								style={{
									border: 'none',
									borderTop: `1px solid ${BORDER_COLOR}`,
									margin: '12px 0',
								}}
							/>
							<Row>
								<Column>
									<Text
										style={{
											color: TEXT,
											fontSize: '16px',
											fontWeight: '700',
											margin: 0,
										}}
									>
										Total
									</Text>
								</Column>
								<Column style={{ textAlign: 'right' }}>
									<Text
										style={{
											color: ACCENT,
											fontSize: '18px',
											fontWeight: '700',
											margin: 0,
										}}
									>
										{formatCurrency(pricing.total)}
									</Text>
								</Column>
							</Row>
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

export default BookingConfirmationTemplate;
