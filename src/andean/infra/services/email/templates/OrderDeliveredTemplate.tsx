import {
	Html,
	Head,
	Body,
	Container,
	Section,
	Text,
	Font,
	Img,
} from '@react-email/components';
import * as React from 'react';
import { OrderDeliveredEmailData } from '../../../../app/datastore/Email.repo';

interface OrderDeliveredTemplateProps {
	data: OrderDeliveredEmailData;
}

const ACCENT = '#3067b0';
const TEXT = '#191919';
const BACKGROUND = '#ffffff';

function formatDate(date: Date): string {
	return new Date(date).toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
	});
}

export function OrderDeliveredTemplate({ data }: OrderDeliveredTemplateProps) {
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
							style={{ display: 'block', margin: '0 auto' }}
						/>
					</Section>

					<Section style={{ padding: '40px' }}>
						<Text
							style={{
								color: TEXT,
								fontSize: '22px',
								fontWeight: '700',
								margin: '0 0 8px',
							}}
						>
							Your order has been delivered
						</Text>
						<Text style={{ color: '#666666', fontSize: '15px', margin: 0 }}>
							Hi {data.customerName}, your order #{data.orderNumber} was marked
							as delivered on {formatDate(data.deliveredAt)}.
						</Text>

						<Section
							style={{
								backgroundColor: '#faf8f5',
								borderRadius: '12px',
								marginTop: '28px',
								padding: '16px 20px',
							}}
						>
							<Text
								style={{
									color: '#666666',
									fontSize: '12px',
									fontWeight: '700',
									letterSpacing: '1px',
									margin: '0 0 8px',
									textTransform: 'uppercase',
								}}
							>
								Delivery address
							</Text>
							<Text
								style={{
									color: TEXT,
									fontSize: '14px',
									lineHeight: '22px',
									margin: 0,
									whiteSpace: 'pre-line',
								}}
							>
								{data.shippingAddress}
							</Text>
						</Section>

						{data.items.length > 0 ? (
							<Section style={{ marginTop: '28px' }}>
								<Text
									style={{
										color: TEXT,
										fontSize: '16px',
										fontWeight: '700',
										margin: '0 0 12px',
									}}
								>
									Items delivered
								</Text>
								{data.items.map((item, index) => (
									<Text
										key={`${item.name}-${index}`}
										style={{
											borderBottom: '1px solid #eeeeee',
											color: TEXT,
											fontSize: '14px',
											margin: 0,
											padding: '10px 0',
										}}
									>
										{item.quantity} x {item.name}
									</Text>
								))}
							</Section>
						) : null}

						<Text
							style={{
								color: '#666666',
								fontSize: '14px',
								lineHeight: '22px',
								margin: '32px 0 0',
							}}
						>
							Thank you for choosing Andean Republic.
						</Text>
					</Section>
				</Container>
			</Body>
		</Html>
	);
}
