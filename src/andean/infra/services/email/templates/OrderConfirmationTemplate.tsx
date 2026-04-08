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
import { OrderConfirmationEmailData } from '../../../../app/datastore/Email.repo';

interface OrderConfirmationTemplateProps {
	data: OrderConfirmationEmailData;
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

export function OrderConfirmationTemplate({
	data,
}: OrderConfirmationTemplateProps) {
	const {
		orderNumber,
		orderDate,
		customerName,
		items,
		summary,
		shippingAddress,
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
							Order Confirmed!
						</Text>
						<Text
							style={{
								color: '#666666',
								fontSize: '15px',
								margin: '0 0 24px',
							}}
						>
							Hi {customerName}, thank you for your purchase. We&apos;ve
							received your order and will process it shortly.
						</Text>

						{/* Order meta */}
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
										Order Number
									</Text>
									<Text
										style={{
											color: ACCENT,
											fontSize: '16px',
											fontWeight: '700',
											margin: 0,
										}}
									>
										#{orderNumber}
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
										Order Date
									</Text>
									<Text
										style={{
											color: TEXT,
											fontSize: '15px',
											margin: 0,
										}}
									>
										{formatDate(orderDate)}
									</Text>
								</Column>
							</Row>
						</Section>

						{/* Products table header */}
						<Text
							style={{
								color: TEXT,
								fontSize: '16px',
								fontWeight: '700',
								margin: '0 0 12px',
							}}
						>
							Order Summary
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
										Product
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

						{/* Item rows */}
						{items.map((item, index) => (
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
											{item.name}
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
											{item.quantity}
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
											{formatCurrency(item.unitPrice)}
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
											{formatCurrency(item.total)}
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
										{formatCurrency(summary.subtotal)}
									</Text>
								</Column>
							</Row>
							<Row style={{ marginBottom: '8px' }}>
								<Column>
									<Text
										style={{ color: '#666666', fontSize: '14px', margin: 0 }}
									>
										Shipping
									</Text>
								</Column>
								<Column style={{ textAlign: 'right' }}>
									<Text style={{ color: TEXT, fontSize: '14px', margin: 0 }}>
										{formatCurrency(summary.shipping)}
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
										{formatCurrency(summary.total)}
									</Text>
								</Column>
							</Row>
						</Section>

						{/* Shipping address */}
						<Section
							style={{
								backgroundColor: '#faf8f5',
								borderRadius: '12px',
								marginTop: '32px',
								padding: '20px',
							}}
						>
							<Text
								style={{
									color: TEXT,
									fontSize: '13px',
									fontWeight: '700',
									letterSpacing: '1px',
									margin: '0 0 8px',
									textTransform: 'uppercase',
								}}
							>
								Shipping Address
							</Text>
							<Text
								style={{
									color: '#444444',
									fontSize: '14px',
									lineHeight: '1.6',
									margin: 0,
									whiteSpace: 'pre-line',
								}}
							>
								{shippingAddress}
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
								href="mailto:support@andeanmarketplace.com"
								style={{ color: ACCENT }}
							>
								support@andeanmarketplace.com
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

export default OrderConfirmationTemplate;
