import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, HttpStatus, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { BadRequestException } from '@nestjs/common';

// ─── Controller ─────────────────────────────────────────────────────────────
import { AuthController } from '../src/andean/infra/controllers/auth.controller';
import { JwtAuthGuard } from '../src/andean/infra/core/jwtAuth.guard';
import { RolesGuard } from '../src/andean/infra/core/roles.guard';

// ─── Use Cases ──────────────────────────────────────────────────────────────
import { LoginUseCase } from '../src/andean/app/use_cases/auth/LoginUseCase';
import { AssignAdminUseCase } from '../src/andean/app/use_cases/auth/AssignAdminUseCase';
import { ForgotPasswordUseCase } from '../src/andean/app/use_cases/auth/ForgotPasswordUseCase';
import { VerifyResetCodeUseCase } from '../src/andean/app/use_cases/auth/VerifyResetCodeUseCase';
import { ResetPasswordUseCase } from '../src/andean/app/use_cases/auth/ResetPasswordUseCase';

describe('AuthController — Password Reset (e2e)', () => {
	let app: INestApplication;
	let forgotPasswordUseCase: ForgotPasswordUseCase;
	let verifyResetCodeUseCase: VerifyResetCodeUseCase;
	let resetPasswordUseCase: ResetPasswordUseCase;

	beforeAll(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			controllers: [AuthController],
			providers: [
				{
					provide: LoginUseCase,
					useValue: { handle: jest.fn() },
				},
				{
					provide: AssignAdminUseCase,
					useValue: { handle: jest.fn() },
				},
				{
					provide: ForgotPasswordUseCase,
					useValue: { execute: jest.fn().mockResolvedValue(undefined) },
				},
				{
					provide: VerifyResetCodeUseCase,
					useValue: {
						execute: jest
							.fn()
							.mockResolvedValue({ resetToken: 'mock.jwt.token' }),
					},
				},
				{
					provide: ResetPasswordUseCase,
					useValue: { execute: jest.fn().mockResolvedValue(undefined) },
				},
			],
		})
			.overrideGuard(JwtAuthGuard)
			.useValue({ canActivate: () => true })
			.overrideGuard(RolesGuard)
			.useValue({ canActivate: () => true })
			.compile();

		app = moduleFixture.createNestApplication();
		app.useGlobalPipes(
			new ValidationPipe({
				whitelist: true,
				forbidNonWhitelisted: true,
				transform: true,
			}),
		);
		await app.init();

		forgotPasswordUseCase = moduleFixture.get(ForgotPasswordUseCase);
		verifyResetCodeUseCase = moduleFixture.get(VerifyResetCodeUseCase);
		resetPasswordUseCase = moduleFixture.get(ResetPasswordUseCase);
	});

	afterAll(async () => {
		await app.close();
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	// ═══════════════════════════════════════════════════════════════════════════
	// POST /auth/forgot-password
	// ═══════════════════════════════════════════════════════════════════════════
	describe('POST /auth/forgot-password', () => {
		it('should return 200 with anti-enumeration message for a valid (existing) email', async () => {
			jest
				.spyOn(forgotPasswordUseCase, 'execute')
				.mockResolvedValueOnce(undefined);

			const response = await request(app.getHttpServer())
				.post('/auth/forgot-password')
				.send({ email: 'user@example.com' });

			expect(response.status).toBe(HttpStatus.OK);
			expect(response.body.message).toBe(
				'If the email exists, a reset code has been sent.',
			);
			expect(forgotPasswordUseCase.execute).toHaveBeenCalledWith(
				'user@example.com',
			);
		});

		it('should return 200 with same message for a non-existent email (anti-enumeration)', async () => {
			// Use case still resolves (silently ignores unknown emails)
			jest
				.spyOn(forgotPasswordUseCase, 'execute')
				.mockResolvedValueOnce(undefined);

			const response = await request(app.getHttpServer())
				.post('/auth/forgot-password')
				.send({ email: 'nonexistent@example.com' });

			expect(response.status).toBe(HttpStatus.OK);
			expect(response.body.message).toBe(
				'If the email exists, a reset code has been sent.',
			);
		});

		it('should return 400 when email format is invalid', async () => {
			const response = await request(app.getHttpServer())
				.post('/auth/forgot-password')
				.send({ email: 'not-an-email' });

			expect(response.status).toBe(HttpStatus.BAD_REQUEST);
			expect(forgotPasswordUseCase.execute).not.toHaveBeenCalled();
		});

		it('should return 400 when email field is missing', async () => {
			const response = await request(app.getHttpServer())
				.post('/auth/forgot-password')
				.send({});

			expect(response.status).toBe(HttpStatus.BAD_REQUEST);
			expect(forgotPasswordUseCase.execute).not.toHaveBeenCalled();
		});

		it('should return 400 when email is an empty string', async () => {
			const response = await request(app.getHttpServer())
				.post('/auth/forgot-password')
				.send({ email: '' });

			expect(response.status).toBe(HttpStatus.BAD_REQUEST);
			expect(forgotPasswordUseCase.execute).not.toHaveBeenCalled();
		});

		it('should call execute exactly once per valid request', async () => {
			jest
				.spyOn(forgotPasswordUseCase, 'execute')
				.mockResolvedValueOnce(undefined);

			await request(app.getHttpServer())
				.post('/auth/forgot-password')
				.send({ email: 'test@example.com' });

			expect(forgotPasswordUseCase.execute).toHaveBeenCalledTimes(1);
		});
	});

	// ═══════════════════════════════════════════════════════════════════════════
	// POST /auth/verify-reset-code
	// ═══════════════════════════════════════════════════════════════════════════
	describe('POST /auth/verify-reset-code', () => {
		const validPayload = {
			email: 'user@example.com',
			code: '482910',
		};

		// ── Happy path ────────────────────────────────────────────────────────
		it('should return 200 with resetToken when code is valid', async () => {
			jest
				.spyOn(verifyResetCodeUseCase, 'execute')
				.mockResolvedValueOnce({ resetToken: 'mock.jwt.token' });

			const response = await request(app.getHttpServer())
				.post('/auth/verify-reset-code')
				.send(validPayload);

			expect(response.status).toBe(HttpStatus.OK);
			expect(response.body).toHaveProperty('resetToken');
			expect(response.body.resetToken).toBe('mock.jwt.token');
			expect(verifyResetCodeUseCase.execute).toHaveBeenCalledWith(
				validPayload.email,
				validPayload.code,
			);
		});

		// ── Wrong code ────────────────────────────────────────────────────────
		it('should return 400 with "Invalid code. X attempts remaining." for a wrong code (first attempt)', async () => {
			jest
				.spyOn(verifyResetCodeUseCase, 'execute')
				.mockRejectedValueOnce(
					new BadRequestException('Invalid code. 2 attempts remaining.'),
				);

			const response = await request(app.getHttpServer())
				.post('/auth/verify-reset-code')
				.send({ ...validPayload, code: '000000' });

			expect(response.status).toBe(HttpStatus.BAD_REQUEST);
			expect(response.body.message).toContain('Invalid code');
			expect(response.body.message).toContain('attempts remaining');
		});

		it('should return 400 with "Invalid code. 1 attempt remaining." for a wrong code (second attempt)', async () => {
			jest
				.spyOn(verifyResetCodeUseCase, 'execute')
				.mockRejectedValueOnce(
					new BadRequestException('Invalid code. 1 attempt remaining.'),
				);

			const response = await request(app.getHttpServer())
				.post('/auth/verify-reset-code')
				.send({ ...validPayload, code: '111111' });

			expect(response.status).toBe(HttpStatus.BAD_REQUEST);
			expect(response.body.message).toContain('Invalid code');
			expect(response.body.message).toContain('attempt remaining');
		});

		// ── Max attempts ──────────────────────────────────────────────────────
		it('should return 400 with "Max attempts reached. Request a new code." after 3 failed attempts', async () => {
			jest
				.spyOn(verifyResetCodeUseCase, 'execute')
				.mockRejectedValueOnce(
					new BadRequestException('Max attempts reached. Request a new code.'),
				);

			const response = await request(app.getHttpServer())
				.post('/auth/verify-reset-code')
				.send({ ...validPayload, code: '999999' });

			expect(response.status).toBe(HttpStatus.BAD_REQUEST);
			expect(response.body.message).toBe(
				'Max attempts reached. Request a new code.',
			);
		});

		// ── Expired code ──────────────────────────────────────────────────────
		it('should return 400 with "Code expired" for an expired code', async () => {
			jest
				.spyOn(verifyResetCodeUseCase, 'execute')
				.mockRejectedValueOnce(new BadRequestException('Code expired'));

			const response = await request(app.getHttpServer())
				.post('/auth/verify-reset-code')
				.send(validPayload);

			expect(response.status).toBe(HttpStatus.BAD_REQUEST);
			expect(response.body.message).toBe('Code expired');
		});

		// ── Already used code ─────────────────────────────────────────────────
		it('should return 400 with "Code already used" for a previously consumed code', async () => {
			jest
				.spyOn(verifyResetCodeUseCase, 'execute')
				.mockRejectedValueOnce(new BadRequestException('Code already used'));

			const response = await request(app.getHttpServer())
				.post('/auth/verify-reset-code')
				.send(validPayload);

			expect(response.status).toBe(HttpStatus.BAD_REQUEST);
			expect(response.body.message).toBe('Code already used');
		});

		// ── DTO validation — invalid code format ──────────────────────────────
		it('should return 400 when code contains non-numeric characters', async () => {
			const response = await request(app.getHttpServer())
				.post('/auth/verify-reset-code')
				.send({ ...validPayload, code: 'abc123' });

			expect(response.status).toBe(HttpStatus.BAD_REQUEST);
			expect(verifyResetCodeUseCase.execute).not.toHaveBeenCalled();
		});

		it('should return 400 when code has fewer than 6 digits', async () => {
			const response = await request(app.getHttpServer())
				.post('/auth/verify-reset-code')
				.send({ ...validPayload, code: '12345' });

			expect(response.status).toBe(HttpStatus.BAD_REQUEST);
			expect(verifyResetCodeUseCase.execute).not.toHaveBeenCalled();
		});

		it('should return 400 when code has more than 6 digits', async () => {
			const response = await request(app.getHttpServer())
				.post('/auth/verify-reset-code')
				.send({ ...validPayload, code: '1234567' });

			expect(response.status).toBe(HttpStatus.BAD_REQUEST);
			expect(verifyResetCodeUseCase.execute).not.toHaveBeenCalled();
		});

		it('should return 400 when code is missing', async () => {
			const { code, ...noCode } = validPayload;
			const response = await request(app.getHttpServer())
				.post('/auth/verify-reset-code')
				.send(noCode);

			expect(response.status).toBe(HttpStatus.BAD_REQUEST);
			expect(verifyResetCodeUseCase.execute).not.toHaveBeenCalled();
		});

		it('should return 400 when email format is invalid', async () => {
			const response = await request(app.getHttpServer())
				.post('/auth/verify-reset-code')
				.send({ ...validPayload, email: 'not-an-email' });

			expect(response.status).toBe(HttpStatus.BAD_REQUEST);
			expect(verifyResetCodeUseCase.execute).not.toHaveBeenCalled();
		});

		it('should return 400 when email is missing', async () => {
			const { email, ...noEmail } = validPayload;
			const response = await request(app.getHttpServer())
				.post('/auth/verify-reset-code')
				.send(noEmail);

			expect(response.status).toBe(HttpStatus.BAD_REQUEST);
			expect(verifyResetCodeUseCase.execute).not.toHaveBeenCalled();
		});

		// ── Use case delegation ───────────────────────────────────────────────
		it('should call execute with email and code in correct order', async () => {
			jest
				.spyOn(verifyResetCodeUseCase, 'execute')
				.mockResolvedValueOnce({ resetToken: 'mock.jwt.token' });

			await request(app.getHttpServer())
				.post('/auth/verify-reset-code')
				.send(validPayload);

			expect(verifyResetCodeUseCase.execute).toHaveBeenCalledWith(
				validPayload.email,
				validPayload.code,
			);
		});
	});

	// ═══════════════════════════════════════════════════════════════════════════
	// POST /auth/reset-password
	// ═══════════════════════════════════════════════════════════════════════════
	describe('POST /auth/reset-password', () => {
		const validPayload = {
			resetToken: 'mock.jwt.token',
			newPassword: 'NewSecurePass123!',
		};

		// ── Happy path ────────────────────────────────────────────────────────
		it('should return 200 with success message when resetToken is valid', async () => {
			jest
				.spyOn(resetPasswordUseCase, 'execute')
				.mockResolvedValueOnce(undefined);

			const response = await request(app.getHttpServer())
				.post('/auth/reset-password')
				.send(validPayload);

			expect(response.status).toBe(HttpStatus.OK);
			expect(response.body.message).toBe(
				'Password has been reset successfully.',
			);
			expect(resetPasswordUseCase.execute).toHaveBeenCalledWith(
				validPayload.resetToken,
				validPayload.newPassword,
			);
		});

		// ── Expired resetToken ────────────────────────────────────────────────
		it('should return 400 with "Reset token expired" for an expired token', async () => {
			jest
				.spyOn(resetPasswordUseCase, 'execute')
				.mockRejectedValueOnce(new BadRequestException('Reset token expired'));

			const response = await request(app.getHttpServer())
				.post('/auth/reset-password')
				.send(validPayload);

			expect(response.status).toBe(HttpStatus.BAD_REQUEST);
			expect(response.body.message).toBe('Reset token expired');
		});

		// ── Invalid resetToken ────────────────────────────────────────────────
		it('should return 400 with "Invalid reset token" for a malformed token', async () => {
			jest
				.spyOn(resetPasswordUseCase, 'execute')
				.mockRejectedValueOnce(new BadRequestException('Invalid reset token'));

			const response = await request(app.getHttpServer())
				.post('/auth/reset-password')
				.send({ ...validPayload, resetToken: 'not.a.valid.token' });

			expect(response.status).toBe(HttpStatus.BAD_REQUEST);
			expect(response.body.message).toBe('Invalid reset token');
		});

		// ── DTO validation — password too short ───────────────────────────────
		it('should return 400 when newPassword is shorter than 8 characters', async () => {
			const response = await request(app.getHttpServer())
				.post('/auth/reset-password')
				.send({ ...validPayload, newPassword: 'short' });

			expect(response.status).toBe(HttpStatus.BAD_REQUEST);
			expect(resetPasswordUseCase.execute).not.toHaveBeenCalled();
		});

		it('should return 400 when newPassword is missing', async () => {
			const { newPassword, ...noPassword } = validPayload;
			const response = await request(app.getHttpServer())
				.post('/auth/reset-password')
				.send(noPassword);

			expect(response.status).toBe(HttpStatus.BAD_REQUEST);
			expect(resetPasswordUseCase.execute).not.toHaveBeenCalled();
		});

		// ── DTO validation — missing resetToken ───────────────────────────────
		it('should return 400 when resetToken is missing', async () => {
			const { resetToken, ...noToken } = validPayload;
			const response = await request(app.getHttpServer())
				.post('/auth/reset-password')
				.send(noToken);

			expect(response.status).toBe(HttpStatus.BAD_REQUEST);
			expect(resetPasswordUseCase.execute).not.toHaveBeenCalled();
		});

		// ── Use case delegation ───────────────────────────────────────────────
		it('should call execute with resetToken and newPassword in correct order', async () => {
			jest
				.spyOn(resetPasswordUseCase, 'execute')
				.mockResolvedValueOnce(undefined);

			await request(app.getHttpServer())
				.post('/auth/reset-password')
				.send(validPayload);

			expect(resetPasswordUseCase.execute).toHaveBeenCalledWith(
				validPayload.resetToken,
				validPayload.newPassword,
			);
		});
	});
});
