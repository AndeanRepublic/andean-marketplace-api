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
import { SellerApplicationDecisionEmailData } from '../../../../app/datastore/Email.repo';

interface SellerApplicationDecisionTemplateProps {
	data: SellerApplicationDecisionEmailData;
}

const ACCENT = '#3067b0';
const TEXT = '#191919';
const BACKGROUND = '#ffffff';

export function SellerApplicationDecisionTemplate({
	data,
}: SellerApplicationDecisionTemplateProps) {
	const isApproved = data.decision === 'APPROVED';

	return (
		<Html lang="es">
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
							{isApproved
								? '¡Tu solicitud fue aprobada!'
								: 'Actualización de tu solicitud'}
						</Text>
						<Text
							style={{
								color: '#666666',
								fontSize: '15px',
								lineHeight: '1.6',
								margin: '0 0 24px',
							}}
						>
							Hola {data.customerName},
						</Text>

						{isApproved ? (
							<Text
								style={{
									color: TEXT,
									fontSize: '15px',
									lineHeight: '1.6',
									margin: '0 0 16px',
								}}
							>
								Nos complace informarte que tu solicitud para vender en Andean
								Republic ha sido <strong>aprobada</strong>. Tu tienda{' '}
								<strong>{data.shopName}</strong> ya está activa y puedes
								comenzar a gestionar tus productos desde el panel de vendedor.
							</Text>
						) : (
							<>
								<Text
									style={{
										color: TEXT,
										fontSize: '15px',
										lineHeight: '1.6',
										margin: '0 0 16px',
									}}
								>
									Lamentamos informarte que tu solicitud para la tienda{' '}
									<strong>{data.shopName}</strong> no ha sido aprobada en esta
									ocasión.
								</Text>
								{data.rejectionReason ? (
									<Section
										style={{
											backgroundColor: '#faf8f5',
											borderRadius: '12px',
											padding: '20px 24px',
											marginBottom: '16px',
											borderLeft: '4px solid #dc2626',
										}}
									>
										<Text
											style={{
												color: '#666666',
												fontSize: '13px',
												fontWeight: '600',
												margin: '0 0 8px',
												textTransform: 'uppercase',
											}}
										>
											Motivo del rechazo
										</Text>
										<Text
											style={{
												color: TEXT,
												fontSize: '15px',
												lineHeight: '1.6',
												margin: 0,
												whiteSpace: 'pre-wrap',
											}}
										>
											{data.rejectionReason}
										</Text>
									</Section>
								) : null}
								<Text
									style={{
										color: '#666666',
										fontSize: '14px',
										lineHeight: '1.6',
										margin: 0,
									}}
								>
									Si tienes dudas o deseas volver a aplicar con información
									actualizada, contáctanos en hola@andeanrepublic.com.
								</Text>
							</>
						)}
					</Section>

					<Hr style={{ borderColor: '#e5e5e5', margin: '0 40px' }} />

					<Section style={{ padding: '24px 40px 32px' }}>
						<Text
							style={{
								color: '#999999',
								fontSize: '12px',
								lineHeight: '1.5',
								margin: 0,
								textAlign: 'center',
							}}
						>
							Andean Republic · Marketplace
						</Text>
					</Section>
				</Container>
			</Body>
		</Html>
	);
}
